import pandas as pd
from sklearn.preprocessing import StandardScaler
import numpy as np
import pickle
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
RAW_DATA_PATH       = os.path.join(SCRIPT_DIR, 'data', 'diabetes_012_health_indicators_BRFSS2015.csv')
PROCESSED_DATA_PATH = os.path.join(SCRIPT_DIR, 'data', 'processed_data.csv')
SCALER_PATH         = os.path.join(SCRIPT_DIR, 'models', 'scaler.pkl')

# ALL 21 features from CSV (exact column names, same order as dataset)
SELECTED_FEATURES = [
    'HighBP',
    'HighChol',
    'CholCheck',
    'BMI',
    'Smoker',
    'Stroke',
    'HeartDiseaseorAttack',
    'PhysActivity',
    'Fruits',
    'Veggies',
    'HvyAlcoholConsump',
    'AnyHealthcare',
    'NoDocbcCost',
    'GenHlth',
    'MentHlth',
    'PhysHlth',
    'DiffWalk',
    'Sex',
    'Age',
    'Education',
    'Income',
]

def preprocess_data():
    print("Starting preprocessing — BRFSS 2015 (21 features)...")

    try:
        data = pd.read_csv(RAW_DATA_PATH)
        print(f"Data loaded. Shape: {data.shape}")
    except FileNotFoundError:
        print(f"File not found: {RAW_DATA_PATH}")
        return

    os.makedirs(os.path.dirname(SCALER_PATH), exist_ok=True)
    os.makedirs(os.path.dirname(PROCESSED_DATA_PATH), exist_ok=True)

    # Binary target: 0 = No Diabetes, 1 = Prediabetes or Diabetes
    data['Outcome'] = (data['Diabetes_012'] > 0).astype(int)
    print(f"\nTarget distribution:\n{data['Outcome'].value_counts()}")
    print(f"Class balance: {data['Outcome'].value_counts(normalize=True).round(3).to_dict()}")

    missing = [c for c in SELECTED_FEATURES if c not in data.columns]
    if missing:
        print(f"Missing columns in CSV: {missing}")
        return

    X = data[SELECTED_FEATURES].copy()
    y = data['Outcome']

    # Remove duplicate rows
    combined = X.copy()
    combined['Outcome'] = y.values
    combined.drop_duplicates(inplace=True)
    X = combined[SELECTED_FEATURES]
    y = combined['Outcome']
    print(f"After deduplication: {len(X)} rows")
    print(f"Missing values per feature:\n{X.isnull().sum()}")

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    with open(SCALER_PATH, 'wb') as f:
        pickle.dump(scaler, f)
    print(f"Scaler saved: {SCALER_PATH}")

    df_out = pd.DataFrame(X_scaled, columns=SELECTED_FEATURES)
    df_out['Outcome'] = y.values
    df_out.to_csv(PROCESSED_DATA_PATH, index=False)
    print(f"Processed data saved: {PROCESSED_DATA_PATH}  shape={df_out.shape}")

if __name__ == '__main__':
    preprocess_data()