"""Public API tests for Trombeta Estudio (iteration: rebranding + UX tweaks).
Focus only on PUBLIC endpoints. Admin endpoints are NOT tested because
ADMIN_PASSWORD_HASH is not configured in this environment.
"""
import os
import time
import uuid
import pytest
import requests

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------------- Health / Root ----------------
class TestHealthRoot:
    def test_health(self, client):
        r = client.get(f"{API}/health", timeout=15)
        assert r.status_code == 200
        body = r.json()
        assert body.get("status") == "ok"

    def test_root(self, client):
        r = client.get(f"{API}/", timeout=15)
        assert r.status_code == 200
        body = r.json()
        assert body.get("service") == "Trombeta Estúdio API"
        assert body.get("status") == "online"


# ---------------- Security headers ----------------
class TestSecurityHeaders:
    def test_headers_present(self, client):
        r = client.get(f"{API}/health", timeout=15)
        h = r.headers
        assert h.get("X-Frame-Options") == "DENY"
        assert h.get("X-Content-Type-Options") == "nosniff"
        assert "max-age" in (h.get("Strict-Transport-Security") or "")


# ---------------- Contact ----------------
class TestContactValid:
    def test_create_valid_lead(self, client):
        # Wait to avoid any leftover rate-limit window
        time.sleep(65)
        marker = uuid.uuid4().hex[:8]
        payload = {
            "name": f"TEST_User_{marker}",
            "email": f"test_{marker}@example.com",
            "phone": "+5511999998888",
            "company": "TEST_Co",
            "service": "Branding",
            "message": "TEST lead from pytest",
            "source": "pytest",
        }
        r = client.post(f"{API}/contact", json=payload, timeout=20)
        assert r.status_code == 200, r.text
        body = r.json()
        assert "id" in body and body["id"]
        assert "_id" not in body
        assert body["email"] == payload["email"]
        assert body["name"] == payload["name"]


class TestContactInvalidEmail:
    def test_invalid_email_422(self, client):
        time.sleep(65)
        r = client.post(
            f"{API}/contact",
            json={"name": "TEST_Bad", "email": "not-an-email", "phone": "+5511999000111"},
            timeout=15,
        )
        assert r.status_code == 422


class TestContactHoneypot:
    def test_honeypot_returns_200(self, client):
        """When honeypot field 'website' is filled, server returns 200 but does
        not persist (fake-success to discourage bots). We cannot read DB without
        admin auth, so we only assert the 200 + shape."""
        time.sleep(65)
        marker = uuid.uuid4().hex[:8]
        payload = {
            "name": f"TEST_Honey_{marker}",
            "email": f"honey_{marker}@bot.com",
            "phone": "+5511900000000",
            "website": "http://bot.example.com",
        }
        r = client.post(f"{API}/contact", json=payload, timeout=15)
        assert r.status_code == 200, r.text
        body = r.json()
        assert "id" in body
        assert "_id" not in body


class TestContactRateLimit:
    def test_rate_limit_4th_blocked(self, client):
        """CONTACT_RATE_LIMIT default = 3/minute. 4th request must return 429."""
        time.sleep(65)
        marker = uuid.uuid4().hex[:6]
        statuses = []
        for i in range(4):
            r = client.post(
                f"{API}/contact",
                json={
                    "name": f"TEST_RL_{marker}_{i}",
                    "email": f"rl_{marker}_{i}@example.com",
                    "phone": "+5511955554444",
                },
                timeout=15,
            )
            statuses.append(r.status_code)
        assert statuses[:3].count(200) == 3, f"First 3 should be 200, got {statuses}"
        assert statuses[3] == 429, f"4th request should be 429, got {statuses}"
