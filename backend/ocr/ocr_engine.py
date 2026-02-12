import pytesseract
from .image_preprocess import preprocess_image

def extract_text_from_image(image_path):
    processed = preprocess_image(image_path)
    text = pytesseract.image_to_string(processed)
    return text
