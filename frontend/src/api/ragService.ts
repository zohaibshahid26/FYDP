import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

interface RetrievalParams {
  query: string;
  emotion?: string;
}

// This function mimics the retrieve_similar_content functionality
export const retrieveSimilarContent = async ({
  query,
  emotion,
}: RetrievalParams): Promise<string> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/retrieve_content`, {
      query,
      emotion,
    });
    return response.data.content;
  } catch (error) {
    console.error("Error retrieving similar content:", error);
    return "Unable to retrieve relevant information.";
  }
};
