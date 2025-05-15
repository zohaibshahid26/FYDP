
# Regular imports
from flask import Flask, request, render_template, jsonify
from flask_cors import CORS  
import os
from modules.llm_service import generate_gemini_response
from modules.rag_service import retrieve_similar_content, load_conversation_dataset
from modules.prompts import create_analysis_prompt, create_prescription_prompt
from datetime import datetime
from dotenv import load_dotenv
app = Flask(__name__)
# Enable CORS for all routes and origins
CORS(app, resources={r"/*": {"origins": "*"}})
    
load_dotenv()  
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("Please set the GOOGLE_API_KEY environment variable.")

@app.route('/retrieve_content', methods=['POST'])
def retrieve_content():
    data = request.json
    query = data.get('query', '')
    emotion = data.get('emotion', None)
    
    try:
        content = retrieve_similar_content(query, emotion)
        return jsonify({
            'content': content,
            'query': query,
            'emotion': emotion
        })
    except Exception as e:
        return jsonify({
            'error': str(e),
            'message': 'Error retrieving content'
        }), 500

@app.route('/analyze', methods=['POST'])
def analyze_emotions():
    data = request.json
    
    # Get emotion data
    facial_emotion = data.get('facial_emotion', 'Unknown')
    facial_confidence = data.get('facial_confidence', 0)
    speech_emotion = data.get('speech_emotion', 'Unknown')
    speech_confidence = data.get('speech_confidence', 0)
    combined_emotion = data.get('combined_emotion', 'Unknown')
    combined_confidence = data.get('combined_confidence', 0)
    
    # Additional information (optional)
    patient_age = data.get('patient_age', 'Unknown')
    patient_gender = data.get('patient_gender', 'Unknown')
    symptom_duration = data.get('symptom_duration', 'Unknown')
    additional_notes = data.get('additional_notes', '')
    
    # Retrieve relevant mental health information
    query = f"Mental health assessment for patient with {combined_emotion} emotion, age {patient_age}, gender {patient_gender}, symptoms for {symptom_duration}"
    relevant_information = retrieve_similar_content(query, emotion=combined_emotion)
    
    # Create the enhanced psychiatric prompt
    prompt = create_analysis_prompt(
        facial_emotion, facial_confidence,
        speech_emotion, speech_confidence,
        combined_emotion, combined_confidence,
        patient_age, patient_gender, symptom_duration,
        additional_notes, relevant_information
    )
    
    # Generate response from Gemini
    try:
        result = generate_gemini_response(prompt)
        
        if "error" in result:
            return jsonify({
                'error': f"Failed to generate analysis: {result['error']}",
                'timestamp': datetime.now().isoformat()
            }), 500
        
        # Ensure all expected fields are present
        expected_fields = ["mental_health_assessment", "differential_diagnosis", "condition", 
                          "severity", "recommendations", "therapy_options", "follow_up", 
                          "risk_assessment", "prognosis"]
        
        for field in expected_fields:
            if field not in result:
                if field in ["recommendations", "therapy_options"]:
                    result[field] = []
                else:
                    result[field] = "Not provided"
                    
        # Add medication_considerations if not present
        if "medication_considerations" not in result:
            result["medication_considerations"] = []
            
        # Add timestamp to the result - use ISO format for better frontend parsing
        result['timestamp'] = datetime.now().isoformat()
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({
            'error': f"Failed to generate analysis: {str(e)}",
            'timestamp': datetime.now().isoformat()
        }), 500

@app.route('/generate_prescription', methods=['POST'])
def generate_prescription():
    data = request.json
    
    # Get patient and analysis data
    patient_name = data.get('patient_name', 'Unknown Patient')
    patient_age = data.get('patient_age', 'Unknown')
    patient_gender = data.get('patient_gender', 'Unknown')
    mental_assessment = data.get('mental_assessment', {})
    
    # Get diagnosis or condition for better retrieval
    condition = mental_assessment.get('condition', '') or mental_assessment.get('differential_diagnosis', '')
    
    # Retrieve relevant treatment information
    query = f"Treatment recommendations for {condition} patient, age {patient_age}, gender {patient_gender}"
    relevant_information = retrieve_similar_content(query)
    
    # Create the enhanced prescription prompt
    prompt = create_prescription_prompt(
        patient_name, patient_age, patient_gender, 
        mental_assessment, relevant_information
    )
    
    # Generate response from Gemini
    try:
        prescription = generate_gemini_response(prompt)
        
        if "error" in prescription:
            return jsonify({
                'error': f"Failed to generate prescription: {prescription['error']}",
                'generation_date': datetime.now().strftime("%Y-%m-%d")
            }), 500
        
        # Add patient information to the response for better frontend display
        prescription['patient_information'] = {
            'name': patient_name,
            'age': patient_age,
            'gender': patient_gender
        }
        
        # Add condition from mental assessment if available
        if mental_assessment and 'condition' in mental_assessment:
            prescription['condition'] = mental_assessment['condition']
            
        # Add generated date
        prescription['generation_date'] = datetime.now().strftime("%Y-%m-%d")
        
        return jsonify(prescription)
    
    except Exception as e:
        return jsonify({
            'error': f"Failed to generate prescription: {str(e)}",
            'generation_date': datetime.now().strftime("%Y-%m-%d")
        }), 500

# Add a direct LLM testing endpoint that might be useful for debugging
@app.route('/generate_ai_response', methods=['POST'])
def generate_ai_response():
    data = request.json
    prompt = data.get('prompt', '')
    
    if not prompt:
        return jsonify({'error': 'No prompt provided'}), 400
        
    try:
        result = generate_gemini_response(prompt)
        return jsonify(result)
    except Exception as e:
        return jsonify({
            'error': str(e),
            'message': 'Error generating AI response'
        }), 500

# Initialize RAG system on startup - use werkzeug's before_first_request instead
# as Flask's decorator is deprecated in newer versions
def initialize_rag():
    print("Initializing RAG system...")
    try:
        load_conversation_dataset()
        print("RAG system initialized successfully!")
    except Exception as e:
        print(f"Error initializing RAG system: {e}")
        # Continue anyway, as this might not be critical

# Register the initialization function
with app.app_context():
    initialize_rag()

if __name__ == '__main__':
    # Use 0.0.0.0 to make the server externally visible
    # This is useful for development and testing
    app.run(debug=True, host='0.0.0.0', port=5000)
