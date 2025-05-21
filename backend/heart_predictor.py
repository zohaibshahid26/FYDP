# heart_predictor.py

import os
import numpy as np
import pandas as pd
import tensorflow as tf
import cohere
from dotenv import load_dotenv
from sklearn.preprocessing import StandardScaler
from utils.heart_feature_descriptions import feature_descriptions

# Load environment variables and Cohere API key
load_dotenv()
cohere_api_key = os.getenv("COHERE_API_KEY")
if not cohere_api_key:
    raise ValueError("COHERE_API_KEY not found in .env")

# Load the trained model
model = tf.keras.models.load_model("models/cad_model.keras")

# Prepare the scaler using standard ranges (optional: load from file)
scaler = StandardScaler()
# These are typical CAD features; exact stats are usually learned during training
# For demo purposes, you could manually set mean/std for each feature or use a training set
# Here, we expect front-end to send already validated inputs, so just fit to dummy example
example_data = pd.DataFrame([[0]*13], columns=feature_descriptions.keys())
scaler.fit(example_data)

def predict_cad(input_data: dict):
    
    user_df = pd.DataFrame([input_data])
    scaled_input = scaler.transform(user_df)
    prediction = model.predict(scaled_input)[0][0]
    diagnosis = "Coronary Artery Disease (CAD)" if prediction > 0.5 else "No CAD"
    return prediction, diagnosis, user_df

def get_medical_analysis(diagnosis: str, user_df: pd.DataFrame) -> str:
    co = cohere.Client(cohere_api_key)

    if diagnosis == "Coronary Artery Disease (CAD)":
        prompt = f"""
        Act as a professional cardiologist. A patient with these health indicators has been predicted to have Coronary Artery Disease (CAD).
        Patient Data: {user_df.iloc[0].to_dict()}

        Please provide a concise 250-word medical analysis.
        Include the following points:

        1. Key risk factors based on the provided data.
        2. 3 practical lifestyle changes the patient should follow to improve their heart health.
        3. 3 suggested clinical follow-ups or diagnostic tests that are recommended for this patient.
        """
    else:
        prompt = f"""
        Act as a professional cardiologist. A patient with these health indicators has been predicted to have no Coronary Artery Disease (No CAD).
        Patient Data: {user_df.iloc[0].to_dict()}

        Please provide a concise 250-word medical analysis emphasizing the good prognosis and preventive care. Don't cold anything and response should be in formatted way.
        Include the following points:

        1. Key healthy indicators based on the provided data.
        2. 3 practical lifestyle recommendations to maintain heart health.
        3. 3 suggested routine clinical follow-ups or diagnostic tests to monitor the patient's heart condition.
        """

    response = co.generate(
        model='command-r-plus',
        prompt=prompt,
        max_tokens=500,
        temperature=0.8
    )
    model_respnose=response.generations[0].text.strip()

    return model_respnose
