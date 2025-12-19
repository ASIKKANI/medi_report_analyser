# 🏥 Medical OS — Intelligent Health Report Analyzer

<div align="center">

![Medical OS](https://img.shields.io/badge/Medical%20OS-Intelligent%20Health%20Analyzer-blue?style=for-the-badge\&logo=health\&logoColor=white)

*🚀 DATASET — Hackathon Entry*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-success?style=flat-square)](https://mediscanai-git-main-asikkanis-projects.vercel.app) [![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Hosted-lightgrey?style=flat-square)](https://asikkani.github.io/medi_report_analyser/) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

</div>

---

## 👥 Team RADIOHEADS

<div align="center">

<!-- Replace names and GitHub links as needed -->

|                                                 Member | Role                    |
| -----------------------------------------------------: | :---------------------- |
| ![placeholder](./images/member1.png) <br> *Member 1* | Project Lead / Frontend |
| ![placeholder](./images/member2.png) <br> *Member 2* | ML & LLM Integration    |
| ![placeholder](./images/member3.png) <br> *Member 3* | OCR & Backend           |
| ![placeholder](./images/member4.png) <br> *Member 4* | DevOps & Deployment     |

</div>

> The future of personal health management — built fast, private by design, and accessible to everyone.

---

## ✨ WOW Features

### 🧠 Multi‑modal AI Intelligence

* *Brief Mode* — quick one‑line summary for time‑pressed users.
* *Simple Mode* — transforms medical jargon into plain English.
* *Detailed Mode* — clinical correlations, reference ranges, and physician‑style commentary.
* *Trend Analysis* — compares current report to historical reports and highlights what changed.

### 👁 Advanced Vision & OCR

* Drop PDFs or photos of lab reports; *Tesseract.js* parses tables and text client‑side.
* OCR confidence overlay and manual correction UI.

### 🧍 Interactive Health Body Map

* SVG/3D visualization that maps values onto organ systems — click an organ to see related metrics and clinical notes.

### 🎙 Voice‑First Interaction

* Floating voice assistant with waveform visualization — speak to ask "What’s my HbA1c?" and get an instant answer.

### 📈 Dynamic Trend Dashboard

* Recharts visualizations for longitudinal tracking (labs, vitals, risk‑scores).

### ♿ Accessibility & Dark Mode

* Text‑to‑speech, font scaling, high‑contrast themes, and keyboard navigation.

---

## 🏗 Architecture & Workflow

> *Replace the placeholder image with ./images/workflow.png or keep the mermaid diagram below.*

mermaid
flowchart LR
  A[Input: PDF / Image / Manual Entry] --> B[OCR (Tesseract.js)]
  B --> C[Parser & Normalizer]
  C --> D[AI Engine]
  D --> D1{Mode}
  D1 -->|Brief| E[Brief Summary]
  D1 -->|Simple| F[Plain Language Report]
  D1 -->|Detailed| G[Detailed Clinical Notes]
  D --> H[Trend Analysis]
  E & F & G --> I[Interactive Body Map]
  H --> I
  I --> J[Export: PDF / CSV / Share]
  J --> K[Encrypted Storage (Firebase)]


---

## 🔧 Built With

* *Frontend:* React 19 + Vite
* *Styling:* Vanilla CSS (Glassmorphism design system)
* *AI / LLM:* Google Gemini & Ollama integrations
* *OCR / Vision:* Tesseract.js
* *Data & Auth:* Firebase (Auth & Secure Storage)
* *Charts:* Recharts
* *PDF Export:* jsPDF + html2canvas
* *Animations:* Framer Motion

---

## 🚀 Live Demo

* *Vercel*: [https://mediscanai-git-main-asikkanis-projects.vercel.app](https://mediscanai-git-main-asikkanis-projects.vercel.app)
* *GitHub Pages*: [https://asikkani.github.io/medi_report_analyser/](https://asikkani.github.io/medi_report_analyser/)

---

## 🛠 Getting Started

### Prerequisites

* Node.js v18+
* npm or yarn

### Install

bash
# Clone
git clone https://github.com/your-username/medi_report_analyser.git
cd medi_report_analyser

# Install
npm install

# Add environment keys
cp .env.example .env
# Edit .env to include your API keys (Gemini, Firebase, etc.)


### Run (dev)

bash
npm run dev
# Open: http://localhost:5173


### Build (prod)

bash
npm run build
npm run preview


---

## 🔒 Security & Privacy

* OCR and primary parsing run client‑side by default to minimize PHI exposure.
* All persisted data is encrypted at rest in Firebase.
* Role‑based access control (RBAC) for shared reports.
* Consider a HIPAA compliance review before integrating with clinical workflows.

---

## 🧪 API (Optional)

> If you expose analysis endpoints, include them here. Placeholder example below.

*POST* /analyze_report

json
{
  "user_id": "string",
  "report_file": "base64 or multipart",
  "history_ids": ["report_2024_01_01", ...]
}


*Response*

json
{
  "summary": "string",
  "findings": [ { "metric": "HbA1c", "value": 7.2, "status": "High" } ],
  "confidence": 0.94
}


---

## 📸 Project Gallery

> Replace these placeholders with real screenshots in ./images/ before final submission.


./images/placeholder-dashboard.png
./images/placeholder-bodymap.png
./images/placeholder-ocr.png
./images/placeholder-voice-ui.png
./images/workflow.png  # architecture / workflow diagram (optional)


---

## 📈 Roadmap (Dataset Hackathon)

* *Phase 1 (Now)* — Stable OCR, Basic LLM summaries, body‑map linking
* *Phase 2* — Secure sharing, doctor notes export, enhanced clinical rules
* *Phase 3* — Federated learning for population trends, regulatory audits

---

## 🧾 License

MIT © Team RADIOHEADS

---

## 📞 Contact

* Team RADIOHEADS — team.radioheads@example.com
* Demo: [https://mediscanai-git-main-asikkanis-projects.vercel.app](https://mediscanai-git-main-asikkanis-projects.vercel.app)

> Made with ❤ for DATASET
