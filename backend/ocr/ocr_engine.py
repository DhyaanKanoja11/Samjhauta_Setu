import os
import requests

OCR_API_KEY = os.getenv("OCR_SPACE_API_KEY")


def extract_text_from_image(image_path: str) -> str:
    """
    Uses OCR.Space API to extract text from image.
    Production-safe for Render (no system dependencies).
    """

    if not OCR_API_KEY:
        return "OCR API key not configured."

    try:
        url = "https://api.ocr.space/parse/image"

        with open(image_path, "rb") as image_file:
            response = requests.post(
                url,
                files={"file": image_file},
                data={
                    "apikey": OCR_API_KEY,
                    "language": "eng",
                    "isOverlayRequired": False,
                },
                timeout=30,
            )

        result = response.json()

        if result.get("IsErroredOnProcessing"):
            return ""

        parsed_results = result.get("ParsedResults")

        if not parsed_results:
            return ""

        extracted_text = parsed_results[0].get("ParsedText", "").strip()

        return extracted_text

    except Exception as e:
        return f"OCR failed: {str(e)}"
