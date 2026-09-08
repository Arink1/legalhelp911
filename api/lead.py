"""Vercel Python serverless function: POST /api/lead

Validates an incoming lead and inserts it into the Supabase `leads` table
via the Supabase REST API (PostgREST). Uses only the standard library so
no requirements.txt is needed.

Required environment variables (set in Vercel project settings):
  SUPABASE_URL               e.g. https://xxxx.supabase.co
  SUPABASE_SERVICE_ROLE_KEY  service role key (server-side only, never
                             exposed to the browser)
"""

import json
import os
import re
import time
import urllib.error
import urllib.parse
import urllib.request
from collections import deque
from http.server import BaseHTTPRequestHandler

# Spam protection is honeypot + rate limit, never a visible CAPTCHA: CAPTCHAs
# cost more leads than they block. Two layers:
#   1. a per-IP sliding window held in module scope (survives warm invocations)
#   2. a duplicate check against recent rows, which also catches retries and
#      double taps that slip past the client-side submit guard
RATE_LIMIT_MAX = 5           # submissions per IP
RATE_LIMIT_WINDOW = 600      # seconds
DUPLICATE_WINDOW = 90        # seconds; same phone counts as a duplicate
_recent_by_ip: dict = {}


def client_ip(headers) -> str:
    fwd = headers.get("x-forwarded-for") or ""
    return (fwd.split(",")[0].strip() or headers.get("x-real-ip") or "unknown")


def rate_limited(ip: str) -> bool:
    """True when this IP has already submitted too often."""
    now = time.time()
    hits = _recent_by_ip.setdefault(ip, deque())
    while hits and now - hits[0] > RATE_LIMIT_WINDOW:
        hits.popleft()
    if len(hits) >= RATE_LIMIT_MAX:
        return True
    hits.append(now)
    # Keep the dict from growing without bound on a long-lived instance.
    if len(_recent_by_ip) > 2000:
        for k in [k for k, v in _recent_by_ip.items() if not v]:
            _recent_by_ip.pop(k, None)
    return False


def is_duplicate(base_url: str, key: str, phone: str) -> bool:
    """True when the same phone was submitted moments ago."""
    since = time.strftime(
        "%Y-%m-%dT%H:%M:%S", time.gmtime(time.time() - DUPLICATE_WINDOW)
    )
    query = urllib.parse.urlencode(
        {"select": "id", "phone": "eq." + phone, "created_at": "gte." + since, "limit": "1"}
    )
    req = urllib.request.Request(
        f"{base_url}/rest/v1/lh911_leads?{query}",
        headers={"apikey": key, "Authorization": f"Bearer {key}"},
    )
    try:
        with urllib.request.urlopen(req, timeout=6) as res:
            return len(json.loads(res.read() or b"[]")) > 0
    except Exception:
        # Never block a real lead because the dedupe check failed.
        return False

MAX_LEN = {
    "name": 120,
    "phone": 30,
    "email": 200,
    "case_type": 60,
    "description": 2000,
    "source": 100,
}

PHONE_DIGITS = re.compile(r"\d")
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def _clean(value, limit):
    if not isinstance(value, str):
        return ""
    return value.strip()[:limit]


def validate(payload):
    """Returns (lead_dict, error_message). error_message is None on success."""
    if not isinstance(payload, dict):
        return None, "Invalid request body."

    # Honeypot: real visitors never see this field. If a bot filled it,
    # report success upstream but signal the caller to skip the insert.
    if _clean(payload.get("company"), 100):
        return None, None

    name = _clean(payload.get("name"), MAX_LEN["name"])
    phone = _clean(payload.get("phone"), MAX_LEN["phone"])
    email = _clean(payload.get("email"), MAX_LEN["email"])
    case_type = _clean(payload.get("case_type"), MAX_LEN["case_type"])
    description = _clean(payload.get("description"), MAX_LEN["description"])
    source = _clean(payload.get("source"), MAX_LEN["source"])

    if len(name) < 2:
        return None, "Please enter your full name."
    if len(PHONE_DIGITS.findall(phone)) < 10:
        return None, "Please enter a valid phone number."
    if email and not EMAIL_RE.match(email):
        return None, "Please enter a valid email address."
    # Per the handoff, phone is the only strictly required field besides
    # name. Practice-area pages already know the case type from the URL.
    if payload.get("consent") is not True:
        return None, "Consent is required so we can contact you."

    return {
        "name": name,
        "phone": phone,
        "email": email or None,
        "case_type": case_type or "Not specified",
        "description": description or None,
        "consent": True,
        "source": source or "legalhelp911.com",
    }, None


def insert_lead(lead):
    base_url = os.environ.get("SUPABASE_URL", "").rstrip("/")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
    if not base_url or not key:
        raise RuntimeError("Supabase environment variables are not set")

    req = urllib.request.Request(
        f"{base_url}/rest/v1/lh911_leads",
        data=json.dumps(lead).encode(),
        headers={
            "Content-Type": "application/json",
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Prefer": "return=minimal",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=10) as res:
        if res.status not in (200, 201, 204):
            raise RuntimeError(f"Supabase insert failed: {res.status}")


class handler(BaseHTTPRequestHandler):
    def _send(self, status, body):
        payload = json.dumps(body).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def do_POST(self):
        try:
            length = int(self.headers.get("Content-Length") or 0)
            if length <= 0 or length > 32_000:
                return self._send(400, {"error": "Invalid request body."})
            payload = json.loads(self.rfile.read(length))
        except (ValueError, json.JSONDecodeError):
            return self._send(400, {"error": "Invalid request body."})

        lead, error = validate(payload)
        if error:
            return self._send(400, {"error": error})
        if lead is None:
            # Honeypot tripped: tell the bot it worked, store nothing.
            return self._send(200, {"ok": True})

        # Rate limit before touching the database. Report success so a bot
        # learns nothing from the response.
        if rate_limited(client_ip(self.headers)):
            return self._send(200, {"ok": True})

        base_url = os.environ.get("SUPABASE_URL", "").rstrip("/")
        key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
        if base_url and key and is_duplicate(base_url, key, lead["phone"]):
            return self._send(200, {"ok": True})

        try:
            insert_lead(lead)
        except (RuntimeError, urllib.error.URLError, OSError):
            return self._send(
                500,
                {"error": "We could not save your request. Please call us instead."},
            )

        return self._send(200, {"ok": True})

    def do_GET(self):
        return self._send(405, {"error": "Method not allowed."})
