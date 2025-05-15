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
        
        # Log the raw response for debugging
        logger.debug(f"Raw response: {response_text}")
        
        try:
            result = json.loads(response_text)
            
            # Handle case where result is a list instead of a dictionary
            if isinstance(result, list):
                logger.warning(f"Received list instead of dict: {result}")
                
                # If it's a non-empty list, convert it to a dictionary if possible
                if result and isinstance(result[0], dict):
                    logger.info("Converting list of dicts to a single dict (using first element)")
                    result = result[0]
                else:
                    # Create a dictionary wrapper for the list
                    logger.info("Wrapping list result in a dictionary")
                    result = {
                        "results": result,
                        "error": "Response was a list, expected a dictionary. Wrapped for compatibility."
                    }
            
            # Validate that result is now a dictionary
            if not isinstance(result, dict):
                logger.error(f"Invalid response format after conversion: expected dict, got {type(result)}")
                return {"error": "Invalid response format from AI model", "raw_type": str(type(result))}
            
            # Ensure arrays are properly initialized
            for field in ["recommendations", "therapy_options", "medication_considerations"]:
                if field in result and not isinstance(result[field], list):
                    logger.warning(f"Converting {field} to list: was {type(result[field])}")
                    # If the field exists but isn't a list, convert it to a list with one item
                    if result[field]:  # If not empty/null
                        result[field] = [result[field]]
                    else:
                        result[field] = []
            
            logger.info(f"Generated response in {time.time() - start_time:.2f} seconds")
            return result
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing error: {e}")
            logger.error(f"Problematic response text: {response_text}")
            # Try to clean up the response by removing any non-JSON content
            clean_response = response_text.split('```')[0].strip()
            if clean_response:
                try:
                    result = json.loads(clean_response)
                    # Check if the result is a list and handle it
                    if isinstance(result, list):
                        if result and isinstance(result[0], dict):
                            result = result[0]
                        else:
                            result = {"results": result}
                    return result
                except:
                    pass
            return {"error": f"Failed to parse response as JSON: {str(e)}", "raw_response": response_text[:500]}
            
    except Exception as e:
        logger.error(f"Error generating response: {str(e)}")
        return {"error": str(e)}
