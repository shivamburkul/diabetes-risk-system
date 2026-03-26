from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

# Load model and label encoder
model = joblib.load("models/prediabetes_model.pkl")
le = joblib.load("models/label_encoder.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json.get("answers", None)
    if data is None or len(data) != 22:
        return jsonify({"error": "Please provide 22 answers"}), 400

    X = np.array(data).reshape(1, -1)
    pred = model.predict(X)
    risk = le.inverse_transform(pred)[0]
    return jsonify({"risk": risk})

if __name__ == "__main__":
    app.run(port=5000, debug=True)
