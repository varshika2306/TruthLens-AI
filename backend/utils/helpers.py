"""
TruthLens AI — Utility Helpers
"""


def truncate(value: str, max_len: int = 200) -> str:
    """Safely truncate a string to `max_len` characters."""
    if not isinstance(value, str):
        value = str(value)
    return value if len(value) <= max_len else value[:max_len] + "…"


def safe_json_value(value) -> str:
    """Convert any value to a JSON-safe string representation."""
    if isinstance(value, (int, float, bool, str)):
        return value  # type: ignore[return-value]
    try:
        return str(value)
    except Exception:
        return "<unserializable>"
