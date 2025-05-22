"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type FeatureType = "number" | "select";

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
    label: "Age",
    description:
      "Patient's age in years; older age increases the risk of heart disease.",
    type: "number",
  },
  RestingBP: {
    label: "Resting Blood Pressure (mm Hg)",
    description: "High blood pressure places extra strain on the heart.",
    type: "number",
  },
  Cholesterol: {
    label: "Serum Cholesterol (mg/dl)",
    description: "High cholesterol can lead to plaque buildup in arteries.",
    type: "number",
  },
  FastingBS: {
    label: "Fasting Blood Sugar > 120 mg/dl",
    description: "1 = True, 0 = False",
    type: "select",
    options: [
      { label: "False", value: "0" },
      { label: "True", value: "1" },
    ],
  },
  MaxHR: {
    label: "Maximum Heart Rate Achieved",
    description: "Lower values may indicate reduced cardiovascular fitness.",
    type: "number",
  },
  Oldpeak: {
    label: "Oldpeak (ST depression)",
    description: "Indicates myocardial stress or ischemia.",
    type: "number",
  },
  Sex: {
    label: "Biological Sex",
    description: "Males and females have different heart disease profiles.",
    type: "select",
    options: [
      { label: "Male", value: "M" },
      { label: "Female", value: "F" },
    ],
  },
  ChestPainType: {
    label: "Chest Pain Type",
    description:
      "TA=Typical Angina, ATA=Atypical Angina, NAP=Non-Anginal, ASY=Asymptomatic",
    type: "select",
    options: [
      { label: "Typical Angina", value: "TA" },
      { label: "Atypical Angina", value: "ATA" },
      { label: "Non-Anginal Pain", value: "NAP" },
      { label: "Asymptomatic", value: "ASY" },
    ],
  },
  RestingECG: {
    label: "Resting ECG Result",
    description: "Normal, ST-T abnormality, or Left Ventricular Hypertrophy",
    type: "select",
    options: [
      { label: "Normal", value: "Normal" },
      { label: "ST-T Abnormality", value: "ST" },
      { label: "LV Hypertrophy", value: "LVH" },
    ],
  },
  ExerciseAngina: {
    label: "Exercise Induced Angina",
    description: "Y = Yes, N = No",
    type: "select",
    options: [
      { label: "Yes", value: "Y" },
      { label: "No", value: "N" },
    ],
  },
  ST_Slope: {
    label: "ST Segment Slope",
    description: "Slope during peak exercise: Up, Flat, or Down",
    type: "select",
    options: [
      { label: "Upsloping", value: "Up" },
      { label: "Flat", value: "Flat" },
      { label: "Downsloping", value: "Down" },
    ],
  },
};

export default function Page() {
  const [formData, setFormData] = useState<Record<string, string>>(
    Object.fromEntries(Object.keys(featureDescriptions).map((key) => [key, ""]))
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string>("");
  const [inferenceStage, setInferenceStage] = useState<string>("idle");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    setInferenceStage("validating");

    const payload: Record<string, string | number> = {};

    for (const [key, value] of Object.entries(formData)) {
      const meta = featureDescriptions[key];

      if (meta.type === "number") {
        if (value === "" || isNaN(Number(value))) {
          setError(`Please enter a valid number for "${meta.label}".`);
          setLoading(false);
          setInferenceStage("idle");
          return;
        }
        payload[key] = parseFloat(value);
      } else {
        if (!value) {
          setError(`Please select a valid option for "${meta.label}".`);
          setLoading(false);
          setInferenceStage("idle");
          return;
        }
        payload[key] = value;
      }
    }

    try {
      setInferenceStage("processing");
      await new Promise((resolve) => setTimeout(resolve, 500));

      const response = await fetch(
        `${API_BASE_URL}/predict-heart-disease-failure`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      setInferenceStage("analyzing");
      await new Promise((resolve) => setTimeout(resolve, 800));

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Prediction failed.");
      }

      setResult(data);
      setInferenceStage("complete");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setInferenceStage("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header Section */}
      <section className="disease-gradient py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            <div className="text-center animate-fade-in">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Heart <span className="text-blue-600">Failure Risk </span>
                Prediction
              </h1>
              <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                Enter patient information to assess the risk of heart failure
              </p>
              <div className="w-20 h-1 bg-blue-500 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap gap-8 justify-center">
          {/* Left: Form */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 min-w-[350px] max-w-[600px] bg-white rounded-2xl shadow-lg p-8 animate-fade-in-up transition-all duration-300"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-4">
              Patient Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(featureDescriptions).map(([key, meta]) => (
                <div key={key} className="mb-4">
                  <label
                    htmlFor={key}
                    className="block font-semibold text-gray-700 mb-1"
                  >
                    {meta.label}
                  </label>
                  {meta.type === "number" ? (
                    <input
                      type="number"
                      id={key}
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      required
                      step="any"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                    />
                  ) : (
                    <select
                      id={key}
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                    >
                      <option value="" disabled>
                        Select...
                      </option>
                      {meta.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  )}
                  <small className="text-gray-500 text-xs mt-1 block">
                    {meta.description}
                  </small>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`relative w-full py-3 px-4 mt-8 rounded-lg font-bold text-white text-lg flex items-center justify-center
                            ${
                              loading
                                ? "bg-gradient-to-r from-blue-400 to-indigo-400 cursor-wait"
                                : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 hover:shadow-lg transform hover:-translate-y-1 transition-all"
                            }`}
              aria-live="polite"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {inferenceStage === "validating" && "Validating input..."}
                  {inferenceStage === "processing" && "Processing data..."}
                  {inferenceStage === "analyzing" &&
                    "Analyzing health parameters..."}
                </>
              ) : (
                "Predict Risk"
              )}
            </button>

            <div className="mt-4 text-center text-sm text-gray-500">
              Complete all fields for an accurate prediction. Data is processed
              securely.
            </div>

            {error && (
              <div
                className="mt-4 bg-red-50 border-l-4 border-red-400 p-4 rounded-lg text-red-700 animate-fade-in"
                role="alert"
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            )}
          </form>

          {/* Right: Result */}
          <section className="flex-1 min-w-[350px] max-w-[600px] bg-white rounded-2xl shadow-lg p-8 animate-fade-in-up transition-all duration-300">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-4">
              Diagnosis Results
            </h2>

            <div className="min-h-[400px] flex flex-col justify-center">
              {!loading && !result && !error && (
                <div className="text-center py-6">
                  <div className="mb-6 relative w-32 h-32 mx-auto">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-full h-full text-blue-100"
                      fill="currentColor"
                    >
                      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-16 h-16 text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 7v10m-5-5h10" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-3">
                    Ready for Analysis
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-xs mx-auto">
                    Complete the form on the left with patient data, then click
                    "Predict Risk" to see the heart failure risk assessment
                    here.
                  </p>
                  <div className="flex items-center justify-center text-sm text-blue-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Your data remains private and secure
                  </div>
                </div>
              )}

              {loading && (
                <div className="text-center py-10 animate-fade-in">
                  <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="relative">
                      {inferenceStage === "validating" && (
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                          <p className="text-blue-600 font-medium">
                            Validating your data
                          </p>
                          <p className="text-gray-500 text-sm mt-1">
                            Checking for data completeness...
                          </p>
                        </div>
                      )}

                      {inferenceStage === "processing" && (
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 mb-4 relative">
                            <div className="w-full h-full border-4 border-blue-200 rounded-full"></div>
                            <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
                          </div>
                          <p className="text-blue-600 font-medium">
                            Processing health data
                          </p>
                          <p className="text-gray-500 text-sm mt-1">
                            Analyzing {Object.keys(formData).length}{" "}
                            parameters...
                          </p>
                        </div>
                      )}

                      {inferenceStage === "analyzing" && (
                        <div className="flex flex-col items-center">
                          <div className="relative w-20 h-16 mb-4">
                            <svg
                              className="w-full h-full"
                              viewBox="0 0 100 70"
                              fill="none"
                            >
                              <path
                                className="stroke-blue-200"
                                d="M0,35 L20,35 L25,20 L35,50 L45,10 L55,40 L65,30 L75,35 L100,35"
                                strokeWidth="6"
                                strokeLinecap="round"
                              />
                              <path
                                className="stroke-blue-600 animate-ecg-wave"
                                d="M0,35 L20,35 L25,20 L35,50 L45,10 L55,40 L65,30 L75,35 L100,35"
                                strokeWidth="6"
                                strokeLinecap="round"
                                strokeDasharray="200"
                                strokeDashoffset="200"
                              />
                            </svg>
                          </div>
                          <p className="text-blue-600 font-medium">
                            Analyzing cardiac risk factors
                          </p>
                          <p className="text-gray-500 text-sm mt-1">
                            Our model is generating predictions...
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg max-w-xs">
                      <p className="text-blue-700 text-sm">
                        {inferenceStage === "validating" &&
                          "This usually takes just a moment..."}
                        {inferenceStage === "processing" &&
                          "Our AI model is evaluating the patient data..."}
                        {inferenceStage === "analyzing" &&
                          "Almost there! Finalizing the clinical assessment..."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {result && (
                <div className="animate-fade-in">
                  <div
                    className={`p-6 mb-6 rounded-lg flex items-center ${
                      result.risk === "High" ? "bg-blue-50" : "bg-green-50"
                    }`}
                  >
                    <div
                      className={`h-12 w-12 rounded-full flex items-center justify-center mr-4 ${
                        result.risk === "High"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {result.risk === "High" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h3
                        className={`font-bold text-lg ${
                          result.risk === "High"
                            ? "text-blue-700"
                            : "text-green-700"
                        }`}
                      >
                        Risk Level: {result.risk}
                      </h3>
                      <p
                        className={`${
                          result.risk === "High"
                            ? "text-blue-600"
                            : "text-green-600"
                        }`}
                      >
                        Probability: {(result.probability * 100).toFixed(2)}%
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-bold text-xl text-gray-800 mb-2">
                      Top Contributing Factors
                    </h3>
                    <ul className="list-disc pl-5 space-y-1 bg-gray-50 p-4 rounded-lg">
                      {result.top_factors.map((factor, index) => (
                        <li key={index} className="text-gray-700">
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold text-xl text-gray-800 mb-2">
                      Clinical Analysis
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                        {result.analysis}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Information Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            About Heart Failure
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">What is Heart Failure?</h3>
              <p className="text-gray-600 text-sm">
                Heart failure occurs when the heart muscle doesn't pump blood as
                well as it should, causing fluid to build up in the lungs and
                other tissues.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Warning Signs</h3>
              <p className="text-gray-600 text-sm">
                Shortness of breath, fatigue, swelling in the legs, ankles and
                feet, rapid or irregular heartbeat, reduced ability to exercise,
                and persistent cough.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Prevention</h3>
              <p className="text-gray-600 text-sm">
                Control blood pressure, maintain healthy weight, regular
                exercise, reduce salt intake, limit alcohol, avoid tobacco, and
                manage stress.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
