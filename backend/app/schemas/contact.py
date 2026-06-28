from pydantic import BaseModel, EmailStr, Field


class ContactMessage(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    message: str = Field(min_length=1, max_length=2000)
    # Honeypot: bots fill hidden fields; humans leave it empty.
    # If this is non-empty, we silently reject.
    website: str | None = ""