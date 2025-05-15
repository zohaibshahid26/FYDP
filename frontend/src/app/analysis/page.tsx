"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { analyzeEmotions } from "@/api/psychiatristService";
import { EmotionData, AnalysisResponse } from "@/types/psychiatristTypes";

export default function AnalysisPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<EmotionData>({
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
    setFormData({
      ...formData,
      [name]: name.includes("confidence") ? parseFloat(value) : value,
    });
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
      router.push("/analysis/results");
    } catch (err) {
      setError("Failed to analyze emotions. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Emotion Analysis</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Emotion Data</h2>

            <div>
              <label className="block mb-1">Facial Emotion</label>
              <select
                name="facial_emotion"
                value={formData.facial_emotion}
                onChange={handleChange}
                className="w-full border rounded p-2"
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
              <label className="block mb-1">Facial Confidence (%)</label>
              <input
                type="number"
                name="facial_confidence"
                value={formData.facial_confidence}
                onChange={handleChange}
                className="w-full border rounded p-2"
                min="0"
                max="100"
                required
              />
            </div>

            <div>
              <label className="block mb-1">Speech Emotion</label>
              <select
                name="speech_emotion"
                value={formData.speech_emotion}
                onChange={handleChange}
                className="w-full border rounded p-2"
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
              <label className="block mb-1">Speech Confidence (%)</label>
              <input
                type="number"
                name="speech_confidence"
                value={formData.speech_confidence}
                onChange={handleChange}
                className="w-full border rounded p-2"
                min="0"
                max="100"
                required
              />
            </div>

            <div>
              <label className="block mb-1">Combined Emotion (Optional)</label>
              <select
                name="combined_emotion"
                value={formData.combined_emotion}
                onChange={handleChange}
                className="w-full border rounded p-2"
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
              <label className="block mb-1">
                Combined Confidence (%) (Optional)
              </label>
              <input
                type="number"
                name="combined_confidence"
                value={formData.combined_confidence}
                onChange={handleChange}
                className="w-full border rounded p-2"
                min="0"
                max="100"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Patient Information</h2>

            <div>
              <label className="block mb-1">Age</label>
              <input
                type="text"
                name="patient_age"
                value={formData.patient_age}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
            </div>

            <div>
              <label className="block mb-1">Gender</label>
              <select
                name="patient_gender"
                value={formData.patient_gender}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block mb-1">Symptom Duration</label>
              <input
                type="text"
                name="symptom_duration"
                value={formData.symptom_duration}
                onChange={handleChange}
                className="w-full border rounded p-2"
                placeholder="e.g., 3 weeks"
                required
              />
            </div>

            <div>
              <label className="block mb-1">Additional Notes</label>
              <textarea
                name="additional_notes"
                value={formData.additional_notes}
                onChange={handleChange}
                className="w-full border rounded p-2 h-32"
                placeholder="Enter any additional observations or notes"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
          >
            {isLoading ? "Analyzing..." : "Analyze Emotions"}
          </button>
        </div>
      </form>
    </div>
  );
}
