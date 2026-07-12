# TruthLens AI

![Python](https://img.shields.io/badge/Python-3.11+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-green)
![IBM watsonx.ai](https://img.shields.io/badge/IBM-watsonx.ai-0062FF)
![IBM Granite](https://img.shields.io/badge/IBM-Granite-black)
![License](https://img.shields.io/badge/License-MIT-green)

---

# TruthLens AI
### AI-Powered Digital Image Investigation Platform

TruthLens AI is an enterprise-ready AI-powered Digital Image Investigation Platform that performs forensic analysis on uploaded images using a modular multi-agent architecture.

The platform combines metadata analysis, pixel-level visual signal extraction, and IBM Granite Large Language Models (LLMs) running on IBM watsonx.ai to generate explainable authenticity reports, helping users detect suspicious or manipulated digital images.

---

# 🚀 Project Highlights

- AI-powered image forensic investigation
- IBM watsonx.ai Granite integration
- Modular Multi-Agent Architecture
- Production-ready FastAPI backend
- Automatic JSON investigation reports
- Interactive Swagger API documentation
- Secure upload validation
- Authenticity scoring engine
- Ready for IBM Orchestrate integration
- Designed for future RAG expansion

---

# IBM Technologies Used

| Technology | Purpose |
|------------|---------|
| IBM watsonx.ai | AI Platform |
| IBM Granite | AI Investigation Report Generation |
| IBM Cloud IAM | Authentication |
| IBM Bob | AI-assisted Development |
| FastAPI | Backend REST APIs |

---

# System Architecture

```
                +----------------------+
                |      React UI        |
                +----------+-----------+
                           |
                           |
                    FastAPI REST API
                           |
                +----------+----------+
                | Investigation       |
                | Orchestrator        |
                +----------+----------+
                           |
      +--------------------+--------------------+
      |                    |                    |
MetadataAgent       VisualAgent          ReportAgent
      |                    |                    |
      +--------------------+--------------------+
                           |
                   IBM Granite (watsonx.ai)
                           |
                   Investigation Report
                           |
                   JSON Response
```

---

# Project Structure

```
backend/
│
├── api/
│   └── routes.py
│
├── services/
│   ├── upload_service.py
│   └── granite_service.py
│
├── agents/
│   ├── metadata_agent.py
│   ├── visual_agent.py
│   └── report_agent.py
│
├── orchestrator/
│   └── investigation.py
│
├── utils/
│   ├── config.py
│   └── helpers.py
│
├── uploads/
├── reports/
├── knowledge_base/
│
├── main.py
├── requirements.txt
├── .env.example
└── README.md
```

---

# Investigation Pipeline

```
Image Upload
      │
      ▼
Upload Validation
      │
      ▼
Metadata Extraction
      │
      ▼
Visual Analysis
      │
      ▼
IBM Granite Analysis
      │
      ▼
Authenticity Score
      │
      ▼
JSON Investigation Report
      │
      ▼
REST API Response
```

---

# Features

- Image Upload API
- Metadata Extraction
- EXIF Analysis
- GPS Coordinate Extraction
- Camera Information Detection
- Brightness Analysis
- Contrast Analysis
- Sharpness Analysis
- Histogram Entropy Analysis
- Noise Estimation
- Image Integrity Checks
- Authenticity Score Generation
- IBM Granite AI Report
- JSON Report Storage
- Report History API
- Report Deletion API
- Interactive Swagger Documentation

---

# Quick Start

## 1. Clone the Project

```bash
cd backend

python -m venv .venv

# Windows
.venv\Scripts\activate

# Linux / macOS
source .venv/bin/activate

pip install -r requirements.txt
```

---

## 2. Configure Environment

Copy

```
.env.example
```

to

```
.env
```

Fill in

```env
WATSONX_API_KEY=YOUR_API_KEY

WATSONX_PROJECT_ID=YOUR_PROJECT_ID

WATSONX_URL=https://us-south.ml.cloud.ibm.com

GRANITE_MODEL_ID=ibm/granite-13b-instruct-v2
```

---

## 3. Run Server

```bash
uvicorn main:app --reload --port 8000
```

---

## 4. Open Swagger

```
http://localhost:8000/docs
```

---

# API Endpoints

| Method | Endpoint | Description |
|----------|------------------------------|--------------------------------|
| GET | / | Root Endpoint |
| GET | /health | Health Check |
| GET | /version | Application Version |
| POST | /api/v1/investigate | Investigate Image |
| GET | /api/v1/report/{id} | Retrieve Report |
| GET | /api/v1/reports | List Reports |
| DELETE | /api/v1/report/{id} | Delete Report |

---

# Sample Response

```json
{
  "investigation_id":"98b9...",
  "original_filename":"sample.jpg",

  "platform":"TruthLens AI",

  "verdict":{
      "authenticity_score":82,
      "risk_level":"LOW",
      "summary":"Image appears authentic."
  }
}
```

---

# Authenticity Scoring

| Score | Risk | Interpretation |
|---------|---------|----------------|
| 75-100 | 🟢 LOW | Image appears authentic |
| 50-74 | 🟡 MEDIUM | Minor anomalies detected |
| 25-49 | 🟠 HIGH | Multiple suspicious signals |
| 0-24 | 🔴 CRITICAL | Strong manipulation indicators |

The score is computed using:

- Metadata integrity
- Missing EXIF fields
- Camera signatures
- Histogram entropy
- Brightness
- Contrast
- Noise
- Sharpness
- Visual anomaly signals

---

# Why IBM Granite?

IBM Granite provides enterprise-grade AI reasoning for:

- Evidence summarization
- Explainable forensic reports
- Structured investigation reasoning
- Low hallucination responses
- Enterprise-ready deployment

---

# Commercial Applications

TruthLens AI can be deployed for:

- News Agencies
- Fact Checking Platforms
- Cybersecurity Companies
- Insurance Companies
- Law Enforcement
- Digital Forensics Laboratories
- Social Media Platforms
- Government Agencies

---

# Security Features

- UUID-based file storage
- Upload validation
- File size restrictions
- Allowed extension verification
- Secure environment variables
- Automatic report persistence
- REST API validation
- Pydantic request validation

---

# Environment Variables

| Variable | Description |
|------------|-------------|
| WATSONX_API_KEY | IBM Cloud API Key |
| WATSONX_PROJECT_ID | IBM watsonx.ai Project |
| WATSONX_URL | IBM Endpoint |
| GRANITE_MODEL_ID | Granite Model |
| UPLOAD_DIR | Upload Folder |
| REPORTS_DIR | Reports Folder |
| MAX_UPLOAD_SIZE_MB | Maximum Upload Size |
| ALLOWED_EXTENSIONS | Allowed File Types |
| DEBUG | Debug Mode |
| LOG_LEVEL | Logging Level |

---

# Future Scope

- IBM Orchestrate workflow integration
- Explainable AI heatmaps
- AI-generated image detection
- Deepfake face detection
- Image tampering localization
- Blockchain evidence storage
- RAG-powered forensic knowledge base
- PDF Investigation Reports
- IBM Cloud Code Engine deployment
- Multi-image comparison
- Video forensic analysis

---

# Roadmap

- ✅ FastAPI Backend
- ✅ Metadata Extraction
- ✅ Visual Analysis
- ✅ IBM Granite Integration
- ✅ JSON Investigation Reports
- ⏳ IBM Orchestrate Integration
- ⏳ React Dashboard
- ⏳ Cloud Deployment
- ⏳ RAG Knowledge Base
- ⏳ Explainable AI Visualizations

---

# Deployment Ready

TruthLens AI is designed with production-readiness in mind:

- Modular architecture
- Environment-based configuration
- RESTful API design
- Enterprise logging
- AI service abstraction
- JSON report persistence
- IBM watsonx.ai integration
- Future cloud scalability

---

# License

MIT License

Developed using ❤️ with

- Python
- FastAPI
- IBM watsonx.ai
- IBM Granite
- IBM Bob