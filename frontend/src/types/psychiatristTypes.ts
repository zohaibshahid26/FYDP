export interface EmotionData {
  facial_emotion?: string;
  facial_confidence?: number;
  speech_emotion?: string;
  speech_confidence?: number;
  combined_emotion?: string;
  combined_confidence?: number;
  patient_age?: string | number;
  patient_gender?: string;
  symptom_duration?: string;
  additional_notes?: string;
}

export interface PrescriptionData {
  patient_name: string;
  patient_age: string | number;
  patient_gender: string;
  mental_assessment: {
    condition?: string;
    differential_diagnosis?: string;
    severity?: string;
    [key: string]: any;
  };
}

export interface AnalysisResponse {
  mental_health_assessment: string;
  differential_diagnosis: string;
  condition: string;
  severity: string;
  recommendations: string[];
  therapy_options: string[];
  follow_up: string;
  risk_assessment: string;
  prognosis: string;
  medication_considerations?: string[];
  timestamp: string;
  error?: string;
}

export interface PrescriptionResponse {
  generation_date: string;
  medications?: string[];
  dosage_instructions?: string;
  treatment_plan?: string;
  follow_up_instructions?: string;
  additional_recommendations?: string[];
  [key: string]: any;
  error?: string;
}
