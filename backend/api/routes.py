"""
TruthLens AI — API Routes
=========================
All HTTP endpoints for the investigation platform are declared here.

Responsibilities of this module
--------------------------------
- Define route paths, HTTP methods, status codes, and OpenAPI metadata.
- Validate incoming request parameters via FastAPI / Pydantic.
- Delegate ALL business logic to the service and orchestrator layers.
- Map service-layer exceptions to appropriate HTTP error responses.
- Return well-typed, documented responses.

This module contains NO business logic — only routing, validation,
dependency injection, and exception mapping.

Python 3.11+
"""

from __future__ import annotations

import asyncio
import logging
import os
from datetime import datetime, timezone
from typing import Annotated, Any

from fastapi import APIRouter, Depends, File, HTTPException, Path, Query, UploadFile, status
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel, Field, field_validator

from orchestrator.investigation import InvestigationOrchestrator
from services.upload_service import UploadService
from utils.config import Settings, get_settings

logger = logging.getLogger("truthlens.routes")

# ---------------------------------------------------------------------------
# Router
# ---------------------------------------------------------------------------

router = APIRouter()

# ---------------------------------------------------------------------------
# Dependency injection — services are constructed once per process.
# Using Depends() defers instantiation until the first request so that
# lifespan() has already created the required directories.
# ---------------------------------------------------------------------------

def _get_upload_service() -> UploadService:
    return UploadService()


def _get_orchestrator() -> InvestigationOrchestrator:
    return InvestigationOrchestrator()


# Annotated aliases — referenced in endpoint signatures
UploadServiceDep = Annotated[UploadService, Depends(_get_upload_service)]
OrchestratorDep = Annotated[InvestigationOrchestrator, Depends(_get_orchestrator)]
SettingsDep = Annotated[Settings, Depends(get_settings)]


# ---------------------------------------------------------------------------
# Response models
# ---------------------------------------------------------------------------

class VerdictModel(BaseModel):
    """High-level verdict extracted from the AI report."""

    authenticity_score: int | None = Field(
        None,
        ge=0,
        le=100,
        description="Authenticity score from 0 (manipulated) to 100 (authentic).",
    )
    risk_level: str | None = Field(
        None,
        description="One of: LOW, MEDIUM, HIGH, CRITICAL.",
    )
    key_signals: list[str] = Field(
        default_factory=list,
        description="List of anomaly / integrity signals detected.",
    )
    summary: str | None = Field(
        None,
        description="IBM Granite AI narrative summary.",
    )


class PipelineStagesModel(BaseModel):
    """Per-stage execution status of the investigation pipeline."""

    metadata_extraction: str = Field(description="'success' or 'failed'")
    visual_analysis: str = Field(description="'success' or 'failed'")
    ai_report_generation: str = Field(description="'success' or 'failed'")


class InvestigationReportModel(BaseModel):
    """
    Full structured response returned by POST /investigate.
    Mirrors the dict produced by InvestigationOrchestrator.run().
    """

    investigation_id: str = Field(description="UUID uniquely identifying this investigation.")
    original_filename: str = Field(description="Original name of the uploaded file.")
    platform: str = Field(description="Always 'TruthLens AI'.")
    pipeline_version: str
    deep_analysis: bool
    started_at: str
    completed_at: str
    pipeline_stages: PipelineStagesModel
    metadata: dict[str, Any]
    visual_analysis: dict[str, Any]
    ai_report: dict[str, Any]
    verdict: VerdictModel

    model_config = {"extra": "allow"}


class ReportListEntryModel(BaseModel):
    """Metadata row returned by GET /reports."""

    investigation_id: str
    filename: str
    size_bytes: int
    created_at: str = Field(description="ISO-8601 UTC timestamp.")


class ReportListResponseModel(BaseModel):
    """Response envelope for GET /reports."""

    total: int
    reports: list[ReportListEntryModel]


class DeleteReportResponseModel(BaseModel):
    """Response for DELETE /report/{investigation_id}."""

    deleted: bool
    investigation_id: str


# ---------------------------------------------------------------------------
# POST /investigate
# ---------------------------------------------------------------------------

@router.post(
    "/investigate",
    response_model=InvestigationReportModel,
    status_code=status.HTTP_200_OK,
    summary="Upload and investigate an image",
    tags=["Investigation"],
    responses={
        200: {"description": "Investigation completed successfully."},
        422: {"description": "Invalid file type, file too large, or missing file."},
        500: {"description": "Internal pipeline error."},
    },
)
async def investigate_image(
    upload_svc: UploadServiceDep,
    orchestrator: OrchestratorDep,
    file: UploadFile = File(
        ...,
        description=(
            "Image file to investigate. "
            "Accepted formats: jpg, jpeg, png, tiff, bmp, webp."
        ),
    ),
    deep_analysis: bool = Query(
        False,
        description=(
            "When true, passes richer context to IBM Granite for a more "
            "detailed forensic narrative. Increases response time."
        ),
    ),
) -> InvestigationReportModel:
    """
    Run the full TruthLens investigation pipeline on an uploaded image.

    **Pipeline stages executed in order:**

    1. **Upload & validate** — extension allowlist, file-size cap, UUID rename.
    2. **Metadata extraction** — EXIF tags, GPS coordinates, camera / software info,
       integrity flags (missing fields, unusual colour modes).
    3. **Visual analysis** — brightness, contrast, sharpness (Laplacian), Shannon entropy,
       noise estimate, per-channel colour statistics, anomaly signal list.
    4. **AI report generation** — IBM Granite LLM synthesises all signals into a
       natural-language forensic summary plus a scored verdict.

    The report is persisted to disk and retrievable afterwards via
    `GET /api/v1/report/{investigation_id}`.
    """
    logger.info(
        "Investigation requested — file=%r  deep_analysis=%s",
        file.filename,
        deep_analysis,
    )

    # --- Stage 0: persist the uploaded file ---------------------------------
    try:
        upload_result = await upload_svc.save(file)
    except ValueError as exc:
        # Validation failures (bad extension, oversized) → 422
        logger.warning("Upload rejected: %s — %s", file.filename, exc)
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(exc),
        ) from exc
    except OSError as exc:
        logger.exception("Disk I/O error saving upload: %s", file.filename)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save uploaded file: {exc}",
        ) from exc

    investigation_id: str = upload_result["investigation_id"]
    logger.info(
        "[%s] Upload saved: %s → %s",
        investigation_id,
        file.filename,
        upload_result["file_path"],
    )

    # --- Stage 1–3: run the investigation pipeline --------------------------
    try:
        report: dict[str, Any] = await orchestrator.run(
            file_path=upload_result["file_path"],
            original_filename=upload_result["original_filename"],
            investigation_id=investigation_id,
            deep_analysis=deep_analysis,
        )
    except Exception as exc:
        logger.exception(
            "[%s] Investigation pipeline failed for %s",
            investigation_id,
            file.filename,
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Investigation pipeline error: {exc}",
        ) from exc

    logger.info(
        "[%s] Investigation complete — risk=%s  score=%s",
        investigation_id,
        report.get("verdict", {}).get("risk_level"),
        report.get("verdict", {}).get("authenticity_score"),
    )

    return report  # type: ignore[return-value]  # FastAPI validates via response_model


# ---------------------------------------------------------------------------
# GET /report/{investigation_id}
# ---------------------------------------------------------------------------

@router.get(
    "/report/{investigation_id}",
    response_class=FileResponse,
    status_code=status.HTTP_200_OK,
    summary="Retrieve a saved investigation report",
    tags=["Reports"],
    responses={
        200: {"description": "JSON investigation report file.", "content": {"application/json": {}}},
        400: {"description": "investigation_id is not a valid UUID."},
        404: {"description": "No report found for the given investigation_id."},
    },
)
async def get_report(
    settings: SettingsDep,
    investigation_id: Annotated[
        str,
        Path(
            description="UUID returned in the `investigation_id` field of POST /investigate.",
            pattern=r"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
        ),
    ],
) -> FileResponse:
    """
    Return the full JSON investigation report for a given `investigation_id`.

    The file is streamed directly from the `reports/` directory.
    Use `GET /api/v1/reports` to list all available IDs.
    """
    report_path = os.path.join(settings.reports_dir, f"{investigation_id}.json")

    if not os.path.isfile(report_path):
        logger.info("Report not found: %s", investigation_id)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No report found for investigation_id '{investigation_id}'.",
        )

    return FileResponse(
        path=report_path,
        media_type="application/json",
        filename=f"truthlens_{investigation_id}.json",
    )


# ---------------------------------------------------------------------------
# GET /reports
# ---------------------------------------------------------------------------

@router.get(
    "/reports",
    response_model=ReportListResponseModel,
    status_code=status.HTTP_200_OK,
    summary="List all saved investigation reports",
    tags=["Reports"],
    responses={
        200: {"description": "Paginated list of investigation report metadata."},
    },
)
async def list_reports(
    settings: SettingsDep,
    skip: int = Query(0, ge=0, description="Number of reports to skip (offset)."),
    limit: int = Query(50, ge=1, le=500, description="Maximum number of reports to return."),
) -> ReportListResponseModel:
    """
    Return metadata for every investigation report stored on disk,
    ordered by creation time (newest first).

    Supports `skip` / `limit` pagination for large report stores.
    """
    reports_dir = settings.reports_dir

    if not os.path.isdir(reports_dir):
        return ReportListResponseModel(total=0, reports=[])

    # Offload directory scan to a thread so the event loop is not blocked
    entries: list[ReportListEntryModel] = await asyncio.to_thread(
        _scan_reports_dir, reports_dir
    )

    total = len(entries)
    page = entries[skip : skip + limit]

    logger.debug("Listed %d reports (skip=%d limit=%d)", total, skip, limit)
    return ReportListResponseModel(total=total, reports=page)


# ---------------------------------------------------------------------------
# DELETE /report/{investigation_id}
# ---------------------------------------------------------------------------

@router.delete(
    "/report/{investigation_id}",
    response_model=DeleteReportResponseModel,
    status_code=status.HTTP_200_OK,
    summary="Delete a saved investigation report",
    tags=["Reports"],
    responses={
        200: {"description": "Report deleted successfully."},
        400: {"description": "investigation_id is not a valid UUID."},
        404: {"description": "No report found for the given investigation_id."},
        500: {"description": "Filesystem error during deletion."},
    },
)
async def delete_report(
    settings: SettingsDep,
    investigation_id: Annotated[
        str,
        Path(
            description="UUID of the report to permanently delete.",
            pattern=r"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
        ),
    ],
) -> DeleteReportResponseModel:
    """
    Permanently delete the JSON report for a given `investigation_id`.

    This operation is **irreversible**. The uploaded image file is not
    affected by this endpoint.
    """
    report_path = os.path.join(settings.reports_dir, f"{investigation_id}.json")

    if not os.path.isfile(report_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No report found for investigation_id '{investigation_id}'.",
        )

    try:
        await asyncio.to_thread(os.remove, report_path)
    except OSError as exc:
        logger.exception("Failed to delete report: %s", report_path)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not delete report: {exc}",
        ) from exc

    logger.info("Deleted report: %s", investigation_id)
    return DeleteReportResponseModel(deleted=True, investigation_id=investigation_id)


# ---------------------------------------------------------------------------
# Private helpers (non-route functions)
# ---------------------------------------------------------------------------

def _scan_reports_dir(reports_dir: str) -> list[ReportListEntryModel]:
    """
    Scan `reports_dir` and build a sorted list of report metadata.

    Runs inside a thread via asyncio.to_thread — must not call any
    async functions.  Sorted newest-first by filesystem ctime.
    """
    entries: list[ReportListEntryModel] = []

    for fname in os.listdir(reports_dir):
        if not fname.endswith(".json"):
            continue

        fpath = os.path.join(reports_dir, fname)

        try:
            stat = os.stat(fpath)
        except OSError:
            continue  # File vanished between listdir and stat — skip silently

        created_at = datetime.fromtimestamp(stat.st_ctime, tz=timezone.utc).isoformat()
        entries.append(
            ReportListEntryModel(
                investigation_id=fname.removesuffix(".json"),
                filename=fname,
                size_bytes=stat.st_size,
                created_at=created_at,
            )
        )

    entries.sort(key=lambda e: e.created_at, reverse=True)
    return entries
