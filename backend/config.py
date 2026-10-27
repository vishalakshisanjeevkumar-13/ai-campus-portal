"""
Configuration settings for AI Campus Companion Backend.
Loads environment variables safely using python-dotenv.
Never hardcodes secrets or exposes raw credentials to the client.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Locate and load the .env file if present in the backend directory
BASE_DIR = Path(__file__).resolve().parent
ENV_PATH = BASE_DIR / ".env"
if ENV_PATH.exists():
    load_dotenv(dotenv_path=ENV_PATH)
else:
    load_dotenv()

class Settings:
    # MongoDB Configuration
    MONGODB_URI: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "ai_campus_companion")

    # Server Configuration
    API_HOST: str = os.getenv("API_HOST", "127.0.0.1")
    API_PORT: int = int(os.getenv("API_PORT", "8000"))
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    ALLOWED_ORIGINS: str = os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173"
    )

    @classmethod
    def get_masked_uri(cls) -> str:
        """
        Returns a sanitized version of the MongoDB URI suitable for safe logging
        without exposing passwords or sensitive auth tokens.
        """
        uri = cls.MONGODB_URI
        if "@" in uri:
            prefix = uri.split("@")[0]
            host_part = uri.split("@")[1]
            scheme = prefix.split("://")[0] if "://" in prefix else "mongodb"
            return f"{scheme}://***:***@{host_part}"
        return uri

settings = Settings()
