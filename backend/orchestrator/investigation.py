"""
TruthLens AI — Investigation Orchestrator
Coordinates MetadataAgent → VisualAgent → ReportAgent
and persists the final JSON report to disk.
"""

import json
import logging
import os
from datetime import datetime, timezone
from typing import Any

from agents.metadata_agent import MetadataAgent
from agents.visual_agent import VisualAgent
from agents.report_agent import ReportAgent
from utils.config import get_settings

logger = logging.getLogger("truthlens.orchestrator")
settings = get_settings()


class InvestigationOrchestrator:
    """
    Runs the full TruthLens investigation pipeline.

    Stage 1 → MetadataAgent
    Stage 2 → VisualAgent
    Stage 3 → ReportAgent (IBM Granite)

    Produces a complete Investigation Report and stores it
    in the reports directory.
    """

    def __init__(self):
        self._metadata_agent = MetadataAgent()
        self._visual_agent = VisualAgent()
        self._report_agent = ReportAgent()

        os.makedirs(settings.reports_dir, exist_ok=True)

    # ---------------------------------------------------------
    # Public API
    # ---------------------------------------------------------

    async def run(
        self,
        file_path: str,
        original_filename: str,
        investigation_id: str,
        deep_analysis: bool = False,
    ) -> dict[str, Any]:

        started_at = datetime.now(timezone.utc).isoformat()

        logger.info(
            "[%s] Investigation started for %s",
            investigation_id,
            original_filename,
        )

        # -----------------------------------------------------
        # Stage 1 : Metadata Analysis
        # -----------------------------------------------------

        logger.info("[%s] Running MetadataAgent", investigation_id)

        try:
            metadata = self._metadata_agent.extract(file_path)
            stage1_status = "success"

        except Exception as exc:
            logger.exception("[%s] MetadataAgent failed", investigation_id)

            metadata = {
                "error": str(exc)
            }

            stage1_status = "failed"

        # -----------------------------------------------------
        # Stage 2 : Visual Analysis
        # -----------------------------------------------------

        logger.info("[%s] Running VisualAgent", investigation_id)

        try:
            visual = self._visual_agent.analyse(file_path)
            stage2_status = "success"

        except Exception as exc:
            logger.exception("[%s] VisualAgent failed", investigation_id)

            visual = {
                "error": str(exc)
            }

            stage2_status = "failed"

        # -----------------------------------------------------
        # Stage 3 : IBM Granite Report Generation
        # -----------------------------------------------------

        logger.info("[%s] Running ReportAgent", investigation_id)

        try:
            ai_report = self._report_agent.generate(
                metadata=metadata,
                visual=visual,
                original_filename=original_filename,
                deep_analysis=deep_analysis,      # ⭐ Improvement
            )

            stage3_status = "success"

        except Exception as exc:
            logger.exception("[%s] ReportAgent failed", investigation_id)

            ai_report = {
                "error": str(exc),
                "authenticity_score": None,
                "risk_level": "UNKNOWN",
                "key_signals": [],
                "ai_summary": "Report generation failed.",
            }

            stage3_status = "failed"

        completed_at = datetime.now(timezone.utc).isoformat()

        # -----------------------------------------------------
        # Final Report
        # -----------------------------------------------------

        report: dict[str, Any] = {
            "investigation_id": investigation_id,
            "original_filename": original_filename,
            "platform": "TruthLens AI",
            "pipeline_version": "1.0.0",
            "deep_analysis": deep_analysis,
            "started_at": started_at,
            "completed_at": completed_at,
            "pipeline_stages": {
                "metadata_extraction": stage1_status,
                "visual_analysis": stage2_status,
                "ai_report_generation": stage3_status,
            },
            "metadata": metadata,
            "visual_analysis": visual,
            "ai_report": ai_report,
            "verdict": {
                "authenticity_score": ai_report.get("authenticity_score"),
                "risk_level": ai_report.get("risk_level"),
                "key_signals": ai_report.get("key_signals", []),
                "summary": ai_report.get("ai_summary"),
            },
        }

        # -----------------------------------------------------
        # Save Report
        # -----------------------------------------------------

        self._save_report(
            investigation_id=investigation_id,
            report=report,
        )

        logger.info(
            "[%s] Investigation completed successfully",
            investigation_id,
        )

        return report

    # ---------------------------------------------------------
    # Save Report
    # ---------------------------------------------------------

    def _save_report(
        self,
        investigation_id: str,
        report: dict,
    ) -> None:

        report_path = os.path.join(
            settings.reports_dir,
            f"{investigation_id}.json",
        )

        try:
            with open(
                report_path,
                "w",
                encoding="utf-8",
            ) as file:

                json.dump(
                    report,
                    file,
                    indent=2,
                    default=str,
                )

            logger.info("Report saved → %s", report_path)

        except Exception as exc:
            logger.exception(
                "Failed to save report %s : %s",
                report_path,
                exc,
            )