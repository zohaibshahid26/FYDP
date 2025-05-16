// Types for emotion analysis data
export interface EmotionData {
  patient_name: string; // Added patient name field
  facial_emotion: string;
  facial_confidence: number;
  speech_emotion: string;
  speech_confidence: number;
  combined_emotion: string;
  combined_confidence: number;
  patient_age: string;
  patient_gender: string;
  symptom_duration: string;
  additional_notes: string;
}

// Types for analysis response
export interface AnalysisResponse {
  patient_information?: {
    name: string;
    age: string;
    gender: string;
    assessment_date: string;
  };
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
}

// Types for prescription data
export interface PrescriptionData {
  patient_name: string;
  patient_age: string;
  patient_gender: string;
  mental_assessment: Record<string, any>;
}

// Types for prescription response
export interface PrescriptionResponse {
  prescription_title?: string;
  patient_information?: {
    name: string;
    age: string;
    gender: string;
  };
  condition?: string;
  medications?: string[];
  dosage_instructions?: string;
  treatment_plan?: any;
  follow_up_instructions?: string;
  additional_recommendations?: string[];
  generation_date: string;
}
