"""
TruthLens AI — Report Agent

Combines metadata analysis and visual analysis into a structured
digital forensic report using IBM Granite.

Author: TruthLens AI
"""

from __future__ import annotations

import json
import logging
from datetime import datetime
from typing import Any

from services.granite_service import get_granite_service
from utils.config import get_settings

logger = logging.getLogger("truthlens.report_agent")

settings = get_settings()

# ---------------------------------------------------------------------
# Granite System Prompt
# ---------------------------------------------------------------------

SYSTEM_CONTEXT = """
You are TruthLens AI, an expert Digital Image Forensics Investigator.

Your task is to analyse structured forensic evidence extracted from
an uploaded image.

You must:

• Evaluate authenticity.
• Explain WHY the image appears suspicious or authentic.
• Never invent evidence.
• Base every conclusion only on supplied forensic signals.

Your report should contain:

1. Executive Summary
2. Key Findings
3. Authenticity Assessment
4. Possible Manipulation Indicators
5. Final Recommendation

Keep the report professional, concise and evidence-based.
"""

# ---------------------------------------------------------------------
# Prompt Template
# ---------------------------------------------------------------------

REPORT_PROMPT_TEMPLATE = """
{system}

==================================================

IMAGE INFORMATION

Filename:
{filename}

Dimensions:
{width} x {height}

Mode:
{mode}

Format:
{fmt}

File Size:
{size_kb} KB

==================================================

METADATA

Integrity Flags:
{integrity_flags}

Camera Information:

{camera_info}

GPS Information:

{gps_info}

==================================================

VISUAL ANALYSIS

Brightness:
{brightness}

Contrast:
{contrast}

Sharpness:
{sharpness}

Noise Estimate:
{noise}

Histogram Entropy:
{entropy}

Detected Visual Anomalies:

{anomaly_signals}

==================================================

Produce a professional forensic investigation report.
"""


class ReportAgent:
    """
    Generates the final investigation report using IBM Granite.
    """

    def __init__(self):
        self.granite = get_granite_service()

    # ---------------------------------------------------------------

    def generate(
        self,
        metadata: dict[str, Any],
        visual: dict[str, Any],
        original_filename: str,
        deep_analysis: bool = False,
    ) -> dict[str, Any]:
        logger.info("Generating AI investigation report...")

        prompt = self._build_prompt(
            metadata,
            visual,
            original_filename,
        )

        try:
            ai_summary = self.granite.generate(prompt)
            granite_available = self.granite.is_available()

        except Exception:
            logger.exception("Granite generation failed")

            ai_summary = (
                "IBM Granite could not generate the investigation report."
            )

            granite_available = False

        authenticity_score, risk_level = self._score(
            metadata,
            visual,
        )

        report = {
            "generated_at": datetime.now().astimezone().isoformat(),
            "granite_available": granite_available,
            "model_used": settings.granite_model_id if granite_available else "stub",
            "authenticity_score": authenticity_score,
            "risk_level": risk_level,
            "confidence": self._confidence(authenticity_score),
            "key_signals": self._key_signals(metadata, visual),
            "ai_summary": ai_summary,
            "deep_analysis": deep_analysis,
        }

        logger.info(
            "AI report complete | Score=%s Risk=%s",
            authenticity_score,
            risk_level,
        )

        return report

    # ---------------------------------------------------------------

    def _build_prompt(
        self,
        metadata: dict,
        visual: dict,
        filename: str,
    ) -> str:
        img = metadata.get("image_properties", {})
        cam = metadata.get("camera_info", {})
        gps = metadata.get("gps_data", {})

        integrity = metadata.get("integrity_flags", [])
        anomalies = visual.get("anomaly_signals", [])

        return REPORT_PROMPT_TEMPLATE.format(
            system=SYSTEM_CONTEXT,
            filename=filename,
            width=img.get("width", "?"),
            height=img.get("height", "?"),
            mode=img.get("mode", "?"),
            fmt=img.get("format", "?"),
            size_kb=metadata.get("file_info", {}).get("size_kb", "?"),
            integrity_flags="\n".join(integrity)
            if integrity else "None",
            camera_info=json.dumps(
                cam,
                indent=2,
            ),
            gps_info=json.dumps(
                gps,
                indent=2,
            ),
            brightness=visual.get("brightness"),
            contrast=visual.get("contrast"),
            sharpness=visual.get("sharpness_score"),
            noise=visual.get("noise_estimate"),
            entropy=visual.get("histogram_entropy"),
            anomaly_signals="\n".join(anomalies)
            if anomalies else "None",
        )

    # ---------------------------------------------------------------
    # Scoring Engine
    # ---------------------------------------------------------------

    @staticmethod
    def _score(
        metadata: dict,
        visual: dict,
    ) -> tuple[int, str]:
        """
        Calculate an authenticity score (0–100) based on
        metadata integrity and visual anomaly signals.

        Higher score = more authentic.
        """

        score = 100

        # -------------------------
        # Metadata penalties
        # -------------------------

        flags = metadata.get("integrity_flags", [])

        penalties = {
            "no_exif_data_found": 20,
            "missing_original_datetime": 8,
            "missing_camera_make": 6,
            "very_small_dimensions": 12,
        }

        for flag in flags:
            score -= penalties.get(flag, 5)

            if flag.startswith("edited_with:"):
                score -= 15

        # -------------------------
        # Visual penalties
        # -------------------------

        anomalies = visual.get("anomaly_signals", [])

        anomaly_penalties = {
            "extremely_dark_image": 5,
            "overexposed_image": 5,
            "very_low_contrast": 8,
            "blurred_image": 10,
            "low_entropy": 15,
            "very_high_entropy": 8,
            "possible_aggressive_smoothing": 10,
        }

        for anomaly in anomalies:
            score -= anomaly_penalties.get(anomaly, 5)

        score = max(0, min(100, score))

        if score >= 75:
            risk = "LOW"

        elif score >= 50:
            risk = "MEDIUM"

        elif score >= 25:
            risk = "HIGH"

        else:
            risk = "CRITICAL"

        return score, risk

    # ---------------------------------------------------------------
    # Confidence
    # ---------------------------------------------------------------

    @staticmethod
    def _confidence(score: int) -> str:
        if score >= 80:
            return "High"

        if score >= 50:
            return "Medium"

        return "Low"

    # ---------------------------------------------------------------
    # Key Signals
    # ---------------------------------------------------------------

    @staticmethod
    def _key_signals(
        metadata: dict,
        visual: dict,
    ) -> list[str]:
        signals = []

        signals.extend(
            metadata.get("integrity_flags", [])
        )

        signals.extend(
            visual.get("anomaly_signals", [])
        )

        signals.extend(
            visual.get("analysis_notes", [])
        )

        # Remove duplicates while preserving order
        unique = []

        seen = set()

        for signal in signals:
            if signal not in seen:
                seen.add(signal)
                unique.append(signal)

        return unique