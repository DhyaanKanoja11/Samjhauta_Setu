# 1. Start with a basic Python image
FROM python:3.10-slim

# 2. Install Tesseract & Dependencies (The Missing Piece)
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libtesseract-dev \
    libgl1 \
    && rm -rf /var/lib/apt/lists/*

# 3. Copy your project files
WORKDIR /app
COPY . /app

# 4. Install Python libraries
RUN pip install --no-cache-dir -r requirements.txt

# 5. Run the server
CMD ["python", "server.py"]
