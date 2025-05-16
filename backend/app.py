# Regular imports
from flask import Flask, request, jsonify
from flask_cors import CORS  
import os
import logging
from modules.llm_service import generate_gemini_response
from modules.rag_service import retrieve_similar_content, load_conversation_dataset
from modules.prompts import create_analysis_prompt, create_prescription_prompt, create_chat_prompt
from datetime import datetime
from dotenv import load_dotenv

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Configure CORS properly - ensure credentials are supported and all origins
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

# Add after_request handler to ensure CORS headers are set even for error responses
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response
    
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
    
    # Get patient identification info
    patient_name = data.get('patient_name', 'Anonymous Patient')
    patient_age = data.get('patient_age', 'Unknown')
    patient_gender = data.get('patient_gender', 'Unknown')
    
    # Get emotion data
    facial_emotion = data.get('facial_emotion', 'Unknown')
    facial_confidence = data.get('facial_confidence', 0)
    speech_emotion = data.get('speech_emotion', 'Unknown')
    speech_confidence = data.get('speech_confidence', 0)
    combined_emotion = data.get('combined_emotion', 'Unknown')
    combined_confidence = data.get('combined_confidence', 0)
    
    # Additional information
    symptom_duration = data.get('symptom_duration', 'Unknown')
    additional_notes = data.get('additional_notes', '')
    
    # Retrieve relevant mental health information
    query = f"Mental health assessment for patient with {combined_emotion} emotion, age {patient_age}, gender {patient_gender}, symptoms for {symptom_duration}"
    relevant_information = retrieve_similar_content(query, emotion=combined_emotion)
    
    # Create the enhanced psychiatric prompt
    prompt = create_analysis_prompt(
        patient_name,  # Added patient name as the first parameter
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
        
        # Ensure patient information is included
        if "patient_information" not in result:
            result["patient_information"] = {
                "name": patient_name,
                "age": patient_age,
                "gender": patient_gender,
                "assessment_date": datetime.now().strftime("%Y-%m-%d")
            }
        
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

@app.route('/chat', methods=['POST'])
def chat_with_ai():
    try:
        # Log that we received a request
        logger.info("Received chat request")
        
        # Check if request has JSON data
        if not request.is_json:
            logger.error("Request did not contain valid JSON")
            return jsonify({
                'error': 'Request must be JSON format',
                'timestamp': datetime.now().isoformat()
            }), 400
        
        data = request.json
        logger.info(f"Chat request data received: {data.keys()}")
        
        # Get message data
        user_message = data.get('message', '')
        user_name = data.get('user_name', 'Patient')
        emotion = data.get('emotion', None)  # Optional detected emotion
        chat_history = data.get('chat_history', [])  # Previous messages for context
        
        # Validate required fields
        if not user_message:
            logger.error("No message content provided")
            return jsonify({
                'error': 'Message content is required',
                'timestamp': datetime.now().isoformat()
            }), 400
        
        logger.info(f"Processing message from {user_name}, chat history length: {len(chat_history)}")
        
        # Ensure chat history is properly formatted if provided
        formatted_history = []
        if chat_history:
            # Limit history to last 10 messages to avoid token limits
            recent_history = chat_history[-10:]
            for msg in recent_history:
                role = "user" if msg.get('sender') == 'user' else "assistant"
                formatted_history.append({
                    "role": role, 
                    "content": msg.get('content', '')
                })
        
        # Retrieve relevant mental health information
        logger.info("Retrieving similar content for user message")
        query = user_message
        relevant_information = retrieve_similar_content(query, emotion=emotion)
        
        # Create the chat prompt
        logger.info("Creating chat prompt")
        prompt = create_chat_prompt(
            user_name=user_name,
            user_message=user_message,
            chat_history=formatted_history,
            relevant_information=relevant_information
        )
        
        # Generate response from Gemini
        logger.info("Generating response from Gemini")
        result = generate_gemini_response(prompt)
        
        if isinstance(result, dict) and "error" in result:
            logger.error(f"Gemini error: {result['error']}")
            return jsonify({
                'error': f"Failed to generate response: {result['error']}",
                'message': "I'm sorry, I couldn't process your message right now. Please try again later.",
                'timestamp': datetime.now().isoformat()
            }), 200  # Return 200 instead of 500 to avoid CORS issues
        
        # If the response is a plain string, format it accordingly
        if isinstance(result, str):
            response_text = result
        elif isinstance(result, dict) and "message" in result:
            response_text = result["message"]
        elif isinstance(result, dict) and "response" in result:
            response_text = result["response"]
        else:
            # As fallback, try to extract response from the model result
            logger.warning(f"Unexpected response format: {type(result)}")
            response_text = str(result.get("message", "I'm not sure how to respond to that."))
        
        logger.info("Successfully generated response")
        return jsonify({
            'message': response_text,
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        logger.exception(f"Exception in chat endpoint: {str(e)}")
        # Return a 200 with error message instead of 500 to avoid CORS issues
        return jsonify({
            'error': "An unexpected error occurred. Our team has been notified.",
            'message': "I'm sorry, but I couldn't process your message due to a technical issue. Please try again in a moment.",
            'timestamp': datetime.now().isoformat()
        }), 200

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
