# SamjhautaSetu - Project Analysis & Connection Report

## 📋 Project Overview

**SamjhautaSetu** is a comprehensive digital platform for Indian farmers featuring:
- Legal document OCR scanning and risk analysis
- AI-powered agricultural chatbot with voice support
- Real-time mandi (market) price tracking
- Multi-language support (6 Indian languages)
- Dark mode and accessibility features

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│                    React + Vite + Tailwind                   │
│                    Port: 5173 (default)                      │
│                                                              │
│  Components:                                                 │
│  ├── Dashboard (Main Hub)                                   │
│  ├── DocumentScanner (OCR Integration)                      │
│  ├── VoiceAssistant (Chatbot Integration)                   │
│  ├── MandiPrices (Market Prices)                            │
│  └── Authentication (Login/Signup)                          │
└──────────────────┬───────────────────┬──────────────────────┘
                   │                   │
                   │                   │
        ┌──────────▼──────────┐  ┌────▼─────────────────┐
        │   BACKEND 1         │  │   BACKEND 2          │
        │   OCR/Risk Engine   │  │   AI Chatbot         │
        │   Flask             │  │   Flask + Groq       │
        │   Port: 5000        │  │   Port: 5001         │
        │                     │  │                      │
        │   Endpoints:        │  │   Endpoints:         │
        │   /scan             │  │   /chat              │
        │   /analyze          │  │   /news              │
        │   /health           │  │                      │
        └─────────────────────┘  └──────────────────────┘
```

---

## 🔌 Server Connections

### 1. Frontend ↔ Backend 1 (OCR/Risk Engine)

**Connection File:** `frontend/src/services/api.js`

```javascript
const BASE_API = axios.create({
  baseURL: "http://localhost:5000",
});

// Document Scanning
export const scanDocument = async (file, lang = 'hi') => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("lang", lang);
  
  const response = await BASE_API.post("/scan", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response.data;
};

// Text Analysis
export const analyzeText = async (text, lang = 'hi') => {
  const response = await BASE_API.post("/analyze", { text, lang });
  return response.data;
};
```

**Backend Endpoints (Port 5000):**
- `POST /scan` - Upload image for OCR + risk analysis
- `POST /analyze` - Analyze raw text for risks
- `GET /health` - Health check

**Used By:**
- `frontend/src/components/dashboard/DocumentScanner.jsx`
- `frontend/src/pages/DocumentsPage.jsx`

---

### 2. Frontend ↔ Backend 2 (AI Chatbot)

**Connection File:** `frontend/src/services/api.js`

```javascript
const CHATBOT_API = axios.create({
  baseURL: "http://localhost:5001",
});

// Text Chat
export const chatWithBot = async (text) => {
  const formData = new FormData();
  formData.append("text", text);
  const response = await CHATBOT_API.post("/chat", formData);
  return response.data;
};

// Voice Chat
export const chatWithBotAudio = async (audioBlob) => {
  const formData = new FormData();
  formData.append("audio", audioBlob, "user_voice.webm");
  const response = await CHATBOT_API.post("/chat", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response.data;
};
```

**Backend Endpoints (Port 5001):**
- `POST /chat` - Text or audio input, returns text + audio response
- `GET /news` - Fetch agriculture news from PIB RSS feed

**Used By:**
- `frontend/src/components/dashboard/VoiceAssistant.jsx`
- `frontend/src/pages/Dashboard.jsx` (for news feed)

---

## 🔧 Issues Found & Fixes Needed

### ❌ CRITICAL ISSUES

#### 1. **Hardcoded API URLs**
**Problem:** API URLs are hardcoded to `localhost` in `api.js`

**Current Code:**
```javascript
baseURL: "http://localhost:5000"
baseURL: "http://localhost:5001"
```

**Fix Required:**
```javascript
// Create environment-based configuration
const BASE_URL_OCR = import.meta.env.VITE_API_URL_OCR || "http://localhost:5000";
const BASE_URL_CHATBOT = import.meta.env.VITE_API_URL_CHATBOT || "http://localhost:5001";

const BASE_API = axios.create({
  baseURL: BASE_URL_OCR,
});

const CHATBOT_API = axios.create({
  baseURL: BASE_URL_CHATBOT,
});
```

**Add `.env` file:**
```env
VITE_API_URL_OCR=http://localhost:5000
VITE_API_URL_CHATBOT=http://localhost:5001
```

---

#### 2. **Missing Error Handling in Components**

**Problem:** Components don't handle network failures gracefully

**Example in VoiceAssistant.jsx:**
```javascript
// Current - Generic error
catch (error) {
  console.error('Chat error:', error);
  const errorMessage = {
    text: t('chatError') || 'माफ़ करें...',
  };
}
```

**Fix Required:**
```javascript
catch (error) {
  console.error('Chat error:', error);
  let errorText = t('chatError');
  
  if (error.code === 'ERR_NETWORK') {
    errorText = t('connectError') || 'सर्वर से जुड़ने में समस्या। कृपया जांचें कि बैकएंड चल रहा है।';
  } else if (error.response?.status === 429) {
    errorText = 'बहुत अधिक अनुरोध। कृपया कुछ देर बाद प्रयास करें।';
  }
  
  const errorMessage = {
    id: Date.now() + 1,
    text: errorText,
    sender: 'bot',
    timestamp: new Date(),
  };
  setMessages((prev) => [...prev, errorMessage]);
}
```

---

#### 3. **Missing CORS Configuration**

**Backend 1 (app.py):**
```python
# Current - Too permissive
CORS(app, resources={r"/*": {"origins": "*"}})
```

**Fix Required:**
```python
# Production-ready CORS
ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

CORS(app, 
     resources={r"/*": {"origins": ALLOWED_ORIGINS}},
     allow_headers=["Content-Type", "Authorization"],
     supports_credentials=True)
```

---

#### 4. **Missing API Keys in Chatbot**

**Problem:** Groq API key is empty in `Agriculture ChatBot/app.py`

**Current:**
```python
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
```

**Fix Required:**
Create `.env` file in `Agriculture ChatBot/` directory:
```env
GROQ_API_KEY=your_groq_api_key_here
OLLAMA_URL=http://localhost:11434/api/generate
OLLAMA_MODEL=llama3
```

Then update app.py:
```python
from dotenv import load_dotenv
load_dotenv()

GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
if not GROQ_API_KEY:
    print("⚠️ WARNING: GROQ_API_KEY not set. Chatbot will use fallback mode.")
```

---

#### 5. **Placeholder Text Issues**

**Problem:** Mixed language placeholders and missing translations

**Examples Found:**

**LoginPage.jsx:**
```javascript
// Current
placeholder="98765-43210"

// Better
placeholder={t('phonePlaceholder') || "98765-43210"}
```

**DocumentScanner.jsx:**
```javascript
// Current - Hardcoded Hindi
<h2>दस्तावेज़ स्कैनर और जोखिम विश्लेषक</h2>

// Better
<h2>{t('scannerTitle')}</h2>
```

---

### ⚠️ MEDIUM PRIORITY ISSUES

#### 6. **Missing Loading States**

**Problem:** No loading indicators during API calls

**Fix in DocumentScanner.jsx:**
```javascript
{isProcessing && (
  <div className="flex-1 flex flex-col items-center justify-center">
    <div className="w-20 h-20 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin" />
    <p className="font-bold text-neutral-800 text-lg mt-4">
      {t('analyzingContract')}
    </p>
  </div>
)}
```

---

#### 7. **Authentication is Mock**

**Problem:** Login/Signup only stores data in localStorage

**Current:**
```javascript
localStorage.setItem('isAuthenticated', 'true');
```

**Recommendation:**
- Implement JWT-based authentication
- Add backend endpoints for user management
- Store tokens securely

---

#### 8. **Missing Backend Requirements**

**Problem:** `backend/requirements.txt` missing critical dependencies

**Current:**
```txt
flask
flask-cors
```

**Should Include:**
```txt
flask==3.0.0
flask-cors==4.0.0
flask-limiter==3.5.0
flask-talisman==1.1.0
pytesseract==0.3.10
opencv-python==4.8.1.78
Pillow==10.1.0
langdetect==1.0.9
deep-translator==1.11.4
gunicorn==21.2.0
python-dotenv==1.0.0
```

---

#### 9. **Chatbot Requirements Missing**

**Problem:** No requirements.txt for Agriculture ChatBot

**Create:** `Agriculture ChatBot/requirements.txt`
```txt
flask==3.0.0
flask-cors==4.0.0
flask-limiter==3.5.0
groq==0.4.1
gtts==2.4.0
speechrecognition==3.10.0
pydub==0.25.1
feedparser==6.0.10
beautifulsoup4==4.12.2
requests==2.31.0
python-dotenv==1.0.0
```

---

## 📝 Translation Completeness Check

### ✅ Well Translated Components:
- `i18n.js` - Comprehensive translations for 6 languages
- `VoiceAssistant.jsx` - Uses translation keys properly
- `Dashboard.jsx` - Good use of `t()` function

### ❌ Needs Translation:
- `DocumentScanner.jsx` - Many hardcoded Hindi strings
- `LoginPage.jsx` - Some placeholders not translated
- `SignupPage.jsx` - Form labels partially translated

---

## 🚀 Startup Instructions (Corrected)

### Prerequisites
```bash
# Install Node.js 18+
# Install Python 3.10+
# Install Tesseract OCR (for backend OCR)
```

### 1. Backend 1 (OCR/Risk Engine)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file
echo "ALLOWED_ORIGINS=http://localhost:5173" > .env

# Run server
python app.py
# Server runs on http://localhost:5000
```

### 2. Backend 2 (AI Chatbot)
```bash
cd "Agriculture ChatBot"
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file
echo "GROQ_API_KEY=your_key_here" > .env

# Run server
python app.py
# Server runs on http://localhost:5001
```

### 3. Frontend
```bash
cd frontend
npm install

# Create .env file
cat > .env << EOF
VITE_API_URL_OCR=http://localhost:5000
VITE_API_URL_CHATBOT=http://localhost:5001
EOF

# Run development server
npm run dev
# Server runs on http://localhost:5173
```

### Access Application
Open browser: `http://localhost:5173`

---

## 🔍 Connection Testing

### Test Backend 1 (OCR)
```bash
curl http://localhost:5000/health
# Expected: {"status": "OK"}
```

### Test Backend 2 (Chatbot)
```bash
curl -X POST http://localhost:5001/chat \
  -F "text=नमस्ते"
# Expected: JSON with text and voice URL
```

### Test News Endpoint
```bash
curl http://localhost:5001/news
# Expected: Array of news items from PIB
```

---

## 📊 Component Connection Map

### Dashboard.jsx
```
├── Connects to: http://localhost:5001/news
├── Renders: MandiPrices, VoiceAssistant
└── Uses: localStorage for user data
```

### VoiceAssistant.jsx
```
├── Connects to: http://localhost:5001/chat
├── Methods: POST (text), POST (audio)
├── Returns: { text, voice }
└── Audio playback: Uses returned voice URL
```

### DocumentScanner.jsx
```
├── Connects to: http://localhost:5000/scan
├── Method: POST (multipart/form-data)
├── Sends: file, lang
└── Returns: { success, ocr_text_preview, analysis }
```

---

## 🎨 UI/UX Issues

### 1. **Inconsistent Styling**
- Some components use `rounded-2xl`, others use `rounded-[2rem]`
- Mix of `px-6` and `px-8` padding

**Recommendation:** Create design tokens in `tailwind.config.js`

### 2. **Missing Responsive Breakpoints**
- Some components don't adapt well to mobile
- VoiceAssistant overlay could be improved for tablets

### 3. **Accessibility Issues**
- Missing ARIA labels on some interactive elements
- Color contrast needs verification for WCAG compliance

---

## 🔐 Security Recommendations

### 1. **API Key Exposure**
- Never commit `.env` files
- Use environment variables in production
- Rotate keys regularly

### 2. **Rate Limiting**
- Backend 1: 100/day, 20/min (configured)
- Backend 2: 500/day, 100/hour (configured)
- Consider user-based rate limiting

### 3. **Input Validation**
- Add file size limits (currently missing)
- Validate file types server-side
- Sanitize user inputs

---

## 📦 Missing Dependencies

### Frontend
```json
// Add to package.json
"@types/node": "^20.0.0"  // For better TypeScript support
```

### Backend
```txt
# Add to requirements.txt
python-dotenv==1.0.0
flask-talisman==1.1.0  // Already in app.py but not in requirements
```

---

## ✅ What's Working Well

1. **Clean Architecture** - Separation of concerns between OCR and Chatbot
2. **Multi-language Support** - Comprehensive i18n implementation
3. **Modern UI** - Beautiful Tailwind-based design
4. **Error Boundaries** - React error boundary in main.jsx
5. **Security Headers** - Flask-Talisman and security headers configured
6. **Rate Limiting** - Proper rate limiting on both backends

---

## 🎯 Priority Action Items

### HIGH PRIORITY
1. ✅ Fix hardcoded API URLs → Use environment variables
2. ✅ Add missing requirements.txt for chatbot
3. ✅ Configure GROQ_API_KEY properly
4. ✅ Improve error handling in API calls
5. ✅ Add proper CORS configuration

### MEDIUM PRIORITY
6. Complete translation coverage
7. Add loading states everywhere
8. Implement real authentication
9. Add comprehensive error messages
10. Create API documentation

### LOW PRIORITY
11. Refactor styling for consistency
12. Add unit tests
13. Optimize bundle size
14. Add analytics
15. Create deployment guides

---

## 📚 Additional Notes

### Backend Server Differences

**Backend 1 (Port 5000):**
- Purpose: Document OCR and legal risk analysis
- Tech: Flask + Tesseract + OpenCV
- Heavy processing: Image preprocessing, OCR, NLP analysis

**Backend 2 (Port 5001):**
- Purpose: AI chatbot and news aggregation
- Tech: Flask + Groq API + Google Speech Recognition
- Real-time: Voice transcription, LLM responses, TTS

### Why Two Backends?
- **Separation of Concerns**: OCR/Risk vs. Conversational AI
- **Scalability**: Can scale independently
- **Reliability**: One service failure doesn't affect the other
- **Development**: Teams can work independently

---

## 🔄 Recommended Project Structure Improvements

```
samjhauta-setu/
├── frontend/
│   ├── .env.example          # ← ADD THIS
│   └── src/
│       └── config/
│           └── api.config.js # ← ADD THIS (centralized config)
├── backend/
│   ├── .env.example          # ← ADD THIS
│   ├── requirements.txt      # ← UPDATE THIS
│   └── tests/                # ← ADD THIS
├── Agriculture ChatBot/
│   ├── .env.example          # ← ADD THIS
│   ├── requirements.txt      # ← CREATE THIS
│   └── tests/                # ← ADD THIS
├── docs/
│   ├── API.md                # ← ADD THIS
│   ├── DEPLOYMENT.md         # ← ADD THIS
│   └── CONTRIBUTING.md       # ← ADD THIS
└── docker-compose.yml        # ← ADD THIS (for easy setup)
```

---

## 🎉 Conclusion

The project has a solid foundation with good architecture and modern tech stack. The main issues are:
1. Configuration management (hardcoded URLs, missing env files)
2. Missing dependencies documentation
3. Incomplete error handling
4. Some translation gaps

All issues are fixable and the codebase is well-structured for improvements.

---

**Generated:** $(date)
**Analyzed By:** Kiro AI Assistant
**Project:** SamjhautaSetu - Digital Platform for Indian Farmers
