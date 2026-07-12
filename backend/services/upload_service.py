"""
TruthLens AI — Upload Service
Handles file validation, sanitisation, and persistence to disk.
"""

import os
import uuid
import logging
import aiofiles
from fastapi import UploadFile

from utils.config import get_settings

logger = logging.getLogger("truthlens.upload_service")
settings = get_settings()


class UploadService:
    """Validates and persists uploaded image files."""

    def __init__(self):
        os.makedirs(settings.upload_dir, exist_ok=True)

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    async def save(self, file: UploadFile) -> dict:
        """
        Validate and save an uploaded image.

        Returns:
            dict with keys: investigation_id, original_filename,
                            file_path, extension, size_bytes
        """
        self._validate_extension(file.filename)

        content = await file.read()
        await file.seek(0)
        self._validate_size(len(content))

        investigation_id = str(uuid.uuid4())
        extension = self._extension(file.filename)
        safe_name = f"{investigation_id}.{extension}"
        file_path = os.path.join(settings.upload_dir, safe_name)

        async with aiofiles.open(file_path, "wb") as out:
            await out.write(content)

        logger.info(
            "Saved upload: %s → %s (%d bytes)",
            file.filename,
            file_path,
            len(content),
        )
        return {
            "investigation_id": investigation_id,
            "original_filename": file.filename,
            "file_path": file_path,
            "extension": extension,
            "size_bytes": len(content),
        }

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _extension(filename: str) -> str:
        if not filename or "." not in filename:
            raise ValueError("Filename has no extension.")
        return filename.rsplit(".", 1)[-1].lower()

    def _validate_extension(self, filename: str) -> None:
        ext = self._extension(filename)
        if ext not in settings.allowed_ext_list:
            raise ValueError(
                f"Unsupported file type '.{ext}'. "
                f"Allowed: {', '.join(settings.allowed_ext_list)}"
            )

    def _validate_size(self, size_bytes: int) -> None:
        if size_bytes > settings.max_upload_bytes:
            raise ValueError(
                f"File too large ({size_bytes / 1_048_576:.1f} MB). "
                f"Maximum allowed: {settings.max_upload_size_mb} MB."
            )
