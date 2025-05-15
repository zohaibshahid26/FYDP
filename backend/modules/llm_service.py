"""
LLM Service Module
Handles all interactions with the Gemini AI model
"""

import os
import json
import time
from google import genai
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Configure the Google API client
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
if GOOGLE_API_KEY:
    client = genai.Client(api_key=GOOGLE_API_KEY)
else:
    logger.error("GOOGLE_API_KEY not found in environment variables")

def generate_gemini_response(prompt, model="gemini-2.0-flash", temperature=0.3):
    """
    Helper function to generate responses from Gemini AI - always generates fresh responses
    
    Args:
        prompt (str): The prompt to send to Gemini
        model (str): The model to use
        temperature (float): Controls randomness (0.0-1.0)
        
    Returns:
        dict: Parsed JSON response or error message
    """
    try:
        start_time = time.time()
        logger.info(f"Generating fresh response using {model} with temperature {temperature}")
        
        response = client.models.generate_content(
            model=model,
            contents=prompt,
            config={
                "temperature": temperature,
                "max_output_tokens": 2048,
                "response_mime_type": "application/json",
                "top_p": 0.95,
                "top_k": 40,
            }
        )
        
        # Parse the response as JSON
        response_text = response.text.strip()
        
        # Sometimes the API returns text with markdown code blocks
        if response_text.startswith("```json") and response_text.endswith("```"):
            response_text = response_text[7:-3].strip()
        
        result = json.loads(response_text)
        
        logger.info(f"Generated response in {time.time() - start_time:.2f} seconds")
        
        return result
    except Exception as e:
        logger.error(f"Error generating response: {str(e)}")
        return {"error": str(e)}
