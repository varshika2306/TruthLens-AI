"""
TruthLens AI — Shared application settings
Loaded from the .env file via pydantic-settings.
"""

from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # IBM watsonx.ai
    watsonx_api_key: str = ""
    watsonx_project_id: str = ""
    watsonx_url: str = "https://us-south.ml.cloud.ibm.com"

    # IBM Granite model
    granite_model_id: str = "ibm/granite-13b-instruct-v2"

    # Upload / storage
    upload_dir: str = "uploads"
    reports_dir: str = "reports"
    max_upload_size_mb: int = 20
    allowed_extensions: str = "jpg,jpeg,png,tiff,bmp,webp"

    # App
    debug: bool = False
    log_level: str = "INFO"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def allowed_ext_list(self) -> list[str]:
        return [e.strip().lower() for e in self.allowed_extensions.split(",")]

    @property
    def max_upload_bytes(self) -> int:
        return self.max_upload_size_mb * 1024 * 1024


@lru_cache
def get_settings() -> Settings:
    return Settings()
