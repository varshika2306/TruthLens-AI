"""
TruthLens AI — Visual Agent
Performs pixel-level statistical and structural analysis of an image.

No AI model required.
Uses only Pillow to generate forensic signals that are later interpreted
by IBM Granite.
"""

from __future__ import annotations

import logging
import math
from typing import Any

from PIL import Image, ImageFilter, ImageStat

logger = logging.getLogger("truthlens.visual_agent")


class VisualAgent:
    """
    Performs image forensic analysis.

    Extracts:

    • Image dimensions
    • Brightness
    • Contrast
    • Sharpness
    • Noise estimation
    • Histogram entropy
    • RGB statistics
    • Anomaly signals
    """

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def analyse(self, file_path: str) -> dict[str, Any]:
        """
        Analyse an image and return structured forensic metrics.
        """

        result = {
            "image_size": {},
            "colour_stats": {},
            "brightness": None,
            "contrast": None,
            "sharpness_score": None,
            "noise_estimate": None,
            "histogram_entropy": None,
            "dominant_channel": None,
            "anomaly_signals": [],
            "analysis_notes": [],
        }

        try:
            with Image.open(file_path) as img:

                rgb = img.convert("RGB")

                result["image_size"] = self._image_size(rgb)
                result["colour_stats"] = self._colour_stats(rgb)
                result["brightness"] = self._brightness(rgb)
                result["contrast"] = self._contrast(rgb)
                result["sharpness_score"] = self._sharpness(rgb)
                result["noise_estimate"] = self._noise_estimate(rgb)
                result["histogram_entropy"] = self._histogram_entropy(rgb)
                result["dominant_channel"] = self._dominant_channel(rgb)

                result["anomaly_signals"] = self._detect_anomalies(result)
                result["analysis_notes"] = self._analysis_notes(rgb, result)

        except Exception as exc:
            logger.exception("Visual analysis failed")
            result["anomaly_signals"].append(f"analysis_error: {exc}")

        return result

    # ------------------------------------------------------------------
    # Image information
    # ------------------------------------------------------------------

    @staticmethod
    def _image_size(img: Image.Image) -> dict:

        width, height = img.size

        return {
            "width": width,
            "height": height,
            "aspect_ratio": round(width / height, 2),
        }

    # ------------------------------------------------------------------
    # Colour statistics
    # ------------------------------------------------------------------

    @staticmethod
    def _colour_stats(img: Image.Image) -> dict:

        stat = ImageStat.Stat(img)

        bands = img.getbands()

        mins = {}
        maxs = {}

        for band, extrema in zip(bands, stat.extrema):
            mins[band] = extrema[0]
            maxs[band] = extrema[1]

        return {
            "bands": list(bands),
            "mean": {
                band: round(value, 2)
                for band, value in zip(bands, stat.mean)
            },
            "stddev": {
                band: round(value, 2)
                for band, value in zip(bands, stat.stddev)
            },
            "min": mins,
            "max": maxs,
            "rms": {
                band: round(value, 2)
                for band, value in zip(bands, stat.rms)
            },
        }

    # ------------------------------------------------------------------
    # Metrics
    # ------------------------------------------------------------------

    @staticmethod
    def _brightness(img: Image.Image) -> float:

        gray = img.convert("L")

        return round(ImageStat.Stat(gray).mean[0], 2)

    @staticmethod
    def _contrast(img: Image.Image) -> float:

        gray = img.convert("L")

        return round(ImageStat.Stat(gray).stddev[0], 2)

    @staticmethod
    def _sharpness(img: Image.Image) -> float:

        gray = img.convert("L")

        edges = gray.filter(ImageFilter.FIND_EDGES)

        return round(ImageStat.Stat(edges).var[0], 2)

    @staticmethod
    def _noise_estimate(img: Image.Image) -> float:

        gray = img.convert("L")

        blurred = gray.filter(ImageFilter.GaussianBlur(radius=2))

        original = ImageStat.Stat(gray).mean[0]
        smooth = ImageStat.Stat(blurred).mean[0]

        return round(abs(original - smooth), 4)

    @staticmethod
    def _histogram_entropy(img: Image.Image) -> float:

        gray = img.convert("L")

        histogram = gray.histogram()

        total = sum(histogram)

        entropy = 0

        for value in histogram:

            if value:

                probability = value / total

                entropy -= probability * math.log2(probability)

        return round(entropy, 4)

    @staticmethod
    def _dominant_channel(img: Image.Image) -> str:

        stat = ImageStat.Stat(img)

        means = {
            "R": stat.mean[0],
            "G": stat.mean[1],
            "B": stat.mean[2],
        }

        return max(means, key=means.get)

    # ------------------------------------------------------------------
    # Signal Detection
    # ------------------------------------------------------------------

    @staticmethod
    def _detect_anomalies(metrics: dict) -> list[str]:

        signals = []

        brightness = metrics["brightness"]

        if brightness < 20:
            signals.append("extremely_dark_image")

        elif brightness > 240:
            signals.append("overexposed_image")

        contrast = metrics["contrast"]

        if contrast < 8:
            signals.append("very_low_contrast")

        sharpness = metrics["sharpness_score"]

        if sharpness < 20:
            signals.append("blurred_image")

        entropy = metrics["histogram_entropy"]

        if entropy < 2:
            signals.append("low_entropy")

        elif entropy > 7.8:
            signals.append("very_high_entropy")

        noise = metrics["noise_estimate"]

        if noise < 0.3:
            signals.append("possible_aggressive_smoothing")

        return signals

    # ------------------------------------------------------------------
    # Notes
    # ------------------------------------------------------------------

    @staticmethod
    def _analysis_notes(img: Image.Image, metrics: dict) -> list[str]:

        notes = []

        width, height = img.size

        ratio = width / height

        if ratio > 3 or ratio < 0.33:
            notes.append("unusual_aspect_ratio")

        if img.mode == "P":
            notes.append("palette_mode_image")

        if metrics["histogram_entropy"] > 7.5:
            notes.append("rich_texture_or_heavy_compression")

        if metrics["noise_estimate"] > 5:
            notes.append("high_noise_detected")

        return notes