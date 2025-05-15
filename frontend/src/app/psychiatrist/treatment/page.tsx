"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { generatePrescription } from "@/api/psychiatristService";
import { AnalysisResponse, PrescriptionData } from "@/types/psychiatristTypes";
import {
  FiFileText,
  FiAlertCircle,
  FiCheckCircle,
  FiUser,
  FiArrowLeft,
  FiActivity,
} from "react-icons/fi";
import Link from "next/link";
import { motion } from "framer-motion";

export default function TreatmentPlanPage() {
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
      router.push("/psychiatrist/treatment/results");
    } catch (err) {
      setError("Failed to generate treatment plan. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // If no analysis result is found, show a prominent message to complete analysis first
  if (!analysisResult) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          href="/psychiatrist"
          className="flex items-center text-blue-700 font-medium mb-6 hover:underline"
        >
          <FiArrowLeft className="mr-2" /> Back to Mental Health Services
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-8 text-center"
        >
          <div className="inline-block p-4 bg-yellow-100 rounded-full mb-6">
            <FiAlertCircle className="text-yellow-700" size={48} />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Analysis Required
          </h2>

          <p className="text-gray-700 mb-8 text-lg">
            Before creating a treatment plan, you need to complete a mental
            health analysis. This ensures your treatment recommendations are
            based on a comprehensive assessment.
          </p>

          <Link
            href="/psychiatrist/analysis"
            className="inline-flex items-center px-8 py-3 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <FiActivity className="mr-2" />
            Begin Analysis Now
          </Link>

          <p className="mt-6 text-gray-600 text-sm">
            Already completed an analysis? The results might not have been saved
            properly. Please try analyzing again.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/psychiatrist/analysis/results"
        className="flex items-center text-blue-700 font-medium mb-6 hover:underline"
      >
        <FiArrowLeft className="mr-2" /> Back to Analysis Results
      </Link>

      <div className="flex items-center mb-6">
        <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-4">
          <FiFileText size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Generate Treatment Plan
          </h1>
          <p className="text-gray-600">
            Create a personalized mental health treatment plan based on your
            analysis
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
        </div>
      )}

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <FiCheckCircle className="h-5 w-5 text-blue-600" />
          </div>
          <div className="ml-3">
            <h2 className="font-semibold text-blue-800">
              Analysis Results Loaded
            </h2>
            <p className="text-blue-800 mt-1">
              Condition:{" "}
              <span className="font-medium">{analysisResult.condition}</span> (
              {analysisResult.severity})
            </p>
          </div>
        </div>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg"
      >
        <div className="space-y-6">
          <div className="pb-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <FiUser className="mr-2 text-purple-600" /> Subject Information
            </h2>
            <p className="text-gray-700 text-sm mt-1">
              Enter personal details for the treatment plan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="patient_name"
                value={formData.patient_name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
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
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Gender
            </label>
            <select
              name="patient_gender"
              value={formData.patient_gender}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-6">
            <div className="flex items-center mb-4">
              <motion.div
                animate={{ rotate: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-3"
              >
                <FiCheckCircle size={20} />
              </motion.div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  AI-Generated Plan
                </h3>
                <p className="text-gray-700 text-sm mt-1">
                  Our AI system will generate a comprehensive treatment plan
                  based on your analysis results and personal information
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-purple-300 shadow-md flex items-center"
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
                  Generating...
                </>
              ) : (
                "Generate Treatment Plan"
              )}
            </motion.button>
          </div>
        </div>
      </motion.form>
    </div>
  );
}
