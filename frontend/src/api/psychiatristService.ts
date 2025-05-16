import {
  EmotionData,
  AnalysisResponse,
  PrescriptionData,
  PrescriptionResponse,
} from "@/types/psychiatristTypes";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Analyze emotions function
export async function analyzeEmotions(
  data: EmotionData
): Promise<AnalysisResponse> {
  try {
    const response = await fetch(`${API_URL}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to analyze emotions");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error in analyzeEmotions:", error);
    throw new Error(error.message || "Failed to analyze emotions");
  }
}

// Generate prescription function
export async function generatePrescription(
  data: PrescriptionData
): Promise<PrescriptionResponse> {
  try {
    const response = await fetch(`${API_URL}/generate_prescription`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate prescription");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error in generatePrescription:", error);
    throw new Error(error.message || "Failed to generate prescription");
  }
}

// Conversation retrieval function
export async function retrieveContent(
  query: string,
  emotion: string | null = null
) {
  try {
    const response = await fetch(`${API_URL}/retrieve_content`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, emotion }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to retrieve content");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error in retrieveContent:", error);
    throw new Error(error.message || "Failed to retrieve content");
  }
}

// Chat message function
export async function sendChatMessage(
  message: string,
  userName: string,
  chatHistory: any[] = []
) {
  try {
    // Verify the API URL is properly set
    const apiUrl = `${API_URL}/chat`;
    console.log(`Sending request to: ${apiUrl}`);

    // Format chat history properly
    const formattedHistory = chatHistory.map((msg) => ({
      sender: msg.sender,
      content: msg.content,
    }));

    const requestBody = {
      message,
      user_name: userName,
      chat_history: formattedHistory,
    };

    console.log("Request payload:", JSON.stringify(requestBody));

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      mode: "cors", // Explicitly set CORS mode
      body: JSON.stringify(requestBody),
    });

    console.log(`Response status: ${response.status} ${response.statusText}`);

    // We'll handle any response that we get back, even errors
    const data = await response.json();

    // If the server returned an error message but with a 200 status
    if (data && data.error) {
      console.warn("Server reported error:", data.error);
      return {
        message:
          data.message || "Sorry, I encountered an error. Please try again.",
        error: data.error,
      };
    }

    // Check if we have a valid response structure
    if (
      !data ||
      (typeof data.message !== "string" && typeof data.message !== "object")
    ) {
      console.warn("Unexpected response format:", data);
      return {
        message:
          "Sorry, I received an unexpected response format. Please try again.",
        error: "Invalid response format",
      };
    }

    return data;
  } catch (error: any) {
    console.error("Error in sendChatMessage:", error);
    return {
      message:
        "Sorry, I couldn't process your message right now. Please check your connection and try again.",
      error: error.message || "Failed to communicate with the server",
    };
  }
}
