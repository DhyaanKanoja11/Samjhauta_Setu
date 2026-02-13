from PIL import Image, ImageOps

try:
    import cv2
    import numpy as np
except Exception:
    cv2 = None
    np = None


def preprocess_image(image_path: str):
    """
    Returns a PIL Image that is lightly preprocessed.
    - If cv2 available -> better preprocessing
    - If not -> simple PIL grayscale/contrast
    """
    img = Image.open(image_path)

    # Fallback preprocessing (always works)
    img = ImageOps.exif_transpose(img)   # fix rotation issues
    img = img.convert("L")               # grayscale

    if cv2 is None or np is None:
        return img

    # Enhanced preprocessing using OpenCV
    arr = np.array(img)
    arr = cv2.GaussianBlur(arr, (3, 3), 0)
    arr = cv2.threshold(arr, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
    return Image.fromarray(arr)
