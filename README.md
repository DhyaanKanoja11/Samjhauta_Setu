
# Samjhauta_Setu
A secure and structured platform to resolve disputes for the farmers of India.
=======
# 🌾 SamjhautaSetu

> A premium, localized, and secure digital platform for Indian farmers.

[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0-green.svg)](https://flask.palletsprojects.com/)
[![Python](https://img.shields.io/badge/Python-3.10+-yellow.svg)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-red.svg)](LICENSE)

---

## ✨ Features

- 🌍 **Universal Translation**: Support for 6 regional languages (Hindi, English, Punjabi, Gujarati, Bhojpuri, Kannada)
- 🤖 **AI Agricultural Assistant**: Voice-enabled chatbot with real-time news from PIB
- 📄 **OCR Document Scanner**: Legal risk analysis for land records and contracts
- 🎨 **Premium Dark Mode**: High-contrast, accessibility-focused UI
- 🔒 **Enterprise Security**: Rate limiting and security header protection
- 📱 **Responsive Design**: Works seamlessly on mobile, tablet, and desktop

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│                   Port: 5173                             │
└───────────────┬─────────────────┬───────────────────────┘
                │                 │
      ┌─────────▼────────┐  ┌────▼──────────────┐
      │  BACKEND 1       │  │  BACKEND 2        │
      │  OCR/Risk        │  │  AI Chatbot       │
      │  Port: 5000      │  │  Port: 5001       │
      └──────────────────┘  └───────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.10+
- **Tesseract OCR** (for document scanning)
- **Groq API Key** (free from [console.groq.com](https://console.groq.com/))

### Installation

**1. Clone the repository**
```bash
git clone <repository-url>
cd samjhauta-setu
```

**2. Set up Backend 1 (OCR/Risk Engine)**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python app.py  # Runs on http://localhost:5000
```

**3. Set up Backend 2 (AI Chatbot)** *(in new terminal)*
```bash
cd "Agriculture ChatBot"
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your GROQ_API_KEY
python app.py  # Runs on http://localhost:5001
```

**4. Set up Frontend** *(in new terminal)*
```bash
cd frontend
npm install
cp .env.example .env
npm run dev  # Runs on http://localhost:5173
```

**5. Access the Application**
```
Open http://localhost:5173 in your browser
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[SETUP_GUIDE.md](SETUP_GUIDE.md)** | 📖 Complete step-by-step setup instructions |
| **[PROJECT_ANALYSIS.md](PROJECT_ANALYSIS.md)** | 🔍 Technical analysis and architecture details |
| **[CONNECTION_MAP.md](CONNECTION_MAP.md)** | 🗺️ API endpoints and data flow diagrams |
| **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** | ⚡ Quick commands and troubleshooting |
| **[FIXES_APPLIED.md](FIXES_APPLIED.md)** | ✅ Summary of improvements and fixes |

---

## 🧪 Testing the Setup

### Test Backend 1 (OCR)
```bash
curl http://localhost:5000/health
# Expected: {"status": "OK"}
```

### Test Backend 2 (Chatbot)
```bash
curl http://localhost:5001/news
# Expected: Array of agriculture news
```

### Test Frontend
Open browser: `http://localhost:5173`
- Click "Guest Mode" to login
- Check if news feed loads
- Try the voice assistant (floating mic button)
- Upload a document to test OCR

---

## 🛠️ Tech Stack

### Frontend
- **React** 18.2 - UI framework
- **Vite** 4.5 - Build tool
- **Tailwind CSS** 3.4 - Styling
- **i18next** - Internationalization
- **Axios** - HTTP client
- **Lucide React** - Icons

### Backend 1 (OCR/Risk)
- **Flask** 3.0 - Web framework
- **Tesseract** - OCR engine
- **OpenCV** - Image processing
- **Deep Translator** - Translation
- **Flask-Limiter** - Rate limiting

### Backend 2 (Chatbot)
- **Flask** 3.0 - Web framework
- **Groq API** - LLM (llama3-70b)
- **gTTS** - Text-to-speech
- **SpeechRecognition** - Voice input
- **Feedparser** - RSS news feed

---

## 🔧 Configuration

### Environment Variables

**Frontend (`.env`)**
```env
VITE_API_URL_OCR=http://localhost:5000
VITE_API_URL_CHATBOT=http://localhost:5001
```

**Backend 1 (`.env`)**
```env
ALLOWED_ORIGINS=http://localhost:5173
```

**Backend 2 (`.env`)**
```env
GROQ_API_KEY=your_groq_api_key_here
ALLOWED_ORIGINS=http://localhost:5173
```

---

## 📡 API Endpoints

### Backend 1 (Port 5000)
- `GET /health` - Health check
- `POST /scan` - Upload image for OCR + risk analysis
- `POST /analyze` - Analyze text for legal risks

### Backend 2 (Port 5001)
- `POST /chat` - Chat with AI (text or audio)
- `GET /news` - Get agriculture news from PIB

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Ensure virtual environment is activated
source venv/bin/activate
pip install -r requirements.txt
```

### Frontend can't connect
```bash
# Check if backends are running
curl http://localhost:5000/health
curl http://localhost:5001/news
```

### Chatbot not responding
- Verify `GROQ_API_KEY` is set in `Agriculture ChatBot/.env`
- Get free API key from [console.groq.com](https://console.groq.com/)

For more troubleshooting, see **[SETUP_GUIDE.md](SETUP_GUIDE.md)**

---

## 🎯 Project Structure

```
samjhauta-setu/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API integration
│   │   └── i18n.js           # Translations
│   └── .env.example
│
├── backend/                  # OCR/Risk Engine
│   ├── ocr/                  # OCR logic
│   ├── risk/                 # Risk analysis
│   ├── app.py                # Main server
│   └── .env.example
│
├── Agriculture ChatBot/      # AI Chatbot
│   ├── app.py                # Main server
│   ├── templates/            # HTML templates
│   └── .env.example
│
└── docs/                     # Documentation
    ├── SETUP_GUIDE.md
    ├── PROJECT_ANALYSIS.md
    ├── CONNECTION_MAP.md
    ├── QUICK_REFERENCE.md
    └── FIXES_APPLIED.md
```

---

## 🌐 Supported Languages

- 🇮🇳 हिन्दी (Hindi) - Default
- 🇬🇧 English
- 🇮🇳 ਪੰਜਾਬੀ (Punjabi)
- 🇮🇳 ગુજરાતી (Gujarati)
- 🇮🇳 भोजपुरी (Bhojpuri)
- 🇮🇳 ಕನ್ನಡ (Kannada)

---

## 🔒 Security Features

- ✅ Rate limiting on all endpoints
- ✅ CORS configuration
- ✅ Security headers (X-Frame-Options, CSP, etc.)
- ✅ Input validation and sanitization
- ✅ File upload restrictions
- ✅ Environment-based configuration

---

## 📈 Roadmap

- [ ] Real authentication system (JWT)
- [ ] Database integration
- [ ] Advanced risk scoring algorithms
- [ ] Mobile app (React Native)
- [ ] Offline mode support
- [ ] More regional languages
- [ ] Integration with government APIs

---

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

Built with ❤️ for Indian farmers

---

## 🙏 Acknowledgments

- **PIB (Press Information Bureau)** for agriculture news feed
- **Groq** for providing fast LLM inference
- **Tesseract OCR** for text extraction
- **Open source community** for amazing tools

---

## 📞 Support

For issues and questions:
- 📖 Check [SETUP_GUIDE.md](SETUP_GUIDE.md)
- 🔍 Review [PROJECT_ANALYSIS.md](PROJECT_ANALYSIS.md)
- ⚡ See [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

---

**SamjhautaSetu** - *Connecting Farmers to Legal Clarity* 🌾

[![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red.svg)](https://github.com)
[![For Farmers](https://img.shields.io/badge/For-Indian%20Farmers-green.svg)](https://github.com)
>>>>>>> f067029 (Initial project upload)
