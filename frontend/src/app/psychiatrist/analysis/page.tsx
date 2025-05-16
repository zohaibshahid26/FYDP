"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { analyzeEmotions } from "@/api/psychiatristService";
import { EmotionData } from "@/types/psychiatristTypes";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiArrowLeft,
} from "react-icons/fi";
import Link from "next/link";

export default function AnalysisPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<EmotionData>({
    patient_name: "",
    facial_emotion: "",
    facial_confidence: 0,
    speech_emotion: "",
    speech_confidence: 0,
    combined_emotion: "",
    combined_confidence: 0,
    patient_age: "",
    patient_gender: "",
    symptom_duration: "",
    additional_notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    // Handle numeric values properly to avoid NaN
    if (name.includes("confidence")) {
      // Parse to float but use 0 as a fallback if NaN
      const numValue = parseFloat(value);
      setFormData({
        ...formData,
        [name]: isNaN(numValue) ? 0 : numValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // If combined emotion is not provided, use facial emotion
      const dataToSend = {
        ...formData,
        combined_emotion: formData.combined_emotion || formData.facial_emotion,
        combined_confidence:
          formData.combined_confidence || formData.facial_confidence,
      };

      const response = await analyzeEmotions(dataToSend);

      // Store the analysis in localStorage or state management for use in prescription
      localStorage.setItem("analysisResult", JSON.stringify(response));

      // Redirect to results page
      router.push("/psychiatrist/analysis/results");
    } catch (err) {
      setError("Failed to analyze emotions. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link
        href="/psychiatrist"
        className="flex items-center text-blue-600 mb-6"
      >
        <FiArrowLeft className="mr-2" /> Back to Mental Health Services
      </Link>

      <div className="flex items-center mb-6">
        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-4">
          <FiAlertCircle size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Emotion Analysis</h1>
          <p className="text-gray-500">
            Input emotional data for comprehensive mental health assessment
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="pb-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <span className="text-blue-500 mr-2">01</span> Patient
                Information
              </h2>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="patient_name"
                value={formData.patient_name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="Enter patient's full name"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Age
              </label>
              <input
                type="text"
                name="patient_age"
                value={formData.patient_age}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="e.g., 35"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Gender
              </label>
              <select
                name="patient_gender"
                value={formData.patient_gender}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Symptom Duration
              </label>
              <div className="flex items-center">
                <div className="text-gray-400 absolute ml-3">
                  <FiClock size={18} />
                </div>
                <input
                  type="text"
                  name="symptom_duration"
                  value={formData.symptom_duration}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 pl-10 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 3 weeks"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="pb-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <span className="text-blue-500 mr-2">02</span> Emotion Data
              </h2>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Facial Emotion
              </label>
              <select
                name="facial_emotion"
                value={formData.facial_emotion}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Emotion</option>
                <option value="happy">Happy</option>
                <option value="sad">Sad</option>
                <option value="angry">Angry</option>
                <option value="fearful">Fearful</option>
                <option value="disgusted">Disgusted</option>
                <option value="surprised">Surprised</option>
                <option value="neutral">Neutral</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Facial Confidence (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="facial_confidence"
                  value={formData.facial_confidence || 0}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  max="100"
                  required
                />
                <span className="absolute right-3 top-3 text-gray-400">%</span>
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Speech Emotion
              </label>
              <select
                name="speech_emotion"
                value={formData.speech_emotion}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Emotion</option>
                <option value="happy">Happy</option>
                <option value="sad">Sad</option>
                <option value="angry">Angry</option>
                <option value="fearful">Fearful</option>
                <option value="disgusted">Disgusted</option>
                <option value="surprised">Surprised</option>
                <option value="neutral">Neutral</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Speech Confidence (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="speech_confidence"
                  value={formData.speech_confidence || 0}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  max="100"
                  required
                />
                <span className="absolute right-3 top-3 text-gray-400">%</span>
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Combined Emotion (Optional)
              </label>
              <select
                name="combined_emotion"
                value={formData.combined_emotion}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Auto (Use Facial)</option>
                <option value="happy">Happy</option>
                <option value="sad">Sad</option>
                <option value="angry">Angry</option>
                <option value="fearful">Fearful</option>
                <option value="disgusted">Disgusted</option>
                <option value="surprised">Surprised</option>
                <option value="neutral">Neutral</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Combined Confidence (%) (Optional)
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="combined_confidence"
                  value={formData.combined_confidence || 0}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  max="100"
                />
                <span className="absolute right-3 top-3 text-gray-400">%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <label className="block mb-2 font-medium text-gray-700">
            Additional Notes
          </label>
          <textarea
            name="additional_notes"
            value={formData.additional_notes}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-40"
            placeholder="Enter any additional observations or notes about condition, behavior, or history"
          />
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 shadow-md"
          >
            {isLoading ? (
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
              <>
                <FiCheckCircle className="mr-2" />
                Analyze Emotions
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
