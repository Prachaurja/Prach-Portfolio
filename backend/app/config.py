from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str
    github_token: str
    github_username: str
    frontend_origin: str = "http://localhost:3000"

    # ----- Dev Tool admin -----
    # Password the Dev Tool sends in the X-Admin-Password header to save
    # content. Keep this matched with NEXT_PUBLIC_DEV_PASSWORD on the frontend.
    admin_password: str = "prachaurja"

    # ----- Contact email (all optional; form works without them) -----
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    contact_to_email: str = ""

    class Config:
        env_file = ".env"


settings = Settings()