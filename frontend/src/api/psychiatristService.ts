import axios from "axios";
import {
  EmotionData,
  PrescriptionData,
  AnalysisResponse,
  PrescriptionResponse,
} from "../types/psychiatristTypes";
import {
  createAnalysisPrompt,
  createPrescriptionPrompt,
} from "../utils/promptHelpers";
import { retrieveSimilarContent } from "./ragService";
import { generateAIResponse } from "./llmService";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const analyzeEmotions = async (
  emotionData: EmotionData
): Promise<AnalysisResponse> => {
  try {
    // Backend call approach
    const response = await axios.post(`${API_BASE_URL}/analyze`, emotionData);
    return response.data;

    /* 
    // Alternative: Frontend processing approach
    // This would move logic to the frontend, but might not be ideal for production
    
    const query = `Mental health assessment for patient with ${emotionData.combined_emotion} emotion, age ${emotionData.patient_age}, gender ${emotionData.patient_gender}, symptoms for ${emotionData.symptom_duration}`;
    const relevantInformation = await retrieveSimilarContent({ 
      query, 
      emotion: emotionData.combined_emotion 
    });
    
    const prompt = createAnalysisPrompt(
      emotionData.facial_emotion || 'Unknown',
      emotionData.facial_confidence || 0,
      emotionData.speech_emotion || 'Unknown',
      emotionData.speech_confidence || 0,
      emotionData.combined_emotion || 'Unknown',
      emotionData.combined_confidence || 0,
      emotionData.patient_age || 'Unknown',
      emotionData.patient_gender || 'Unknown',
      emotionData.symptom_duration || 'Unknown',
      emotionData.additional_notes || '',
      relevantInformation
    );
    
    const result = await generateAIResponse(prompt);
    result.timestamp = new Date().toISOString();
    return result;
    */
  } catch (error) {
    console.error("Error analyzing emotions:", error);
    throw error;
  }
};

export const generatePrescription = async (
  prescriptionData: PrescriptionData
): Promise<PrescriptionResponse> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/generate_prescription`,
      prescriptionData
    );
    return response.data;
  } catch (error) {
    console.error("Error generating prescription:", error);
    throw error;
  }
};
