import shutil
import pytesseract
from .image_preprocess import preprocess_image


def _tesseract_available() -> bool:
    return shutil.which("tesseract") is not None


def extract_text_from_image(image_path: str) -> str:
    """
    Uses Tesseract if available.
    Raises RuntimeError with a clear message if not available.
    """
    if not _tesseract_available():
        raise RuntimeError("OCR not available on this server (Tesseract missing).")

    img = preprocess_image(image_path)
    text = pytesseract.image_to_string(img)
    return text
