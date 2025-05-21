'use client';
import { useState, ChangeEvent, FormEvent } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
type FeatureKey =
    | 'age'
    | 'sex'
    | 'cp'
    | 'trestbps'
    | 'chol'
    | 'fbs'
    | 'restecg'
    | 'thalach'
    | 'exang'
    | 'oldpeak'
    | 'slope'
    | 'ca'
    | 'thal';

type FormDataType = Record<FeatureKey, string>;

type FeatureDescriptionsType = Record<FeatureKey, [string, string]>;

type PredictionResult = {
    prediction_probability: number;
    diagnosis: string;
    analysis: string;
};

const featureDescriptions: FeatureDescriptionsType = {
    age: ['Age', 'Age of the patient in years'],
    sex: ['Sex', '1 = Male, 0 = Female'],
    cp: ['Chest Pain Type', '0 = Typical angina, 1 = Atypical angina, 2 = Non-anginal pain, 3 = Asymptomatic'],
    trestbps: ['Resting Blood Pressure', 'Measured in mm Hg'],
    chol: ['Serum Cholesterol', 'mg/dl'],
    fbs: ['Fasting Blood Sugar > 120 mg/dl', '1 = True, 0 = False'],
    restecg: ['Resting ECG', '0 = Normal, 1 = ST-T abnormality, 2 = LV hypertrophy'],
    thalach: ['Max Heart Rate Achieved', 'Measured during stress test'],
    exang: ['Exercise Induced Angina', '1 = Yes, 0 = No'],
    oldpeak: ['Oldpeak', 'ST depression from exercise'],
    slope: ['Slope of ST Segment', '0 = Upsloping, 1 = Flat, 2 = Downsloping'],
    ca: ['Major Vessels Colored', '0-3'],
    thal: ['Thalassemia', '1 = Normal, 2 = Fixed defect, 3 = Reversible defect']
};

export default function Page() {
    const [formData, setFormData] = useState<FormDataType>({
        age: '',
        sex: '',
        cp: '',
        trestbps: '',
        chol: '',
        fbs: '',
        restecg: '',
        thalach: '',
        exang: '',
        oldpeak: '',
        slope: '',
        ca: '',
        thal: ''
    });

    const [result, setResult] = useState<PredictionResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const payload = Object.fromEntries(
                Object.entries(formData).map(([k, v]) => [k, parseFloat(v)])
            );

            const res = await fetch(`${API_BASE_URL}/predict_cad`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (res.ok) {
                setResult(data);
            } else {
                setError(data.error || 'An error occurred.');
            }
        } catch (err: any) {
            setError(err.message || 'Network error.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main
            style={{
                maxWidth: 1100,
                margin: '2rem auto',
                padding: '1rem',
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                color: '#222',
            }}
        >
            <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#004466' ,fontSize: '32px', fontWeight: 'bold' }}>
                Coronary Artery Disease Predictor
            </h1>
            <div
                style={{
                    display: 'flex',
                    gap: '3rem',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                }}
            >
                {/* Left: Form */}
                <form
                    onSubmit={handleSubmit}
                    style={{
                        flex: '1 1 350px',
                        backgroundColor: '#f9fafb',
                        padding: '2rem',
                        borderRadius: 8,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                >
                    {Object.entries(featureDescriptions).map(([key, [label, description]]) => (
                        <div
                            key={key}
                            style={{
                                marginBottom: '1.5rem',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <label
                                htmlFor={key}
                                style={{ fontWeight: '600', fontSize: '1rem', marginBottom: '0.3rem' }}
                            >
                                {label}
                            </label>
                            <input
                                id={key}
                                type="number"
                                name={key}
                                value={formData[key as FeatureKey]}
                                onChange={handleChange}
                                required
                                step="any"
                                style={{
                                    padding: '0.5rem 0.75rem',
                                    borderRadius: 4,
                                    border: '1.5px solid #ccc',
                                    fontSize: '1rem',
                                    transition: 'border-color 0.3s',
                                }}
                                onFocus={e => (e.target.style.borderColor = '#007acc')}
                                onBlur={e => (e.target.style.borderColor = '#ccc')}
                                aria-describedby={`${key}-desc`}
                            />
                            <small
                                id={`${key}-desc`}
                                style={{ color: '#555', fontSize: '0.85rem', marginTop: '0.2rem' }}
                            >
                                {description}
                            </small>
                        </div>
                    ))}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            backgroundColor: loading ? '#a0c4ff' : '#007acc',
                            color: 'white',
                            fontWeight: '700',
                            fontSize: '1.1rem',
                            border: 'none',
                            borderRadius: 5,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'background-color 0.3s',
                        }}
                        onMouseEnter={e => {
                            if (!loading) e.currentTarget.style.backgroundColor = '#005f99';
                        }}
                        onMouseLeave={e => {
                            if (!loading) e.currentTarget.style.backgroundColor = '#007acc';
                        }}
                    >
                        {loading ? 'Predicting...' : 'Predict CAD'}
                    </button>

                    {error && (
                        <p
                            role="alert"
                            style={{
                                marginTop: '1rem',
                                color: '#cc0000',
                                fontWeight: '600',
                                textAlign: 'center',
                            }}
                        >
                            {error}
                        </p>
                    )}
                </form>

                {/* Right: Result */}
                <section
                    style={{
                        flex: '1 1 350px',
                        backgroundColor: '#ffffff',
                        padding: '2rem',
                        borderRadius: 8,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        minHeight: 450,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        color: '#222',
                    }}
                >
                    {!loading && !result && !error && (
                        <p style={{ textAlign: 'center', color: '#666', fontSize: '1.1rem' }}>
                            Enter patient details on the left and click <strong>Predict CAD</strong> to see the result here.
                        </p>
                    )}

                    {loading && (
                        <p
                            style={{
                                textAlign: 'center',
                                fontSize: '1.2rem',
                                color: '#007acc',
                                fontWeight: '700',
                            }}
                        >
                            Predicting...
                        </p>
                    )}

                    {result && (
                        <>
                            <h2
                                style={{
                                    color: result.diagnosis.toLowerCase().includes('high')
                                        ? '#cc0000'
                                        : '#2e7d32',
                                    fontWeight: '700',
                                    fontSize: '1.8rem',
                                    marginBottom: '0.75rem',
                                    textAlign: 'center',
                                }}
                            >
                                Diagnosis: {result.diagnosis}
                            </h2>

                            <p
                                style={{
                                    fontSize: '1.1rem',
                                    marginBottom: '1rem',
                                    textAlign: 'center',
                                }}
                            >
                                Probability: {(result.prediction_probability * 100).toFixed(2)}%
                            </p>

                            <h3 style={{ color: '#004466', marginBottom: '0.5rem' }}>Medical Analysis</h3>
                            <p
                                style={{
                                    whiteSpace: 'pre-wrap',
                                    lineHeight: 1.5,
                                    fontSize: '1rem',
                                    color: '#333',
                                }}
                            >
                                {result.analysis}
                            </p>
                        </>
                    )}
                </section>
            </div>
        </main>
    );
}
