"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnalysisResponse } from "@/types/psychiatristTypes";
import {
  FiFileText,
  FiChevronRight,
  FiAlertTriangle,
  FiCheckCircle,
  FiActivity,
  FiArrowLeft,
  FiPrinter,
  FiDownload,
  FiEdit,
  FiSave,
  FiLayers,
  FiCopy,
} from "react-icons/fi";
import { motion } from "framer-motion";

export default function AnalysisResultsPage() {
  const router = useRouter();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState<AnalysisResponse | null>(
    null
  );
  const [activeTab, setActiveTab] = useState("report"); // "report" or "edit"
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Retrieve analysis result from localStorage
    const storedResult = localStorage.getItem("analysisResult");

    if (storedResult) {
      try {
        const parsed = JSON.parse(storedResult);
        setAnalysisResult(parsed);
        setEditedContent(parsed);
      } catch (e) {
        console.error("Error parsing analysis result", e);
      }
    } else {
      // Redirect if no result found
      router.push("/psychiatrist/analysis");
    }
  }, [router]);

  if (!analysisResult) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Loading assessment results...</p>
      </div>
    );
  }

  // Helper functions for UI
  const getSeverityColor = (severity: string) => {
    const lowerSeverity = severity.toLowerCase();
    if (lowerSeverity.includes("mild"))
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    if (lowerSeverity.includes("moderate"))
      return "bg-orange-100 text-orange-800 border-orange-300";
    if (lowerSeverity.includes("severe"))
      return "bg-red-100 text-red-800 border-red-300";
    return "bg-blue-100 text-blue-700 border-blue-300";
  };

  const getRiskColor = (risk: string) => {
    const lowerRisk = risk.toLowerCase();
    if (lowerRisk.includes("low"))
      return "bg-green-100 text-green-800 border-green-300";
    if (lowerRisk.includes("medium") || lowerRisk.includes("moderate"))
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    if (lowerRisk.includes("high"))
      return "bg-red-100 text-red-800 border-red-300";
    return "bg-gray-100 text-gray-800 border-gray-300";
  };

  // Handle text editing
  const handleTextChange = (field: string, value: string) => {
    setEditedContent((prev) => {
      if (prev === null) return null;
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  // Handle therapy options changes
  const handleTherapyChange = (index: number, value: string) => {
    if (!editedContent) return;

    setEditedContent((prev) => {
      if (!prev) return null;

      const newTherapies = [...prev.therapy_options];
      newTherapies[index] = value;

      return {
        ...prev,
        therapy_options: newTherapies,
      };
    });
  };

  // Handle recommendation changes
  const handleRecommendationChange = (index: number, value: string) => {
    if (!editedContent) return;

    setEditedContent((prev) => {
      if (!prev) return null;

      const newRecommendations = [...prev.recommendations];
      newRecommendations[index] = value;

      return {
        ...prev,
        recommendations: newRecommendations,
      };
    });
  };

  // Handle medication considerations changes
  const handleMedicationChange = (index: number, value: string) => {
    if (!editedContent || !editedContent.medication_considerations) return;

    setEditedContent((prev) => {
      if (!prev || !prev.medication_considerations) return prev;

      const newMedications = [...prev.medication_considerations];
      newMedications[index] = value;

      return {
        ...prev,
        medication_considerations: newMedications,
      };
    });
  };

  // Save changes
  const saveChanges = () => {
    if (!editedContent) return;

    localStorage.setItem("analysisResult", JSON.stringify(editedContent));
    setAnalysisResult(editedContent);
    setActiveTab("report");
  };

  // Export to PDF
  const exportToPdf = () => {
    window.print();
  };

  // Export to Word/Document format
  const exportToDoc = () => {
    // This would normally connect to a backend service to generate a doc
    alert("Report exported to document format!");
  };

  // Copy to clipboard
  const copyToClipboard = () => {
    if (editorRef.current) {
      const text = editorRef.current.innerText;
      navigator.clipboard
        .writeText(text)
        .then(() => {
          alert("Report copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    }
  };

  // Ensure editedContent is not null before rendering edit form
  if (activeTab === "edit" && !editedContent) {
    setActiveTab("report");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Link
          href="/psychiatrist/analysis"
          className="flex items-center text-blue-700 font-medium hover:underline"
        >
          <FiArrowLeft className="mr-2" /> Back to Analysis
        </Link>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportToPdf}
            className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
            title="Print Report"
          >
            <FiPrinter className="mr-2" /> Print
          </button>
          <button
            onClick={exportToDoc}
            className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
            title="Export to Document"
          >
            <FiDownload className="mr-2" /> Export
          </button>
          <button
            onClick={copyToClipboard}
            className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
            title="Copy to Clipboard"
          >
            <FiCopy className="mr-2" /> Copy
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                  <FiFileText size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">
                    Mental Health Assessment
                  </h1>
                  <p className="text-blue-100">
                    Generated on {analysisResult.timestamp}
                  </p>
                </div>
              </div>

              <div className="hidden sm:flex space-x-1">
                <button
                  onClick={() => setActiveTab("report")}
                  className={`px-4 py-2 rounded-t-lg text-sm font-medium ${
                    activeTab === "report"
                      ? "bg-white text-blue-700"
                      : "bg-blue-700/30 text-white hover:bg-blue-700/50"
                  }`}
                >
                  <div className="flex items-center">
                    <FiLayers className="mr-2" /> View Report
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("edit")}
                  className={`px-4 py-2 rounded-t-lg text-sm font-medium ${
                    activeTab === "edit"
                      ? "bg-white text-blue-700"
                      : "bg-blue-700/30 text-white hover:bg-blue-700/50"
                  }`}
                >
                  <div className="flex items-center">
                    <FiEdit className="mr-2" /> Edit Report
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile tabs */}
          <div className="sm:hidden flex border-b">
            <button
              onClick={() => setActiveTab("report")}
              className={`flex-1 py-3 text-center font-medium ${
                activeTab === "report"
                  ? "text-blue-700 border-b-2 border-blue-700"
                  : "text-gray-500"
              }`}
            >
              View Report
            </button>
            <button
              onClick={() => setActiveTab("edit")}
              className={`flex-1 py-3 text-center font-medium ${
                activeTab === "edit"
                  ? "text-blue-700 border-b-2 border-blue-700"
                  : "text-gray-500"
              }`}
            >
              Edit Report
            </button>
          </div>

          {activeTab === "report" ? (
            // View mode
            <div className="p-6" ref={editorRef}>
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                <h2 className="text-lg font-bold text-gray-800 mb-2">
                  Patient Information
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">
                      {analysisResult.patient_information?.name ||
                        "Anonymous Patient"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Age</p>
                    <p className="font-medium">
                      {analysisResult.patient_information?.age || "Unknown"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium">
                      {analysisResult.patient_information?.gender || "Unknown"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div className="text-sm text-blue-500 font-medium mb-1">
                    Primary Condition
                  </div>
                  <div className="text-lg font-semibold">
                    {analysisResult.condition}
                  </div>
                </div>

                <div
                  className={`p-4 rounded-lg border ${getSeverityColor(
                    analysisResult.severity
                  )}`}
                >
                  <div className="text-sm font-medium mb-1">Severity</div>
                  <div className="text-lg font-semibold flex items-center">
                    <FiActivity className="mr-2" />
                    {analysisResult.severity}
                  </div>
                </div>

                <div
                  className={`p-4 rounded-lg border ${getRiskColor(
                    analysisResult.risk_assessment
                  )}`}
                >
                  <div className="text-sm font-medium mb-1">
                    Risk Assessment
                  </div>
                  <div className="text-lg font-semibold flex items-center">
                    <FiAlertTriangle className="mr-2" />
                    {analysisResult.risk_assessment}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
                    <span className="inline-block w-4 h-4 rounded-full bg-blue-600 mr-2"></span>
                    Mental Health Assessment
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="whitespace-pre-line text-gray-700">
                      {analysisResult.mental_health_assessment}
                    </p>
                  </div>

                  <h3 className="text-lg font-semibold mt-6 mb-3 text-gray-800 flex items-center">
                    <span className="inline-block w-4 h-4 rounded-full bg-blue-600 mr-2"></span>
                    Prognosis
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-700">{analysisResult.prognosis}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
                    <span className="inline-block w-4 h-4 rounded-full bg-blue-600 mr-2"></span>
                    Differential Diagnosis
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="whitespace-pre-line text-gray-700">
                      {analysisResult.differential_diagnosis}
                    </p>
                  </div>

                  <h3 className="text-lg font-semibold mt-6 mb-3 text-gray-800 flex items-center">
                    <span className="inline-block w-4 h-4 rounded-full bg-blue-600 mr-2"></span>
                    Follow-up Recommendation
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-700">{analysisResult.follow_up}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                  <FiCheckCircle className="mr-2 text-green-600" />
                  Treatment Recommendations
                </h3>

                {analysisResult.recommendations.length > 0 ? (
                  <ul className="space-y-2 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    {analysisResult.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start">
                        <FiChevronRight className="mt-1 mr-2 text-blue-600 flex-shrink-0" />
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    No specific recommendations provided.
                  </p>
                )}

                <h4 className="font-semibold text-gray-700 mb-2">
                  Therapy Options
                </h4>
                {analysisResult.therapy_options.length > 0 ? (
                  <ul className="space-y-2 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    {analysisResult.therapy_options.map((therapy, i) => (
                      <li key={i} className="flex items-start">
                        <FiChevronRight className="mt-1 mr-2 text-blue-600 flex-shrink-0" />
                        <span className="text-gray-700">{therapy}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    No specific therapy options provided.
                  </p>
                )}

                {analysisResult.medication_considerations &&
                  analysisResult.medication_considerations.length > 0 && (
                    <>
                      <h4 className="font-semibold text-gray-700 mb-2">
                        Medication Considerations
                      </h4>
                      <ul className="space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                        {analysisResult.medication_considerations.map(
                          (med, i) => (
                            <li key={i} className="flex items-start">
                              <FiChevronRight className="mt-1 mr-2 text-blue-600 flex-shrink-0" />
                              <span className="text-gray-700">{med}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </>
                  )}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-500">
                  This report was generated by the EALTH AI Mental Health
                  System.
                </p>
                <p className="text-sm text-gray-500">
                  Always consult with a qualified healthcare professional for
                  medical advice.
                </p>
              </div>
            </div>
          ) : (
            // Edit mode
            <div className="p-6">
              {editedContent && (
                <>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                    <div className="flex items-center">
                      <FiEdit className="text-yellow-600 mr-3" />
                      <p className="text-yellow-800">
                        Edit mode active. Make your changes and click "Save
                        Report" when done.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Primary Condition
                      </label>
                      <input
                        type="text"
                        value={editedContent.condition || ""}
                        onChange={(e) =>
                          handleTextChange("condition", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Severity
                      </label>
                      <select
                        value={editedContent.severity || ""}
                        onChange={(e) =>
                          handleTextChange("severity", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Mild">Mild</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Severe">Severe</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Risk Assessment
                      </label>
                      <select
                        value={editedContent.risk_assessment || ""}
                        onChange={(e) =>
                          handleTextChange("risk_assessment", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Low Risk">Low Risk</option>
                        <option value="Moderate Risk">Moderate Risk</option>
                        <option value="High Risk">High Risk</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Mental Health Assessment
                      </label>
                      <textarea
                        value={editedContent.mental_health_assessment || ""}
                        onChange={(e) =>
                          handleTextChange(
                            "mental_health_assessment",
                            e.target.value
                          )
                        }
                        className="w-full border border-gray-300 rounded-lg p-3 h-40 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Differential Diagnosis
                      </label>
                      <textarea
                        value={editedContent.differential_diagnosis || ""}
                        onChange={(e) =>
                          handleTextChange(
                            "differential_diagnosis",
                            e.target.value
                          )
                        }
                        className="w-full border border-gray-300 rounded-lg p-3 h-40 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Prognosis
                      </label>
                      <textarea
                        value={editedContent.prognosis || ""}
                        onChange={(e) =>
                          handleTextChange("prognosis", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg p-3 h-20 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Follow-up Recommendation
                      </label>
                      <textarea
                        value={editedContent.follow_up || ""}
                        onChange={(e) =>
                          handleTextChange("follow_up", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg p-3 h-20 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Recommendations
                      </label>
                      {editedContent.recommendations &&
                        editedContent.recommendations.map((rec, index) => (
                          <div key={index} className="mb-2 flex items-center">
                            <input
                              type="text"
                              value={rec}
                              onChange={(e) =>
                                handleRecommendationChange(
                                  index,
                                  e.target.value
                                )
                              }
                              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        ))}
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Therapy Options
                      </label>
                      {editedContent.therapy_options &&
                        editedContent.therapy_options.map((therapy, index) => (
                          <div key={index} className="mb-2 flex items-center">
                            <input
                              type="text"
                              value={therapy}
                              onChange={(e) =>
                                handleTherapyChange(index, e.target.value)
                              }
                              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        ))}
                    </div>

                    {editedContent.medication_considerations && (
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Medication Considerations
                        </label>
                        {editedContent.medication_considerations.map(
                          (med, index) => (
                            <div key={index} className="mb-2 flex items-center">
                              <input
                                type="text"
                                value={med}
                                onChange={(e) =>
                                  handleMedicationChange(index, e.target.value)
                                }
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          )
                        )}
                      </div>
                    )}

                    <div className="flex justify-end">
                      <button
                        onClick={() => setActiveTab("report")}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 mr-2 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveChanges}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                      >
                        <FiSave className="mr-2" /> Save Report
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </motion.div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-24 w-24 opacity-10">
          <FiFileText size={96} className="text-indigo-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-3">
          Next Step: Create a Treatment Plan
        </h3>
        <p className="text-gray-700 mb-4">
          Based on this assessment, you can now generate a personalized
          treatment plan addressing the identified conditions and concerns.
        </p>
        <Link
          href="/psychiatrist/treatment"
          className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 hover:shadow-lg"
        >
          Create Treatment Plan
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <FiChevronRight className="ml-2" />
          </motion.div>
        </Link>
      </div>
    </div>
  );
}
