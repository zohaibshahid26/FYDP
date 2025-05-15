"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { generatePrescription } from "@/api/psychiatristService";
import { AnalysisResponse, PrescriptionData } from "@/types/psychiatristTypes";

export default function PrescriptionPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(
    null
  );
  const [formData, setFormData] = useState<PrescriptionData>({
    patient_name: "",
    patient_age: "",
    patient_gender: "",
    mental_assessment: {},
  });

  useEffect(() => {
    // Retrieve analysis result from localStorage
    const storedResult = localStorage.getItem("analysisResult");

    if (storedResult) {
      try {
        const result = JSON.parse(storedResult) as AnalysisResponse;
        setAnalysisResult(result);

        // Pre-fill the form with data from analysis
        setFormData((prev) => ({
          ...prev,
          mental_assessment: {
            condition: result.condition,
            differential_diagnosis: result.differential_diagnosis,
            severity: result.severity,
          },
        }));
      } catch (e) {
        console.error("Error parsing analysis result", e);
      }
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await generatePrescription(formData);

      // Store the prescription result
      localStorage.setItem("prescriptionResult", JSON.stringify(response));

      // Redirect to results page
      router.push("/prescription/results");
    } catch (err) {
      setError("Failed to generate prescription. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Generate Prescription</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded">
          {error}
        </div>
      )}

      {analysisResult ? (
        <div className="bg-blue-50 p-4 mb-6 rounded-lg border border-blue-100">
          <h2 className="font-semibold text-lg mb-2">Using Analysis Results</h2>
          <p>
            Diagnosis:{" "}
            <span className="font-medium">{analysisResult.condition}</span> (
            {analysisResult.severity})
          </p>
        </div>
      ) : (
        <div className="bg-yellow-50 p-4 mb-6 rounded-lg border border-yellow-100">
          <h2 className="font-semibold text-lg mb-2">No Analysis Results</h2>
          <p>
            You haven't performed an analysis yet.
            <a href="/analysis" className="text-blue-600 hover:underline ml-2">
              Perform Analysis First
            </a>
          </p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg"
      >
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Patient Information</h2>

          <div>
            <label className="block mb-1">Patient Name</label>
            <input
              type="text"
              name="patient_name"
              value={formData.patient_name}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

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

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:bg-purple-300"
            >
              {isLoading ? "Generating..." : "Generate Prescription"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
