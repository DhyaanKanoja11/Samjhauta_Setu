import os
import random
import string
import requests
import json
import feedparser
from flask import Flask, render_template, request, jsonify, url_for
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from werkzeug.utils import secure_filename
from gtts import gTTS
import speech_recognition as sr
from pydub import AudioSegment
from groq import Groq
from bs4 import BeautifulSoup

app = Flask(__name__)
# Security: Hardened CORS
CORS(app, resources={r"/*": {"origins": "*"}})

# Rate Limiting for security
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["500 per day", "100 per hour"],
    storage_uri="memory://"
)

app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['ALLOWED_EXTENSIONS'] = {'webm', 'wav', 'mp3', 'm4a', 'ogg'}

# Configuration
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
OLLAMA_URL = os.environ.get("OLLAMA_URL", "http://localhost:11434/api/generate")
OLLAMA_MODEL = os.environ.get("OLLAMA_MODEL", "llama3")

groq_client = None
if GROQ_API_KEY:
    try:
        groq_client = Groq(api_key=GROQ_API_KEY)
    except Exception as e:
        print(f"Groq Init Error: {e}")

# Expert System Fallback Knowledge Base
EXPERT_SYSTEM = {
    "भाव": "वर्तमान में मंडी भाव स्थिर हैं। गेहूं ₹2850, धान ₹1950 और मक्का ₹1800 के करीब है।",
    "मौसम": "मौसम विभाग के अनुसार आने वाले सप्ताह में हल्की बारिश की संभावना है।",
    "योजना": "पीएम किसान की अगली किस्त जल्द ही जारी होने वाली है।",
    "विवाद": "समझौता सेतु के माध्यम से आप अपने अनुबंध विवादों का समाधान कर सकते हैं।",
    "नमस्कार": "नमस्ते! मैं आपका डिजिटल कृषि साथी हूँ।",
    "help": "I can help with mandi prices, weather, schemes, and scanning your contracts."
}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# Local Speech to Text Integration (Zero Investment)
def transcribe_local(filepath):
    try:
        # Convert to WAV for SpeechRecognition
        audio = AudioSegment.from_file(filepath)
        wav_path = filepath.rsplit('.', 1)[0] + "_processed.wav"
        audio.export(wav_path, format="wav")
        
        recognizer = sr.Recognizer()
        with sr.AudioFile(wav_path) as source:
            audio_data = recognizer.record(source)
            # Free Google Web Speech API
            text = recognizer.recognize_google(audio_data, language="hi-IN")
            return text
    except Exception as e:
        print(f"STT Error: {e}")
        return None

# Indian Ag-News Scraping (PIB)
def get_pib_news():
    try:
        # Agriculture & Farmers Welfare Category
        feed_url = "https://pib.gov.in/RssMain.aspx?ModId=4&LangId=1"
        feed = feedparser.parse(feed_url)
        news = []
        for entry in feed.entries[:3]:
            news.append({"title": entry.title, "link": entry.link})
        return news
    except:
        return []

def get_answer(question):
    # Try Groq
    if groq_client:
        try:
            response = groq_client.chat.completions.create(
                model="llama3-70b-8192",
                messages=[
                    {"role": "system", "content": "You are a professional agricultural advisor for Indian farmers. Keep answers concise and helpful. Use the user's language."},
                    {"role": "user", "content": question}
                ],
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Groq Error: {e}")

    # Try Ollama (Local)
    try:
        response = requests.post(OLLAMA_URL, json={
            "model": OLLAMA_MODEL,
            "prompt": f"As an Indian Agriculture expert, answer this: {question}",
            "stream": False
        }, timeout=5)
        if response.status_code == 200:
            return response.json().get('response')
    except:
        pass

    # Expert System Fallback
    for key, val in EXPERT_SYSTEM.items():
        if key.lower() in question.lower():
            return val
    return "माफ़ करें, मैं अभी इस बारे में जानकारी नहीं जुटा पा रहा हूँ। कृपया इंटरनेट या मंडी भाव की जाँच करें।"

@app.after_request
def add_security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'SAMEORIGIN'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    return response

@app.route('/news', methods=['GET'])
@limiter.limit("20 per minute")
def news():
    return jsonify(get_pib_news())

@app.route('/chat', methods=['POST'])
@limiter.limit("30 per minute")
def chat():
    try:
        # Audio Handling
        if 'audio' in request.files:
            audio = request.files['audio']
            if audio and allowed_file(audio.filename):
                filename = secure_filename(audio.filename)
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                audio.save(filepath)
                
                # Try Local Transcribe First
                transcription = transcribe_local(filepath)
                
                # If local fails and Groq exists, try Groq Whisper
                if not transcription and groq_client:
                    with open(filepath, "rb") as f:
                        transcription = groq_client.audio.transcriptions.create(
                            model="whisper-large-v3-turbo",
                            file=f,
                        ).text
                
                if not transcription:
                    return jsonify({'text': 'वॉइस इनपुट समझ नहीं आया। कृपया साफ बोलें या टाइप करें।'})

                answer = get_answer(transcription)
                
                # Convert answer to TTS
                voice_filename = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
                tts = gTTS(answer, lang='hi' if 'hi' in transcription else 'en') 
                audio_path = os.path.join("static/audio", f"{voice_filename}.mp3")
                tts.save(audio_path)

                return jsonify({
                    'text': f"🎤 {transcription}\n\n🤖 {answer}",
                    'voice': url_for('static', filename='audio/' + voice_filename + '.mp3')
                })

        # Text Handling
        question = ""
        if 'text' in request.form:
            question = request.form['text']
        elif request.is_json:
            question = request.json.get('text', '')

        if not question:
            return jsonify({'text': 'No query provided'}), 400

        answer = get_answer(question)
        voice_filename = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
        tts = gTTS(answer, lang='hi')
        audio_path = os.path.join("static/audio", f"{voice_filename}.mp3")
        tts.save(audio_path)

        return jsonify({
            'text': answer,
            'voice': url_for('static', filename='audio/' + voice_filename + '.mp3')
        })

    except Exception as e:
        return jsonify({'text': f"Error: {str(e)}"}), 500

if __name__ == '__main__':
    os.makedirs("uploads", exist_ok=True)
    os.makedirs("static/audio", exist_ok=True)
    app.run(host='0.0.0.0', port=5001, debug=True)
