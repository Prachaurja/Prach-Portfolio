import smtplib
from email.message import EmailMessage

from fastapi import APIRouter, Request, HTTPException
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.config import settings
from app.schemas.contact import ContactMessage

router = APIRouter()

# Limiter is attached to the app in main.py; we reuse the same instance here
limiter = Limiter(key_func=get_remote_address)


def _send_email(msg: ContactMessage) -> None:
    """
    Send the contact message to your inbox via SMTP.
    Only runs if SMTP settings are configured; otherwise we just log.
    """
    if not settings.smtp_host or not settings.contact_to_email:
        # Not configured yet — log to the server console so you still see it
        print(f"[CONTACT] From {msg.name} <{msg.email}>:\n{msg.message}\n")
        return

    email = EmailMessage()
    email["Subject"] = f"Portfolio contact from {msg.name}"
    email["From"] = settings.smtp_user
    email["To"] = settings.contact_to_email
    email["Reply-To"] = msg.email
    email.set_content(
        f"Name: {msg.name}\nEmail: {msg.email}\n\n{msg.message}"
    )

    with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
        server.starttls()
        server.login(settings.smtp_user, settings.smtp_password)
        server.send_message(email)


@router.post("/")
@limiter.limit("5/minute")  # max 5 submissions per minute per IP
def create_message(request: Request, msg: ContactMessage):
    # Honeypot check — silently accept (so bots don't learn) but do nothing
    if msg.website:
        return {"status": "received"}

    try:
        _send_email(msg)
    except Exception:
        raise HTTPException(
            status_code=502,
            detail="Could not send your message right now. Please try again later.",
        )

    return {"status": "received"}