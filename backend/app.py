import os
import uuid
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_talisman import Talisman

from config import UPLOAD_FOLDER, ALLOWED_EXTENSIONS, DEFAULT_OUTPUT_LANG, ALLOWED_ORIGINS
from ocr.ocr_engine import extract_text_from_image
from risk.risk_engine import analyze_contract
from utils.logger import logger


# ----------------------------
# App Initialization
# ----------------------------

app = Flask(__name__)

Talisman(app, content_security_policy=None, force_https=False)

CORS(
    app,
    origins=ALLOWED_ORIGINS,
    supports_credentials=False,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "OPTIONS"]
)

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["100 per day", "20 per minute"],
    storage_uri="memory://"
)

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.after_request
def add_security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'SAMEORIGIN'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    return response


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/", methods=["GET"])
def home():
    return "Samjhauta Setu backend running", 200


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "OK"}), 200


@app.route("/analyze", methods=["POST"])
@limiter.limit("10 per minute")
def analyze_text():
    try:
        data = request.get_json()

        if not data or "text" not in data:
            return jsonify({"success": False, "error": "No text provided"}), 400

        text = data.get("text", "").strip()
        output_lang = data.get("lang", DEFAULT_OUTPUT_LANG)

        if not text:
            return jsonify({"success": False, "error": "Empty text"}), 400

        result = analyze_contract(text, output_lang)

        return jsonify({
            "success": True,
            "analysis": result
        }), 200

    except Exception:
        logger.exception("Analyze error")
        return jsonify({"success": False, "error": "Internal server error"}), 500


@app.route("/scan", methods=["POST"])
@limiter.limit("5 per minute")
def scan_document():
    filepath = None

    try:
        if "file" not in request.files:
            return jsonify({"success": False, "error": "No file uploaded"}), 400

        file = request.files["file"]
        output_lang = request.form.get("lang", DEFAULT_OUTPUT_LANG)

        if not file.filename:
            return jsonify({"success": False, "error": "Empty filename"}), 400

        if not allowed_file(file.filename):
            return jsonify({"success": False, "error": "Unsupported file type"}), 400

        filename = f"{uuid.uuid4().hex}_{file.filename}"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)

        text = extract_text_from_image(filepath)

        if not text or len(text.strip()) < 10:
            return jsonify({
                "success": False,
                "error": "OCR failed or insufficient readable text"
            }), 400

        analysis = analyze_contract(text, output_lang)

        return jsonify({
            "success": True,
            "ocr_text_preview": text[:2000],
            "analysis": analysis
        }), 200

    except Exception:
        logger.exception("Scan error")
        return jsonify({"success": False, "error": "Internal server error"}), 500

    finally:
        if filepath and os.path.exists(filepath):
            try:
                os.remove(filepath)
            except Exception:
                pass


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
