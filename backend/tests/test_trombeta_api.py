"""Backend API tests for Trombeta Estudio - iteration 5 (rebranding + animations).
Focus: regression on auth, contact, honeypot, rate-limit, admin endpoints with
admin/admin123 credentials (per .env).
"""
import os
import time
import uuid
import pytest
import requests

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/") if "REACT_APP_BACKEND_URL" in os.environ else "https://code-inspection-7.preview.emergentagent.com"
API = f"{BASE_URL}/api"

ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin123"


def _reset_login_attempts():
    import asyncio
    from motor.motor_asyncio import AsyncIOMotorClient
    async def _go():
        c = AsyncIOMotorClient(os.environ.get('MONGO_URL', 'mongodb://localhost:27017'))
        await c[os.environ.get('DB_NAME', 'trombeta_db')].login_attempts.delete_many({})
        c.close()
    try:
        asyncio.run(_go())
    except Exception:
        pass


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def admin_token(client):
    _reset_login_attempts()
    r = client.post(f"{API}/admin/login", json={"username": ADMIN_USERNAME, "password": ADMIN_PASSWORD}, timeout=20)
    assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
    return r.json()["access_token"]


@pytest.fixture(scope="module")
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}


class TestHealthAndRoot:
    def test_health(self, client):
        r = client.get(f"{API}/health", timeout=15)
        assert r.status_code == 200
        assert r.json().get("status") == "ok"

    def test_root(self, client):
        r = client.get(f"{API}/", timeout=15)
        assert r.status_code == 200
        assert "Trombeta" in r.json()["service"]


class TestSecurityHeaders:
    def test_headers(self, client):
        r = client.get(f"{API}/health", timeout=15)
        h = r.headers
        assert h.get("X-Frame-Options") == "DENY"
        assert h.get("X-Content-Type-Options") == "nosniff"
        assert h.get("Referrer-Policy") == "strict-origin-when-cross-origin"
        assert "max-age" in (h.get("Strict-Transport-Security") or "")


class TestContact:
    def test_create_lead_valid(self, client):
        marker = uuid.uuid4().hex[:8]
        r = client.post(f"{API}/contact", json={
            "name": f"TEST_User_{marker}",
            "email": f"test_{marker}@example.com",
            "phone": "+5511999998888",
            "company": "TEST_Co",
            "service": "Branding",
            "message": "TEST lead",
            "source": "pytest",
        }, timeout=20)
        assert r.status_code == 200, r.text
        d = r.json()
        assert "id" in d and "_id" not in d
        assert d["email"] == f"test_{marker}@example.com"

    def test_create_lead_invalid_email(self, client):
        r = client.post(f"{API}/contact", json={"name": "TEST_Bad", "email": "not-an-email", "phone": "+5511999"}, timeout=15)
        assert r.status_code == 422


class TestHoneypot:
    def test_honeypot_returns_200_but_not_persisted(self, client, auth_headers):
        time.sleep(65)
        marker = uuid.uuid4().hex[:8]
        bot_name = f"TEST_HoneyBot_{marker}"
        r = client.post(f"{API}/contact", json={
            "name": bot_name,
            "email": f"honey_{marker}@bot.com",
            "phone": "+5511900000000",
            "website": "http://bot.com",
        }, timeout=15)
        assert r.status_code == 200, r.text
        leads = client.get(f"{API}/admin/leads?limit=500", headers=auth_headers, timeout=20).json()
        assert all(l["name"] != bot_name for l in leads), "Honeypot lead leaked to DB!"


class TestAdminAuth:
    def test_login_success(self, client):
        _reset_login_attempts()
        r = client.post(f"{API}/admin/login", json={"username": ADMIN_USERNAME, "password": ADMIN_PASSWORD}, timeout=15)
        assert r.status_code == 200
        d = r.json()
        assert "access_token" in d and d["token_type"] == "bearer" and d["expires_in"] > 0

    def test_wrong_password(self, client):
        _reset_login_attempts()
        r = client.post(f"{API}/admin/login", json={"username": ADMIN_USERNAME, "password": "wrong-pass-zzz"}, timeout=15)
        assert r.status_code == 401

    def test_me_with_valid_token(self, client, auth_headers):
        r = client.get(f"{API}/admin/me", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        assert r.json()["username"] == ADMIN_USERNAME

    def test_me_without_token(self, client):
        r = client.get(f"{API}/admin/me", timeout=15)
        assert r.status_code in (401, 403)


class TestContactRateLimit:
    def test_rate_limit(self, client):
        time.sleep(65)
        marker = uuid.uuid4().hex[:6]
        statuses = []
        for i in range(4):
            r = client.post(f"{API}/contact", json={
                "name": f"TEST_RL_{marker}_{i}",
                "email": f"rl_{marker}_{i}@example.com",
                "phone": "+5511955554444",
            }, timeout=15)
            statuses.append(r.status_code)
        assert statuses[:3].count(200) == 3, f"First 3 should be 200: {statuses}"
        assert statuses[3] == 429, f"4th should be 429: {statuses}"


class TestAdminLeads:
    def test_leads_requires_auth(self, client):
        r = client.get(f"{API}/admin/leads", timeout=15)
        assert r.status_code in (401, 403)

    def test_leads_returns_list_no_objectid(self, client, auth_headers):
        r = client.get(f"{API}/admin/leads", headers=auth_headers, timeout=20)
        assert r.status_code == 200
        leads = r.json()
        assert isinstance(leads, list)
        for l in leads:
            assert "_id" not in l and "id" in l

    def test_stats_shape(self, client, auth_headers):
        r = client.get(f"{API}/admin/stats", headers=auth_headers, timeout=20)
        assert r.status_code == 200
        d = r.json()
        for k in ("total", "last_24h", "last_7d", "top_services"):
            assert k in d
