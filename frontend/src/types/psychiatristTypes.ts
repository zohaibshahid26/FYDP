// Types for emotion analysis data
export interface EmotionData {
  patient_name: string;
  patient_age: string;
  patient_gender: string;

  // These fields will now be populated by the video analysis
  facial_emotion?: string;
  facial_confidence?: number;
  speech_emotion?: string;
  speech_confidence?: number;
  combined_emotion?: string;
  combined_confidence?: number;
}

export interface PatientInformation {
  name: string;
  age: string;
  gender: string;
  assessment_date?: string;
}

export interface AnalysisResponse {
  patient_information?: PatientInformation; // PatientInformation already has assessment_date as optional
  mental_health_assessment: string;
  differential_diagnosis: string;
  condition: string;
  severity: string;
  recommendations: string[];
  therapy_options: string[];
  medication_considerations?: string[];
  follow_up: string;
  risk_assessment: string;
  prognosis: string;
  timestamp: string;
  emotion_analysis?: string; // Raw emotion analysis from video processing
}

// New type for the data sent to generate a prescription
export interface GeneratePrescriptionInput {
  patient_name: string;
  patient_age: string;
  patient_gender: string;
  mental_assessment: Partial<AnalysisResponse>; // Pass the relevant analysis data
}

export interface TreatmentResponse {
  prescription_title: string;
  patient_information?: PatientInformation;
  clinical_formulation: string;
  diagnosis: {
    primary: string;
    differential: string;
    contributing_factors: string[];
  };
  treatment_plan: {
    immediate_recommendations: string;
    psychotherapy: string;
    medication_considerations: string;
    lifestyle_modifications: string;
    self_care_strategies: string;
  };
  monitoring_plan: {
    follow_up: string;
    assessment_tools: string[];
    warning_signs: string[];
    treatment_milestones: string[];
  };
  medications: string[];
  dosage_instructions: string;
  follow_up_instructions: string;
  additional_recommendations: string[];
  generation_date?: string;
  condition?: string;
}

// New types for Chat functionality
export interface ChatMessage {
  sender: "user" | "assistant";
  content: string;
  timestamp?: string; // ISO string format
}

export interface ChatRequestPayload {
  message: string;
  user_name: string;
  chat_history: ChatMessage[];
  emotion?: string; // Optional
}

export interface ChatResponse {
  message: string; // The AI's reply
  timestamp: string; // ISO string format
  error?: string; // Optional error message from backend
  // If your backend returns the structured LLM response, you can add more fields here:
  // validation_and_empathy?: string;
  // therapeutic_insight?: string;
  // practical_support?: string;
  // reflection_and_exploration?: string;
  // invitation_to_continue?: string;
}

// New types for Chat with File functionality
export interface ChatWithFileRequestPayload {
  file: File;
  message: string; // User's message about the file
  user_name: string;
  // chat_history could also be included if needed for context with file uploads
}

export interface ChatWithFileResponse {
  message: string; // AI's response about the file
  filename?: string; // Name of the processed file (optional, from backend)
  timestamp: string; // ISO string format
  error?: string; // Optional error message
}
