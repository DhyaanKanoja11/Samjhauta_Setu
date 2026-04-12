from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any

# Internal Imports
from services.chat import get_chat_response
from services.news import get_pib_news
from services.weather import get_weather

app = FastAPI(title="Samjhauta Setu - Agriculture ChatBot V2")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory context (Simplification for V2 demo)
USER_CONTEXT = {}

class ChatRequest(BaseModel):
    text: str
    lang: str = "hi"
    lat: Optional[float] = None
    lon: Optional[float] = None

@app.get("/")
async def root():
    return {"message": "Agriculture ChatBot V2 is running"}

@app.post("/chat")
async def chat(request: ChatRequest, req: Request):
    user_id = req.client.host
    if user_id not in USER_CONTEXT:
        USER_CONTEXT[user_id] = {"state": None, "market": None}
    
    context = USER_CONTEXT[user_id]
    response, status_code = get_chat_response(
        request.text, request.lang, context, request.lat, request.lon
    )
    
    return JSONResponse(content={"text": response, "context": context}, status_code=status_code)

@app.get("/pib-news")
async def pib_news(count: int = 10):
    return get_pib_news(count)

@app.get("/weather")
async def weather(lat: float, lon: float):
    return {"text": get_weather(lat, lon)}

@app.post("/reset")
async def reset(req: Request):
    user_id = req.client.host
    USER_CONTEXT[user_id] = {"state": None, "market": None}
    return {"message": "Context reset"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5001)
