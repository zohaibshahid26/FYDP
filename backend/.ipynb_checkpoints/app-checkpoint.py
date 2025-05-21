# Regular imports
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS  
import os
import logging
from modules.llm_service import generate_gemini_response
from modules.rag_service import retrieve_similar_content, load_conversation_dataset
from modules.prompts import create_analysis_prompt, create_prescription_prompt, create_chat_prompt
from modules.report_service import generate_pdf_report
from datetime import datetime
from dotenv import load_dotenv
from io import BytesIO
import base64
from werkzeug.utils import secure_filename
from google import genai
import json
import speech_recognition as sr  # Import SpeechRecognition
from fall_detection import process_video_for_fall_detection  # Added

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Configure CORS properly - ensure credentials are supported and all origins
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

# Define upload and output directories
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
FALL_DETECTION_OUTPUT_FOLDER = os.path.join(os.getcwd(), 'static', 'fall_detection_outputs')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(FALL_DETECTION_OUTPUT_FOLDER, exist_ok=True)

# Serve static files from the 'static' directory
app.static_folder = 'static'

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

client = genai.Client(api_key=GOOGLE_API_KEY)

# Define allowed file types
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'txt', 'docx', 'doc'}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def upload_file(file):
    """
    Upload a file to Gemini's file API
    
    Args:
        file: Flask FileStorage object
        
    Returns:
        str: File name in Gemini's system
    """
    # Save the file temporarily to disk
    temp_path = os.path.join('uploads', secure_filename(file.filename))
    os.makedirs('uploads', exist_ok=True)
    
    try:
        file.save(temp_path)
        # Now upload the file from the temporary location
        with open(temp_path, 'rb') as f:
            uploaded_file = client.files.upload(
                file=f,
                config={
                    'mime_type': file.content_type,
                }
            )
        
        return uploaded_file
    finally:
        # Always clean up the temporary file
        if os.path.exists(temp_path):
            os.remove(temp_path)

def delete_file(file):
    myfile = client.files.get(name=file)
    if myfile:
        client.files.delete(name=myfile.name)
        return True
    return False

def process_file_with_gemini(file, user_message, user_name):
    """
    Process a file with Gemini's multimodal capabilities
    
    Args:
        file_path: Path to the uploaded file
        user_message: Message from the user about the file
        user_name: Name of the user
        
    Returns:
        dict: Response from Gemini
    """
    try:
        # Create a targeted prompt for document analysis that includes user context
        system_prompt = f"""You are a helpful mental health AI assistant that can analyze documents, images, 
        and files. You're currently helping {user_name} who asked: "{user_message}"

        When analyzing this file:
        1. First describe what you see in the document or image briefly
        2. Extract relevant information particularly related to mental health, medical concepts, or personal data
        3. Organize your analysis in a clear, structured way
        4. If it's a medical document, highlight key findings, diagnoses, or recommendations
        5. For personal notes or journals, identify emotional themes or concerns
        6. Address {user_name}'s specific question or request about this file: "{user_message}"
        
        Respond in a professional, supportive manner appropriate for a mental health context.
        Be empathetic but maintain clinical accuracy. If the content is sensitive, acknowledge that 
        and be respectful. Address {user_name} directly in your response.
        """
        
        # Generate response from Gemini using multimodal capabilities
        logger.info(f"Processing file for {user_name} with message: {user_message}")
        print(f"File name: {file}")
        response = client.models.generate_content(
            model="gemini-2.0-flash", 
            contents=[
                system_prompt, file
            ],
            config={
                "temperature": 0.3,
                "max_output_tokens": 2048,
            }
        )
        
        return {
            'success': True,
            'message': response.text,
            'filename': file.name,
        }
    
    except Exception as e:
        logger.exception(f"Error processing file with Gemini: {str(e)}")
        return {
            'success': False,
            'error': str(e),
            'message': f"I'm sorry {user_name}, I encountered an issue while analyzing this file."
        }

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
    
    # Retrieve relevant mental health information
    query = f"Mental health assessment for patient with {combined_emotion} emotion, age {patient_age}, gender {patient_gender}"
    relevant_information = retrieve_similar_content(query, emotion=combined_emotion)
    
    # Create the enhanced psychiatric prompt
    prompt = create_analysis_prompt(
        patient_name,
        patient_age,
        patient_gender,
        emotion_analysis=f"Facial Emotion: {facial_emotion} (Confidence: {facial_confidence}), Speech Emotion: {speech_emotion} (Confidence: {speech_confidence}), Combined Emotion: {combined_emotion} (Confidence: {combined_confidence})",
        transcribed_text=None,
        relevant_information=relevant_information
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

@app.route('/chat_with_file', methods=['POST'])
def chat_with_file():
    """Process files along with chat messages for multimodal interaction"""
    try:
        # Check if request has the file part
        if 'file' not in request.files:
            return jsonify({
                'error': 'No file uploaded',
                'message': "I don't see any uploaded file. Please upload a document to discuss.",
                'timestamp': datetime.now().isoformat()
            }), 400
            
        file = request.files['file']
        
        # Check if the file is empty
        if file.filename == '':
            return jsonify({
                'error': 'No file selected',
                'message': "The uploaded file appears to be empty. Please select a valid file.",
                'timestamp': datetime.now().isoformat()
            }), 400
            
        # Get the message text and user details from form data
        user_message = request.form.get('message', 'Tell me about this file')
        user_name = request.form.get('user_name', 'Patient')
        
        # Check if file type is allowed
        if not allowed_file(file.filename):
            return jsonify({
                'error': 'File type not allowed',
                'message': f"Sorry, this file type isn't supported. Please upload a {', '.join(ALLOWED_EXTENSIONS)} file.",
                'timestamp': datetime.now().isoformat()
            }), 400
            
        # Upload the file to Gemini
        uploaded_file = upload_file(file)

        # Process the file with Gemini
        result = process_file_with_gemini(uploaded_file, user_message, user_name)
        
        # Delete the file after processing
        delete_file(uploaded_file)
            
        # Return the response
        if result['success']:
            return jsonify({
                'message': result['message'],
                'filename': result['filename'],
                'timestamp': datetime.now().isoformat()
            })
        else:
            return jsonify({
                'error': "Error processing file",
                'message': result['message'],
                'timestamp': datetime.now().isoformat()
            }), 500
            
    except Exception as e:
        logger.exception(f"Exception in chat_with_file endpoint: {str(e)}")
        return jsonify({
            'error': str(e),
            'message': "Something went wrong while processing your file. Please try again.",
            'timestamp': datetime.now().isoformat()
        }), 500

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

@app.route('/generate_pdf_report', methods=['POST'])
def generate_pdf():
    try:
        data = request.json
        report_type = data.get('report_type', 'analysis')  # 'analysis' or 'treatment'
        report_data = data.get('report_data', {})
        
        if not report_data:
            return jsonify({'error': 'No report data provided'}), 400
            
        # Generate PDF using the report_service
        pdf_buffer = generate_pdf_report(report_type, report_data)
        
        # Return the PDF as a response
        return send_file(
            BytesIO(pdf_buffer.getvalue()),
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f"{report_type}_report_{report_data.get('patient_information', {}).get('name', 'patient')}_{datetime.now().strftime('%Y%m%d')}.pdf"
        )
    except Exception as e:
        logger.exception(f"Error generating PDF: {str(e)}")
        return jsonify({
            'error': f"Failed to generate PDF: {str(e)}",
        }), 500

@app.route('/analyze_video', methods=['POST'])
def analyze_video_endpoint():
    try:
        logging.info("Received video analysis request")
        if 'video' not in request.files:
            return jsonify({
                'error': 'No video file provided',
                'timestamp': datetime.now().isoformat()
            }), 400

        video_file = request.files['video']
        patient_info = json.loads(request.form.get('patient_info', '{}'))
        patient_name = patient_info.get('patient_name', 'Anonymous Patient')
        patient_age = patient_info.get('patient_age', 'Unknown')
        patient_gender = patient_info.get('patient_gender', 'Unknown')

        if video_file.filename == '':
            return jsonify({
                'error': 'No video file selected',
                'timestamp': datetime.now().isoformat()
            }), 400

        upload_dir = os.path.join(os.getcwd(), 'uploads')
        os.makedirs(upload_dir, exist_ok=True)
        video_path = os.path.join(upload_dir, secure_filename(video_file.filename))
        video_file.save(video_path)
        logging.info(f"Video saved at: {video_path}")

        audio_path = 'audio.wav'
        ffmpeg_command = f'ffmpeg -y -i "{video_path}" -vn -acodec pcm_s16le -ar 16000 -ac 1 "{audio_path}"'
        os.system(ffmpeg_command)
        logging.info(f"Audio extracted to: {audio_path}")

        # --- Speech-to-Text ---
        transcribed_text = None
        if os.path.exists(audio_path):
            recognizer = sr.Recognizer()
            with sr.AudioFile(audio_path) as source:
                audio_data = recognizer.record(source)
                try:
                    transcribed_text = recognizer.recognize_google(audio_data)
                    logging.info(f"Transcribed text: {transcribed_text}")
                except sr.UnknownValueError:
                    logging.warning("Google Speech Recognition could not understand audio")
                    transcribed_text = "Audio not clear or no speech detected."
                except sr.RequestError as e:
                    logging.error(f"Could not request results from Google Speech Recognition service; {e}")
                    transcribed_text = "Speech recognition service unavailable."
        else:
            logging.warning(f"Audio file not found at {audio_path} for STT.")
            transcribed_text = "Audio extraction failed."
        # --- End Speech-to-Text ---

        from modules.combine import process_video
        resnet_pt_path = os.path.join(os.getcwd(), "models", "resnet101_emotion_latest.pt")
        wav2vec_pt_path = os.path.join(os.getcwd(), "models", "wav2vec_emotion_model.pt")

        logging.info("Processing video with emotion analysis models...")
        emotion_analysis = process_video(video_path, resnet_pt_path, wav2vec_pt_path)
        logging.info("Video processing complete")

        # Use the raw emotion_analysis output for the LLM prompt
        logger.info("Retrieving similar content for analysis")
        query = f"Mental health assessment for patient, age {patient_age}, gender {patient_gender}"
        relevant_information = retrieve_similar_content(query)

        # Pass only the raw emotion_analysis output to the prompt
        prompt = create_analysis_prompt(
            patient_name=patient_name,
            patient_age=patient_age,
            patient_gender=patient_gender,
            emotion_analysis=emotion_analysis,
            transcribed_text=transcribed_text,
            relevant_information=relevant_information
        )

        logger.info("Generating analysis from Gemini")
        result = generate_gemini_response(prompt)

        if "error" in result:
            return jsonify({
                'error': f"Failed to generate analysis: {result['error']}",
                'timestamp': datetime.now().isoformat(),
                'emotion_analysis': emotion_analysis
            }), 500

        expected_fields = ["mental_health_assessment", "differential_diagnosis", "condition", 
                          "severity", "recommendations", "therapy_options", "follow_up", 
                          "risk_assessment", "prognosis"]
        for field in expected_fields:
            if field not in result:
                if field in ["recommendations", "therapy_options"]:
                    result[field] = []
                else:
                    result[field] = "Not provided"

        if "patient_information" not in result:
            result["patient_information"] = {
                "name": patient_name,
                "age": patient_age,
                "gender": patient_gender,
                "assessment_date": datetime.now().strftime("%Y-%m-%d")
            }
        if "medication_considerations" not in result:
            result["medication_considerations"] = []

        result['timestamp'] = datetime.now().isoformat()
        result['emotion_analysis'] = emotion_analysis
        result['transcribed_text'] = transcribed_text  # Optionally include in the final API response

        try:
            os.remove(video_path)
            if os.path.exists(audio_path):
                os.remove(audio_path)
        except Exception as e:
            logger.warning(f"Error cleaning up temporary files: {str(e)}")

        return jsonify(result)

    except Exception as e:
        logger.exception(f"Error in analyze_video endpoint: {str(e)}")
        return jsonify({
            'error': f"Failed to analyze video: {str(e)}",
            'timestamp': datetime.now().isoformat()
        }), 500

@app.route('/fall_detection_video', methods=['POST'])
def fall_detection_video_endpoint():
    logger.info("Received request for /fall_detection_video")
    if 'video' not in request.files:
        logger.warning("No video file part in request")
        return jsonify({'error': 'No video file provided'}), 400

    file = request.files['video']
    if file.filename == '':
        logger.warning("No selected file in video part")
        return jsonify({'error': 'No selected file'}), 400

    if file:
        filename = secure_filename(file.filename)
        input_video_path = os.path.join(UPLOAD_FOLDER, filename)
        
        try:
            file.save(input_video_path)
            logger.info(f"Uploaded video saved to {input_video_path}")
        except Exception as e_save:
            logger.error(f"Error saving uploaded file {input_video_path}: {e_save}", exc_info=True)
            return jsonify({'error': f'Error saving uploaded file: {str(e_save)}'}), 500

        # Create a unique output filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        base, ext = os.path.splitext(filename)
        output_filename = f"output_{base}_{timestamp}{ext if ext else '.mp4'}"
        output_video_path = os.path.join(FALL_DETECTION_OUTPUT_FOLDER, output_filename)
        
        try:
            logger.info(f"Starting fall detection for {input_video_path}, output to {output_video_path}")
            fall_detected, error_msg = process_video_for_fall_detection(input_video_path, output_video_path)
            
            if error_msg:
                logger.error(f"Error processing video {input_video_path}: {error_msg}")
                if os.path.exists(input_video_path):
                    try:
                        os.remove(input_video_path)
                    except Exception as e_clean_err:
                        logger.warning(f"Could not remove uploaded file {input_video_path} after processing error: {e_clean_err}")
                return jsonify({'error': f'Error processing video: {error_msg}'}), 500

            logger.info(f"Fall detection complete for {input_video_path}. Fall detected: {fall_detected}")
            output_video_url = f"/static/fall_detection_outputs/{output_filename}"
            
            if os.path.exists(input_video_path):
                try:
                    os.remove(input_video_path)
                    logger.info(f"Removed uploaded input file: {input_video_path}")
                except Exception as e_clean:
                    logger.warning(f"Could not remove uploaded file {input_video_path}: {e_clean}")

            return jsonify({
                'output_video_url': output_video_url,
                'fall_detected': fall_detected,
                'message': 'Video processed successfully.'
            })
            
        except Exception as e:
            logger.error(f"Unexpected error in fall detection endpoint for {input_video_path}: {e}", exc_info=True)
            if os.path.exists(input_video_path):
                try:
                    os.remove(input_video_path)
                except Exception as e_clean_fatal:
                    logger.warning(f"Could not remove uploaded file {input_video_path} during fatal error handling: {e_clean_fatal}")
            return jsonify({'error': f'An unexpected error occurred: {str(e)}'}), 500
    
    logger.warning("File processing failed before reaching main try-except block.")
    return jsonify({'error': 'File processing failed'}), 500

# Initialize RAG system on startup
def initialize_rag():
    print("Initializing RAG system...")
    try:
        load_conversation_dataset()
        print("RAG system initialized successfully!")
    except Exception as e:
        print(f"Error initializing RAG system: {e}")

if not app.debug:
    with app.app_context():
        initialize_rag()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
