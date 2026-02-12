# 🔗 SamjhautaSetu - Connection Map

## Visual Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USER BROWSER                                │
│                     http://localhost:5173                            │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    REACT FRONTEND                            │   │
│  │                                                              │   │
│  │  Pages:                    Components:                      │   │
│  │  ├── Dashboard             ├── VoiceAssistant               │   │
│  │  ├── LoginPage             ├── DocumentScanner              │   │
│  │  ├── MandiPage             ├── MandiPrices                  │   │
│  │  ├── DocumentsPage         └── Navbar                       │   │
│  │  └── ProfilePage                                            │   │
│  │                                                              │   │
│  │  Services Layer:                                            │   │
│  │  └── api.js (Axios HTTP Client)                             │   │
│  └──────────────┬────────────────────────┬──────────────────────┘   │
└─────────────────┼────────────────────────┼──────────────────────────┘
                  │                        │
                  │ HTTP POST/GET          │ HTTP POST/GET
                  │ JSON/FormData          │ JSON/FormData
                  │                        │
        ┌─────────▼──────────┐   ┌────────▼─────────────┐
        │   BACKEND 1        │   │   BACKEND 2          │
        │   OCR/Risk Engine  │   │   AI Chatbot         │
        │   Port: 5000       │   │   Port: 5001         │
        │                    │   │                      │
        │   Flask Server     │   │   Flask Server       │
        │   ├── /scan        │   │   ├── /chat          │
        │   ├── /analyze     │   │   └── /news          │
        │   └── /health      │   │                      │
        │                    │   │                      │
        │   Dependencies:    │   │   Dependencies:      │
        │   ├── Tesseract    │   │   ├── Groq API       │
        │   ├── OpenCV       │   │   ├── gTTS           │
        │   ├── Pillow       │   │   ├── SpeechRec      │
        │   └── Translator   │   │   └── Feedparser     │
        └────────────────────┘   └──────────────────────┘
                  │                        │
                  │                        │
        ┌─────────▼──────────┐   ┌────────▼─────────────┐
        │   File System      │   │   External APIs      │
        │   ├── uploads/     │   │   ├── Groq LLM       │
        │   └── logs/        │   │   ├── PIB RSS        │
        └────────────────────┘   │   └── Google STT     │
                                 └──────────────────────┘
```

---

## 🔄 Data Flow Diagrams

### 1. Document Scanning Flow

```
User uploads image
       │
       ▼
┌──────────────────┐
│ DocumentScanner  │ (React Component)
│ Component        │
└────────┬─────────┘
         │ FormData: { file, lang }
         │ POST /scan
         ▼
┌──────────────────┐
│ Backend 1        │
│ /scan endpoint   │
└────────┬─────────┘
         │
         ├─► Image Preprocessing (OpenCV)
         │
         ├─► OCR Extraction (Tesseract)
         │
         ├─► Language Detection
         │
         ├─► Risk Analysis (NLP)
         │
         └─► Translation (if needed)
         │
         ▼
┌──────────────────┐
│ Response JSON    │
│ {                │
│   success: true, │
│   ocr_text,      │
│   analysis: {    │
│     risk_level,  │
│     risk_score,  │
│     clauses,     │
│     findings     │
│   }              │
│ }                │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ UI Updates       │
│ - Show results   │
│ - Display risks  │
│ - Enable actions │
└──────────────────┘
```

---

### 2. Voice Chat Flow

```
User speaks/types
       │
       ▼
┌──────────────────┐
│ VoiceAssistant   │ (React Component)
│ Component        │
└────────┬─────────┘
         │
         ├─► Text Input: FormData { text }
         │   OR
         └─► Audio Input: FormData { audio: blob }
         │
         │ POST /chat
         ▼
┌──────────────────┐
│ Backend 2        │
│ /chat endpoint   │
└────────┬─────────┘
         │
         ├─► If Audio:
         │   ├─► Convert to WAV
         │   ├─► Speech-to-Text (Google/Groq)
         │   └─► Extract text
         │
         ├─► Get Answer:
         │   ├─► Try Groq LLM (llama3-70b)
         │   ├─► Fallback: Ollama (local)
         │   └─► Fallback: Expert System
         │
         └─► Text-to-Speech (gTTS)
         │
         ▼
┌──────────────────┐
│ Response JSON    │
│ {                │
│   text: "...",   │
│   voice: "/url"  │
│ }                │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ UI Updates       │
│ - Show message   │
│ - Play audio     │
│ - Update chat    │
└──────────────────┘
```

---

### 3. News Feed Flow

```
Dashboard loads
       │
       ▼
┌──────────────────┐
│ Dashboard.jsx    │
│ useEffect()      │
└────────┬─────────┘
         │ GET /news
         ▼
┌──────────────────┐
│ Backend 2        │
│ /news endpoint   │
└────────┬─────────┘
         │
         ├─► Fetch PIB RSS Feed
         │   (Press Information Bureau)
         │
         ├─► Parse XML
         │
         └─► Extract top 3 articles
         │
         ▼
┌──────────────────┐
│ Response JSON    │
│ [                │
│   {              │
│     title,       │
│     link         │
│   },             │
│   ...            │
│ ]                │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ UI Updates       │
│ - Display cards  │
│ - Enable links   │
└──────────────────┘
```

---

## 📡 API Endpoints Reference

### Backend 1 (Port 5000) - OCR/Risk Engine

| Endpoint | Method | Input | Output | Purpose |
|----------|--------|-------|--------|---------|
| `/` | GET | - | String | Health check message |
| `/health` | GET | - | `{"status": "OK"}` | Service health |
| `/scan` | POST | `file` (image)<br>`lang` (string) | `{success, ocr_text_preview, analysis}` | OCR + Risk analysis |
| `/analyze` | POST | `text` (string)<br>`lang` (string) | `{success, analysis}` | Text risk analysis |

**Rate Limits:**
- 100 requests per day
- 20 requests per minute

---

### Backend 2 (Port 5001) - AI Chatbot

| Endpoint | Method | Input | Output | Purpose |
|----------|--------|-------|--------|---------|
| `/chat` | POST | `text` (string)<br>OR<br>`audio` (file) | `{text, voice}` | Chat with AI |
| `/news` | GET | - | `[{title, link}, ...]` | Agriculture news |

**Rate Limits:**
- 500 requests per day
- 100 requests per hour

---

## 🔌 Frontend API Integration

### File: `frontend/src/services/api.js`

```javascript
// Configuration
const BASE_URL_OCR = "http://localhost:5000"
const BASE_URL_CHATBOT = "http://localhost:5001"

// API Clients
const BASE_API = axios.create({ baseURL: BASE_URL_OCR })
const CHATBOT_API = axios.create({ baseURL: BASE_URL_CHATBOT })

// Functions
scanDocument(file, lang)      → POST /scan
analyzeText(text, lang)       → POST /analyze
chatWithBot(text)             → POST /chat
chatWithBotAudio(audioBlob)   → POST /chat
```

---

## 🎯 Component-to-API Mapping

### Dashboard.jsx
```javascript
useEffect(() => {
  fetch('http://localhost:5001/news')  // Direct fetch
    .then(res => res.json())
    .then(data => setNews(data))
})
```
**Connects to:** Backend 2 `/news`

---

### VoiceAssistant.jsx
```javascript
// Text chat
const response = await chatWithBot(text)
// → POST http://localhost:5001/chat

// Voice chat
const response = await chatWithBotAudio(audioBlob)
// → POST http://localhost:5001/chat
```
**Connects to:** Backend 2 `/chat`

---

### DocumentScanner.jsx
```javascript
const response = await scanDocument(selectedFile, 'hi')
// → POST http://localhost:5000/scan
```
**Connects to:** Backend 1 `/scan`

---

## 🔒 CORS Configuration

### Backend 1 (app.py)
```python
CORS(app, resources={r"/*": {"origins": "*"}})
```
**Allows:** All origins (development only)

### Backend 2 (app.py)
```python
CORS(app, resources={r"/*": {"origins": "*"}})
```
**Allows:** All origins (development only)

### Production Recommendation
```python
ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "").split(",")
CORS(app, resources={r"/*": {"origins": ALLOWED_ORIGINS}})
```

---

## 🧪 Testing Connections

### Test Backend 1
```bash
# Health check
curl http://localhost:5000/health

# Test analyze endpoint
curl -X POST http://localhost:5000/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "This is a test contract", "lang": "en"}'
```

### Test Backend 2
```bash
# Get news
curl http://localhost:5001/news

# Test chat endpoint
curl -X POST http://localhost:5001/chat \
  -F "text=नमस्ते"
```

### Test Frontend Connection
```javascript
// Open browser console on http://localhost:5173
// Run:
fetch('http://localhost:5000/health')
  .then(r => r.json())
  .then(console.log)

fetch('http://localhost:5001/news')
  .then(r => r.json())
  .then(console.log)
```

---

## 🚨 Common Connection Issues

### Issue: CORS Error
```
Access to fetch at 'http://localhost:5000/scan' from origin 
'http://localhost:5173' has been blocked by CORS policy
```

**Solution:**
1. Check backend CORS configuration
2. Ensure backend is running
3. Verify `ALLOWED_ORIGINS` in `.env`

---

### Issue: Network Error
```
AxiosError: Network Error
```

**Solution:**
1. Check if backend is running: `curl http://localhost:5000/health`
2. Verify port numbers in frontend `.env`
3. Check firewall settings

---

### Issue: 404 Not Found
```
POST http://localhost:5000/scan 404 (Not Found)
```

**Solution:**
1. Verify endpoint exists in backend
2. Check HTTP method (GET vs POST)
3. Ensure backend is fully started

---

## 📊 Connection Health Dashboard

Create this simple HTML file to monitor all connections:

```html
<!DOCTYPE html>
<html>
<head>
  <title>SamjhautaSetu Health Check</title>
  <style>
    body { font-family: monospace; padding: 20px; }
    .status { padding: 10px; margin: 5px; border-radius: 5px; }
    .ok { background: #d4edda; color: #155724; }
    .error { background: #f8d7da; color: #721c24; }
  </style>
</head>
<body>
  <h1>🔍 Connection Health Monitor</h1>
  <div id="results"></div>
  
  <script>
    async function checkHealth() {
      const results = document.getElementById('results');
      results.innerHTML = '<p>Checking...</p>';
      
      const checks = [
        { name: 'Backend 1 Health', url: 'http://localhost:5000/health' },
        { name: 'Backend 2 News', url: 'http://localhost:5001/news' },
        { name: 'Frontend', url: 'http://localhost:5173' }
      ];
      
      let html = '';
      for (const check of checks) {
        try {
          const res = await fetch(check.url);
          const status = res.ok ? 'ok' : 'error';
          html += `<div class="status ${status}">✅ ${check.name}: OK</div>`;
        } catch (e) {
          html += `<div class="status error">❌ ${check.name}: FAILED</div>`;
        }
      }
      results.innerHTML = html;
    }
    
    checkHealth();
    setInterval(checkHealth, 5000); // Check every 5 seconds
  </script>
</body>
</html>
```

Save as `health-check.html` and open in browser.

---

## 🎓 Learning Resources

### Understanding the Stack

**Frontend (React + Vite):**
- React handles UI components and state
- Vite provides fast development server
- Axios manages HTTP requests
- i18next handles translations

**Backend 1 (Flask + OCR):**
- Flask provides REST API
- Tesseract extracts text from images
- OpenCV preprocesses images
- Custom NLP analyzes risks

**Backend 2 (Flask + AI):**
- Flask provides REST API
- Groq API powers LLM responses
- gTTS converts text to speech
- SpeechRecognition handles voice input

---

**Last Updated:** 2024
**Maintained By:** SamjhautaSetu Team
