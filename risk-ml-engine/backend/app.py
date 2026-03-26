import pandas as pd
import numpy as np
import pickle
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

BASE_DIR       = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH     = os.path.join(BASE_DIR, 'models', 'final_xgb_model.pkl')
SCALER_PATH    = os.path.join(BASE_DIR, 'models', 'scaler.pkl')
THRESHOLD_PATH = os.path.join(BASE_DIR, 'models', 'threshold.pkl')

MODEL     = None
SCALER    = None
THRESHOLD = 0.5

try:
    with open(MODEL_PATH, 'rb') as f:   MODEL  = pickle.load(f)
    with open(SCALER_PATH, 'rb') as f:  SCALER = pickle.load(f)
    try:
        with open(THRESHOLD_PATH, 'rb') as f: THRESHOLD = pickle.load(f)
        print(f"Optimised threshold loaded: {THRESHOLD:.4f}")
    except FileNotFoundError:
        print("No saved threshold — using 0.5")
    print("Model and Scaler loaded.")
except Exception as e:
    print(f"Error loading assets: {e}")

EXPECTED_FEATURES = [
    'HighBP', 'HighChol', 'CholCheck', 'BMI', 'Smoker', 'Stroke',
    'HeartDiseaseorAttack', 'PhysActivity', 'Fruits', 'Veggies',
    'HvyAlcoholConsump', 'AnyHealthcare', 'NoDocbcCost', 'GenHlth',
    'MentHlth', 'PhysHlth', 'DiffWalk', 'Sex', 'Age', 'Education', 'Income',
]

FEATURE_DEFAULTS = {
    'HighBP': 0, 'HighChol': 0, 'CholCheck': 1, 'BMI': 27,
    'Smoker': 0, 'Stroke': 0, 'HeartDiseaseorAttack': 0,
    'PhysActivity': 1, 'Fruits': 1, 'Veggies': 1,
    'HvyAlcoholConsump': 0, 'AnyHealthcare': 1, 'NoDocbcCost': 0,
    'GenHlth': 3, 'MentHlth': 0, 'PhysHlth': 0, 'DiffWalk': 0,
    'Sex': 0, 'Age': 5, 'Education': 5, 'Income': 5,
}


def preprocess_and_predict(data_point):
    if MODEL is None or SCALER is None:
        return {'prediction': 0, 'probability': 0.0,
                'result_text': 'Model Not Loaded', 'error': True}

    filled = {f: data_point.get(f, FEATURE_DEFAULTS[f]) for f in EXPECTED_FEATURES}
    df = pd.DataFrame([filled])[EXPECTED_FEATURES]
    X_scaled = SCALER.transform(df)

    prob       = float(MODEL.predict_proba(X_scaled)[0][1])
    prediction = int(prob >= THRESHOLD)

    return {
        'prediction': prediction,
        'probability': round(prob, 4),
        'result_text': 'High Risk (1)' if prediction == 1 else 'Low Risk (0)',
        'error': False
    }


app = Flask(__name__)
CORS(app)  # Allow all origins for deployment


@app.route('/', methods=['GET'])
def home():
    return f"BRFSS Diabetes API running — threshold: {THRESHOLD:.4f}"


@app.route('/predict', methods=['POST'])
def predict():
    if not request.json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.json
    processed = {}
    for f in EXPECTED_FEATURES:
        try:
            v = data.get(f)
            processed[f] = float(v) if (v is not None and v != "") else float(FEATURE_DEFAULTS[f])
        except (ValueError, TypeError):
            processed[f] = float(FEATURE_DEFAULTS[f])

    try:
        result = preprocess_and_predict(processed)
        if result.get('error'):
            return jsonify({"percent": 0.0, "result": "Model Failed",
                            "explanation": "Check backend logs.",
                            "reasons": ["Model files missing."]}), 500

        pct = float(np.clip(round(result['probability'] * 100, 1), 0.0, 100.0))

        if pct < 35:    risk = "Low Risk Detected"
        elif pct < 70:  risk = "Moderate Risk Detected"
        else:           risk = "High Risk Detected"

        return jsonify({
            "percent":     pct,
            "result":      risk,
            "explanation": ("This is a screening estimate, not a medical diagnosis. "
                            "Consult a healthcare professional for formal testing."),
            "reasons": [
                f"Prediction Probability: {pct}%",
                f"Model Decision: {'Positive (Diabetic/Prediabetic)' if result['prediction'] == 1 else 'Negative (Non-Diabetic)'}",
                f"Decision Threshold: {round(THRESHOLD * 100, 1)}% (optimised for sensitivity)",
                "Based on XGBoost trained on full BRFSS 2015 dataset — 21 features.",
            ]
        })

    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({"error": str(e), "percent": 0.0,
                        "result": "Error", "explanation": str(e), "reasons": []}), 500


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=False)
