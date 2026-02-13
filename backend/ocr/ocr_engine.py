import os
import cv2
import pytesseract


def extract_text_from_image(image_path: str) -> str:
    """
    Extract text from image.
    Works locally with Tesseract.
    Safe fallback on Render (where Tesseract isn't installed).
    """

    try:
        if not os.path.exists(image_path):
            raise RuntimeError("Image not found")

        image = cv2.imread(image_path)

        if image is None:
            raise RuntimeError("Invalid image file")

        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        text = pytesseract.image_to_string(gray)

        return text.strip()

    except pytesseract.TesseractNotFoundError:
        # Render doesn't support Tesseract
        return "OCR engine not available in production environment."

    except Exception as e:
        return f"OCR failed: {str(e)}"
