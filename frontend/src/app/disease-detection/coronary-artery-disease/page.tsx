"use client";
import { useState, ChangeEvent, FormEvent } from "react";

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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const payload = Object.fromEntries(
        Object.entries(formData).map(([k, v]) => [k, parseFloat(v)])
      );

      const res = await fetch(`${API_BASE_URL}/predict_cad`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || "An error occurred.");
      }
    } catch (err: any) {
      setError(err.message || "Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {" "}
      {/* Header Section */}
      <section className="disease-gradient py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            <div className="text-center animate-fade-in">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Coronary Artery{" "}
                <span className="text-blue-600">Disease Predictor</span>
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
            className="flex-1 min-w-[350px] max-w-[600px] bg-white rounded-2xl shadow-lg p-8 animate-fade-in-up"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-4">
              Patient Information
            </h2>
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
            </div>{" "}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 mt-8 rounded-lg font-bold text-white text-lg flex items-center justify-center
                                ${
                                  loading
                                    ? "bg-blue-300 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-1 transition-all"
                                }`}
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
                  Predicting...
                </>
              ) : (
                "Predict CAD"
              )}
            </button>{" "}
            {error && (
              <div className="mt-4 bg-blue-50 text-blue-700 p-4 rounded-lg font-medium text-center">
                {error}
              </div>
            )}
          </form>

          {/* Right: Result */}
          <section className="flex-1 min-w-[350px] max-w-[600px] bg-white rounded-2xl shadow-lg p-8 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-4">
              Diagnosis Results
            </h2>

            <div className="min-h-[400px] flex flex-col justify-center">
              {!loading && !result && !error && (
                <div className="text-center py-10">
                  <div className="text-blue-300 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 mx-auto"
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
                  </div>
                  <p className="text-gray-500 text-lg">
                    Enter patient details and click <strong>Predict CAD</strong>{" "}
                    to see diagnostic results here.
                  </p>
                </div>
              )}

              {loading && (
                <div className="text-center py-10">
                  <div className="animate-pulse flex flex-col items-center">
                    {" "}
                    <div className="rounded-full bg-blue-100 h-16 w-16 mb-4 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                    <div className="h-4 bg-blue-100 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-blue-100 rounded w-1/2"></div>
                  </div>
                </div>
              )}

              {result && (
                <div className="animate-fade-in">
                  {" "}
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
                      {" "}
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
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            About Coronary Artery Disease
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {" "}
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
