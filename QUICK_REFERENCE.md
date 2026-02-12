# ⚡ SamjhautaSetu - Quick Reference Card

## 🚀 Quick Start Commands

### Start All Services (3 terminals needed)

**Terminal 1 - Backend 1 (OCR):**
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
python app.py
# Running on http://localhost:5000
```

**Terminal 2 - Backend 2 (Chatbot):**
```bash
cd "Agriculture ChatBot"
source venv/bin/activate  # Windows: venv\Scripts\activate
python app.py
# Running on http://localhost:5001
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
# Running on http://localhost:5173
```

---

## 📍 Service URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:5173 | Main application |
| Backend 1 | http://localhost:5000 | OCR & Risk Analysis |
| Backend 2 | http://localhost:5001 | AI Chatbot & News |

---

## 🔑 Environment Variables

### Backend 1 (.env)
```env
ALLOWED_ORIGINS=http://localhost:5173
```

### Backend 2 (.env)
```env
GROQ_API_KEY=your_key_here
ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL_OCR=http://localhost:5000
VITE_API_URL_CHATBOT=http://localhost:5001
```

---

## 🧪 Quick Tests

### Test Backend 1
```bash
curl http://localhost:5000/health
# Expected: {"status": "OK"}
```

### Test Backend 2
```bash
curl http://localhost:5001/news
# Expected: [{title: "...", link: "..."}]
```

### Test Frontend
Open browser: http://localhost:5173

---

## 📡 API Endpoints Cheat Sheet

### Backend 1 (Port 5000)
```
GET  /              → "Samjhauta Setu backend running"
GET  /health        → {"status": "OK"}
POST /scan          → Upload image for OCR + analysis
POST /analyze       → Analyze text for risks
```

### Backend 2 (Port 5001)
```
POST /chat          → Chat with AI (text or audio)
GET  /news          → Get agriculture news
```

---

## 🔧 Common Commands

### Install Dependencies
```bash
# Backend 1
cd backend && pip install -r requirements.txt

# Backend 2
cd "Agriculture ChatBot" && pip install -r requirements.txt

# Frontend
cd frontend && npm install
```

### Create Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

### Build for Production
```bash
cd frontend
npm run build
# Output: frontend/dist/
```

---

## 🐛 Troubleshooting Quick Fixes

### Backend won't start
```bash
# Activate venv first
source venv/bin/activate
pip install -r requirements.txt
```

### Port already in use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <pid> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### Frontend can't connect
```bash
# Check backends are running
curl http://localhost:5000/health
curl http://localhost:5001/news

# Restart frontend
npm run dev
```

### Chatbot not responding
```bash
# Check GROQ_API_KEY in .env
cat "Agriculture ChatBot/.env"

# Get free key from: https://console.groq.com/
```

---

## 📂 Project Structure

```
samjhauta-setu/
├── frontend/              # React app (Port 5173)
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API calls (api.js)
│   │   └── i18n.js        # Translations
│   └── .env               # Frontend config
│
├── backend/               # OCR/Risk Engine (Port 5000)
│   ├── ocr/               # OCR logic
│   ├── risk/              # Risk analysis
│   ├── app.py             # Main server
│   └── .env               # Backend 1 config
│
└── Agriculture ChatBot/   # AI Chatbot (Port 5001)
    ├── app.py             # Main server
    ├── templates/         # HTML templates
    └── .env               # Backend 2 config
```

---

## 🎯 Feature-to-Component Map

| Feature | Component | Backend |
|---------|-----------|---------|
| Login/Signup | LoginPage.jsx, SignupPage.jsx | None (localStorage) |
| Dashboard | Dashboard.jsx | Backend 2 (/news) |
| Voice Chat | VoiceAssistant.jsx | Backend 2 (/chat) |
| Document Scan | DocumentScanner.jsx | Backend 1 (/scan) |
| Mandi Prices | MandiPrices.jsx | Mock data |
| News Feed | Dashboard.jsx | Backend 2 (/news) |

---

## 🌐 Language Support

Available languages in i18n:
- `hi` - हिन्दी (Hindi) - Default
- `en` - English
- `pa` - ਪੰਜਾਬੀ (Punjabi)
- `gu` - ગુજરાતી (Gujarati)
- `bh` - भोजपुरी (Bhojpuri)
- `kn` - ಕನ್ನಡ (Kannada)

Change language:
```javascript
import { useTranslation } from 'react-i18next';
const { i18n } = useTranslation();
i18n.changeLanguage('pa'); // Change to Punjabi
```

---

## 🔒 Security Notes

### Development
- CORS: `*` (all origins allowed)
- Debug: `True`
- HTTPS: Not required

### Production
- CORS: Specific origins only
- Debug: `False`
- HTTPS: Required
- Rate limiting: Enabled
- API keys: Environment variables

---

## 📦 Dependencies Summary

### Frontend
- React 18.2
- Vite 4.5
- Axios 1.13
- i18next 25.8
- Tailwind CSS 3.4
- Lucide React 0.563

### Backend 1
- Flask 3.0
- Tesseract OCR
- OpenCV
- Pillow
- Deep Translator

### Backend 2
- Flask 3.0
- Groq API
- gTTS
- SpeechRecognition
- Feedparser

---

## 🎨 UI Theme Colors

```css
/* Tailwind config */
brand-green: #2C5F2D    /* Primary green */
brand-brown: #8B4513    /* Accent brown */
brand-cream: #F5F1E7    /* Background cream */
brand-tan: #D2B48C      /* Secondary tan */
brand-blue: #4A90E2     /* Info blue */
```

---

## 🔗 Important Files

| File | Purpose |
|------|---------|
| `frontend/src/services/api.js` | API connection logic |
| `frontend/src/i18n.js` | Translation configuration |
| `backend/app.py` | OCR backend server |
| `Agriculture ChatBot/app.py` | Chatbot backend server |
| `backend/config.py` | Backend 1 configuration |
| `.env` files | Environment variables |

---

## 📞 API Request Examples

### Scan Document
```bash
curl -X POST http://localhost:5000/scan \
  -F "file=@contract.jpg" \
  -F "lang=hi"
```

### Analyze Text
```bash
curl -X POST http://localhost:5000/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "Contract text here", "lang": "hi"}'
```

### Chat with Bot
```bash
curl -X POST http://localhost:5001/chat \
  -F "text=गेहूं का भाव क्या है?"
```

### Get News
```bash
curl http://localhost:5001/news
```

---

## 🎓 Learning Path

1. **Start Here:** SETUP_GUIDE.md
2. **Understand Architecture:** PROJECT_ANALYSIS.md
3. **See Connections:** CONNECTION_MAP.md
4. **Quick Reference:** This file

---

## ⚡ Performance Tips

### Frontend
- Use React.memo for expensive components
- Lazy load routes with React.lazy()
- Optimize images before upload
- Enable production build for deployment

### Backend
- Use Gunicorn with multiple workers
- Enable caching for repeated requests
- Optimize image preprocessing
- Use connection pooling

---

## 🔄 Update Commands

### Update Frontend Dependencies
```bash
cd frontend
npm update
```

### Update Backend Dependencies
```bash
cd backend
pip install --upgrade -r requirements.txt
```

---

## 📊 Monitoring

### Check Service Status
```bash
# Backend 1
curl -s http://localhost:5000/health | jq

# Backend 2
curl -s http://localhost:5001/news | jq

# Frontend (check if accessible)
curl -I http://localhost:5173
```

### View Logs
```bash
# Backend logs are in terminal
# Frontend logs in browser console (F12)
# Backend 1 logs: backend/logs/app.log
```

---

## 🎯 Development Workflow

1. Start all 3 services
2. Make changes to code
3. Frontend: Auto-reloads (Vite HMR)
4. Backend: Restart server (or use --reload)
5. Test in browser
6. Check console for errors
7. Commit changes

---

## 🚀 Deployment Checklist

- [ ] Set production environment variables
- [ ] Build frontend: `npm run build`
- [ ] Test production build locally
- [ ] Configure CORS for production domain
- [ ] Set up HTTPS/SSL certificates
- [ ] Configure reverse proxy (Nginx)
- [ ] Set up process manager (PM2/Supervisor)
- [ ] Enable monitoring and logging
- [ ] Set up automated backups
- [ ] Configure firewall rules

---

## 📱 Mobile Testing

The app is responsive. Test on:
- Chrome DevTools (F12 → Toggle device toolbar)
- Real devices via network:
  ```bash
  # Frontend
  npm run dev -- --host
  # Access via: http://<your-ip>:5173
  ```

---

## 🆘 Emergency Commands

### Kill All Python Processes
```bash
# Windows
taskkill /F /IM python.exe

# Mac/Linux
pkill -9 python
```

### Reset Everything
```bash
# Stop all services (Ctrl+C in each terminal)
# Delete virtual environments
rm -rf backend/venv
rm -rf "Agriculture ChatBot/venv"

# Delete node_modules
rm -rf frontend/node_modules

# Reinstall everything
# Follow SETUP_GUIDE.md from step 2
```

---

## 📚 Documentation Files

1. **SETUP_GUIDE.md** - Complete setup instructions
2. **PROJECT_ANALYSIS.md** - Technical analysis & issues
3. **CONNECTION_MAP.md** - Architecture & data flow
4. **QUICK_REFERENCE.md** - This file (quick commands)

---

## 🎉 Success Indicators

✅ All 3 services running without errors
✅ Can login to frontend
✅ News feed loads on dashboard
✅ Voice assistant responds
✅ Document scanner accepts uploads
✅ No CORS errors in console
✅ All API endpoints return 200 OK

---

**Pro Tip:** Bookmark this file for quick access during development!

**Last Updated:** 2024
**Version:** 1.0.0
