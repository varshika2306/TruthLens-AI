"""
TruthLens AI — IBM Granite Service

Handles all communication with IBM watsonx.ai using the official
ibm-watsonx-ai SDK.

Supports:
• Automatic authentication
• Graceful fallback (stub mode)
• Health checking
• Centralized text generation
"""

from __future__ import annotations

import logging
import time
from functools import lru_cache

from utils.config import get_settings

logger = logging.getLogger("truthlens.granite_service")

settings = get_settings()


class GraniteService:
    """
    Wrapper around IBM watsonx.ai ModelInference.

    If credentials are unavailable, the service automatically switches
    into stub mode so the remaining backend continues functioning.
    """

    DEFAULT_PARAMS = {
        "decoding_method": "greedy",
        "temperature": 0.3,
        "max_new_tokens": 800,
        "min_new_tokens": 40,
        "repetition_penalty": 1.1,
    }

    def __init__(self):

        self._client = None

        self._initialise()

    # ------------------------------------------------------------------
    # Initialisation
    # ------------------------------------------------------------------

    def _initialise(self) -> None:

        if (
            not settings.watsonx_api_key
            or settings.watsonx_api_key.startswith("your_")
            or not settings.watsonx_project_id
            or settings.watsonx_project_id.startswith("your_")
        ):

            logger.warning(
                "IBM credentials not configured. "
                "GraniteService is running in STUB mode."
            )

            return

        try:

            from ibm_watsonx_ai import Credentials
            from ibm_watsonx_ai.foundation_models import ModelInference

            credentials = Credentials(
                url=settings.watsonx_url,
                api_key=settings.watsonx_api_key,
            )

            self._client = ModelInference(
                model_id=settings.granite_model_id,
                credentials=credentials,
                project_id=settings.watsonx_project_id,
                params=self.DEFAULT_PARAMS,
            )

            logger.info("=" * 60)
            logger.info("IBM Granite connected successfully")
            logger.info("Model   : %s", settings.granite_model_id)
            logger.info("Project : %s", settings.watsonx_project_id)
            logger.info("=" * 60)

        except ImportError:

            logger.error(
                "ibm-watsonx-ai SDK not installed.\n"
                "Install using:\n"
                "pip install ibm-watsonx-ai"
            )

        except Exception as exc:

            logger.exception(
                "Failed to initialise Granite client: %s",
                exc,
            )

    # ------------------------------------------------------------------
    # Health
    # ------------------------------------------------------------------

    def is_available(self) -> bool:
        """Returns True if IBM Granite is ready."""
        return self._client is not None

    def health(self) -> dict:
        """Simple service health information."""

        return {
            "available": self.is_available(),
            "model": settings.granite_model_id,
            "url": settings.watsonx_url,
        }

    # ------------------------------------------------------------------
    # Text Generation
    # ------------------------------------------------------------------

    def generate(self, prompt: str) -> str:
        """
        Send a prompt to IBM Granite.
        """

        if not self.is_available():
            return self._stub_response(prompt)

        start = time.perf_counter()

        try:

            response = self._client.generate_text(
                prompt=prompt
            )

            elapsed = round(
                time.perf_counter() - start,
                2,
            )

            logger.info(
                "Granite response generated in %.2fs",
                elapsed,
            )

            if isinstance(response, str):
                return response.strip()

            return str(response)

        except Exception as exc:

            logger.exception(
                "Granite generation failed: %s",
                exc,
            )

            return (
                "IBM Granite could not generate the report. "
                f"Reason: {exc}"
            )

    # ------------------------------------------------------------------
    # Stub Mode
    # ------------------------------------------------------------------

    @staticmethod
    def _stub_response(prompt: str) -> str:
        """
        Offline response used during development.
        """

        return (
            "[STUB MODE]\n\n"
            "IBM Granite credentials are not configured.\n"
            "Configure WATSONX_API_KEY and WATSONX_PROJECT_ID "
            "inside the .env file.\n\n"
            f"Prompt Preview:\n{prompt[:200]}..."
        )


# ----------------------------------------------------------------------
# Singleton
# ----------------------------------------------------------------------

@lru_cache(maxsize=1)
def get_granite_service() -> GraniteService:
    """
    Shared Granite service instance.
    """
    return GraniteService()