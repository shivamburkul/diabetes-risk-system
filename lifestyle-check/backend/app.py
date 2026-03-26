from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np

app = Flask(__name__)
# Enable CORS for both frontend projects
CORS(app, resources={r"/*": {"origins": [
    "http://localhost:5173",
    "http://localhost:5174"
]}})

# ------------------------------------------------------------------
# Helper: Map answers to risk score - FINAL STABLE SCORING LOGIC (V3)
# ------------------------------------------------------------------
def map_answers_to_scores(answers):
    score = 0.0
    reasons = []

    # Max Score remains 140.0. Tiers: Low < 42, Moderate 42-84, High > 84.
    MAX_SCORE = 140.0
    
    # --- 1. Age (Max 15) ---
    age_map = {
        "<25": 0, "25–34": 2, "35–44": 5, "45–54": 8, 
        "55–64": 12, # Stable weight
        "65–74": 13, "75+": 15
    }
    age = answers.get("age", "")
    a = age_map.get(age, 0)
    score += a
    if a >= 8: # 45+
        reasons.append("Age ≥ 45 increases risk")

    # --- 2. Weight/BMI approximation (Max 20) ---
    weight_map = {
        "<50 kg": 0, "50–64 kg": 2, 
        "65–79 kg": 9, # Stable weight
        "80–94 kg": 12, "95–109 kg": 16, "110+ kg": 20,
        "Underweight": 0, "Normal": 0, "Overweight": 12, "Obese": 20
    }
    weight = answers.get("weight", "") or answers.get("height_weight", "")
    b = weight_map.get(weight, 0)
    score += b
    if b >= 12: # 80kg+ or Overweight/Obese
        reasons.append("High body weight / BMI (approx)")

    # --- 3. Waist (Max 10) ---
    waist = answers.get("waist", "")
    if waist == "Yes":
        score += 10
        reasons.append("Large waist circumference")

    # --- 4. Family history (Max 15) ---
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

    # --- 5. Activity (Max 10) ---
    act_map = {
        "0": 10, "1–2": 7, 
        "3–4": 4, # Stable weight
        "5–7": 0
    }
    activity = answers.get("activity", "")
    act = act_map.get(activity, 0)
    score += act
    if act >= 7: # 0-2 days
        reasons.append("Low physical activity")

    # --- 6. Diet & Drinks (Max 15 total) ---
    diet = answers.get("diet", "")
    if diet in ("High processed/sugary foods", "Mostly fast food", "High processed / sugary foods"):
        score += 10
        reasons.append("Unhealthy diet (processed/sugary)")

    sdrink = answers.get("sugary_drinks", "")
    if sdrink == "Daily":
        score += 5
        reasons.append("Regular sugary drink consumption")

    # --- 7. Alcohol & Smoking (Max 12 total) ---
    alc = answers.get("alcohol", "")
    if alc == "15+ units":
        score += 6
        reasons.append("High alcohol intake")

    smoke = answers.get("smoke", "")
    if smoke == "Current smoker":
        score += 6
        reasons.append("Current smoker")

    # --- 8. Symptoms (Max 5 per symptom) ---
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

    # --- 9. Sleep & Stress (Max 15 total) ---
    sl = answers.get("sleep", "")
    if sl == "<5":
        score += 6; reasons.append("Short sleep duration")
    elif sl == "5–6":
        score += 4; # Stable weight
        reasons.append("Sub-optimal sleep duration")
        
    if answers.get("sleep_issues", "") == "Yes":
        score += 6; reasons.append("Sleep issues / possible sleep apnea")
        
    st = answers.get("stress", "")
    if st == "Often":
        score += 4; # Stable weight
        reasons.append("Moderate stress")
    elif st == "Daily":
        score += 6; reasons.append("Daily high stress")

    # --- 10. Female factors (Max 10) ---
    ff = answers.get("female_factors", "")
    if ff in ("Gestational diabetes", "PCOS", "Both"):
        score += 10
        reasons.append("Female-specific risk (GDM/PCOS)")

    # ----------------------------
    # Calculate Percentage and Determine Risk Level
    # ----------------------------
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

    # Sort reasons, prioritizing high-impact factors
    unique_reasons = sorted(list(set(reasons)), key=lambda x: -1 if any(k in x.lower() for k in ["high", "excessive", "large", "daily"]) else 1)

    return percent, result, explanation, unique_reasons

# ----------------------------
# Prediction endpoint
# ----------------------------
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

# ----------------------------
# Health check
# ----------------------------
@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "scoring_system": "Activities Manual Scorer (Final Stable)"})

# ----------------------------
# Run server
# ----------------------------
if __name__ == "__main__":
    app.run(port=5000, debug=True)
