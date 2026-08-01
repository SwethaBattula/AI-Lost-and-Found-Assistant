import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Lost and Found Assistant"
    API_V1_STR: str = ""
    
    # Database
    DATABASE_URL: str = "sqlite:///./lost_found.db"
    
    # JWT Auth
    JWT_SECRET: str = "super-secret-key-change-this-in-production-1234567890"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Upload Directories
    UPLOAD_DIR: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "uploads"))
    UPLOAD_LOST_DIR: str = os.path.join(UPLOAD_DIR, "lost")
    UPLOAD_FOUND_DIR: str = os.path.join(UPLOAD_DIR, "found")
    
    # AI Matching Thresholds
    AI_CONFIDENCE_THRESHOLD: float = 0.65
    AI_MODEL_DEVICE: str = "cpu"
    
    # SMTP Email Configuration
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM_EMAIL: str = "noreply@ailostfound.com"
    SMTP_ENABLED: bool = False

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
