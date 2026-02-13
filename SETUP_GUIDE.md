````markdown
# 🛠 SETUP_GUIDE.md  
## SamjhautaSetu – Local Development Setup Guide  

> 🌾 Developed & Managed by **Team Binary Brains**  
> This guide helps you run the entire system locally for development and testing.

---

# 📋 Prerequisites

Before starting, make sure the following are installed on your system:

### ✅ Required Software

- **Node.js 18+**
  ```bash
  node -v
````

* **Python 3.10+**

  ```bash
  python --version
  ```
* **Git**

  ```bash
  git --version
  ```

---

### ⚙ Optional (Recommended for Full Features)

#### 🧾 Tesseract OCR (Required for document scanning)

* **Windows:**
  Download from:
  [https://github.com/UB-Mannheim/tesseract/wiki](https://github.com/UB-Mannheim/tesseract/wiki)

* **Mac:**

  ```bash
  brew install tesseract
  ```

* **Linux:**

  ```bash
  sudo apt-get install tesseract-ocr
  ```

---

# 📂 1️⃣ Clone the Repository

```bash
git clone https://github.com/DhyaanKanoja11/Samjhauta_Setu.git
cd Samjhauta_Setu
```

---

# 🔧 2️⃣ Backend 1 Setup (OCR + Risk Engine)

Navigate to backend folder:

```bash
cd backend
```

---

### Create Virtual Environment

```bash
python -m venv venv
```

Activate it:

**Windows:**

```bash
venv\Scripts\activate
```

**Mac/Linux:**

```bash
source venv/bin/activate
```

---

### Install Dependencies

```bash
pip install -r requirements.txt
```

---

### Create Environment File

```bash
cp .env.example .env
```

If `cp` doesn't work on Windows:

```bash
copy .env.example .env
```

You can leave defaults for local development.

---

### Start Backend 1

```bash
python app.py
```

You should see:

```
Running on http://127.0.0.1:5000
```

---

### Test Backend 1

```bash
curl http://localhost:5000/health
```

Expected response:

```json
{"status":"OK"}
```

---

# 🤖 3️⃣ Backend 2 Setup (AI Chatbot)

Open a **new terminal window**.

Navigate to chatbot folder:

```bash
cd "Agriculture ChatBot"
```

---

### Create Virtual Environment

```bash
python -m venv venv
```

Activate it:

**Windows:**

```bash
venv\Scripts\activate
```

**Mac/Linux:**

```bash
source venv/bin/activate
```

---

### Install Dependencies

```bash
pip install -r requirements.txt
```

---

### Create Environment File

```bash
cp .env.example .env
```

---

### Add Groq API Key

Open `.env` and add:

```
GROQ_API_KEY=your_actual_groq_api_key_here
ALLOWED_ORIGINS=http://localhost:5173
```

You can get a free API key from:

[https://console.groq.com/](https://console.groq.com/)

---

### Start Backend 2

```bash
python app.py
```

Runs on:

```
http://localhost:5001
```

---

### Test Backend 2

```bash
curl http://localhost:5001/news
```

You should receive agriculture news JSON.

---

# 🖥 4️⃣ Frontend Setup

Open a **new terminal window**.

Navigate to frontend folder:

```bash
cd frontend
```

---

### Install Dependencies

```bash
npm install
```

---

### Create Environment File

```bash
cp .env.example .env
```

Ensure it contains:

```
VITE_API_URL_OCR=http://localhost:5000
VITE_API_URL_CHATBOT=http://localhost:5001
```

---

### Start Frontend

```bash
npm run dev
```

Runs on:

```
http://localhost:5173
```

---

# 🌐 5️⃣ Access the Application

Open your browser:

```
http://localhost:5173
```

---

# 🧪 Local Testing Checklist

### ✅ Login

* Click "Guest Mode"
* Dashboard loads

### ✅ News Feed

* Agriculture news visible
* Confirms Backend 2 working

### ✅ Voice Assistant

* Click microphone button
* Send text
* Receive response

### ✅ Document Scanner

* Upload image
* OCR extracts text
* Risk analysis appears

---

# 🐛 Troubleshooting

---

## ❌ Backend Not Starting

**Error: ModuleNotFoundError**

Make sure virtual environment is activated:

```bash
source venv/bin/activate
pip install -r requirements.txt
```

---

## ❌ Frontend Cannot Connect

Check if both backends are running:

```bash
curl http://localhost:5000/health
curl http://localhost:5001/news
```

If not, restart them.

---

## ❌ Chatbot Not Responding

Check:

* GROQ_API_KEY exists in `.env`
* Backend 2 restarted after adding key

---

## ❌ OCR Not Working

Make sure Tesseract is installed.

Test:

```bash
tesseract --version
```

If not found → install Tesseract.

---

## ❌ Port Already In Use

Kill process:

**Windows:**

```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Mac/Linux:**

```bash
lsof -ti:5000 | xargs kill -9
```

---

# 📌 Development Notes

* Both backends must run simultaneously
* Frontend connects to both
* Use separate terminals for each service
* Do not commit `.env` files

---

# 🚀 Local Setup Summary

You should now have:

| Service   | Port |
| --------- | ---- |
| Backend 1 | 5000 |
| Backend 2 | 5001 |
| Frontend  | 5173 |

---

# 🌾 You're Ready to Develop!

SamjhautaSetu is now fully running locally.

For production deployment, refer to `README.md`.

---

### Built & Managed by Team Binary Brains

```
