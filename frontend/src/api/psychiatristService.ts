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
