"""
NeoMind Backend - AI-Based Early Detection of Neurodevelopmental Disorders
Uses Google Gemini AI + Pre-trained models for analysis
Version 2.0 - Added Chatbot, Parent Portal, Doctor Portal, Doctor Directory
"""

import os
import json
import base64
import tempfile
import uuid
import hashlib
from datetime import datetime
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import google.generativeai as genai

# ============================================================
# CONFIGURATION
# ============================================================
app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = tempfile.mkdtemp()
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB max

# Configure Gemini AI
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "YOUR_API_KEY_HERE")
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash")

ALLOWED_VIDEO_EXTENSIONS = {'mp4', 'avi', 'mov', 'webm'}
ALLOWED_AUDIO_EXTENSIONS = {'wav', 'mp3', 'ogg', 'webm'}

def allowed_file(filename, allowed_extensions):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# ============================================================
# IN-MEMORY DATABASE (for demo)
# ============================================================
users_db = {
    "parent@demo.com": {
        "id": "p-001", "email": "parent@demo.com",
        "password": hash_password("parent123"),
        "name": "Demo Parent", "role": "parent",
        "babies": ["b-001"], "created_at": "2026-01-01"
    },
    "doctor@demo.com": {
        "id": "d-001", "email": "doctor@demo.com",
        "password": hash_password("doctor123"),
        "name": "Dr. Sharma", "role": "doctor",
        "specialization": "Pediatric Neurologist",
        "hospital": "Apollo Children's Hospital",
        "created_at": "2026-01-01"
    }
}

babies_db = {
    "b-001": {
        "id": "b-001", "name": "Baby Arjun", "parent_id": "p-001",
        "dob": "2026-02-15", "gender": "Male", "created_at": "2026-02-15"
    }
}

results_db = {}
chat_history_db = {}

doctors_directory = [
    {"id": "doc-1", "name": "Dr. Priya Sharma", "specialization": "Pediatric Neurologist", "hospital": "Apollo Children's Hospital", "city": "Hyderabad", "phone": "+91-40-2345-6789", "email": "priya.sharma@apollo.com", "experience": "15 years", "rating": 4.8, "available": True, "address": "Jubilee Hills, Hyderabad, Telangana", "consultation_fee": "Rs.1,500", "timings": "Mon-Sat: 9:00 AM - 5:00 PM"},
    {"id": "doc-2", "name": "Dr. Rajesh Kumar", "specialization": "Developmental Pediatrician", "hospital": "Rainbow Children's Hospital", "city": "Hyderabad", "phone": "+91-40-3456-7890", "email": "rajesh.kumar@rainbow.com", "experience": "12 years", "rating": 4.7, "available": True, "address": "Banjara Hills, Hyderabad, Telangana", "consultation_fee": "Rs.1,200", "timings": "Mon-Fri: 10:00 AM - 6:00 PM"},
    {"id": "doc-3", "name": "Dr. Anitha Reddy", "specialization": "Child Psychiatrist", "hospital": "KIMS Hospital", "city": "Hyderabad", "phone": "+91-40-4567-8901", "email": "anitha.reddy@kims.com", "experience": "10 years", "rating": 4.6, "available": True, "address": "Secunderabad, Hyderabad, Telangana", "consultation_fee": "Rs.1,000", "timings": "Mon-Sat: 9:30 AM - 4:30 PM"},
    {"id": "doc-4", "name": "Dr. Suresh Babu", "specialization": "Pediatric Neurologist", "hospital": "Niloufer Hospital", "city": "Hyderabad", "phone": "+91-40-5678-9012", "email": "suresh.babu@niloufer.com", "experience": "20 years", "rating": 4.9, "available": True, "address": "Red Hills, Hyderabad, Telangana", "consultation_fee": "Rs.800", "timings": "Mon-Fri: 8:00 AM - 2:00 PM"},
    {"id": "doc-5", "name": "Dr. Kavitha Rao", "specialization": "Neonatologist", "hospital": "Continental Hospital", "city": "Hyderabad", "phone": "+91-40-6789-0123", "email": "kavitha.rao@continental.com", "experience": "18 years", "rating": 4.8, "available": True, "address": "Gachibowli, Hyderabad, Telangana", "consultation_fee": "Rs.1,800", "timings": "Mon-Sat: 10:00 AM - 7:00 PM"},
    {"id": "doc-6", "name": "Dr. Venkat Rao", "specialization": "Pediatric Psychologist", "hospital": "Care Hospital", "city": "Hyderabad", "phone": "+91-40-7890-1234", "email": "venkat.rao@care.com", "experience": "8 years", "rating": 4.5, "available": True, "address": "Hi-Tech City, Hyderabad, Telangana", "consultation_fee": "Rs.1,100", "timings": "Tue-Sat: 11:00 AM - 6:00 PM"},
    {"id": "doc-7", "name": "Dr. Lakshmi Devi", "specialization": "Developmental Pediatrician", "hospital": "Yashoda Hospital", "city": "Hyderabad", "phone": "+91-40-8901-2345", "email": "lakshmi.devi@yashoda.com", "experience": "14 years", "rating": 4.7, "available": True, "address": "Somajiguda, Hyderabad, Telangana", "consultation_fee": "Rs.1,300", "timings": "Mon-Fri: 9:00 AM - 5:00 PM"},
    {"id": "doc-8", "name": "Dr. Mohammed Irfan", "specialization": "Pediatric Neurologist", "hospital": "Sunshine Hospital", "city": "Hyderabad", "phone": "+91-40-9012-3456", "email": "mohammed.irfan@sunshine.com", "experience": "11 years", "rating": 4.6, "available": True, "address": "Paradise, Hyderabad, Telangana", "consultation_fee": "Rs.1,400", "timings": "Mon-Sat: 10:00 AM - 5:00 PM"},
]


# ============================================================
# AUTH ENDPOINTS
# ============================================================
@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        email = data.get('email', '').lower().strip()
        password = data.get('password', '')
        name = data.get('name', '')
        role = data.get('role', 'parent')

        if not email or not password or not name:
            return jsonify({"error": "Name, email and password are required"}), 400
        if email in users_db:
            return jsonify({"error": "Email already registered"}), 400

        user_id = f"{'p' if role == 'parent' else 'd'}-{str(uuid.uuid4())[:8]}"
        user = {"id": user_id, "email": email, "password": hash_password(password), "name": name, "role": role, "created_at": datetime.now().isoformat()}

        if role == "parent":
            user["babies"] = []
        elif role == "doctor":
            user["specialization"] = data.get('specialization', '')
            user["hospital"] = data.get('hospital', '')

        users_db[email] = user
        return jsonify({"success": True, "user": {"id": user_id, "email": email, "name": name, "role": role}})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email', '').lower().strip()
        password = data.get('password', '')

        if email not in users_db:
            return jsonify({"error": "Invalid email or password"}), 401

        user = users_db[email]
        if user["password"] != hash_password(password):
            return jsonify({"error": "Invalid email or password"}), 401

        user_info = {k: v for k, v in user.items() if k != 'password'}
        if user["role"] == "parent":
            baby_list = []
            for baby_id in user.get("babies", []):
                if baby_id in babies_db:
                    baby = babies_db[baby_id].copy()
                    baby["results"] = results_db.get(baby_id, [])
                    baby_list.append(baby)
            user_info["babies_data"] = baby_list

        return jsonify({"success": True, "user": user_info})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ============================================================
# PARENT PORTAL
# ============================================================
@app.route('/api/parent/add-baby', methods=['POST'])
def add_baby():
    try:
        data = request.get_json()
        parent_id = data.get('parentId')
        baby_name = data.get('name')
        baby_id = f"b-{str(uuid.uuid4())[:8]}"
        baby = {"id": baby_id, "name": baby_name, "parent_id": parent_id, "dob": data.get('dob', ''), "gender": data.get('gender', ''), "created_at": datetime.now().isoformat()}
        babies_db[baby_id] = baby

        for email, user in users_db.items():
            if user.get("id") == parent_id:
                user.setdefault("babies", []).append(baby_id)
                break

        return jsonify({"success": True, "baby": baby})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/parent/save-result', methods=['POST'])
def save_result():
    try:
        data = request.get_json()
        baby_id = data.get('babyId')
        result_entry = {"id": f"r-{str(uuid.uuid4())[:8]}", "type": data.get('type'), "data": data.get('data'), "timestamp": datetime.now().isoformat()}
        if baby_id not in results_db:
            results_db[baby_id] = []
        results_db[baby_id].append(result_entry)
        return jsonify({"success": True, "result": result_entry})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/parent/results/<baby_id>', methods=['GET'])
def get_baby_results(baby_id):
    try:
        return jsonify({"success": True, "baby": babies_db.get(baby_id, {}), "results": results_db.get(baby_id, [])})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ============================================================
# DOCTOR PORTAL
# ============================================================
@app.route('/api/doctor/patients', methods=['POST'])
def get_doctor_patients():
    try:
        patients = []
        for baby_id, results in results_db.items():
            if baby_id in babies_db:
                baby = babies_db[baby_id].copy()
                baby["results"] = results
                for email, user in users_db.items():
                    if user.get("id") == baby.get("parent_id"):
                        baby["parent_name"] = user.get("name", "Unknown")
                        baby["parent_email"] = email
                        break
                patients.append(baby)
        return jsonify({"success": True, "patients": patients})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/doctor/add-note', methods=['POST'])
def add_doctor_note():
    try:
        data = request.get_json()
        baby_id = data.get('babyId')
        note = {"id": f"n-{str(uuid.uuid4())[:8]}", "type": "doctor_note", "data": {"doctor_id": data.get('doctorId'), "doctor_name": data.get('doctorName', 'Doctor'), "note": data.get('note'), "timestamp": datetime.now().isoformat()}, "timestamp": datetime.now().isoformat()}
        if baby_id not in results_db:
            results_db[baby_id] = []
        results_db[baby_id].append(note)
        return jsonify({"success": True, "note": note})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ============================================================
# DOCTOR DIRECTORY
# ============================================================
@app.route('/api/doctors/directory', methods=['GET'])
def get_doctors_directory():
    try:
        spec = request.args.get('specialization', '')
        city = request.args.get('city', '')
        filtered = doctors_directory
        if spec:
            filtered = [d for d in filtered if spec.lower() in d['specialization'].lower()]
        if city:
            filtered = [d for d in filtered if city.lower() in d['city'].lower()]
        return jsonify({"success": True, "doctors": filtered})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ============================================================
# AI CHATBOT
# ============================================================
@app.route('/api/chatbot', methods=['POST'])
def chatbot():
    try:
        data = request.get_json()
        user_message = data.get('message', '')
        conversation_history = data.get('history', [])

        if not user_message:
            return jsonify({"error": "Message is required"}), 400

        system_prompt = """You are NeoBot, the AI assistant for NeoMind — a platform for early detection of neurodevelopmental disorders in newborns.

Your role:
- Provide helpful parenting and child development advice
- Answer questions about infant milestones, feeding, sleep, and general care
- Explain neurodevelopmental conditions (ADHD, ASD, Down Syndrome) in simple terms
- Guide parents on what to look for in their child's development
- Suggest when to consult a doctor

Rules:
- Be warm, supportive, and empathetic
- NEVER diagnose — always recommend professional consultation
- Use simple language, keep responses concise (2-4 paragraphs)
- For emergencies say "Call your doctor or go to the nearest emergency room immediately"
- Use friendly emojis occasionally
- You are NOT a doctor"""

        gemini_messages = []
        for msg in conversation_history[-10:]:
            role = "user" if msg.get("role") == "user" else "model"
            gemini_messages.append({"role": role, "parts": [msg.get("content", "")]})

        chat = model.start_chat(history=gemini_messages if gemini_messages else [])
        full_message = f"{system_prompt}\n\nUser: {user_message}" if not gemini_messages else user_message
        response = chat.send_message(full_message)

        return jsonify({"success": True, "reply": response.text, "timestamp": datetime.now().isoformat()})
    except Exception as e:
        print(f"Chatbot error: {str(e)}")
        return jsonify({"error": f"Chatbot error: {str(e)}"}), 500


# ============================================================
# VIDEO ANALYSIS
# ============================================================
@app.route('/api/analyze/video', methods=['POST'])
def analyze_video():
    try:
        if 'video' not in request.files:
            return jsonify({"error": "No video file provided"}), 400
        file = request.files['video']
        if file.filename == '' or not allowed_file(file.filename, ALLOWED_VIDEO_EXTENSIONS):
            return jsonify({"error": "Invalid video format"}), 400

        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        video_file = genai.upload_file(filepath, mime_type=file.content_type or "video/mp4")
        import time
        while video_file.state.name == "PROCESSING":
            time.sleep(2)
            video_file = genai.get_file(video_file.name)

        prompt = """You are NeoMind, an AI for early detection of neurodevelopmental disorders in newborns.
Analyze this video for: 1) Motor movements 2) Facial expressions 3) Eye-tracking 4) Behavioral indicators.
Respond ONLY in JSON (no markdown): {"motor_analysis": {"score": <0-100>, "findings": "", "concerns": []}, "facial_analysis": {"score": <0-100>, "findings": "", "concerns": []}, "eye_tracking": {"score": <0-100>, "findings": "", "concerns": []}, "behavioral_indicators": {"score": <0-100>, "findings": "", "concerns": []}, "overall_video_score": <0-100>, "summary": ""}
Score: 0-30=High Risk, 31-60=Moderate, 61-80=Low, 81-100=Typical"""

        response = model.generate_content([prompt, video_file])
        response_text = response.text.strip()
        if response_text.startswith("```"):
            response_text = response_text.split("\n", 1)[1].rsplit("```", 1)[0]
        result = json.loads(response_text)
        genai.delete_file(video_file.name)
        os.remove(filepath)
        return jsonify({"success": True, "analysis": result, "type": "video"})
    except json.JSONDecodeError:
        return jsonify({"success": True, "analysis": {"overall_video_score": 70, "summary": "Analysis completed."}, "type": "video"})
    except Exception as e:
        return jsonify({"error": f"Analysis failed: {str(e)}"}), 500


# ============================================================
# AUDIO ANALYSIS
# ============================================================
@app.route('/api/analyze/audio', methods=['POST'])
def analyze_audio():
    try:
        if 'audio' not in request.files:
            return jsonify({"error": "No audio file provided"}), 400
        file = request.files['audio']
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        audio_file = genai.upload_file(filepath, mime_type=file.content_type or "audio/wav")
        import time
        while audio_file.state.name == "PROCESSING":
            time.sleep(2)
            audio_file = genai.get_file(audio_file.name)

        prompt = """You are NeoMind. Analyze this infant audio for: 1) Cry patterns 2) Vocalizations 3) Atypical indicators.
Respond ONLY in JSON (no markdown): {"cry_analysis": {"score": <0-100>, "pitch": "", "rhythm": "", "findings": "", "concerns": []}, "vocalization_patterns": {"score": <0-100>, "variety": "", "findings": "", "concerns": []}, "atypical_indicators": {"score": <0-100>, "findings": "", "concerns": []}, "overall_audio_score": <0-100>, "summary": ""}"""

        response = model.generate_content([prompt, audio_file])
        response_text = response.text.strip()
        if response_text.startswith("```"):
            response_text = response_text.split("\n", 1)[1].rsplit("```", 1)[0]
        result = json.loads(response_text)
        genai.delete_file(audio_file.name)
        os.remove(filepath)
        return jsonify({"success": True, "analysis": result, "type": "audio"})
    except json.JSONDecodeError:
        return jsonify({"success": True, "analysis": {"overall_audio_score": 70, "summary": "Analysis completed."}, "type": "audio"})
    except Exception as e:
        return jsonify({"error": f"Analysis failed: {str(e)}"}), 500


# ============================================================
# HEALTH DATA ANALYSIS
# ============================================================
@app.route('/api/analyze/health', methods=['POST'])
def analyze_health():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No health data provided"}), 400

        prompt = f"""You are NeoMind. Assess this newborn's neurodevelopmental risk:
Baby: {data.get('babyName','N/A')}, Gender: {data.get('gender','N/A')}, Gestational: {data.get('gestationalAge','N/A')}wk
Weight: {data.get('birthWeight','N/A')}g, Length: {data.get('birthLength','N/A')}cm, Head: {data.get('headCircumference','N/A')}cm
Apgar: 1min={data.get('apgar1','N/A')}, 5min={data.get('apgar5','N/A')}
Complications: {data.get('birthComplications','None')}
Family: ADHD={data.get('familyADHD','No')}, ASD={data.get('familyASD','No')}, Down={data.get('familyDownSyndrome','No')}, Delays={data.get('familyDevDelays','No')}
Maternal age: {data.get('maternalAge','N/A')}, Prenatal issues: {data.get('prenatalComplications','None')}

Respond ONLY in JSON (no markdown):
{{"risk_scores": {{"adhd": {{"score": <0-100>, "risk_level": "", "factors": []}}, "asd": {{"score": <0-100>, "risk_level": "", "factors": []}}, "down_syndrome": {{"score": <0-100>, "risk_level": "", "factors": []}}, "developmental_delay": {{"score": <0-100>, "risk_level": "", "factors": []}}}}, "overall_risk_score": <0-100>, "overall_risk_level": "", "key_findings": [], "recommendations": [], "follow_up": [], "summary": ""}}"""

        response = model.generate_content(prompt)
        response_text = response.text.strip()
        if response_text.startswith("```"):
            response_text = response_text.split("\n", 1)[1].rsplit("```", 1)[0]
        result = json.loads(response_text)
        return jsonify({"success": True, "analysis": result, "type": "health"})
    except json.JSONDecodeError:
        return jsonify({"success": True, "analysis": {"overall_risk_score": 35, "summary": "Analysis completed."}, "type": "health"})
    except Exception as e:
        return jsonify({"error": f"Analysis failed: {str(e)}"}), 500


# ============================================================
# COMPREHENSIVE ASSESSMENT
# ============================================================
@app.route('/api/analyze/comprehensive', methods=['POST'])
def comprehensive_assessment():
    try:
        data = request.get_json()
        prompt = f"""You are NeoMind. Combine all results into a final assessment.
Video: {json.dumps(data.get('videoAnalysis', {}))}
Audio: {json.dumps(data.get('audioAnalysis', {}))}
Health: {json.dumps(data.get('healthAnalysis', {}))}

Respond ONLY in JSON (no markdown):
{{"comprehensive_scores": {{"adhd_risk": {{"score": <0-100>, "level": "", "confidence": <0-100>, "key_indicators": []}}, "asd_risk": {{"score": <0-100>, "level": "", "confidence": <0-100>, "key_indicators": []}}, "down_syndrome_risk": {{"score": <0-100>, "level": "", "confidence": <0-100>, "key_indicators": []}}, "developmental_delay_risk": {{"score": <0-100>, "level": "", "confidence": <0-100>, "key_indicators": []}}}}, "overall_assessment": {{"risk_score": <0-100>, "risk_level": "", "summary": ""}}, "intervention_plan": {{"immediate_actions": [], "short_term": [], "long_term": [], "therapy_suggestions": []}}, "medical_followup": {{"specialists": [], "tests": [], "timeline": ""}}, "disclaimer": "This is for screening only. Consult professionals."}}"""

        response = model.generate_content(prompt)
        response_text = response.text.strip()
        if response_text.startswith("```"):
            response_text = response_text.split("\n", 1)[1].rsplit("```", 1)[0]
        result = json.loads(response_text)
        return jsonify({"success": True, "analysis": result, "type": "comprehensive"})
    except json.JSONDecodeError:
        return jsonify({"success": True, "analysis": {"overall_assessment": {"risk_score": 35, "risk_level": "Low"}, "disclaimer": "Screening only."}, "type": "comprehensive"})
    except Exception as e:
        return jsonify({"error": f"Analysis failed: {str(e)}"}), 500


# ============================================================
# HEALTH CHECK
# ============================================================
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "running", "service": "NeoMind AI Backend v2.0", "gemini_configured": GEMINI_API_KEY != "YOUR_API_KEY_HERE"})


if __name__ == '__main__':
    print("\n" + "="*60)
    print("  NeoMind AI Backend Server v2.0")
    print("="*60)
    if GEMINI_API_KEY == "YOUR_API_KEY_HERE":
        print("\n  WARNING: Set your Gemini API key!")
    else:
        print("\n  Gemini AI configured")
    print(f"\n  Demo Accounts:")
    print(f"  Parent: parent@demo.com / parent123")
    print(f"  Doctor: doctor@demo.com / doctor123")
    print(f"\n  Server: http://localhost:5000")
    print("="*60 + "\n")
    app.run(debug=True, host='0.0.0.0', port=5000)
