import cohere
import os

def generate_cohere_analysis_heart(patient_info, risk, prob, top_factors):
    print("This is File cohere")
    cohere_api_key = os.getenv("COHERE_API_KEY")
    co = cohere.Client(cohere_api_key)

    prompt = f"""
You are a professional cardiologist.

Patient details:
{patient_info}

Predicted risk of heart disease: {risk} ({prob*100:.1f}% probability).

Top contributing factors: {', '.join(top_factors)}

Please provide a detailed clinical analysis covering:
1. Clinical significance of the predicted risk.
2. Pathophysiological connections to the features.
3. Recommended interventions and lifestyle changes.
4. Suggestions for monitoring and follow-up.
5. Don't cold anything and response should be in formatted way.
"""

    try:
        response = co.generate(
            model='command-r-plus',
            prompt=prompt,
            max_tokens=400,
            temperature=0.3
        )
        model_response=response.generations[0].text.strip()
        print(f"model_response={model_response}")
        return model_response
    except Exception as e:
        Print("Cohere Exception")
        return f"⚠️ Cohere error: {e}"
