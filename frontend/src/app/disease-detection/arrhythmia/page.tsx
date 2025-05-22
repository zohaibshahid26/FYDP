"use client";

import { useState, FormEvent } from "react";

interface PredictionResult {
  prediction: string;
  confidence: string;
  analysis: string;
}
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // Create image preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!file) {
      setError("Please select an ECG image file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/predict_arrhythmia`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || "An error occurred during prediction.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
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
                ECG <span className="text-blue-600">Arrhythmia</span> Detection
              </h1>
              <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                Upload an ECG image for AI-powered arrhythmia analysis
              </p>
              <div className="w-20 h-1 bg-blue-500 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left Side: Upload Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-4">
              Upload ECG Image
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div>
                <label
                  htmlFor="file"
                  className="block font-semibold text-gray-700 mb-2"
                >
                  Select ECG Image:
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <input
                    id="file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                    className="hidden"
                  />
                  <label htmlFor="file" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-gray-400 mb-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-gray-600 font-medium">
                        {file ? file.name : "Click to upload or drag and drop"}
                      </span>
                      <span className="text-gray-500 text-sm mt-1">
                        PNG, JPG, GIF up to 10MB
                      </span>
                    </div>
                  </label>
                </div>
              </div>
              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Preview
                  </h3>
                  <div className="relative h-48 w-full bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="ECG Preview"
                      className="object-contain w-full h-full"
                    />
                  </div>
                </div>
              )}
              <button
                type="submit"
                disabled={loading || !file}
                className={`w-full py-3 px-4 rounded-lg font-bold text-white text-lg flex items-center justify-center
                                    ${
                                      loading || !file
                                        ? "bg-blue-300 cursor-not-allowed"
                                        : "btn-disease hover:shadow-lg"
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
                    Analyzing...
                  </>
                ) : (
                  "Detect Arrhythmia"
                )}
              </button>
              {error && (
                <div className="mt-4 bg-blue-50 text-blue-700 p-4 rounded-lg font-medium text-center">
                  {error}
                </div>
              )}
            </form>
          </div>

          {/* Right Side: Results */}
          <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-4">
              Analysis Results
            </h2>

            <div className="min-h-[400px] flex flex-col justify-center">
              {!result && !error && !loading && (
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
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg">
                    Upload an ECG image and click
                    <strong>Detect Arrhythmia</strong> to see analysis results.
                  </p>
                </div>
              )}

              {loading && (
                <div className="text-center py-10">
                  <div className="animate-pulse flex flex-col items-center">
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
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
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
                  <div className="p-6 mb-6 rounded-lg bg-blue-50">
                    <div className="flex items-center mb-4">
                      <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-4">
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
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-blue-800">
                          {result.prediction}
                        </h3>
                        <p className="text-blue-600">
                          Confidence: {result.confidence}
                        </p>
                      </div>
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
          </div>
        </div>
      </main>
      {/* Information Section */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            About Cardiac Arrhythmias
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
              <h3 className="font-semibold mb-2">What are Arrhythmias?</h3>
              <p className="text-gray-600 text-sm">
                Cardiac arrhythmias are irregular heartbeats caused by
                abnormalities in the heart's electrical impulses, causing it to
                beat too fast, too slow, or irregularly.
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
              <h3 className="font-semibold mb-2">Common Types</h3>
              <p className="text-gray-600 text-sm">
                Atrial fibrillation, atrial flutter, ventricular tachycardia,
                ventricular fibrillation, heart blocks, and premature
                contractions are common types of arrhythmias.
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
              <h3 className="font-semibold mb-2">Symptoms & Treatment</h3>
              <p className="text-gray-600 text-sm">
                Symptoms include palpitations, dizziness, shortness of breath,
                and fainting. Treatments range from lifestyle changes to
                medications, procedures, and implantable devices.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
