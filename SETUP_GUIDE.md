# 🚀 SamjhautaSetu - Complete Setup Guide

## 📋 Prerequisites

Before starting, ensure you have the following installed:

### Required Software
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.10 or higher) - [Download](https://www.python.org/)
- **Git** - [Download](https://git-scm.com/)

### Optional (for enhanced features)
- **Tesseract OCR** - Required for document scanning
  - Windows: Download from [GitHub](https://github.com/UB-Mannheim/tesseract/wiki)
  - Mac: `brew install tesseract`
  - Linux: `sudo apt-get install tesseract-ocr`
- **Ollama** - For local AI (alternative to Groq)
  - [Download Ollama](https://ollama.ai/)

---

## 🔧 Step-by-Step Setup

### 1️⃣ Clone the Repository

```bash
git clone <repository-url>
cd samjhauta-setu
```

---

### 2️⃣ Backend 1 Setup (OCR/Risk Engine)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Edit .env file (optional - defaults work for local development)
# ALLOWED_ORIGINS=http://localhost:5173
```

**Start Backend 1:**
```bash
python app.py
```

✅ Backend 1 should now be running on `http://localhost:5000`

**Test it:**
```bash
curl http://localhost:5000/health
# Expected response: {"status": "OK"}
```

---

### 3️⃣ Backend 2 Setup (AI Chatbot)

Open a **new terminal window**:

```bash
# Navigate to chatbot directory
cd "Agriculture ChatBot"

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# IMPORTANT: Edit .env and add your Groq API key
# Get free API key from: https://console.groq.com/
```

**Edit `.env` file:**
```env
GROQ_API_KEY=your_actual_groq_api_key_here
ALLOWED_ORIGINS=http://localhost:5173
```

**Start Backend 2:**
```bash
python app.py
```

✅ Backend 2 should now be running on `http://localhost:5001`

**Test it:**
```bash
curl http://localhost:5001/news
# Expected: Array of agriculture news items
```

---

### 4️⃣ Frontend Setup

Open a **new terminal window**:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# The default values should work:
# VITE_API_URL_OCR=http://localhost:5000
# VITE_API_URL_CHATBOT=http://localhost:5001
```

**Start Frontend:**
```bash
npm run dev
```

✅ Frontend should now be running on `http://localhost:5173`

---

## 🌐 Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

You should see the SamjhautaSetu login page!

---

## 🧪 Testing the Connections

### Test 1: Login
1. Go to `http://localhost:5173`
2. Click "अतिथि रूप में जारी रखें (Guest Mode)"
3. You should be redirected to the dashboard

### Test 2: News Feed (Chatbot Connection)
1. On the dashboard, check if agriculture news appears
2. If news loads, Backend 2 connection is working ✅

### Test 3: Voice Assistant (Chatbot Connection)
1. Click the floating microphone button (bottom right)
2. Type a message like "नमस्ते" or "Hello"
3. Click send
4. You should get a response with audio ✅

### Test 4: Document Scanner (OCR Connection)
1. Navigate to "Document Vault" or "दस्तावेज़ तिजोरी"
2. Upload an image with text
3. Click "जोखिम जांचें (Check Risk)"
4. You should see OCR results and risk analysis ✅

---

## 🐛 Troubleshooting

### Issue: Backend won't start

**Error:** `ModuleNotFoundError: No module named 'flask'`

**Solution:**
```bash
# Make sure virtual environment is activated
# You should see (venv) in your terminal prompt

# Reinstall dependencies
pip install -r requirements.txt
```

---

### Issue: Frontend can't connect to backend

**Error:** `Network Error` or `ERR_CONNECTION_REFUSED`

**Solution:**
1. Check if both backends are running:
   - Backend 1: `http://localhost:5000/health`
   - Backend 2: `http://localhost:5001/news`

2. Check `.env` file in frontend:
   ```env
   VITE_API_URL_OCR=http://localhost:5000
   VITE_API_URL_CHATBOT=http://localhost:5001
   ```

3. Restart frontend after changing `.env`:
   ```bash
   # Stop with Ctrl+C, then:
   npm run dev
   ```

---

### Issue: Chatbot not responding

**Error:** Chatbot returns "माफ़ करें, मैं अभी इस बारे में जानकारी नहीं जुटा पा रहा हूँ"

**Solution:**
1. Check if GROQ_API_KEY is set in `Agriculture ChatBot/.env`
2. Get a free API key from [Groq Console](https://console.groq.com/)
3. Restart Backend 2 after adding the key

**Alternative:** Use Ollama (local AI)
```bash
# Install Ollama
# Download from https://ollama.ai/

# Pull a model
ollama pull llama3

# Update .env
OLLAMA_URL=http://localhost:11434/api/generate
OLLAMA_MODEL=llama3
```

---

### Issue: OCR not working

**Error:** `TesseractNotFoundError`

**Solution:**
1. Install Tesseract OCR:
   - **Windows:** Download installer from [GitHub](https://github.com/UB-Mannheim/tesseract/wiki)
   - **Mac:** `brew install tesseract`
   - **Linux:** `sudo apt-get install tesseract-ocr`

2. Add Tesseract to PATH (Windows):
   - Add `C:\Program Files\Tesseract-OCR` to system PATH
   - Restart terminal

---

### Issue: Port already in use

**Error:** `Address already in use: 5000` or `5001`

**Solution:**
```bash
# Find process using the port (Windows)
netstat -ano | findstr :5000

# Kill the process
taskkill /PID <process_id> /F

# On Mac/Linux
lsof -ti:5000 | xargs kill -9
```

Or change the port in the backend:
```python
# In app.py, change:
app.run(host='0.0.0.0', port=5002, debug=True)
```

Then update frontend `.env`:
```env
VITE_API_URL_OCR=http://localhost:5002
```

---

## 📦 Production Deployment

### Environment Variables for Production

**Backend 1 (.env):**
```env
ALLOWED_ORIGINS=https://yourdomain.com
FLASK_ENV=production
FLASK_DEBUG=False
```

**Backend 2 (.env):**
```env
GROQ_API_KEY=your_production_key
ALLOWED_ORIGINS=https://yourdomain.com
FLASK_ENV=production
FLASK_DEBUG=False
```

**Frontend (.env):**
```env
VITE_API_URL_OCR=https://api.yourdomain.com/ocr
VITE_API_URL_CHATBOT=https://api.yourdomain.com/chat
```

### Build Frontend for Production

```bash
cd frontend
npm run build

# Output will be in frontend/dist/
# Deploy this folder to your hosting service
```

### Run Backends with Gunicorn

```bash
# Backend 1
cd backend
gunicorn -w 4 -b 0.0.0.0:5000 app:app

# Backend 2
cd "Agriculture ChatBot"
gunicorn -w 4 -b 0.0.0.0:5001 app:app
```

---

## 🔐 Security Checklist

Before deploying to production:

- [ ] Change all default passwords/keys
- [ ] Set `FLASK_DEBUG=False` in production
- [ ] Configure proper CORS origins (not `*`)
- [ ] Enable HTTPS
- [ ] Set up rate limiting
- [ ] Add authentication for sensitive endpoints
- [ ] Regular security updates
- [ ] Monitor logs for suspicious activity

---

## 📚 Additional Resources

- **Groq API Documentation:** https://console.groq.com/docs
- **Flask Documentation:** https://flask.palletsprojects.com/
- **React Documentation:** https://react.dev/
- **Vite Documentation:** https://vitejs.dev/

---

## 🆘 Getting Help

If you encounter issues not covered here:

1. Check the `PROJECT_ANALYSIS.md` file for detailed technical information
2. Review backend logs in the terminal
3. Check browser console for frontend errors (F12)
4. Ensure all prerequisites are installed correctly

---

## ✅ Quick Start Checklist

- [ ] Python 3.10+ installed
- [ ] Node.js 18+ installed
- [ ] Tesseract OCR installed (optional but recommended)
- [ ] Backend 1 running on port 5000
- [ ] Backend 2 running on port 5001
- [ ] Frontend running on port 5173
- [ ] Groq API key configured (for chatbot)
- [ ] All `.env` files created from `.env.example`
- [ ] Can access `http://localhost:5173` in browser
- [ ] Can login as guest
- [ ] News feed loads on dashboard
- [ ] Voice assistant responds to messages
- [ ] Document scanner accepts uploads

---

**Happy Coding! 🌾**

*SamjhautaSetu - Empowering Indian Farmers with Technology*
