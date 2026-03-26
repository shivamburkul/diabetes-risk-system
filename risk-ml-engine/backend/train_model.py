import pandas as pd
import numpy as np
import pickle
import warnings
from xgboost import XGBClassifier
from sklearn.model_selection import StratifiedKFold, GridSearchCV, train_test_split
from sklearn.metrics import (f1_score, classification_report, confusion_matrix,
                             accuracy_score, roc_auc_score, roc_curve)
import os

warnings.filterwarnings("ignore", category=UserWarning)

SCRIPT_DIR          = os.path.dirname(os.path.abspath(__file__))
PROCESSED_DATA_PATH = os.path.join(SCRIPT_DIR, 'data', 'processed_data.csv')
MODEL_PATH          = os.path.join(SCRIPT_DIR, 'models', 'final_xgb_model.pkl')
THRESHOLD_PATH      = os.path.join(SCRIPT_DIR, 'models', 'threshold.pkl')

# --- 1. Load Data ---
try:
    data = pd.read_csv(PROCESSED_DATA_PATH)
    print(f"Processed data loaded. Shape: {data.shape}")
except FileNotFoundError:
    print(f"File not found: {PROCESSED_DATA_PATH}")
    print("Run preprocessing.py first.")
    exit()

X = data.drop('Outcome', axis=1)
y = data['Outcome']

print(f"\nDataset size: {len(data)} rows")
print(f"Class distribution:\n{y.value_counts()}")

# --- 2. Train/Test Split ---
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
print(f"\nTrain: {len(X_train)}  Test: {len(X_test)}")

# --- 3. Class weight (replaces SMOTE — better for large datasets + XGBoost) ---
neg = (y_train == 0).sum()
pos = (y_train == 1).sum()
spw = neg / pos
print(f"scale_pos_weight: {spw:.2f}")

# --- 4. Grid Search ---
xgb = XGBClassifier(
    random_state=42,
    eval_metric='auc',
    use_label_encoder=False,
    tree_method='hist',
    n_jobs=-1,
    scale_pos_weight=spw,
)

param_grid = {
    'n_estimators':     [300, 500],
    'learning_rate':    [0.05, 0.1],
    'max_depth':        [4, 6],
    'subsample':        [0.8, 0.9],
    'colsample_bytree': [0.8, 1.0],
    'min_child_weight': [1, 3],
    'gamma':            [0, 0.1],
}

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
grid = GridSearchCV(xgb, param_grid, scoring='roc_auc', cv=cv, verbose=2, n_jobs=-1)

print("\nStarting Grid Search (may take 15-30 min on full data)...")
grid.fit(X_train, y_train)
best = grid.best_estimator_

# --- 5. Threshold Optimisation (maximise F1 on train set) ---
y_proba_train = best.predict_proba(X_train)[:, 1]
_, _, thresholds = roc_curve(y_train, y_proba_train)
f1s = [f1_score(y_train, (y_proba_train >= t).astype(int), zero_division=0) for t in thresholds]
best_t = float(thresholds[np.argmax(f1s)])
print(f"Optimal threshold (F1): {best_t:.4f}")

# --- 6. Evaluate ---
y_proba_test  = best.predict_proba(X_test)[:, 1]
y_pred_default = best.predict(X_test)
y_pred_tuned   = (y_proba_test >= best_t).astype(int)

print("\n" + "="*70)
print("  XGBoost Training Complete — BRFSS 2015 (21 features)")
print("="*70)
print(f"Best CV AUC:        {grid.best_score_:.4f}")
print(f"Best params:        {grid.best_params_}")
print(f"\n-- Default threshold (0.5) --")
print(f"Accuracy : {accuracy_score(y_test, y_pred_default):.4f}")
print(f"F1       : {f1_score(y_test, y_pred_default):.4f}")
print(f"ROC-AUC  : {roc_auc_score(y_test, y_proba_test):.4f}")
print(f"\n-- Optimised threshold ({best_t:.4f}) --")
print(f"Accuracy : {accuracy_score(y_test, y_pred_tuned):.4f}")
print(f"F1       : {f1_score(y_test, y_pred_tuned):.4f}")
print(f"ROC-AUC  : {roc_auc_score(y_test, y_proba_test):.4f}")
print("\nClassification Report (tuned):")
print(classification_report(y_test, y_pred_tuned,
      target_names=['No Diabetes', 'Diabetes/Prediabetes']))
print("Confusion Matrix (tuned):")
print(confusion_matrix(y_test, y_pred_tuned))
print("="*70)

# --- 7. Save ---
os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
with open(MODEL_PATH, 'wb') as f:
    pickle.dump(best, f)
with open(THRESHOLD_PATH, 'wb') as f:
    pickle.dump(best_t, f)
print(f"\nModel saved    : {MODEL_PATH}")
print(f"Threshold saved: {THRESHOLD_PATH}  ({best_t:.4f})")