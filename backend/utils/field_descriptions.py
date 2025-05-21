# Descriptions for each input field about its heart disease relevance
FIELD_DESCRIPTIONS = {
    "Age": "Patient's age in years; older age increases the risk of heart disease.",
    "RestingBP": "Resting blood pressure (mm Hg); high blood pressure places extra strain on the heart.",
    "Cholesterol": "Serum cholesterol level (mg/dl); high cholesterol can lead to plaque buildup in arteries.",
    "FastingBS": "Fasting blood sugar > 120 mg/dl (1 = true, 0 = false); elevated levels are linked to diabetes and higher heart disease risk.",
    "MaxHR": "Maximum heart rate achieved during exercise; lower values may indicate reduced cardiovascular fitness.",
    "Oldpeak": "ST depression induced by exercise relative to rest; indicates myocardial stress or ischemia.",
    "Sex": "Biological sex of the patient; males and females have differing risk profiles and symptoms for heart disease.",
    "ChestPainType": "Type of chest pain experienced; certain types are more strongly associated with heart issues.",
    "RestingECG": "Resting electrocardiogram results; abnormal results may suggest underlying cardiac conditions.",
    "ExerciseAngina": "Presence of angina (chest pain) induced by exercise; a clear indicator of possible ischemia.",
    "ST_Slope": "Slope of the ST segment during peak exercise; abnormal slopes are often linked to ischemic heart disease."
}

# Valid categorical values for input validation
VALID_VALUES = {
    "Sex": ["M", "F"],
    "ChestPainType": ["TA", "ATA", "NAP", "ASY"],
    "RestingECG": ["Normal", "ST", "LVH"],
    "ExerciseAngina": ["Y", "N"],
    "ST_Slope": ["Up", "Flat", "Down"]
}
