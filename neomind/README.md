# 🧠 NeoMind — AI-Based Early Detection of Neurodevelopmental Disorders in Newborns

NeoMind is an AI-powered platform that detects early signs of neurodevelopmental disorders in newborns (ADHD, ASD, Down Syndrome, and developmental delays) by analyzing behavioral, physiological, and genetic markers.

---

## 📁 Project Structure

```
neomind/
├── backend/
│   ├── app.py                 # Python Flask backend with Gemini AI
│   └── requirements.txt       # Python dependencies
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js             # Main React app with all pages
│   │   ├── App.css            # Complete styling
│   │   └── index.js           # React entry point
│   └── package.json           # Node.js dependencies
└── README.md                  # This file
```

---

## 🚀 SETUP INSTRUCTIONS (Step by Step)

### Prerequisites
Make sure you have these installed:
- **Python 3.8+** → Download from https://python.org
- **Node.js 18+** → Download from https://nodejs.org
- **Gemini API Key** → Free from https://aistudio.google.com/apikey

---

### STEP 1: Setup the Backend (Python)

Open your terminal/command prompt and run:

```bash
# Navigate to backend folder
cd neomind/backend

# Install Python packages
pip install -r requirements.txt

# Set your Gemini API key (IMPORTANT!)
# On Windows CMD:
set GEMINI_API_KEY=your_api_key_here

# On Windows PowerShell:
$env:GEMINI_API_KEY="your_api_key_here"

# On Mac/Linux:
export GEMINI_API_KEY=your_api_key_here

# Start the backend server
python app.py
```

✅ You should see: "Server running at http://localhost:5000"

**Keep this terminal open!**

---

### STEP 2: Setup the Frontend (React)

Open a NEW terminal/command prompt and run:

```bash
# Navigate to frontend folder
cd neomind/frontend

# Install packages (this takes a few minutes the first time)
npm install

# Start the React app
npm start
```

✅ Your browser will automatically open http://localhost:3000

---

### STEP 3: Use the App!

1. **Dashboard** → Overview of all features
2. **Video Analysis** → Upload a baby video (MP4) for AI movement/facial analysis
3. **Audio Analysis** → Upload cry/vocalization audio (WAV/MP3) for pattern analysis
4. **Health Data** → Fill in birth data, Apgar scores, and family history
5. **Results** → Get comprehensive AI assessment combining all data

---

## 🔧 Technology Stack

| Component          | Technology                          |
|--------------------|-------------------------------------|
| AI/ML              | Google Gemini 1.5 Flash (Multimodal)|
| Computer Vision    | Gemini Vision (video analysis)      |
| Audio Processing   | Gemini Audio (cry analysis)         |
| Predictive Model   | Gemini (health data risk modeling)  |
| Frontend           | React.js + React Router             |
| Backend            | Python Flask                        |
| API Communication  | Axios (REST API)                    |
| Styling            | Custom CSS (Medical Dashboard)      |
| Security           | HIPAA/GDPR compliance design        |

---

## 📊 Features

- **Video Analysis**: Computer vision AI analyzes motor movements, facial expressions, eye-tracking
- **Audio Analysis**: AI evaluates cry patterns, vocalizations for atypical traits
- **Health Data Assessment**: Predictive modeling with birth data, Apgar scores, family history
- **Comprehensive Report**: Combined risk assessment with intervention plan
- **Risk Score Gauges**: Visual risk indicators for each disorder
- **Intervention Plans**: Immediate, short-term, and long-term recommendations
- **Medical Follow-up**: Specialist referrals and recommended tests
- **Print Report**: Print-friendly comprehensive assessment
- **HIPAA/GDPR Design**: Secure data handling architecture

---

## ⚠️ Disclaimer

This is an AI screening tool for educational and research purposes only.
It does NOT provide medical diagnoses. Always consult qualified healthcare
professionals for proper evaluation and diagnosis.

---

## 👨‍💻 Troubleshooting

**"GEMINI_API_KEY not set" error:**
→ Make sure you set the environment variable before running `python app.py`

**"npm: command not found":**
→ Install Node.js from https://nodejs.org (choose LTS version)

**"pip: command not found":**
→ Install Python from https://python.org (check "Add to PATH" during install)

**Video upload fails:**
→ Make sure the video is under 50MB and in MP4/AVI/MOV/WEBM format

**"CORS error" in browser console:**
→ Make sure the backend is running on port 5000

---

## 🔮 Future Scope

- Integration with wearable sensors for real-time monitoring
- Expansion to detect other early-onset neurological disorders
- Hospital-scale screening program collaboration
- Gamified developmental exercises for early intervention
