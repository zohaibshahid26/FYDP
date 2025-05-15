// These functions create structured prompts for analysis and prescription generation

export const createAnalysisPrompt = (
  facialEmotion: string,
  facialConfidence: number,
  speechEmotion: string,
  speechConfidence: number,
  combinedEmotion: string,
  combinedConfidence: number,
  patientAge: string | number,
  patientGender: string,
  symptomDuration: string,
  additionalNotes: string,
  relevantInformation: string
): string => {
  return `
    As an AI psychiatrist assistant, please analyze the following patient data:
    
    EMOTIONAL ASSESSMENT:
    - Facial Expression: ${facialEmotion} (Confidence: ${facialConfidence}%)
    - Speech Emotion: ${speechEmotion} (Confidence: ${speechConfidence}%)
    - Combined Emotional State: ${combinedEmotion} (Confidence: ${combinedConfidence}%)
    
    PATIENT INFORMATION:
    - Age: ${patientAge}
    - Gender: ${patientGender}
    - Symptom Duration: ${symptomDuration}
    - Additional Notes: ${additionalNotes}
    
    REFERENCE INFORMATION:
    ${relevantInformation}
    
    Please provide a comprehensive psychiatric assessment including:
    1. Mental health assessment
    2. Possible differential diagnosis 
    3. Likely primary condition
    4. Severity assessment
    5. Recommendations for treatment
    6. Therapy options
    7. Follow-up timeline
    8. Risk assessment
    9. Prognosis
    10. Medication considerations (if appropriate)
    
    Format your response as a structured JSON object with these fields.
  `;
};

export const createPrescriptionPrompt = (
  patientName: string,
  patientAge: string | number,
  patientGender: string,
  mentalAssessment: any,
  relevantInformation: string
): string => {
  return `
    As an AI psychiatrist assistant, please generate a comprehensive treatment plan for:
    
    PATIENT INFORMATION:
    - Name: ${patientName}
    - Age: ${patientAge}
    - Gender: ${patientGender}
    
    PSYCHIATRIC ASSESSMENT:
    - Primary Condition: ${mentalAssessment.condition || "Not specified"}
    - Differential Diagnosis: ${
      mentalAssessment.differential_diagnosis || "Not specified"
    }
    - Severity: ${mentalAssessment.severity || "Not specified"}
    
    REFERENCE INFORMATION:
    ${relevantInformation}
    
    Please provide a detailed treatment plan including:
    1. Recommended medications (if appropriate)
    2. Dosage instructions
    3. Comprehensive treatment plan
    4. Follow-up instructions
    5. Additional recommendations
    
    Format your response as a structured JSON object with these fields.
  `;
};
