from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.config import settings
from app.routers import projects, contact, github, analytics

app = FastAPI(title="Portfolio API")

# Rate limiter — used by the contact route to block spam
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(github.router, prefix="/api/github", tags=["github"])
app.include_router(projects.router, prefix="/api/projects", tags=["projects"])
app.include_router(contact.router, prefix="/api/contact", tags=["contact"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics"])


@app.get("/api/health")
def health():
    return {"status": "ok"}