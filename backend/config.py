import os

# ----------------------------
# Base Directory
# ----------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


UPLOAD_FOLDER = os.environ.get("UPLOAD_FOLDER", "/tmp/uploads")


ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}

DEFAULT_OUTPUT_LANG = os.environ.get("DEFAULT_OUTPUT_LANG", "hi")

# ----------------------------
# Allowed Origins (CORS)
# ----------------------------

ALLOWED_ORIGINS = os.environ.get(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,https://samjhautasetu.vercel.app"
).split(",")
