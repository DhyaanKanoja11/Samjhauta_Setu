import os
import pytesseract
from PIL import Image
import shutil

# ---------------------------------------------------
# Check if Tesseract is available in system
# ---------------------------------------------------

def is_tesseract_available():
    return shutil.which("tesseract") is not None


# ---------------------------------------------------
# OCR Extraction Function
# ---------------------------------------------------

def extract_text_from_image(image_path):
    if not is_tesseract_available():
        raise RuntimeError("Tesseract OCR is not installed on this server.")

    try:
        image = Image.open(image_path)
        text = pytesseract.image_to_string(image)
        return text

    except Exception as e:
        raise RuntimeError(f"OCR processing failed: {str(e)}")
