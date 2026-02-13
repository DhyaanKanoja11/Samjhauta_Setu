import os
import pytesseract
import uuid
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_talisman import Talisman

from config import UPLOAD_FOLDER, ALLOWED_EXTENSIONS, DEFAULT_OUTPUT_LANG
from ocr.ocr_engine import extract_text_from_image
from risk.risk_engine import analyze_contract
from utils.logger import logger

# ----------------------------
# App Initialization
# ----------------------------

if os.name == 'nt': # Windows
    pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
else: # Linux (Render/Docker)
    pytesseract.pytesseract.tesseract_cmd = '/usr/bin/tesseract'
    
app = Flask(__name__)

# Security Headers (handled via proxy on Render)
Talisman(app, content_security_policy=None)

# Secure CORS Configuration
CORS(app, origins=[
    "http://localhost:5173",  # Local development
    "https://samjhautasetu.vercel.app/"  # Replace with actual Vercel URL
])

# Rate Limiting
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["100 per day", "20 per minute"],
    storage_uri="memory://"
)

# Additional Security Headers
@app.after_request
def add_security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'SAMEORIGIN'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    return response

# Ensure upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# ----------------------------
# Utility: File Validation
# ----------------------------

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


# ----------------------------
# Routes
# ----------------------------

@app.route("/", methods=["GET"])
def home():
    return "Samjhauta Setu backend running"


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "OK"})


# ----------------------------
# Analyze Raw Text
# ----------------------------

@app.route("/analyze", methods=["POST"])
@limiter.limit("10 per minute")
def analyze_text():
    try:
        data = request.get_json()

        if not data or "text" not in data:
            return jsonify({"error": "No text provided"}), 400

        text = data.get("text", "").strip()
        output_lang = data.get("lang", DEFAULT_OUTPUT_LANG)

        if not text:
            return jsonify({"error": "Empty text"}), 400

        logger.info("Analyze endpoint triggered")

        result = analyze_contract(text, output_lang)

        return jsonify({
            "success": True,
            "analysis": result
        })

    except Exception as e:
        logger.error(f"Analyze error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


# ----------------------------
# OCR + Analyze Document
# ----------------------------
@app.route("/scan", methods=["POST"])
@limiter.limit("5 per minute")
def scan_document():
    try:
        if "file" not in request.files:
            return jsonify({"success": False, "error": "No file uploaded"}), 400

        file = request.files["file"]
        output_lang = request.form.get("lang", DEFAULT_OUTPUT_LANG)

        if file.filename == "":
            return jsonify({"success": False, "error": "Empty filename"}), 400

        if not allowed_file(file.filename):
            return jsonify({"success": False, "error": "Unsupported file type"}), 400

        filename = f"{uuid.uuid4().hex}_{file.filename}"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)

        logger.info("Scan endpoint triggered")

        # OCR
        try:
            text = extract_text_from_image(filepath)
        except RuntimeError as ocr_error:
            return jsonify({
                "success": False,
                "error": str(ocr_error)
            }), 500

        if not text or len(text.strip()) < 20:
            return jsonify({
                "success": False,
                "error": "OCR failed or insufficient readable text"
            }), 400

        analysis = analyze_contract(text, output_lang)

        return jsonify({
            "success": True,
            "ocr_text_preview": text[:2000],
            "analysis": analysis
        })

    except Exception as e:
        logger.error(f"Scan error: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

    finally:
        if "filepath" in locals() and os.path.exists(filepath):
            os.remove(filepath)

# ----------------------------
# Entry Point (Render Compatible)
# ----------------------------

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
