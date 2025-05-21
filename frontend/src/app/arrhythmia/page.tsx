'use client';

import { useState, FormEvent } from 'react';

interface PredictionResult {
    prediction: string;
    confidence: string;
    analysis: string;
}
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
export default function Page() {
    const [file, setFile] = useState<File | null>(null);
    const [result, setResult] = useState<PredictionResult | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setResult(null);

        if (!file) {
            setError('Please select an ECG image file.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/predict_arrhythmia`, {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            if (res.ok) {
                setResult(data);
            } else {
                setError(data.error || 'An error occurred during prediction.');
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                maxWidth: 1100,
                margin: '2rem auto',
                padding: '1rem 2rem',
                fontFamily:
                    "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '3rem',
                minHeight: '60vh',
                boxShadow: '0 0 15px rgba(0,0,0,0.1)',
                borderRadius: 8,
                backgroundColor: '#fff',
            }}
        >
            {/* Left side: Form */}
            <section>
                <h1
                    style={{
                        marginBottom: '1.5rem',
                        fontWeight: 'bold',
                        color: '#222',
                        fontSize: '32px'
                    }}
                >
                    ECG Arrhythmia Predictor
                </h1>
                <form onSubmit={handleSubmit} noValidate>
                    <label
                        htmlFor="file"
                        style={{
                            display: 'block',
                            fontWeight: 600,
                            fontSize: '1rem',
                            marginBottom: '0.5rem',
                            color: '#333',
                        }}
                    >
                        Upload ECG Image:
                    </label>
                    <input
                        id="file"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                        style={{
                            display: 'block',
                            width: '100%',
                            padding: '0.5rem',
                            borderRadius: 5,
                            border: '1px solid #ccc',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            marginBottom: '1.5rem',
                            transition: 'border-color 0.3s',
                        }}
                        onFocus={e =>
                            (e.currentTarget.style.borderColor = '#0070f3')
                        }
                        onBlur={e =>
                            (e.currentTarget.style.borderColor = '#ccc')
                        }
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            backgroundColor: loading ? '#a0c4ff' : '#0070f3',
                            color: '#fff',
                            border: 'none',
                            padding: '0.75rem 1.5rem',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            borderRadius: 6,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            boxShadow:
                                '0 4px 12px rgba(0,112,243,0.3)',
                            transition: 'background-color 0.3s',
                            width: '100%',
                        }}
                        onMouseEnter={e => {
                            if (!loading)
                                (e.currentTarget.style.backgroundColor =
                                    '#005bb5');
                        }}
                        onMouseLeave={e => {
                            if (!loading)
                                (e.currentTarget.style.backgroundColor =
                                    '#0070f3');
                        }}
                    >
                        {loading ? 'Analyzing...' : 'Predict Arrhythmia'}
                    </button>
                </form>
            </section>

            {/* Right side: Result / Error */}
            <section
                style={{
                    backgroundColor: '#f9fafb',
                    borderRadius: 8,
                    padding: '1.5rem',
                    boxShadow:
                        'inset 0 0 8px rgba(0,0,0,0.05)',
                    minHeight: '250px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    color: '#222',
                }}
            >
                {error && (
                    <div
                        style={{
                            color: '#d32f2f',
                            fontWeight: '600',
                            fontSize: '1.1rem',
                            textAlign: 'center',
                        }}
                        role="alert"
                    >
                        {error}
                    </div>
                )}

                {result && (
                    <>
                        <h2
                            style={{
                                marginBottom: '1rem',
                                fontWeight: '700',
                                fontSize: '1.5rem',
                                color: '#0070f3',
                            }}
                        >
                            Prediction Result
                        </h2>
                        <p style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                            <strong>Diagnosis:</strong> {result.prediction}
                        </p>
                        <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
                            <strong>Confidence:</strong> {result.confidence}
                        </p>
                        <h3
                            style={{
                                marginBottom: '0.5rem',
                                fontWeight: '600',
                                fontSize: '1.2rem',
                            }}
                        >
                            Medical Analysis
                        </h3>
                        <p
                            style={{
                                whiteSpace: 'pre-wrap',
                                lineHeight: 1.5,
                                fontSize: '1rem',
                                color: '#444',
                            }}
                        >
                            {result.analysis}
                        </p>
                    </>
                )}

                {!result && !error && (
                    <p
                        style={{
                            textAlign: 'center',
                            color: '#666',
                            fontStyle: 'italic',
                            fontSize: '1rem',
                        }}
                    >
                        Prediction results will appear here.
                    </p>
                )}
            </section>
        </div>
    );
}
