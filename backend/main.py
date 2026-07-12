"""
TruthLens AI — Digital Image Investigation Platform
Entry point: FastAPI application bootstrap

Python 3.11+
"""

from __future__ import annotations

import logging
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from api.routes import router

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

API_PREFIX = "/api/v1"

_REQUIRED_DIRS = (
    "uploads",
    "reports",
    "knowledge_base",
)

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

_log_level = getattr(
    logging,
    os.getenv("LOG_LEVEL", "INFO").upper(),
    logging.INFO,
)

logging.basicConfig(
    level=_log_level,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
)

logger = logging.getLogger("truthlens")


# ---------------------------------------------------------------------------
# Lifespan
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create required folders on startup."""

    for directory in _REQUIRED_DIRS:
        os.makedirs(directory, exist_ok=True)
        logger.info("✓ Directory ready: %s", directory)

    logger.info("=" * 60)
    logger.info("🚀 TruthLens AI Backend Started Successfully")
    logger.info("📘 Swagger Docs : http://localhost:8000/docs")
    logger.info("📗 ReDoc        : http://localhost:8000/redoc")
    logger.info("=" * 60)

    yield

    logger.info("TruthLens AI backend shutting down gracefully.")


# ---------------------------------------------------------------------------
# FastAPI App
# ---------------------------------------------------------------------------

app = FastAPI(
    title="TruthLens AI",
    description="""
# TruthLens AI

AI-Powered Digital Image Investigation Platform.

### Investigation Pipeline

1. 📤 Image Upload
2. 🖼 Metadata Extraction
3. 🔍 Visual Analysis
4. 🤖 IBM Granite AI Reasoning
5. 📄 Investigation Report Generation

Built using:

- FastAPI
- IBM Granite (watsonx.ai)
- IBM Bob
- Modular Agent Architecture
""",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
    openapi_tags=[
        {
            "name": "Health",
            "description": "Health and status endpoints",
        },
        {
            "name": "Investigation",
            "description": "Digital Image Investigation APIs",
        },
        {
            "name": "Reports",
            "description": "Investigation Report APIs",
        },
    ],
)

# ---------------------------------------------------------------------------
# Middleware
# ---------------------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Static Files
# ---------------------------------------------------------------------------

app.mount(
    "/reports",
    StaticFiles(directory="reports"),
    name="reports",
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------

app.include_router(
    router,
    prefix=API_PREFIX,
)

# ---------------------------------------------------------------------------
# Health Endpoints
# ---------------------------------------------------------------------------

@app.get("/", tags=["Health"], summary="Root Endpoint")
async def root():
    return JSONResponse(
        content={
            "platform": "TruthLens AI",
            "description": "AI-Powered Digital Image Investigation Platform",
            "version": app.version,
            "status": "Operational",
            "docs": "/docs",
            "redoc": "/redoc",
            "api": API_PREFIX,
        }
    )


@app.get("/health", tags=["Health"], summary="Health Check")
async def health():
    return JSONResponse(
        content={
            "status": "healthy",
            "platform": "TruthLens AI",
        }
    )


@app.get("/version", tags=["Health"], summary="Version Information")
async def version():
    return JSONResponse(
        content={
            "platform": "TruthLens AI",
            "version": app.version,
            "python": "3.11+",
            "framework": "FastAPI",
            "architecture": "Agentic AI",
        }
    )