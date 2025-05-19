import { FallDetectionResponse } from "@/types/fallDetectionTypes";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const uploadAndProcessFallDetectionVideo = async (
  videoFile: File
): Promise<FallDetectionResponse> => {
  const formData = new FormData();
  formData.append("video", videoFile);

  try {
    const response = await fetch(`${API_BASE_URL}/fall_detection_video`, {
      method: "POST",
      body: formData,
      // Headers are not strictly necessary for FormData with fetch, browser sets Content-Type
    });

    const responseData: FallDetectionResponse = await response.json();

    if (!response.ok) {
      // Use error message from backend if available, otherwise a generic one
      throw new Error(
        responseData.error || `Server responded with status ${response.status}`
      );
    }

    return responseData;
  } catch (error) {
    console.error("Error uploading video for fall detection:", error);
    // Ensure a consistent error structure for the caller
    if (error instanceof Error) {
      return {
        output_video_url: "", // Or handle appropriately
        fall_detected: false, // Default on error
        error: error.message,
      };
    }
    return {
      output_video_url: "",
      fall_detected: false,
      error: "An unknown error occurred during fall detection video upload.",
    };
  }
};
