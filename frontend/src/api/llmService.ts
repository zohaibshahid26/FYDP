import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

// This function mimics the generate_gemini_response functionality
export const generateAIResponse = async (prompt: string): Promise<any> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/generate_ai_response`, {
      prompt,
    });
    return response.data;
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw error;
  }
};
