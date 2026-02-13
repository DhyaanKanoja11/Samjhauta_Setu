import os

# ----------------------------
# Upload Configuration
# ----------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "pdf"}

DEFAULT_OUTPUT_LANG = "hi"

# ----------------------------
# CORS Configuration
# ----------------------------

ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,https://samjhautasetu.vercel.app"
)

ALLOWED_ORIGINS = [origin.strip() for origin in ALLOWED_ORIGINS.split(",")]
