import os
import pytesseract
import cv2


# If Tesseract path is provided via ENV (optional)
TESSERACT_PATH = os.environ.get("TESSERACT_PATH")

if TESSERACT_PATH:
    pytesseract.pytesseract.tesseract_cmd = TESSERACT_PATH


def extract_text_from_image(image_path: str) -> str:
    """
    Extract text from an image using Tesseract OCR.
    """

    if not os.path.exists(image_path):
        raise RuntimeError("Image file not found")

    try:
        # Read image
        image = cv2.imread(image_path)

        if image is None:
            raise RuntimeError("Failed to read image")

        # Convert to grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # Optional thresholding for better OCR
        gray = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)[1]

        # Extract text
        text = pytesseract.image_to_string(gray)

        return text.strip()

    except pytesseract.TesseractNotFoundError:
        raise RuntimeError(
            "Tesseract OCR is not installed on the server"
        )

    except Exception as e:
        raise RuntimeError(f"OCR processing failed: {str(e)}")
