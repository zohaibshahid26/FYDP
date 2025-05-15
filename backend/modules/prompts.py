"""
Prompts Module
Contains all the templating logic for creating structured prompts for the LLM
"""

import json
from typing import List, Dict, Any
from datetime import date

def format_rag_context(relevant_information: List[Dict[str, Any]]) -> str:
    """
    Format retrieved information into a well-structured context for the LLM
    
    Args:
        relevant_information: List of retrieved documents with content and metadata
        
    Returns:
        str: Formatted context
    """
    if not relevant_information:
        return ""
    
    rag_context = "RELEVANT CLINICAL KNOWLEDGE BASE INFORMATION:\n"
    
    # Sort by relevance if available
    if all('relevance' in item for item in relevant_information):
        relevant_information.sort(key=lambda x: x.get('relevance', 0), reverse=True)
    
    for i, item in enumerate(relevant_information):
        content = item['content']
        metadata = item.get('metadata', {})
        topics = metadata.get('topics', [])
        
        # Add topic tags if available
        topic_text = f" [Topics: {', '.join(topics)}]" if topics else ""
        
        rag_context += f"Reference {i+1}{topic_text}:\n{content}\n\n"
    
    return rag_context

def create_analysis_prompt(
    facial_emotion: str, facial_confidence: float,
    speech_emotion: str, speech_confidence: float,
    combined_emotion: str, combined_confidence: float,
    patient_age: str, patient_gender: str, symptom_duration: str,
    additional_notes: str, relevant_information: List[Dict[str, Any]]
) -> str:
    """
    Create an enhanced psychiatric assessment prompt with RAG integration
    
    Args:
        facial_emotion (str): Facial expression emotion
        facial_confidence (float): Confidence in facial emotion
        speech_emotion (str): Speech tone emotion
        speech_confidence (float): Confidence in speech emotion
        combined_emotion (str): Combined emotional assessment
        combined_confidence (float): Confidence in combined emotion
        patient_age (str): Patient's age
        patient_gender (str): Patient's gender
        symptom_duration (str): Duration of symptoms
        additional_notes (str): Additional clinical notes
        relevant_information (List[Dict]): RAG retrieved information
        
    Returns:
        str: Complete LLM prompt
    """
    # Format RAG context
    rag_context = format_rag_context(relevant_information)
    
    # Current date 
    today_date = date.today().strftime("%B %d, %Y")
    
    prompt = f"""
    # Psychiatric Assessment Protocol
    
    You are Dr. Morgan Chen, a board-certified psychiatrist with 15 years of clinical experience specializing in mood and anxiety disorders. You're currently conducting a thorough psychiatric assessment based on multimodal emotional analysis data and patient history. Today is {today_date}.

    ## PATIENT DATA
    
    ### Emotional Analysis Results
    - **Facial Expression Analysis**: {facial_emotion} (Confidence: {facial_confidence:.2f})
    - **Speech Tone Analysis**: {speech_emotion} (Confidence: {speech_confidence:.2f})
    - **Combined Assessment**: {combined_emotion} (Confidence: {combined_confidence:.2f})
    
    ### Patient Background
    - **Age**: {patient_age}
    - **Gender**: {patient_gender}
    - **Symptom Duration**: {symptom_duration}
    - **Clinical Notes**: {additional_notes}

    ## CLINICAL KNOWLEDGE BASE REFERENCES
    
    {rag_context}
    
    ## ASSESSMENT FRAMEWORK
    
    Follow this structured diagnostic approach:
    
    1. **Initial Evaluation**: Synthesize the emotional data patterns, noting congruence or incongruence between facial expressions and speech tone
    
    2. **Pattern Recognition**: Map the emotional patterns to potential diagnostic considerations:
       - Persistent sadness/low mood → Depressive disorders (MDD, PDD, adjustment disorder)
       - Elevated anxiety/fear → Anxiety spectrum disorders (GAD, panic disorder, phobias)
       - Emotional dysregulation/mood swings → Bipolar spectrum, borderline personality traits
       - Emotional numbing/restricted affect → PTSD, dissociative disorders, schizophrenia spectrum
       - Incongruence between expression and speech → Alexithymia, masked depression, conversion disorder
    
    3. **Clinical Reasoning**: Apply DSM-5 criteria methodically to formulate differential diagnoses
    
    4. **Severity Assessment**: Evaluate:
       - Chronicity and pattern of emotional responses
       - Impact on daily functioning
       - Presence of cognitive distortions
       - Physiological symptoms
       - Threshold criteria (subclinical vs. clinical presentation)
    
    5. **Integrated Analysis**: Synthesize findings into a comprehensive clinical formulation that reflects both:
       - Biopsychosocial understanding
       - Evidence-based clinical judgment
       
    6. **Treatment Planning**: Considering age, gender, symptom duration, and severity, recommend:
       - Evidence-based psychotherapeutic approaches with rationale
       - Appropriate medication classes if indicated
       - Lifestyle interventions
       - Follow-up protocol
       
    ## CLINICAL OUTPUT FORMAT
    
    Provide a comprehensive psychiatric assessment in JSON format:
    
    ```json
    {{
        "mental_health_assessment": "Detailed clinical formulation including observed patterns and their significance",
        "differential_diagnosis": "Primary and alternative diagnostic considerations with clear DSM-5 reasoning",
        "condition": "Most likely clinical condition based on available data",
        "severity": "Mild/Moderate/Severe/Subclinical",
        "recommendations": ["Evidence-based recommendations for non-pharmacological interventions"],
        "therapy_options": ["Specific psychotherapy approaches with brief rationale for each"],
        "medication_considerations": ["Classes of medications that might be considered, with cautionary notes about evaluation needed"],
        "follow_up": "Recommended follow-up timeline and assessments",
        "risk_assessment": "Any noted risk factors requiring monitoring",
        "prognosis": "Expected course with appropriate treatment"
    }}
    ```
    
    Maintain clinical precision and professional language while conveying a thoughtful understanding of the patient's experience.
    """
    
    return prompt

def create_prescription_prompt(
    patient_name: str, patient_age: str, patient_gender: str,
    mental_assessment: Dict[str, Any], relevant_information: List[Dict[str, Any]]
) -> str:
    """
    Create an enhanced treatment plan prescription prompt with RAG integration
    
    Args:
        patient_name (str): Patient's name
        patient_age (str): Patient's age
        patient_gender (str): Patient's gender
        mental_assessment (Dict): Mental health assessment data
        relevant_information (List[Dict]): RAG retrieved information
        
    Returns:
        str: Complete LLM prompt
    """
    # Format RAG context
    rag_context = format_rag_context(relevant_information)
    
    # Extract condition information for more specific prompting
    condition = mental_assessment.get('condition', 'Unknown')
    severity = mental_assessment.get('severity', 'Unknown')
    
    # Get today's date for the report
    today_date = date.today().strftime("%B %d, %Y")
    
    prompt = f"""
    # Psychiatric Treatment Plan Documentation
    
    You are Dr. Morgan Chen, MD, PhD, a board-certified psychiatrist with 15 years of clinical experience specializing in {condition if condition != 'Unknown' else 'mood and anxiety disorders'}. You are preparing a comprehensive treatment plan for a patient following your detailed psychiatric assessment. Today is {today_date}.

    ## PATIENT INFORMATION
    
    - **Name**: {patient_name}
    - **Age**: {patient_age}
    - **Gender**: {patient_gender}
    - **Assessment Date**: {today_date}
    
    ## CLINICAL ASSESSMENT SUMMARY
    
    {json.dumps(mental_assessment, indent=2)}
    
    ## EVIDENCE-BASED TREATMENT REFERENCES
    
    {rag_context}
    
    ## TREATMENT PLAN FRAMEWORK
    
    Create a detailed, professionally formatted treatment plan that addresses:
    
    1. **Clinical Formulation**: Synthesize the assessment findings into a coherent understanding of the patient's presentation from a biopsychosocial perspective
    
    2. **Diagnostic Impression**: Provide clear diagnostic formulation using DSM-5 codes and categories (e.g., F32.1 Major Depressive Disorder, moderate)
    
    3. **Treatment Planning**: Follow these evidence-based principles:
       - Implement a stepped care approach based on severity ({severity})
       - Prioritize treatments with strongest empirical support for the identified condition
       - Address both symptom reduction and functional improvement
       - Consider patient factors including age ({patient_age}), gender ({patient_gender}), and comorbidities
       - Include measurable treatment goals and outcomes
       
    4. **Comprehensive Care Components**:
       - Psychotherapy: Specify modality, frequency, duration, and expected mechanisms of change
       - Pharmacotherapy: When indicated, specify medication classes (NOT specific medications or dosages)
       - Psychosocial interventions: Support systems, lifestyle modifications, psychoeducation
       - Self-management strategies: Skills development, monitoring tools, coping techniques
       
    5. **Continuity of Care Planning**:
       - Detailed follow-up schedule with assessment intervals
       - Specific outcome measures to track progress
       - Criteria for treatment adjustment or escalation
       - Crisis management protocol if applicable
       
    ## OUTPUT FORMAT
    
    Present the treatment plan in professional medical documentation format as a JSON object:
    
    ```json
    {{
        "prescription_title": "Comprehensive Mental Health Treatment Plan",
        "patient_details": {{
            "name": "{patient_name}",
            "age": "{patient_age}",
            "gender": "{patient_gender}",
            "assessment_date": "{today_date}"
        }},
        "clinical_formulation": "Integrative understanding of patient's presentation based on biopsychosocial model",
        "diagnosis": {{
            "primary": "Primary diagnosis with DSM-5 category and code",
            "differential": "Alternative diagnoses to consider",
            "contributing_factors": ["Psychosocial factors influencing presentation"]
        }},
        "treatment_plan": {{
            "immediate_recommendations": ["Urgent interventions if needed"],
            "psychotherapy": "Detailed therapy approach with empirical rationale and expected timeline",
            "medication_considerations": "General medication classes that may be considered pending full evaluation",
            "lifestyle_modifications": ["Specific behavioral changes recommended with scientific basis"],
            "self_care_strategies": ["Evidence-based coping skills and wellness practices"]
        }},
        "monitoring_plan": {{
            "follow_up": "Detailed follow-up schedule with specific timeframes",
            "assessment_tools": ["Standardized measures to track progress"],
            "warning_signs": ["Symptoms requiring prompt clinical attention"],
            "treatment_milestones": ["Expected progress indicators at different timepoints"]
        }},
        "additional_resources": ["Support groups, educational materials, etc."],
        "provider_notes": "Additional clinical considerations for healthcare team"
    }}
    ```
    
    Ensure the plan reflects the highest standards of psychiatric care, maintains clinical precision, and adheres to medical best practices for documentation while being comprehensive and individualized to this specific patient's needs.
    """
    
    return prompt
