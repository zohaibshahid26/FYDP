import {
  EmotionData,
  AnalysisResponse,
  GeneratePrescriptionInput,
  TreatmentResponse,
  ChatRequestPayload,
  ChatResponse,
  ChatWithFileRequestPayload, // Added
  ChatWithFileResponse, // Added
} from "@/types/psychiatristTypes";

// Base URL for API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Upload and analyze a video for emotional assessment
 */
export const analyzeVideo = async (
  videoFile: File,
  patientInfo: any
): Promise<AnalysisResponse> => {
  try {
    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("patient_info", JSON.stringify(patientInfo));

    const response = await fetch(`${API_BASE_URL}/analyze_video`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: "Network response was not ok and error details are unavailable",
      }));
      throw new Error(
        errorData.error || `Server responded with status ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error analyzing video:", error);
    throw error;
  }
};

/**
 * Generate a treatment plan based on analysis results
 */
export const generateTreatmentPlan = async (
  data: any
): Promise<TreatmentResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/generate_prescription`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: "Network response was not ok and error details are unavailable",
      }));
      throw new Error(
        errorData.error ||
          `Failed to generate prescription: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error generating treatment plan:", error);
    throw error;
  }
};

/**
 * Generate a prescription based on input data
 */
export async function generatePrescription(
  data: GeneratePrescriptionInput
): Promise<TreatmentResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/generate_prescription`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: "Network response was not ok and error details are unavailable",
      }));
      throw new Error(
        errorData.error ||
          `Failed to generate prescription: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error generating prescription:", error);
    throw error;
  }
}

/**
 * Download a PDF report for the analysis or treatment plan
 */
export const downloadPdfReport = async (
  reportType: string,
  reportData: any
): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/generate_pdf_report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        report_type: reportType,
        report_data: reportData,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.error || `Failed to download PDF: ${response.statusText}`
      );
    }

    // Get the blob from the response
    const blob = await response.blob();

    // Create a temporary URL for the blob
    const url = window.URL.createObjectURL(blob);

    // Create a temporary link element
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;

    // Get the filename from the Content-Disposition header if available
    const contentDisposition = response.headers.get("Content-Disposition");
    let filename = `${reportType}_report.pdf`;

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/i);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1];
      }
    }

    a.download = filename;
    document.body.appendChild(a);
    a.click();

    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error("Error downloading PDF report:", error);
    throw error;
  }
};

// Chat message function
export async function sendChatMessage(
  message: string,
  userName: string,
  chatHistory: any[] = []
) {
  try {
    // Verify the API URL is properly set
    const apiUrl = `${API_BASE_URL}/chat`;
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
