# 🧠 MediScan AI – Privacy-First Medical Report Intelligence Platform

# DATAQUEST / Hackathon Edition

<div align="center">

![MediScan AI](https://img.shields.io/badge/MediScan%20AI-Accessible%20Healthcare-blueviolet?style=for-the-badge\&logo=health\&logoColor=white)

**🏥 AI-Powered Medical Report Analyzer & Accessibility Dashboard**

[![Privacy First](https://img.shields.io/badge/Privacy-Local%20First-green?style=flat-square)](#)
[![Voice Enabled](https://img.shields.io/badge/Voice-First%20UX-orange?style=flat-square)](#)
[![Hybrid AI](https://img.shields.io/badge/Hybrid-AI%20Cloud%20%2B%20Local-blue?style=flat-square)](#)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG%20Inspired-brightgreen?style=flat-square)](#)

*Turning complex medical reports into clear, visual, and narratable health stories*

</div>

---

## Deployment Links 
 * https://asikkani.github.io/medi_report_analyser/ (preferable)
 * https://mediscanai-git-main-asikkanis-projects.vercel.app/
---
## Demo Video
 https://drive.google.com/drive/folders/1Y9z4DoQXbMcrfVDMf8JV2ybiMV3ppc0w?usp=sharing

---

## 👥 Team RADIOHEADS

<table align="center">
<tr>
<td align="center"><img src="https://img.shields.io/badge/-Yeswanth%20Ram-6C5CE7?style=for-the-badge&logo=github&logoColor=white"></td>
<td align="center"><img src="https://img.shields.io/badge/-BharaniDharan%20-00CEC9?style=for-the-badge&logo=github&logoColor=white"></td>
<td align="center"><img src="https://img.shields.io/badge/-AsikKani%20-FDCB6E?style=for-the-badge&logo=github&logoColor=white"></td>
<td align="center"><img src="https://img.shields.io/badge/-Logesh%20-FF7675?style=for-the-badge&logo=github&logoColor=white"></td>
</tr>
</table>

---

## 🎯 Problem Statement

Medical reports are written **for clinicians**, not for patients.

### 🔍 The Challenge

* Patients struggle to understand lab values and medical terminology
* Elderly and visually impaired users are excluded from digital health tools
* Existing AI tools are text-centric and cloud-dependent
* Lack of context, trends, and explainability increases anxiety

---

## 🚀 Our Solution: MediScan AI

MediScan AI is a **privacy-first, accessibility-driven medical report intelligence platform** that converts scanned reports into **structured insights, interactive visuals, voice explanations, and historical health trends**.

It works **with or without the cloud**, supports **voice-only navigation**, and is designed so **blind and elderly users can use it independently**.


<div align="center">

```mermaid
graph TD
    A[Medical Report Image] --> B[Local OCR - Tesseract.js]
    B --> C[Hybrid AI Engine]
    C -->|Cloud| D[Gemini 2.0 Flash]
    C -->|Local| E[Ollama LLMs]
    D --> F[Structured JSON Extraction]
    E --> F
    F --> G[Health Scoring & Trends]
    G --> H[3D Anatomy Dashboard]
    H --> I[Voice Narration Engine]
    I --> J[User Interaction & Chat]
```

</div>

---

## ⭐ Key Features

### 🔒 Privacy-First Medical Intelligence

* **100% local OCR** using Tesseract.js
* Optional **local AI processing** via Ollama
* No forced cloud dependency
* User-controlled data persistence

---

### 🧠 Structured Medical Understanding

* Precise extraction of lab values into JSON
* Clinical range comparison
* Abnormal value highlighting
* Confidence-aware extraction (High / Medium / Low)

---

### 🫀 Interactive 3D Anatomy Dashboard

* Touch-based body system exploration
* Organ-specific lab value mapping
* Color-coded health indicators
* Click-to-hear explanations

---

### 📊 Smart Health Scoring

* Algorithmic health percentage per system
* Weighted scoring based on reference ranges
* Change-aware scoring across reports
* Transparent “Explain Why” logic

---

### 📈 Historical Trend Tracking

* Persistent health history via Firebase
* Visual trend graphs for key metrics
* Delta-based narration:

  * “Improved”
  * “Worsened”
  * “Stable”

---

### 🎙️ Accessibility-First Experience

* Auto-narration of results
* Voice-only navigation mode
* Adjustable speech rate
* Text scaling up to large print
* High-contrast UI with large touch targets

---

### 💬 Context-Aware AI Chat

* Ask questions about your own report
* AI remembers extracted values
* Non-diagnostic, educational responses
* Guardrails against medical advice

---

## 🏗️ System Architecture

```
┌──────────────────────┐
│   Frontend (React)   │
│  Framer Motion + UX  │
└─────────┬────────────┘
          │
┌─────────▼────────────┐
│   Local OCR Engine   │
│   (Tesseract.js)     │
└─────────┬────────────┘
          │
┌─────────▼────────────┐
│   Hybrid AI Layer    │
│ Gemini | Ollama LLM  │
└─────────┬────────────┘
          │
┌─────────▼────────────┐
│ Structured Analysis  │
│ Trends | Scores | QA │
└─────────┬────────────┘
          │
┌─────────▼────────────┐
│ Visualization Layer  │
│ Anatomy | Charts     │
└─────────┬────────────┘
          │
┌─────────▼────────────┐
│ Voice & Accessibility│
│ Web Speech API       │
└──────────────────────┘
```

---

## 🛠️ Technology Stack

<div align="center">

### Frontend

![React](https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge\&logo=react\&logoColor=black)
![Framer Motion](https://img.shields.io/badge/Framer-Motion-black?style=for-the-badge)
![CSS](https://img.shields.io/badge/CSS-Custom_UI-1572B6?style=for-the-badge)

### AI & Intelligence

![Gemini](https://img.shields.io/badge/Gemini-2.0%20Flash-blue?style=for-the-badge)
![Ollama](https://img.shields.io/badge/Ollama-Local%20LLMs-purple?style=for-the-badge)

### OCR & Voice

![Tesseract](https://img.shields.io/badge/Tesseract-OCR-green?style=for-the-badge)
![Web Speech](https://img.shields.io/badge/Web%20Speech-API-orange?style=for-the-badge)

### Backend & Storage

![Firebase](https://img.shields.io/badge/Firebase-Firestore-yellow?style=for-the-badge)

</div>

---

## 🔐 Ethics & Safety

* Non-diagnostic system
* No medication recommendations
* Clear confidence indicators
* Explainable AI decisions
* User-controlled data deletion

---

## 🚀 Getting Started

### Prerequisites

```bash
Node.js 18+
npm or pnpm
Ollama (optional, for local AI)
```

### Installation

```bash
git clone https://github.com/<your-org>/mediscan-ai.git
cd mediscan-ai
npm install
npm run dev
```

---
## 📸 Project Screenshots & Demonstration

<div align="center">

<img src="./images/10.jpg" width="800"/>

<img src="./images/7.jpg" width="800"/>

<img src="./images/8.jpg" width="800"/>

<img src="./images/5.jpg" width="800"/>

</div>

---

## 🎯 Use Cases

* Elderly patients reviewing lab reports
* Visually impaired users accessing health data
* Families tracking long-term health trends
* Clinics needing patient-friendly summaries
* Privacy-conscious individuals


## 🏆 Innovation Highlights

* Hybrid cloud + local AI
* Voice-only navigation
* Interactive anatomy intelligence
* Confidence-aware medical extraction
* Accessibility-first architecture

---

<div align="center">

<img src="https://img.shields.io/badge/Built%20With-❤️-red?style=for-the-badge">
<img src="https://img.shields.io/badge/Focus-Accessible%20Healthcare-blue?style=for-the-badge">

</div>

---

> *“Healthcare intelligence should be understandable, inclusive, and private by default.”*
> **— Team RADIOHEADS**

---
