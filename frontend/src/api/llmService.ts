import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

// This function mimics the generate_gemini_response functionality
export const generateAIResponse = async (prompt: string): Promise<any> => {
  try {
    // If you want to use Google's Gemini directly from the frontend (not recommended for production)
    // You would need to call their API directly

    // Instead, we'll proxy the request through our backend API
    const response = await axios.post(`${API_BASE_URL}/generate_ai_response`, {
      prompt,
    });
    return response.data;
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw error;
  }
};
