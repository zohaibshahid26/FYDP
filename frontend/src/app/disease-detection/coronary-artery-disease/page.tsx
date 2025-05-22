"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
type FeatureKey =
  | "age"
  | "sex"
  | "cp"
  | "trestbps"
  | "chol"
  | "fbs"
  | "restecg"
  | "thalach"
  | "exang"
  | "oldpeak"
  | "slope"
  | "ca"
  | "thal";

type FormDataType = Record<FeatureKey, string>;

type FeatureDescriptionsType = Record<FeatureKey, [string, string]>;

type PredictionResult = {
  prediction_probability: number;
  diagnosis: string;
  analysis: string;
};

const featureDescriptions: FeatureDescriptionsType = {
  age: ["Age", "Age of the patient in years"],
  sex: ["Sex", "1 = Male, 0 = Female"],
  cp: [
    "Chest Pain Type",
    "0 = Typical angina, 1 = Atypical angina, 2 = Non-anginal pain, 3 = Asymptomatic",
  ],
  trestbps: ["Resting Blood Pressure", "Measured in mm Hg"],
  chol: ["Serum Cholesterol", "mg/dl"],
  fbs: ["Fasting Blood Sugar > 120 mg/dl", "1 = True, 0 = False"],
  restecg: [
    "Resting ECG",
    "0 = Normal, 1 = ST-T abnormality, 2 = LV hypertrophy",
  ],
  thalach: ["Max Heart Rate Achieved", "Measured during stress test"],
  exang: ["Exercise Induced Angina", "1 = Yes, 0 = No"],
  oldpeak: ["Oldpeak", "ST depression from exercise"],
  slope: ["Slope of ST Segment", "0 = Upsloping, 1 = Flat, 2 = Downsloping"],
  ca: ["Major Vessels Colored", "0-3"],
  thal: ["Thalassemia", "1 = Normal, 2 = Fixed defect, 3 = Reversible defect"],
};

export default function Page() {
  const [formData, setFormData] = useState<FormDataType>({
    age: "",
    sex: "",
    cp: "",
    trestbps: "",
    chol: "",
    fbs: "",
    restecg: "",
    thalach: "",
    exang: "",
    oldpeak: "",
    slope: "",
    ca: "",
    thal: "",
  });

  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [inferenceStage, setInferenceStage] = useState<string>("idle");
  const [processingTip, setProcessingTip] = useState<string>("");

  const processingTips = [
    "Tip: Regular exercise can significantly reduce the risk of CAD.",
    "Did you know? Managing stress is important for heart health.",
    "Tip: A diet rich in fruits and vegetables helps prevent CAD.",
    "Fact: Quitting smoking can reduce heart disease risk within a year.",
  ];

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    setInferenceStage("validating");

    // Show random processing tip
    setProcessingTip(
      processingTips[Math.floor(Math.random() * processingTips.length)]
    );

    try {
      const payload = Object.fromEntries(
        Object.entries(formData).map(([k, v]) => [k, parseFloat(v)])
      );

      // Add small delays to showcase the inference stages
      setInferenceStage("processing");
      await new Promise((resolve) => setTimeout(resolve, 700));

      const res = await fetch(`${API_BASE_URL}/predict_cad`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setInferenceStage("analyzing");
      await new Promise((resolve) => setTimeout(resolve, 800));

      const data = await res.json();
      if (res.ok) {
        setResult(data);
        setInferenceStage("complete");
      } else {
        setError(data.error || "An error occurred.");
        setInferenceStage("error");
      }
    } catch (err: any) {
      setError(err.message || "Network error.");
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
                Coronary Artery
                <span className="text-blue-600"> Disease Predictor </span>
              </h1>
              <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                Enter patient data to receive an AI-powered diagnosis and
                analysis
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
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-4 flex items-center">
              <span className="bg-blue-100 text-blue-700 p-1 rounded-md mr-2">
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </span>
              Patient Information
            </h2>

            {/* Form help info */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6 text-sm text-blue-700 flex">
              <svg
                className="h-5 w-5 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                All fields must be filled with numerical values. Enter
                measurements exactly as recorded in medical tests.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(featureDescriptions).map(
                ([key, [label, description]]) => (
                  <div key={key} className="mb-4">
                    <label
                      htmlFor={key}
                      className="block font-semibold text-gray-700 mb-1"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                      aria-describedby={`${key}-desc`}
                    />
                    <small
                      id={`${key}-desc`}
                      className="text-gray-500 text-xs mt-1 block"
                    >
                      {description}
                    </small>
                  </div>
                )
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 mt-8 rounded-lg font-bold text-white text-lg flex items-center justify-center
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
                  {inferenceStage === "validating" && "Validating data..."}
                  {inferenceStage === "processing" && "Processing..."}
                  {inferenceStage === "analyzing" && "Diagnosing..."}
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                  Predict CAD
                </>
              )}
            </button>

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
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-4 flex items-center">
              <span className="bg-blue-100 text-blue-700 p-1 rounded-md mr-2">
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
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </span>
              Diagnosis Results
            </h2>

            <div className="min-h-[400px] flex flex-col justify-center">
              {!loading && !result && !error && (
                <div className="text-center py-6">
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-28 h-28 rounded-full bg-blue-50 p-6 mb-4 relative">
                      <div className="animate-pulse absolute inset-0 rounded-full bg-blue-100 opacity-60"></div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-full h-full text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      CAD Analysis
                    </h3>
                    <p className="text-gray-500 mb-4 max-w-xs mx-auto">
                      Fill in the patient data form to the left and click
                      "Predict CAD" to receive a detailed coronary artery
                      disease risk analysis.
                    </p>
                  </div>

                  {/* Steps visualization */}
                  <div className="flex justify-between w-full max-w-xs mx-auto mb-8">
                    <div className="flex flex-col items-center">
                      <div className="rounded-full bg-blue-100 text-blue-600 w-8 h-8 flex items-center justify-center mb-2">
                        1
                      </div>
                      <span className="text-xs text-gray-500">Enter Data</span>
                    </div>
                    <div className="flex-1 border-b-2 border-dashed border-blue-100 relative top-4"></div>
                    <div className="flex flex-col items-center">
                      <div className="rounded-full bg-gray-100 text-gray-400 w-8 h-8 flex items-center justify-center mb-2">
                        2
                      </div>
                      <span className="text-xs text-gray-400">Analysis</span>
                    </div>
                    <div className="flex-1 border-b-2 border-dashed border-gray-100 relative top-4"></div>
                    <div className="flex flex-col items-center">
                      <div className="rounded-full bg-gray-100 text-gray-400 w-8 h-8 flex items-center justify-center mb-2">
                        3
                      </div>
                      <span className="text-xs text-gray-400">Results</span>
                    </div>
                  </div>

                  <Link
                    href="/disease-detection"
                    className="text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center text-sm"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    Back to disease detection options
                  </Link>
                </div>
              )}

              {loading && (
                <div className="text-center py-6 animate-fade-in">
                  <div className="flex flex-col items-center justify-center space-y-6">
                    {inferenceStage === "validating" && (
                      <div className="flex flex-col items-center">
                        <div className="relative w-16 h-16 mb-4">
                          <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
                          <div className="relative flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full text-white">
                            <svg
                              className="w-8 h-8"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        </div>
                        <p className="text-blue-600 font-medium">
                          Validating Input Data
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          Ensuring all values are within expected ranges...
                        </p>
                      </div>
                    )}

                    {inferenceStage === "processing" && (
                      <div className="flex flex-col items-center">
                        <div className="relative w-16 h-16 mb-4">
                          <div className="w-full h-full bg-blue-100 rounded-full flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                          </div>
                        </div>
                        <p className="text-blue-600 font-medium">
                          Processing Health Data
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          Our AI model is analyzing risk factors...
                        </p>

                        {/* Show health tips during processing */}
                        <div className="mt-4 bg-blue-50 p-3 rounded-lg max-w-xs border border-blue-100 text-sm text-blue-700">
                          {processingTip}
                        </div>
                      </div>
                    )}

                    {inferenceStage === "analyzing" && (
                      <div className="flex flex-col items-center">
                        <div className="relative w-20 h-16 mb-4">
                          <svg viewBox="0 0 100 60" className="w-full h-full">
                            <path
                              className="stroke-blue-200"
                              d="M0,30 L15,30 L20,10 L30,50 L40,15 L50,45 L60,25 L70,30 L85,30 L90,15 L100,30"
                              fill="none"
                              strokeWidth="4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              className="stroke-blue-600 animate-cardiac-wave"
                              d="M0,30 L15,30 L20,10 L30,50 L40,15 L50,45 L60,25 L70,30 L85,30 L90,15 L100,30"
                              fill="none"
                              strokeWidth="4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeDasharray="300"
                              strokeDashoffset="300"
                            />
                          </svg>
                        </div>
                        <p className="text-blue-600 font-medium">
                          Analyzing Cardiac Patterns
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          Synthesizing results and preparing diagnosis...
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {result && (
                <div className="animate-fade-in">
                  <div
                    className={`p-6 mb-6 rounded-lg flex items-center ${
                      result.diagnosis.toLowerCase().includes("high")
                        ? "bg-blue-50"
                        : "bg-green-50"
                    }`}
                  >
                    <div
                      className={`h-12 w-12 rounded-full flex items-center justify-center mr-4 ${
                        result.diagnosis.toLowerCase().includes("high")
                          ? "bg-blue-100 text-blue-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {result.diagnosis.toLowerCase().includes("high") ? (
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
                          result.diagnosis.toLowerCase().includes("high")
                            ? "text-blue-700"
                            : "text-green-700"
                        }`}
                      >
                        {result.diagnosis}
                      </h3>
                      <p
                        className={`${
                          result.diagnosis.toLowerCase().includes("high")
                            ? "text-blue-600"
                            : "text-green-600"
                        }`}
                      >
                        Probability:{" "}
                        {(result.prediction_probability * 100).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-800 mb-2">
                      Medical Analysis
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
            About Coronary Artery Disease
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
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
              <h3 className="font-semibold mb-2">What is CAD?</h3>
              <p className="text-gray-600 text-sm">
                Coronary artery disease happens when plaque builds up in the
                arteries that supply blood to the heart, causing them to narrow
                and restrict blood flow.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
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
              <h3 className="font-semibold mb-2">Risk Factors</h3>
              <p className="text-gray-600 text-sm">
                High blood pressure, high cholesterol, smoking, diabetes,
                obesity, physical inactivity, unhealthy diet, and family history
                can all contribute to CAD.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
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
                Regular exercise, healthy diet, avoiding smoking, controlling
                blood pressure and cholesterol can help prevent CAD development.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
