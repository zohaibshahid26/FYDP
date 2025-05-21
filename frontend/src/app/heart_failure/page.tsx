'use client';

import { useState, ChangeEvent, FormEvent } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

type FeatureType = 'number' | 'select';

type FeatureMetadata = {
    label: string;
    description: string;
    type: FeatureType;
    options?: { label: string; value: string }[];
};

type PredictionResponse = {
    risk: string;
    probability: number;
    top_factors: string[];
    analysis: string;
};

const featureDescriptions: Record<string, FeatureMetadata> = {
    Age: {
        label: 'Age',
        description: 'Patient\'s age in years; older age increases the risk of heart disease.',
        type: 'number',
    },
    RestingBP: {
        label: 'Resting Blood Pressure (mm Hg)',
        description: 'High blood pressure places extra strain on the heart.',
        type: 'number',
    },
    Cholesterol: {
        label: 'Serum Cholesterol (mg/dl)',
        description: 'High cholesterol can lead to plaque buildup in arteries.',
        type: 'number',
    },
    FastingBS: {
        label: 'Fasting Blood Sugar > 120 mg/dl',
        description: '1 = True, 0 = False',
        type: 'select',
        options: [
            { label: 'False', value: '0' },
            { label: 'True', value: '1' },
        ],
    },
    MaxHR: {
        label: 'Maximum Heart Rate Achieved',
        description: 'Lower values may indicate reduced cardiovascular fitness.',
        type: 'number',
    },
    Oldpeak: {
        label: 'Oldpeak (ST depression)',
        description: 'Indicates myocardial stress or ischemia.',
        type: 'number',
    },
    Sex: {
        label: 'Biological Sex',
        description: 'Males and females have different heart disease profiles.',
        type: 'select',
        options: [
            { label: 'Male', value: 'M' },
            { label: 'Female', value: 'F' },
        ],
    },
    ChestPainType: {
        label: 'Chest Pain Type',
        description: 'TA=Typical Angina, ATA=Atypical Angina, NAP=Non-Anginal, ASY=Asymptomatic',
        type: 'select',
        options: [
            { label: 'Typical Angina', value: 'TA' },
            { label: 'Atypical Angina', value: 'ATA' },
            { label: 'Non-Anginal Pain', value: 'NAP' },
            { label: 'Asymptomatic', value: 'ASY' },
        ],
    },
    RestingECG: {
        label: 'Resting ECG Result',
        description: 'Normal, ST-T abnormality, or Left Ventricular Hypertrophy',
        type: 'select',
        options: [
            { label: 'Normal', value: 'Normal' },
            { label: 'ST-T Abnormality', value: 'ST' },
            { label: 'LV Hypertrophy', value: 'LVH' },
        ],
    },
    ExerciseAngina: {
        label: 'Exercise Induced Angina',
        description: 'Y = Yes, N = No',
        type: 'select',
        options: [
            { label: 'Yes', value: 'Y' },
            { label: 'No', value: 'N' },
        ],
    },
    ST_Slope: {
        label: 'ST Segment Slope',
        description: 'Slope during peak exercise: Up, Flat, or Down',
        type: 'select',
        options: [
            { label: 'Upsloping', value: 'Up' },
            { label: 'Flat', value: 'Flat' },
            { label: 'Downsloping', value: 'Down' },
        ],
    },
};

export default function Page() {
    const [formData, setFormData] = useState<Record<string, string>>(
        Object.fromEntries(Object.keys(featureDescriptions).map((key) => [key, '']))
    );
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<PredictionResponse | null>(null);
    const [error, setError] = useState<string>('');

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setResult(null);
        setLoading(true);

        const payload: Record<string, string | number> = {};

        for (const [key, value] of Object.entries(formData)) {
            const meta = featureDescriptions[key];

            if (meta.type === 'number') {
                if (value === '' || isNaN(Number(value))) {
                    setError(`Please enter a valid number for "${meta.label}".`);
                    setLoading(false);
                    return;
                }
                payload[key] = parseFloat(value); // Use float, not int
            } else {
                if (!value) {
                    setError(`Please select a valid option for "${meta.label}".`);
                    setLoading(false);
                    return;
                }
                payload[key] = value; // Keep categorical values as strings
            }
        }

        try {
            const response = await fetch(`${API_BASE_URL}/predict-heart-disease-failure`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Prediction failed.');
            }

            setResult(data);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main style={{ maxWidth: '1100px', margin: '2rem auto', padding: '1rem' }}>
            <h1 style={{ textAlign: 'center', color: '#003366', marginBottom: '2rem', fontSize: '32px', fontWeight: 'bold' }}>
                Heart Disease Risk Prediction
            </h1>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
                <form
                    onSubmit={handleSubmit}
                    style={{
                        flex: '1 1 400px',
                        background: '#f4f6f8',
                        padding: '24px',
                        borderRadius: '10px',
                        boxShadow: '0 0 12px rgba(0,0,0,0.08)',
                    }}
                >
                    {Object.entries(featureDescriptions).map(([key, meta]) => (
                        <div key={key} style={{ marginBottom: '18px' }}>
                            <label htmlFor={key} style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>
                                {meta.label}
                            </label>
                            <small style={{ display: 'block', color: '#555', marginBottom: 4 }}>
                                {meta.description}
                            </small>

                            {meta.type === 'number' ? (
                                <input
                                    type="number"
                                    id={key}
                                    name={key}
                                    value={formData[key]}
                                    onChange={handleChange}
                                    required
                                    step="any"
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: 6,
                                        border: '1px solid #ccc',
                                    }}
                                />
                            ) : (
                                <select
                                    id={key}
                                    name={key}
                                    value={formData[key]}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: 6,
                                        border: '1px solid #ccc',
                                    }}
                                >
                                    <option value="" disabled>Select...</option>
                                    {meta.options?.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    ))}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: '#007acc',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 6,
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            cursor: 'pointer',
                        }}
                    >
                        {loading ? 'Predicting...' : 'Predict Risk'}
                    </button>

                    {error && (
                        <p style={{ color: 'crimson', marginTop: '1rem', fontWeight: 500 }}>
                            {error}
                        </p>
                    )}
                </form>

                <div
                    style={{
                        flex: '1 1 500px',
                        padding: '24px',
                        borderRadius: '10px',
                        backgroundColor: '#fff',
                        boxShadow: '0 0 12px rgba(0,0,0,0.08)',
                        minHeight: 200,
                    }}
                >
                    {!result && !loading && (
                        <p style={{ color: '#666' }}>
                            Fill out the form and click <strong>Predict Risk</strong> to see your heart disease risk.
                        </p>
                    )}
                    {loading && <p style={{ color: '#007acc' }}>Analyzing data...</p>}
                    {result && (
                        <>
                            <h2 style={{ color: result.risk === 'High' ? 'crimson' : 'green' }}>
                                Risk Level: {result.risk}
                            </h2>
                            <p><strong>Probability:</strong> {(result.probability * 100).toFixed(2)}%</p>

                            <h3 style={{ marginTop: '1.5rem' }}>Top Contributing Factors</h3>
                            <ul style={{ paddingLeft: '1.2rem' }}>
                                {result.top_factors.map((factor, index) => (
                                    <li key={index}>{factor}</li>
                                ))}
                            </ul>

                            <h3 style={{ marginTop: '1.5rem' }}>Clinical Analysis</h3>
                            <p>{result.analysis}</p>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}
