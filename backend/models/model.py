import os
import json
import pickle
import numpy as np
from tensorflow.keras.models import load_model

MODEL_DIR = "models"

model = load_model(os.path.join(MODEL_DIR, "heart_disease_model.keras"))
scaler_mean = np.load(os.path.join(MODEL_DIR, "scaler_mean.npy"))
scaler_scale = np.load(os.path.join(MODEL_DIR, "scaler_scale.npy"))

with open(os.path.join(MODEL_DIR, "encoder_categories.pkl"), "rb") as f:
    encoder_categories = pickle.load(f)

with open(os.path.join(MODEL_DIR, "preprocessing_info.json"), "r") as f:
    prep_info = json.load(f)
