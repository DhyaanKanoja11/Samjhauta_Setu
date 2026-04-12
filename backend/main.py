import os
import uuid
import shutil
from typing import List, Optional
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

# Internal Imports
from config import UPLOAD_FOLDER, ALLOWED_EXTENSIONS, DEFAULT_OUTPUT_LANG
from ocr.ocr_engine import extract_text_from_image
from risk.risk_engine import analyze_contract
from utils.logger import logger

app = FastAPI(
    title="Samjhauta Setu V2 - Legal Intelligence API",
    description="FastAPI-powered OCR and Risk Analysis for Agriculture Contracts",
    version="2.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# --- Models ---
class AnalysisRequest(BaseModel):
    text: str
    lang: Optional[str] = DEFAULT_OUTPUT_LANG

class HealthResponse(BaseModel):
    status: str = "OK"
    version: str = "2.0.0"

# --- Endpoints ---

@app.get("/", tags=["General"])
async def root():
    return {"message": "Samjhauta Setu V2 Backend is active", "docs": "/docs"}

@app.get("/health", response_model=HealthResponse, tags=["General"])
async def health():
    return HealthResponse()

@app.post("/analyze", tags=["Intelligence"])
async def analyze_text(request: AnalysisRequest):
    """
    Analyzes raw text for legal risks without requiring an image upload.
    """
    try:
        if not request.text.strip():
            raise HTTPException(status_code=400, detail="Text content cannot be empty")
            
        result = analyze_contract(request.text, request.lang)
        return {"success": True, "analysis": result}
        
    except Exception as e:
        logger.error(f"Text Analysis Error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error during analysis")

@app.post("/scan", tags=["Intelligence"])
async def scan_document(
    file: UploadFile = File(...), 
    lang: str = Form(DEFAULT_OUTPUT_LANG)
):
    """
    Uploads an image, performs OCR, and analyzes the extracted legal text.
    """
    file_extension = file.filename.split(".")[-1].lower()
    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported file type. Allowed: {ALLOWED_EXTENSIONS}"
        )

    # Generate unique filename to prevent collisions
    unique_filename = f"{uuid.uuid4().hex}_{file.filename}"
    filepath = os.path.join(UPLOAD_FOLDER, unique_filename)

    try:
        # Save uploaded file
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 1. OCR Step
        extracted_text = extract_text_from_image(filepath)
        
        if not extracted_text or len(extracted_text.strip()) < 10:
            raise HTTPException(
                status_code=422, 
                detail="OCR failed or insufficient text detected in the image."
            )

        # 2. Risk Analysis Step
        analysis_result = analyze_contract(extracted_text, lang)

        return {
            "success": True,
            "filename": file.filename,
            "ocr_preview": extracted_text[:500] + "...",
            "analysis": analysis_result
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Document Scan Error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error during document processing")
    
    finally:
        # Cleanup: Remove file after processing
        if os.path.exists(filepath):
            try:
                os.remove(filepath)
            except Exception as cleanup_err:
                logger.warning(f"Failed to delete temp file {filepath}: {cleanup_err}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
