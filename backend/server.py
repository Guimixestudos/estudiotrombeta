from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, Request, Response
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr, field_validator
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt as pyjwt
import bcrypt
import bleach
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("trombeta")
security_logger = logging.getLogger("trombeta.security")

# MongoDB
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Auth config
ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME', 'admin')
ADMIN_PASSWORD_HASH = os.environ.get('ADMIN_PASSWORD_HASH', '')
JWT_SECRET = os.environ.get('JWT_SECRET', 'change-me')
JWT_EXPIRE_HOURS = int(os.environ.get('JWT_EXPIRE_HOURS', '12'))
JWT_ALGO = 'HS256'

LOGIN_MAX_ATTEMPTS = int(os.environ.get('LOGIN_MAX_ATTEMPTS', '5'))
LOGIN_LOCKOUT_MINUTES = int(os.environ.get('LOGIN_LOCKOUT_MINUTES', '15'))
CONTACT_RATE_LIMIT = os.environ.get('CONTACT_RATE_LIMIT', '3/minute')

bearer_scheme = HTTPBearer(auto_error=False)


def client_ip(request: Request) -> str:
    """Extract real client IP behind reverse proxy."""
    xff = request.headers.get('x-forwarded-for')
    if xff:
        return xff.split(',')[0].strip()
    return request.client.host if request.client else 'unknown'


# Rate limiter (uses X-Forwarded-For aware extractor)
limiter = Limiter(key_func=client_ip)


# ---------------- Security headers ----------------
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        return response


app = FastAPI(title="Trombeta Estúdio API")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SecurityHeadersMiddleware)

api_router = APIRouter(prefix="/api")


# ---------------- Helpers ----------------
def sanitize(text: Optional[str], max_len: int = 2000) -> str:
    """Strip all HTML and limit length to prevent stored XSS."""
    if not text:
        return ""
    cleaned = bleach.clean(text, tags=[], attributes={}, strip=True)
    return cleaned.strip()[:max_len]


def verify_password(plain: str, hashed: str) -> bool:
    if not plain or not hashed:
        return False
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


# ---------------- Models ----------------
class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str
    company: Optional[str] = ""
    service: Optional[str] = ""
    message: Optional[str] = ""
    source: Optional[str] = "landing"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class LeadCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    phone: str = Field(..., min_length=6, max_length=40)
    company: Optional[str] = Field("", max_length=160)
    service: Optional[str] = Field("", max_length=120)
    message: Optional[str] = Field("", max_length=2000)
    source: Optional[str] = Field("landing", max_length=40)
    # Honeypot , if filled, request is a bot. Must remain empty.
    website: Optional[str] = Field("", max_length=120)

    @field_validator("name", "company", "service", "message", "source", mode="before")
    @classmethod
    def _sanitize_text(cls, v):
        if v is None:
            return v
        return sanitize(str(v), max_len=2000)

    @field_validator("phone", mode="before")
    @classmethod
    def _sanitize_phone(cls, v):
        if not v:
            return v
        # only keep digits, +, -, (, ), spaces
        return "".join(c for c in str(v) if c.isdigit() or c in "+-() ")[:40]


class LeadResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    phone: str
    company: Optional[str] = ""
    service: Optional[str] = ""
    message: Optional[str] = ""
    source: Optional[str] = "landing"
    created_at: datetime


class LoginRequest(BaseModel):
    username: str = Field(..., min_length=2, max_length=120)
    password: str = Field(..., min_length=4, max_length=200)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int


# ---------------- Auth helpers ----------------
def create_token(subject: str) -> tuple[str, int]:
    expire = datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRE_HOURS)
    payload = {"sub": subject, "exp": expire, "iat": datetime.now(timezone.utc)}
    token = pyjwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)
    return token, JWT_EXPIRE_HOURS * 3600


async def require_admin(
    creds: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
) -> str:
    if not creds or not creds.credentials:
        raise HTTPException(status_code=401, detail="Token ausente")
    try:
        payload = pyjwt.decode(creds.credentials, JWT_SECRET, algorithms=[JWT_ALGO])
        sub = payload.get("sub")
        if sub != ADMIN_USERNAME:
            raise HTTPException(status_code=401, detail="Token inválido")
        return sub
    except pyjwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado")
    except pyjwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Token inválido")


# ---------------- Brute force protection ----------------
async def is_locked_out(identifier: str) -> Optional[datetime]:
    """Return lockout end datetime if currently locked out, else None."""
    doc = await db.login_attempts.find_one({"_id": identifier})
    if not doc:
        return None
    if doc.get("attempts", 0) < LOGIN_MAX_ATTEMPTS:
        return None
    last_failed = doc.get("last_failed_at")
    if not last_failed:
        return None
    if isinstance(last_failed, str):
        last_failed = datetime.fromisoformat(last_failed)
    if last_failed.tzinfo is None:
        last_failed = last_failed.replace(tzinfo=timezone.utc)
    unlock_at = last_failed + timedelta(minutes=LOGIN_LOCKOUT_MINUTES)
    if datetime.now(timezone.utc) >= unlock_at:
        await db.login_attempts.delete_one({"_id": identifier})
        return None
    return unlock_at


async def register_failed_attempt(identifier: str):
    # Store as native datetime (UTC) so MongoDB TTL index can work
    await db.login_attempts.update_one(
        {"_id": identifier},
        {
            "$inc": {"attempts": 1},
            "$set": {"last_failed_at": datetime.now(timezone.utc)},
        },
        upsert=True,
    )


async def clear_attempts(identifier: str):
    await db.login_attempts.delete_one({"_id": identifier})


# ---------------- Routes ----------------
@api_router.get("/")
async def root():
    return {"service": "Trombeta Estúdio API", "status": "online"}


@api_router.get("/health")
async def health():
    return {"status": "ok", "timestamp": datetime.now(timezone.utc).isoformat()}


@api_router.post("/contact", response_model=LeadResponse)
@limiter.limit(CONTACT_RATE_LIMIT)
async def create_lead(request: Request, payload: LeadCreate):
    """Save a contact lead. Rate-limited + honeypot + sanitization."""
    # Honeypot , silently accept and discard if filled
    if payload.website:
        security_logger.warning(
            "honeypot triggered ip=%s name=%s", client_ip(request), payload.name
        )
        # Return fake-success so bots don't retry
        return LeadResponse(
            id=str(uuid.uuid4()),
            name=payload.name,
            email=payload.email,
            phone=payload.phone,
            company=payload.company or "",
            service=payload.service or "",
            message=payload.message or "",
            source=payload.source or "landing",
            created_at=datetime.now(timezone.utc),
        )

    try:
        lead = Lead(**{k: v for k, v in payload.model_dump().items() if k != "website"})
        doc = lead.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.leads.insert_one(doc)
        logger.info("lead_created id=%s email=%s", lead.id, lead.email)
        return LeadResponse(
            id=lead.id, name=lead.name, email=lead.email, phone=lead.phone,
            company=lead.company, service=lead.service, message=lead.message,
            source=lead.source, created_at=lead.created_at,
        )
    except Exception as e:
        logger.exception("Failed to save lead")
        raise HTTPException(status_code=500, detail=f"Erro ao salvar contato: {str(e)}")


# ---------------- Admin ----------------
@api_router.post("/admin/login", response_model=TokenResponse)
async def admin_login(request: Request, payload: LoginRequest):
    """Admin login. Brute-force protection via DB-backed failure counter
    (per IP+username, only counts failures, clears on success)."""
    if not ADMIN_PASSWORD_HASH:
        raise HTTPException(status_code=500, detail="Admin não configurado")

    ip = client_ip(request)
    identifier = f"{ip}:{payload.username.lower()}"

    # Check lockout
    unlock_at = await is_locked_out(identifier)
    if unlock_at:
        remaining = max(1, int((unlock_at - datetime.now(timezone.utc)).total_seconds() / 60))
        security_logger.warning("login_locked ip=%s user=%s", ip, payload.username)
        raise HTTPException(
            status_code=429,
            detail=f"Muitas tentativas. Tente novamente em {remaining} min.",
        )

    # Validate
    if payload.username != ADMIN_USERNAME or not verify_password(payload.password, ADMIN_PASSWORD_HASH):
        await register_failed_attempt(identifier)
        attempts = (await db.login_attempts.find_one({"_id": identifier}) or {}).get("attempts", 0)
        security_logger.warning(
            "login_failed ip=%s user=%s attempts=%d", ip, payload.username, attempts
        )
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    await clear_attempts(identifier)
    security_logger.info("login_success ip=%s user=%s", ip, payload.username)
    token, expires = create_token(ADMIN_USERNAME)
    return TokenResponse(access_token=token, expires_in=expires)


@api_router.get("/admin/me")
async def admin_me(_user: str = Depends(require_admin)):
    return {"username": _user, "ok": True}


@api_router.get("/admin/leads", response_model=List[LeadResponse])
async def admin_list_leads(limit: int = 200, _user: str = Depends(require_admin)):
    leads = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    for lead in leads:
        if isinstance(lead.get('created_at'), str):
            try:
                lead['created_at'] = datetime.fromisoformat(lead['created_at'])
            except Exception:
                lead['created_at'] = datetime.now(timezone.utc)
    return leads


@api_router.delete("/admin/leads/{lead_id}")
async def admin_delete_lead(lead_id: str, _user: str = Depends(require_admin)):
    res = await db.leads.delete_one({"id": lead_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lead não encontrado")
    return {"deleted": lead_id}


@api_router.get("/admin/stats")
async def admin_stats(_user: str = Depends(require_admin)):
    total = await db.leads.count_documents({})
    last_24h_cutoff = (datetime.now(timezone.utc) - timedelta(hours=24)).isoformat()
    last_7d_cutoff = (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()
    last_24h = await db.leads.count_documents({"created_at": {"$gte": last_24h_cutoff}})
    last_7d = await db.leads.count_documents({"created_at": {"$gte": last_7d_cutoff}})
    pipeline = [
        {"$match": {"service": {"$nin": [None, ""]}}},
        {"$group": {"_id": "$service", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 5},
    ]
    top_services = [
        {"service": d["_id"], "count": d["count"]}
        async for d in db.leads.aggregate(pipeline)
    ]
    return {
        "total": total,
        "last_24h": last_24h,
        "last_7d": last_7d,
        "top_services": top_services,
    }


# Mount router
app.include_router(api_router)

# CORS , explicit allowed origins (+ optional regex), configured via env
allowed_origins = [
    o.strip() for o in os.environ.get('CORS_ORIGINS', '').split(',') if o.strip()
]
allowed_origin_regex = os.environ.get('CORS_ORIGIN_REGEX', None)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=allowed_origin_regex,
    allow_credentials=False,  # Using Bearer tokens, not cookies
    allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.on_event("startup")
async def startup_indexes():
    try:
        # TTL index , login_attempts auto-cleanup after 1 hour (4x lockout window)
        ttl_seconds = max(3600, LOGIN_LOCKOUT_MINUTES * 60 * 4)
        await db.login_attempts.create_index(
            "last_failed_at", expireAfterSeconds=ttl_seconds
        )
        await db.leads.create_index("created_at")
        await db.leads.create_index("id", unique=True)
    except Exception as e:
        logger.warning("Index creation issue: %s", e)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
