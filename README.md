# 🩺 Diabetes Risk Assessment System

> A full-stack web application that helps users assess their risk of developing diabetes through **lifestyle questionnaires** and a **machine learning engine** — built as a 3rd Year University Team Project.

---

## 📸 Screenshots

> **Add your screenshots here!**
> Take screenshots of your running website and drag-and-drop them below.

| Assessment Hub | Lifestyle Check | Risk Result |
|---|---|---|
| ![Assessment Hub](screenshots/assessment-hub.png) | ![Lifestyle Check](screenshots/lifestyle-check.png) | ![Result](screenshots/result.png) |

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [How It Works](#-how-it-works)
- [Team](#-team)
- [Disclaimer](#-disclaimer)

---

## 🧠 About the Project

This system was built to give people a quick, accessible, and educational way to understand their diabetes risk — without needing to see a doctor first.

It has **two separate modules** that work together:

1. **Lifestyle Check** — A friendly quiz that asks about your daily habits (diet, sleep, exercise, etc.) and gives you a risk score based on a custom scoring algorithm.

2. **Risk ML Engine** — A machine learning model (XGBoost) trained on the **BRFSS 2015 Health Indicators dataset** (253,000+ real records) that predicts diabetes risk based on clinical health factors.

---

## ✨ Features

- 🎯 **Two-mode risk assessment** — Lifestyle quiz + ML-based clinical prediction
- 📊 **Detailed risk breakdown** — Shows exactly *why* your risk is low/moderate/high
- 🤖 **XGBoost ML model** — Trained with class-weight balancing and threshold optimisation
- 💅 **Animated UI** — Built with React + Framer Motion for smooth, engaging experience
- 🔒 **No personal data stored** — All processing is done in real-time
- 📱 **Responsive design** — Works on desktop and mobile

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| HTML / CSS / JavaScript | Assessment Hub (vanilla) |
| React 18 + Vite | Lifestyle Check frontend |
| Framer Motion | Animations |
| React Icons | UI icons |

### Backend
| Technology | Purpose |
|---|---|
| Python + Flask | REST API for both modules |
| Flask-CORS | Cross-origin request handling |

### Machine Learning
| Technology | Purpose |
|---|---|
| XGBoost | Diabetes risk classification |
| scikit-learn | Preprocessing, metrics, scaling |
| imbalanced-learn | Dataset balancing (SMOTE) |
| pandas + NumPy | Data processing |

---

## 📁 Project Structure

```
diabetes-risk-system/
│
├── assessment-hub/                  # Vanilla HTML/CSS/JS landing & hub
│   ├── index.html
│   ├── script.js
│   └── styles.css
│
├── lifestyle-check/                 # Lifestyle quiz module
│   ├── backend/
│   │   ├── app.py                   # Flask API — scoring logic
│   │   ├── predict.py
│   │   ├── train.py
│   │   └── requirements.txt
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── App.jsx              # Main React app
│   │   │   ├── components/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── ProgressNav.jsx
│   │   │   │   ├── QuestionCard.jsx
│   │   │   │   └── ResultCard.jsx
│   │   │   └── styles.css
│   │   ├── public/stickers/         # Question illustration images
│   │   ├── package.json
│   │   └── vite.config.js
│   └── models/
│       ├── prediabetes_model.pkl
│       └── label_encoder.pkl
│
└── risk-ml-engine/                  # XGBoost ML prediction module
    └── backend/
        ├── app.py                   # Flask API — ML predictions
        ├── train_model.py           # Model training script
        ├── preprocessing.py         # Data preprocessing
        ├── predict_new_data.py
        ├── models/
        │   ├── final_xgb_model.pkl
        │   ├── scaler.pkl
        │   └── threshold.pkl
        ├── data/
        │   └── diabetes_012_health_indicators_BRFSS2015.csv
        └── requirements.txt
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:
- [Node.js](https://nodejs.org/) (v18 or above)
- [Python](https://www.python.org/) (v3.9 or above)
- [Git](https://git-scm.com/)

---

### 1. Clone the Repository

```bash
git clone https://github.com/shivamburkul/diabetes-risk-system.git
cd diabetes-risk-system
```

---

### 2. Run the Lifestyle Check Module

#### Backend
```bash
cd lifestyle-check/backend
pip install -r requirements.txt
python app.py
```
> Runs on `http://localhost:5000`

#### Frontend
```bash
cd lifestyle-check/frontend
npm install
npm run dev
```
> Runs on `http://localhost:5173`

---

### 3. Run the Risk ML Engine

```bash
cd risk-ml-engine/backend
pip install -r requirements.txt
python app.py
```
> Runs on `http://localhost:5001`

---

### 4. Open the Assessment Hub

Simply open `assessment-hub/index.html` in your browser — no server needed!

---

## ⚙️ How It Works

### Lifestyle Check — Scoring System

The lifestyle questionnaire scores your answers across **10 risk categories**:

| Category | Max Score |
|---|---|
| Age | 15 |
| Weight / BMI | 20 |
| Waist circumference | 10 |
| Family history | 15 |
| Physical activity | 10 |
| Diet & sugary drinks | 15 |
| Alcohol & smoking | 12 |
| Symptoms (thirst, urination, fatigue, etc.) | varies |
| Sleep & stress | 15 |
| Female-specific factors (GDM / PCOS) | 10 |

**Risk Levels:**
- 🟢 Low Risk — below 30%
- 🟡 Moderate Risk — 30% to 60%
- 🔴 High Risk — above 60%

---

### Risk ML Engine — XGBoost Model

- **Dataset:** CDC BRFSS 2015 Health Indicators (253,680 records, 21 features)
- **Model:** XGBoost Classifier with optimised decision threshold
- **Balancing:** Class-weight balancing for imbalanced dataset
- **Evaluation:** F1-Score, ROC-AUC, Confusion Matrix

**Input features include:** BMI, Blood Pressure, Cholesterol, Physical Activity, Smoking status, General Health rating, Age, Income, Education and more.

---

## 👥 Team

This project was built as a **3rd Year University Team Project** by:

| Name | GitHub | Role |
|---|---|---|
| Pranav Gajanan Dighade | [@connectpranav](https://github.com/connectpranav) | Leader |
| Ajay Bhanwarlal Chaudhary | [@ajay262628](https://github.com/ajay262628) | Member 1 |
| Shivam Gajanan Burkul | [@shivamburkul](https://github.com/shivamburkul) | Member 2 |
| Faiz Ishaque Chauhan | [@faizchauhan18-creator](https://github.com/faizchauhan18-creator) | Member 3 |

> ✏️ *Fill in your teammates' names, GitHub usernames, and roles (e.g. ML Engineer, Frontend Developer, Backend Developer, UI/UX Designer)*

---

## ⚠️ Disclaimer

> This tool is for **educational and informational purposes only**. It is **not a medical diagnosis** and should not replace professional medical advice. If you have concerns about your health, please consult a qualified healthcare professional.

---

## 📄 License

This project was built for academic purposes as part of a university module.

---

<div align="center">
  <p>Made with ❤️ by the Diabetes Risk System Team</p>
</div>