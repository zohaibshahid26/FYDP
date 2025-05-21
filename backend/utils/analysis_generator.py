import cohere
import os
import numpy as np

def generate_cohere_analysis(ecg_signal, pred_class,class_map):
    cohere_api_key = os.getenv("COHERE_API_KEY")
    co = cohere.Client(cohere_api_key)
    diagnosis = class_map[pred_class]

    prompt = f"""
You are a professional clinical cardiologist writing a report for a patient's ECG. The ECG signal has been automatically classified as: {diagnosis}.

Based on this classification and the following signal features:
- Duration: 10 seconds
- Mean amplitude: {np.mean(ecg_signal):.2f}
- Signal variability (standard deviation): {np.std(ecg_signal):.2f}

Write a comprehensive clinical report in the following format:

---
Clinical Analysis:  
[Brief summary of diagnosis.]

Explanation:  
[Explain what this classification means, how it is identified on an ECG, and its medical significance.]

Implications and Causes:  
[List the possible causes for this condition and what it could imply about the patient’s cardiac health.]

Recommended Diagnostic Tests:
[Suggest further tests or evaluations needed for confirmation or broader understanding.]

Management and Emergency Actions:
[Suggest if immediate medical action is needed and what follow-up or treatment plan is advised.]

Use clear, clinical language suitable for a medical report. Be concise yet informative. Avoid repetition.Don't cold anything and response should be in formatted way.
---
    """

    try:
        response = co.generate(
            model="command-r-plus",
            prompt=prompt,
            max_tokens=800,
            temperature=0.3,
            stop_sequences=["---"]
        )
        return response.generations[0].text.strip()
    except Exception as e:
        return f"⚠️ Error generating analysis: {str(e)}"
