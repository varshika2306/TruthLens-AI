"""
TruthLens AI — Metadata Agent
Extracts EXIF, GPS, camera, and file-system metadata from an image.
"""

import os
import logging
from datetime import datetime
from typing import Any

from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS

logger = logging.getLogger("truthlens.metadata_agent")


class MetadataAgent:
    """
    Extracts structured metadata from an uploaded image file.

    Produces:
    - File-system metadata (size, extension, modified time)
    - PIL image properties (dimensions, colour mode, format)
    - Full EXIF tag dump
    - GPS coordinates (decoded to decimal degrees when available)
    - Camera / software signatures
    - Integrity flags (missing expected EXIF fields, etc.)
    """

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def extract(self, file_path: str) -> dict[str, Any]:
        """
        Run full metadata extraction on `file_path`.

        Returns a dict guaranteed to contain the top-level keys:
        file_info, image_properties, exif_data, gps_data,
        camera_info, integrity_flags, extraction_timestamp.
        """
        result: dict[str, Any] = {
            "file_info": self._file_info(file_path),
            "image_properties": {},
            "exif_data": {},
            "gps_data": {},
            "camera_info": {},
            "integrity_flags": [],
            "extraction_timestamp": datetime.utcnow().isoformat() + "Z",
        }

        try:
            with Image.open(file_path) as img:
                result["image_properties"] = self._image_properties(img)
                raw_exif = self._raw_exif(img)
                result["exif_data"] = raw_exif
                result["gps_data"] = self._gps_info(raw_exif)
                result["camera_info"] = self._camera_info(raw_exif)
                result["integrity_flags"] = self._integrity_flags(img, raw_exif)
        except Exception as exc:
            logger.warning("Metadata extraction partial failure: %s", exc)
            result["integrity_flags"].append(f"extraction_error: {exc}")

        return result

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _file_info(file_path: str) -> dict:
        stat = os.stat(file_path)
        return {
            "path": file_path,
            "filename": os.path.basename(file_path),
            "extension": os.path.splitext(file_path)[1].lstrip(".").lower(),
            "size_bytes": stat.st_size,
            "size_kb": round(stat.st_size / 1024, 2),
            "modified_at": datetime.utcfromtimestamp(stat.st_mtime).isoformat() + "Z",
        }

    @staticmethod
    def _image_properties(img: Image.Image) -> dict:
        return {
            "width": img.width,
            "height": img.height,
            "megapixels": round((img.width * img.height) / 1_000_000, 2),
            "mode": img.mode,
            "format": img.format,
            "has_transparency": img.mode in ("RGBA", "LA", "P"),
            "is_animated": getattr(img, "n_frames", 1) > 1,
        }

    @staticmethod
    def _raw_exif(img: Image.Image) -> dict:
        """Return a human-readable EXIF dict (tag name → value)."""
        exif_data: dict = {}
        try:
            raw = img._getexif()  # type: ignore[attr-defined]
            if raw:
                for tag_id, value in raw.items():
                    tag_name = TAGS.get(tag_id, str(tag_id))
                    # Skip bulky binary blobs
                    if isinstance(value, bytes) and len(value) > 256:
                        exif_data[tag_name] = f"<binary {len(value)} bytes>"
                    else:
                        try:
                            exif_data[tag_name] = (
                                str(value) if not isinstance(value, (int, float, str)) else value
                            )
                        except Exception:
                            exif_data[tag_name] = "<unserializable>"
        except Exception:
            pass  # Non-JPEG formats or stripped EXIF — handled via integrity_flags
        return exif_data

    @staticmethod
    def _gps_info(exif_data: dict) -> dict:
        """Decode GPSInfo into a lat/lon dict when present."""
        gps_raw = exif_data.get("GPSInfo")
        if not gps_raw:
            return {"available": False}

        try:
            gps_tags = {GPSTAGS.get(k, k): v for k, v in gps_raw.items()} \
                if isinstance(gps_raw, dict) else {}

            def _dms_to_dd(dms, ref) -> float:
                d, m, s = [float(x) for x in dms]
                dd = d + m / 60 + s / 3600
                return -dd if ref in ("S", "W") else dd

            lat = lon = None
            if "GPSLatitude" in gps_tags and "GPSLatitudeRef" in gps_tags:
                lat = round(_dms_to_dd(gps_tags["GPSLatitude"], gps_tags["GPSLatitudeRef"]), 6)
            if "GPSLongitude" in gps_tags and "GPSLongitudeRef" in gps_tags:
                lon = round(_dms_to_dd(gps_tags["GPSLongitude"], gps_tags["GPSLongitudeRef"]), 6)

            return {
                "available": lat is not None and lon is not None,
                "latitude": lat,
                "longitude": lon,
                "altitude": gps_tags.get("GPSAltitude"),
                "timestamp": gps_tags.get("GPSTimeStamp"),
            }
        except Exception as exc:
            logger.debug("GPS decode failed: %s", exc)
            return {"available": False, "error": str(exc)}

    @staticmethod
    def _camera_info(exif_data: dict) -> dict:
        return {
            "make": exif_data.get("Make", "Unknown"),
            "model": exif_data.get("Model", "Unknown"),
            "software": exif_data.get("Software", "Unknown"),
            "datetime_original": exif_data.get("DateTimeOriginal"),
            "datetime_digitized": exif_data.get("DateTimeDigitized"),
            "exposure_time": exif_data.get("ExposureTime"),
            "f_number": exif_data.get("FNumber"),
            "iso_speed": exif_data.get("ISOSpeedRatings"),
            "focal_length": exif_data.get("FocalLength"),
            "flash": exif_data.get("Flash"),
            "orientation": exif_data.get("Orientation"),
        }

    @staticmethod
    def _integrity_flags(img: Image.Image, exif_data: dict) -> list[str]:
        flags: list[str] = []
        if not exif_data:
            flags.append("no_exif_data_found")
        if "DateTimeOriginal" not in exif_data:
            flags.append("missing_original_datetime")
        if "Make" not in exif_data or exif_data.get("Make") in (None, "Unknown"):
            flags.append("missing_camera_make")
        if img.mode not in ("RGB", "RGBA", "L"):
            flags.append(f"unusual_colour_mode:{img.mode}")
        if img.width < 100 or img.height < 100:
            flags.append("very_small_dimensions")
        return flags
