# backend/core/config.py
from pydantic_settings import BaseSettings
from typing import List, Union

class Settings(BaseSettings):
    PROJECT_NAME: str = "SliceSite API"
    PROJECT_VERSION: str = "0.1.0"
    ENVIRONMENT: str = "development"

    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30 # Default to 30 minutes

    SQLALCHEMY_DATABASE_URL: str

    # CORS Origins: can be a string of comma-separated origins or a list
    BACKEND_CORS_ORIGINS: Union[str, List[str]] = "*" # Default to all for development

    # For pydantic-settings to load from .env file
    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'
        # If BACKEND_CORS_ORIGINS is a string, convert it to a list
        # This is a common pattern, but pydantic-settings might handle it directly
        # or you might need a validator if you want to ensure it's a list.
        # For simplicity, we'll assume it's handled or validated where used.

settings = Settings()
