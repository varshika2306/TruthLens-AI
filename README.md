# 🔍 TruthLens AI


AI-Powered Digital Image Investigation Platform

## 🌐 Live Demo

🚀 Try the application here:

https://truth-lens-ai-sage.vercel.app/


## 📸 Application Screenshots

### 🏠 TruthLens AI Home Page

The landing page provides an interface to upload images and initiate AI-powered digital investigation.

![Home Page](screenshots/Home.pg.png)


---

### 📤 Image Upload & Analysis

Users can upload digital images for authenticity analysis through the TruthLens AI investigation pipeline.

![Image Upload](screenshots/img%20uploaded.png)


---

### 🔍 Investigation Report

The system generates an explainable forensic report containing analysis results and investigation insights.

![Investigation Report](screenshots/Investigation%20Report.png)

### AI-Powered Digital Image Investigation Platform using IBM Granite Models

![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688.svg)
![React](https://img.shields.io/badge/React-TypeScript-61DAFB.svg)
![IBM](https://img.shields.io/badge/IBM-watsonx.ai-052FAD.svg)
![Granite](https://img.shields.io/badge/IBM-Granite%204-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

---

## 📖 Overview

TruthLens AI is an intelligent digital image investigation platform that analyzes uploaded images using metadata inspection, visual analysis, and IBM Granite foundation models to generate AI-powered forensic reports.

Instead of simply displaying technical image information, TruthLens AI interprets the findings and produces a professional investigation report including authenticity assessment, risk analysis, observations, and recommendations.

This project was developed as part of the **IBM SkillsBuild / Edunet AI Internship**.

---

# ✨ Features

- 📤 Secure Image Upload
- 🔎 Metadata Analysis
- 🖼️ Visual Inspection
- 🤖 AI Investigation using IBM Granite
- 📊 Authenticity Score
- ⚠️ Risk Assessment
- 📝 AI Generated Investigation Report
- 📁 Investigation History
- ⚡ FastAPI REST Backend
- 🎨 Modern React + TypeScript Frontend

---

# 🏗️ System Architecture

```
                 React Frontend
                        │
                        ▼
                 FastAPI Backend
                        │
      ┌─────────────────┼─────────────────┐
      │                 │                 │
      ▼                 ▼                 ▼
Upload Service    Metadata Agent    Visual Agent
                        │
                        ▼
                 Report Generator
                        │
                        ▼
          IBM watsonx.ai + Granite 4
                        │
                        ▼
           AI Investigation Report
```
## 🔗 Deployment

Frontend:
https://truth-lens-ai-sage.vercel.app/

Backend API:
https://truthlens-ai-13bj.onrender.com

API Documentation:
https://truthlens-ai-13bj.onrender.com/docs
---

# 🛠 Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- Vite

### Backend
- FastAPI
- Python
- Uvicorn

### AI
- IBM watsonx.ai
- IBM Granite 4 Foundation Model

### Other Libraries
- Pillow
- Pydantic
- Requests
- python-dotenv

---

# 📂 Project Structure

```
TruthLens-AI/

├── frontend/
│   ├── components/
│   ├── pages/
│   ├── App.tsx
│   └── ...
│
├── backend/
│   ├── agents/
│   ├── services/
│   ├── routes/
│   ├── uploads/
│   ├── reports/
│   ├── knowledge_base/
│   ├── main.py
│   └── ...
│
└── README.md
```

---

# 🚀 Getting Started

## 1 Clone Repository

```bash
git clone https://github.com/varshika2306/TruthLens-AI.git

cd TruthLens-AI
```

---

## 2 Backend Setup

```bash
cd backend

python -m venv .venv

# Windows
.venv\Scripts\activate

pip install -r requirements.txt
```

Create a `.env` file:

```env
WATSONX_API_KEY=YOUR_API_KEY

WATSONX_PROJECT_ID=YOUR_PROJECT_ID

WATSONX_URL=https://us-south.ml.cloud.ibm.com

GRANITE_MODEL_ID=ibm/granite-4-h-small
```

Run Backend

```bash
uvicorn main:app --reload
```

Backend

```
http://localhost:8000
```

Swagger API

```
http://localhost:8000/docs
```

---

## 3 Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend

```
http://localhost:5173
```

---

# 🔄 Workflow

1. Upload an image.
2. Metadata Agent extracts EXIF information.
3. Visual Agent analyzes image properties.
4. IBM Granite interprets the evidence.
5. AI generates a forensic investigation report.
6. Results are displayed in the React dashboard.

---

# 📋 API Endpoints

| Method | Endpoint | Description |
|----------|----------|-------------|
| GET | /health | Health Check |
| GET | /version | Version |
| POST | /api/v1/investigate | Analyze Image |
| GET | /api/v1/report/{id} | Get Report |
| GET | /api/v1/reports | List Reports |
| DELETE | /api/v1/report/{id} | Delete Report |

---

# 🤖 IBM Technologies Used

- IBM watsonx.ai
- IBM Granite 4 Foundation Model
- IBM Cloud
- Watsonx Runtime
- Watsonx Studio

---


# 🎯 Future Improvements

- PDF Report Export
- OCR Analysis
- Deepfake Detection
- Reverse Image Search
- AI Explainability Dashboard
- Multi-image Comparison
- Investigation Timeline
- User Authentication

---

# 👩‍💻 Author

**Varshika**

Artificial Intelligence & Machine Learning Student

GitHub

https://github.com/varshika2306

---

# 📄 License

This project is licensed under the MIT License.

---

## ⭐ If you found this project useful, please consider giving it a Star.
