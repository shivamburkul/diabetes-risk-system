import pandas as pd
import pickle
import os

BASE_DIR       = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH     = os.path.join(BASE_DIR, 'models', 'final_xgb_model.pkl')
SCALER_PATH    = os.path.join(BASE_DIR, 'models', 'scaler.pkl')
THRESHOLD_PATH = os.path.join(BASE_DIR, 'models', 'threshold.pkl')

# Must match preprocessing.py exactly
EXPECTED_FEATURES = [
    'HighBP', 'HighChol', 'CholCheck', 'BMI', 'Smoker', 'Stroke',
    'HeartDiseaseorAttack', 'PhysActivity', 'Fruits', 'Veggies',
    'HvyAlcoholConsump', 'AnyHealthcare', 'NoDocbcCost', 'GenHlth',
    'MentHlth', 'PhysHlth', 'DiffWalk', 'Sex', 'Age', 'Education', 'Income',
]

# -------------------------------------------------------------------
# FEATURE VALUE REFERENCE  (from BRFSS 2015 dataset)
# -------------------------------------------------------------------
# HighBP, HighChol, CholCheck, Smoker, Stroke, HeartDiseaseorAttack,
# PhysActivity, Fruits, Veggies, HvyAlcoholConsump, AnyHealthcare,
# NoDocbcCost, DiffWalk    →  0 = No,  1 = Yes
#
# BMI          →  actual numeric (e.g. 27, 35)
# GenHlth      →  1=Excellent  2=Very Good  3=Good  4=Fair  5=Poor
# MentHlth     →  0–30  (days of poor mental health in past 30 days)
# PhysHlth     →  0–30  (days of poor physical health in past 30 days)
# Sex          →  0=Female  1=Male
# Age          →  1=18-24  2=25-29  3=30-34  4=35-39  5=40-44
#                 6=45-49  7=50-54  8=55-59  9=60-64  10=65-69
#                 11=70-74  12=75-79  13=80+
# Education    →  1=Never attended  2=Elementary  3=Some HS
#                 4=HS Graduate  5=Some College  6=College Graduate
# Income       →  1=<$10k  2=$10-15k  3=$15-20k  4=$20-25k
#                 5=$25-35k  6=$35-50k  7=$50-75k  8=$75k+
# -------------------------------------------------------------------


def load_assets():
    try:
        with open(MODEL_PATH, 'rb') as f:  model  = pickle.load(f)
        with open(SCALER_PATH, 'rb') as f: scaler = pickle.load(f)
        t = 0.5
        try:
            with open(THRESHOLD_PATH, 'rb') as f: t = pickle.load(f)
            print(f"Optimised threshold: {t:.4f}")
        except FileNotFoundError:
            print("No saved threshold — using 0.5")
        return model, scaler, t
    except FileNotFoundError as e:
        print(f"Error: {e}\nRun preprocessing.py and train_model.py first.")
        return None, None, 0.5


def predict(patient):
    model, scaler, t = load_assets()
    if model is None: return None
    df   = pd.DataFrame([patient])[EXPECTED_FEATURES]
    prob = float(model.predict_proba(scaler.transform(df))[0][1])
    pred = int(prob >= t)
    return {
        'prediction':  pred,
        'probability': round(prob, 4),
        'threshold':   round(t, 4),
        'result':      'Diabetes / Prediabetes Detected' if pred == 1 else 'No Diabetes Detected',
    }


if __name__ == '__main__':
    # --- Test with row from dataset (Diabetes_012 = 2.0, actual diabetic) ---
    row_diabetic = {
        'HighBP': 1, 'HighChol': 1, 'CholCheck': 1, 'BMI': 30,
        'Smoker': 1, 'Stroke': 0,  'HeartDiseaseorAttack': 1,
        'PhysActivity': 0, 'Fruits': 1, 'Veggies': 1, 'HvyAlcoholConsump': 0,
        'AnyHealthcare': 1, 'NoDocbcCost': 0, 'GenHlth': 5,
        'MentHlth': 30, 'PhysHlth': 30, 'DiffWalk': 1,
        'Sex': 0, 'Age': 9, 'Education': 5, 'Income': 1,
    }

    # --- Test with row from dataset (Diabetes_012 = 0.0, no diabetes) ---
    row_healthy = {
        'HighBP': 0, 'HighChol': 0, 'CholCheck': 0, 'BMI': 25,
        'Smoker': 1, 'Stroke': 0,  'HeartDiseaseorAttack': 0,
        'PhysActivity': 1, 'Fruits': 0, 'Veggies': 0, 'HvyAlcoholConsump': 0,
        'AnyHealthcare': 0, 'NoDocbcCost': 1, 'GenHlth': 3,
        'MentHlth': 0, 'PhysHlth': 0, 'DiffWalk': 0,
        'Sex': 0, 'Age': 7, 'Education': 6, 'Income': 1,
    }

    print("\n=== BRFSS Diabetes Prediction — 21 Features ===")

    print("\n[DIABETIC patient from dataset]")
    r = predict(row_diabetic)
    if r: print(f"  Result      : {r['result']}\n  Probability : {r['probability']}\n  Threshold   : {r['threshold']}")

    print("\n[HEALTHY patient from dataset]")
    r = predict(row_healthy)
    if r: print(f"  Result      : {r['result']}\n  Probability : {r['probability']}\n  Threshold   : {r['threshold']}")