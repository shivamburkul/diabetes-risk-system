import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from xgboost import XGBClassifier
import joblib
import os

# Create synthetic dataset
num_samples = 1000  # adjust as needed
num_questions = 22

# Random integer responses 0-3 for each question
X = np.random.randint(0, 4, size=(num_samples, num_questions))

# Expert rules: sum responses and classify
# 0-20: Low, 21-40: Moderate, 41+: High
y = []
for row in X:
    total = row.sum()
    if total <= 20:
        y.append("Low")
    elif total <= 40:
        y.append("Moderate")
    else:
        y.append("High")

y = np.array(y)

# Encode labels
le = LabelEncoder()
y_encoded = le.fit_transform(y)

# Train XGBoost
model = XGBClassifier(use_label_encoder=False, eval_metric="mlogloss")
model.fit(X, y_encoded)

# Create models directory
os.makedirs("models", exist_ok=True)

# Save model and label encoder
joblib.dump(model, "models/prediabetes_model.pkl")
joblib.dump(le, "models/label_encoder.pkl")

print("Training complete. Model and label encoder saved in 'models/'")
