# 🧠 NeoMind — AI-Based Early Detection of Neurodevelopmental Disorders in Newborns

An AI-powered full-stack web application that detects early signs of neurodevelopmental disorders in newborns (ADHD, ASD, Down Syndrome, and developmental delays) by analyzing behavioral, physiological, and genetic markers using Google Gemini AI.

🌐 **Live Demo:** [https://neomind-1-kr12.onrender.com](https://neomind-1-kr12.onrender.com)

> ⚠️ Free tier instance — first load may take ~50 seconds to wake up.

> ⚠️ **Disclaimer:** This is an AI screening tool for educational and research purposes only. It does NOT provide medical diagnoses. Always consult qualified healthcare professionals for proper evaluation and diagnosis.

---

## ✨ Features

- 🎥 **Video Analysis** — AI analyzes baby motor movements, facial expressions and eye-tracking
- 🎤 **Audio Analysis** — AI evaluates cry patterns and vocalizations for atypical traits
- 📋 **Health Data Assessment** — Predictive risk modeling with birth data, Apgar scores and family history
- 📊 **Comprehensive Report** — Combined risk assessment with intervention plan
- 📈 **Risk Score Gauges** — Visual risk indicators for ADHD, ASD, Down Syndrome, Developmental Delay
- 🤖 **NeoBot AI Chatbot** — Parenting and child development advice powered by Gemini AI
- 👨‍⚕️ **Doctor Directory** — Find pediatric specialists near you
- 👪 **Parent Portal** — Track multiple babies and view past screening results
- 🏥 **Doctor Portal** — View patients and add clinical notes
- 🖨️ **Print Report** — Print-friendly comprehensive assessment
- 🛡️ **HIPAA/GDPR Design** — Secure data handling architecture

---

## 🔧 Technology Stack

| Component | Technology |
|---|---|
| AI/ML | Google Gemini 2.5 Flash (Multimodal) |
| Computer Vision | Gemini Vision (video analysis) |
| Audio Processing | Gemini Audio (cry analysis) |
| Predictive Model | Gemini (health data risk modeling) |
| Frontend | React.js + React Router |
| Backend | Python Flask |
| API Communication | REST API |
| Styling | Custom CSS (Medical Dashboard) |
| Deployment | Render |
| Server | Gunicorn |
| Security | HIPAA/GDPR compliance design |

---

## 📁 Project Structure

```
neomind/
├── backend/
│   ├── app.py                 # Python Flask backend with Gemini AI
│   ├── requirements.txt       # Python dependencies
│   └── render.yaml            # Render deployment config
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js             # Main React app with all pages
│   │   ├── App.css            # Complete styling
│   │   └── index.js           # React entry point
│   ├── build/                 # Production build (served by Flask)
│   └── package.json           # Node.js dependencies
└── README.md
```

---

## 🚀 Run Locally

### Prerequisites
Make sure you have these installed:
- **Python 3.8+** → Download from https://python.org
- **Node.js 18+** → Download from https://nodejs.org
- **Gemini API Key** → Free from https://aistudio.google.com/apikey

---

### Step 1 — Setup the Backend (Python)

```bash
# Navigate to backend folder
cd neomind/backend

# Install Python packages
pip install -r requirements.txt

# Set your Gemini API key
# Windows CMD:
set GEMINI_API_KEY=your_api_key_here

# Windows PowerShell:
$env:GEMINI_API_KEY="your_api_key_here"

# Mac/Linux:
export GEMINI_API_KEY=your_api_key_here

# Start the backend server
python app.py
```

✅ You should see: "Server running at http://localhost:5000"

---

### Step 2 — Setup the Frontend (React)

```bash
# Navigate to frontend folder
cd neomind/frontend

# Install packages
npm install

# Build for production
npm run build
```

Open your browser and go to 👉 **http://localhost:5000**

---

### Step 3 — Use the App!

1. **Dashboard** → Overview of all features
2. **Video Analysis** → Upload a baby video (MP4) for AI movement/facial analysis
3. **Audio Analysis** → Upload cry/vocalization audio (WAV/MP3) for pattern analysis
4. **Health Data** → Fill in birth data, Apgar scores, and family history
5. **Results** → Get comprehensive AI assessment combining all data
6. **AI Chatbot** → Ask NeoBot parenting and development questions
7. **Find Doctors** → Browse pediatric specialists directory

---

## 🔑 Demo Accounts

| Role | Email | Password |
|---|---|---|
| Parent | parent@demo.com | parent123 |
| Doctor | doctor@demo.com | doctor123 |

---

## ☁️ Deployment

This app is deployed on **Render** (free tier) with Flask serving the React frontend as a single service.

### Deploy your own instance
1. Fork this repo
2. Go to [render.com](https://render.com) → connect your GitHub
3. Set **Root Directory** to `neomind/backend`
4. Set **Build Command** to `pip install -r requirements.txt`
5. Set **Start Command** to `gunicorn app:app`
6. Add environment variable: `GEMINI_API_KEY` = your key
7. Click **Deploy Web Service** 🎉

---

## 👨‍💻 Troubleshooting

**"GEMINI_API_KEY not set" error:**
→ Make sure you added the environment variable in Render dashboard

**Video upload fails:**
→ Make sure the video is under 50MB and in MP4/AVI/MOV/WEBM format

**"npm: command not found":**
→ Install Node.js from https://nodejs.org (choose LTS version)

**"pip: command not found":**
→ Install Python from https://python.org (check "Add to PATH" during install)

**"CORS error" in browser console:**
→ Make sure the backend is running on port 5000

---

## 🔮 Future Scope

- Integration with wearable sensors for real-time monitoring
- Expansion to detect other early-onset neurological disorders
- Hospital-scale screening program collaboration
- Gamified developmental exercises for early intervention

---

## 👨‍💻 Author

**Sreenidhi** — [GitHub](https://github.com/sreenidhi-06)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

