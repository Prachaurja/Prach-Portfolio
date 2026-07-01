"""
Site content store for the Dev Tool.

GET  /api/content  -> returns the saved content JSON (public, read-only).
PUT  /api/content  -> overwrites it (requires the admin password header).

The whole portfolio is data-driven from this blob, so the author can edit
everything from /dev without touching code. Stored as a plain JSON file on
disk — no migrations, trivially portable. The frontend keeps a bundled
default, so an empty/missing file just means "use defaults".
"""

import json
from pathlib import Path

from fastapi import APIRouter, HTTPException, Header, Request

from app.config import settings

router = APIRouter()

# backend/data/site_content.json
DATA_DIR = Path(__file__).resolve().parents[2] / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)
CONTENT_PATH = DATA_DIR / "site_content.json"


@router.get("/content")
async def get_content():
    if CONTENT_PATH.exists():
        try:
            return json.loads(CONTENT_PATH.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            return {}
    return {}


@router.put("/content")
async def put_content(
    request: Request,
    x_admin_password: str = Header(default=""),
):
    if x_admin_password != settings.admin_password:
        raise HTTPException(status_code=401, detail="Invalid admin password")

    try:
        body = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Body must be valid JSON")

    if not isinstance(body, dict):
        raise HTTPException(status_code=400, detail="Content must be an object")

    try:
        CONTENT_PATH.write_text(
            json.dumps(body, indent=2, ensure_ascii=False), encoding="utf-8"
        )
    except OSError:
        raise HTTPException(status_code=500, detail="Could not persist content")

    return {"status": "saved"}
