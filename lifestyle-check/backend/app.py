from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import os

app = Flask(__name__)
CORS(app)  # Allow all origins for deployment

def map_answers_to_scores(answers):
    score = 0.0
    reasons = []
    MAX_SCORE = 140.0

    age_map = {
        "<25": 0, "25–34": 2, "35–44": 5, "45–54": 8,
        "55–64": 12, "65–74": 13, "75+": 15
    }
    age = answers.get("age", "")
    a = age_map.get(age, 0)
    score += a
    if a >= 8:
        reasons.append("Age ≥ 45 increases risk")

    weight_map = {
        "<50 kg": 0, "50–64 kg": 2,
        "65–79 kg": 9, "80–94 kg": 12, "95–109 kg": 16, "110+ kg": 20,
        "Underweight": 0, "Normal": 0, "Overweight": 12, "Obese": 20
    }
    weight = answers.get("weight", "") or answers.get("height_weight", "")
    b = weight_map.get(weight, 0)
    score += b
    if b >= 12:
        reasons.append("High body weight / BMI (approx)")

    waist = answers.get("waist", "")
    if waist == "Yes":
        score += 10
        reasons.append("Large waist circumference")

    family = answers.get("family", "")
    if family == "Yes":
        score += 15
        reasons.append("Family history of diabetes")
    elif family == "Gestational only":
        score += 6
        reasons.append("Gestational diabetes in family")

    gest = answers.get("gestational_family", "")
    if gest == "Yes":
        score += 6
        if "Gestational diabetes in family" not in reasons:
            reasons.append("Gestational diabetes in family")

    act_map = {"0": 10, "1–2": 7, "3–4": 4, "5–7": 0}
    activity = answers.get("activity", "")
    act = act_map.get(activity, 0)
    score += act
    if act >= 7:
        reasons.append("Low physical activity")

    diet = answers.get("diet", "")
    if diet in ("High processed/sugary foods", "Mostly fast food", "High processed / sugary foods"):
        score += 10
        reasons.append("Unhealthy diet (processed/sugary)")

    sdrink = answers.get("sugary_drinks", "")
    if sdrink == "Daily":
        score += 5
        reasons.append("Regular sugary drink consumption")

    alc = answers.get("alcohol", "")
    if alc == "15+ units":
        score += 6
        reasons.append("High alcohol intake")

    smoke = answers.get("smoke", "")
    if smoke == "Current smoker":
        score += 6
        reasons.append("Current smoker")

    if answers.get("thirst", "") == "Yes":
        score += 5; reasons.append("Frequent thirst")
    if answers.get("urinate", "") == "Yes":
        score += 5; reasons.append("Frequent urination")
    if answers.get("acanthosis", "") == "Yes":
        score += 5; reasons.append("Dark skin patches (insulin resistance sign)")

    if answers.get("fatigue", "") == "Yes":
        score += 4; reasons.append("Persistent fatigue")
    w = answers.get("weight_change", "")
    if w in ("Weight loss", "Weight gain"):
        score += 4; reasons.append(f"Recent unexplained weight change: {w}")
    if answers.get("hunger", "") == "Yes":
        score += 4; reasons.append("Excessive hunger after meals")

    sl = answers.get("sleep", "")
    if sl == "<5":
        score += 6; reasons.append("Short sleep duration")
    elif sl == "5–6":
        score += 4; reasons.append("Sub-optimal sleep duration")

    if answers.get("sleep_issues", "") == "Yes":
        score += 6; reasons.append("Sleep issues / possible sleep apnea")

    st = answers.get("stress", "")
    if st == "Often":
        score += 4; reasons.append("Moderate stress")
    elif st == "Daily":
        score += 6; reasons.append("Daily high stress")

    ff = answers.get("female_factors", "")
    if ff in ("Gestational diabetes", "PCOS", "Both"):
        score += 10
        reasons.append("Female-specific risk (GDM/PCOS)")

    percent = (score / MAX_SCORE) * 100
    percent = float(np.clip(percent, 0, 100))

    if percent < 30:
        result = "Low Risk Detected"
    elif percent < 60:
        result = "Moderate Risk Detected"
    else:
        result = "High Risk Detected"

    explanation = (
        "This assessment is an estimate based on your answers. "
        "It is not a medical diagnosis. Please consult a healthcare professional for definitive testing."
    )

    unique_reasons = sorted(list(set(reasons)), key=lambda x: -1 if any(k in x.lower() for k in ["high", "excessive", "large", "daily"]) else 1)

    return percent, result, explanation, unique_reasons


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json() or {}
        answers = data.get("answers", {}) if isinstance(data, dict) else {}
        percent, result, explanation, reasons = map_answers_to_scores(answers)
        return jsonify({
            "percent": round(percent, 1),
            "result": result,
            "explanation": explanation,
            "reasons": reasons
        })
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({"error": f"Internal error during prediction: {str(e)}"}), 500


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "scoring_system": "Activities Manual Scorer (Final Stable)"})


@app.route("/", methods=["GET"])
def home():
    return "Lifestyle Check Backend is running!"


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)