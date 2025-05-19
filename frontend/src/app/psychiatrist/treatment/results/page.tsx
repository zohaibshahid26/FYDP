"use client";

import { useState, useEffect, JSX } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TreatmentResponse } from "@/types/psychiatristTypes";
import {
  FiPrinter,
  FiArrowLeft,
  FiFileText,
  FiCheckCircle,
  FiList,
  FiMessageSquare,
  FiActivity,
  FiShield,
  FiAlertCircle,
} from "react-icons/fi";
import { downloadPdfReport } from "@/api/psychiatristService";
import { motion } from "framer-motion";

export default function TreatmentPlanResultsPage() {
  const router = useRouter();
  const [treatmentPlan, setTreatmentPlan] = useState<TreatmentResponse | null>(
    null
  );
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const storedResult = localStorage.getItem("prescriptionResult");

    if (storedResult) {
      try {
        setTreatmentPlan(JSON.parse(storedResult));
      } catch (e) {
        console.error("Error parsing treatment plan result", e);
      }
    } else {
      router.push("/psychiatrist/treatment");
    }
  }, [router]);

  if (!treatmentPlan) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const printTreatmentPlan = async () => {
    if (!treatmentPlan) return;

    setIsExporting(true);
    try {
      await downloadPdfReport("treatment", treatmentPlan);
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      alert("Failed to export to PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const renderField = (label: string, content: any, icon?: JSX.Element) => {
    if (
      content === null ||
      content === undefined ||
      (typeof content === "string" && content.trim() === "") ||
      (Array.isArray(content) && content.length === 0)
    ) {
      return null;
    }

    return (
      <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h4 className="text-md font-semibold text-gray-700 mb-2 flex items-center">
          {icon && <span className="mr-2 text-purple-600">{icon}</span>}
          {label}
        </h4>
        {Array.isArray(content) ? (
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            {content.map((item, index) => (
              <li key={index}>
                {typeof item === "object"
                  ? JSON.stringify(item, null, 2)
                  : item}
              </li>
            ))}
          </ul>
        ) : typeof content === "object" ? (
          <pre className="whitespace-pre-wrap text-sm text-gray-600 bg-white p-3 rounded border">
            {JSON.stringify(content, null, 2)}
          </pre>
        ) : (
          <p className="whitespace-pre-line text-gray-600">{content}</p>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link
        href="/psychiatrist/treatment"
        className="flex items-center text-blue-600 mb-6 print:hidden"
      >
        <FiArrowLeft className="mr-2" /> Back to Treatment Planning
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-4">
            <FiFileText size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Mental Health Treatment Plan
            </h1>
            <p className="text-gray-500">
              Generated on {treatmentPlan.generation_date}
            </p>
          </div>
        </div>

        <div className="print:hidden">
          <button
            onClick={printTreatmentPlan}
            disabled={isExporting}
            className="px-4 py-2 flex items-center border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
          >
            {isExporting ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 mr-2"
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
                Processing...
              </>
            ) : (
              <>
                <FiPrinter className="mr-2" />
                Download PDF
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 print:shadow-none">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-5 text-white print:bg-white print:text-black print:border-b-2 print:border-gray-800">
          <h2 className="text-xl font-bold text-center">
            MENTAL HEALTH TREATMENT PLAN
          </h2>
          <p className="text-center text-purple-100 print:text-gray-600">
            EALTH - SMART Health Monitoring System - Generated:{" "}
            {treatmentPlan.generation_date || new Date().toLocaleDateString()}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 md:p-8"
        >
          {treatmentPlan.patient_information && (
            <div className="mb-8 pb-4 border-b border-gray-200">
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                Patient Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Name</p>
                  <p className="font-medium text-gray-700">
                    {treatmentPlan.patient_information.name || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Age</p>
                  <p className="font-medium text-gray-700">
                    {treatmentPlan.patient_information.age || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Gender</p>
                  <p className="font-medium text-gray-700">
                    {treatmentPlan.patient_information.gender || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {renderField(
            "Clinical Formulation",
            treatmentPlan.clinical_formulation,
            <FiMessageSquare />
          )}

          {treatmentPlan.diagnosis && (
            <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="text-md font-semibold text-gray-700 mb-2 flex items-center">
                <FiCheckCircle className="mr-2 text-purple-600" /> Diagnosis
              </h4>
              {renderField(
                "Primary Diagnosis",
                treatmentPlan.diagnosis.primary
              )}
              {renderField(
                "Differential Diagnosis",
                treatmentPlan.diagnosis.differential
              )}
              {renderField(
                "Contributing Factors",
                treatmentPlan.diagnosis.contributing_factors
              )}
            </div>
          )}

          {treatmentPlan.treatment_plan && (
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3 text-gray-800 pt-4 border-t border-gray-200">
                Treatment Plan
              </h3>
              {renderField(
                "Immediate Recommendations",
                treatmentPlan.treatment_plan.immediate_recommendations,
                <FiAlertCircle />
              )}
              {renderField(
                "Psychotherapy",
                treatmentPlan.treatment_plan.psychotherapy,
                <FiMessageSquare />
              )}
              {renderField(
                "Medication Considerations (Classes & Rationale)",
                treatmentPlan.treatment_plan.medication_considerations,
                <FiActivity />
              )}
              {renderField(
                "Lifestyle Modifications",
                treatmentPlan.treatment_plan.lifestyle_modifications,
                <FiList />
              )}
              {renderField(
                "Self-Care Strategies",
                treatmentPlan.treatment_plan.self_care_strategies,
                <FiShield />
              )}
            </div>
          )}

          {renderField(
            "Medications (Classes)",
            treatmentPlan.medications,
            <FiList />
          )}
          {renderField(
            "Dosage Instructions & Monitoring",
            treatmentPlan.dosage_instructions,
            <FiMessageSquare />
          )}

          {treatmentPlan.monitoring_plan && (
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3 text-gray-800 pt-4 border-t border-gray-200">
                Monitoring Plan
              </h3>
              {renderField(
                "Follow-up Schedule",
                treatmentPlan.monitoring_plan.follow_up,
                <FiArrowLeft />
              )}
              {renderField(
                "Assessment Tools",
                treatmentPlan.monitoring_plan.assessment_tools,
                <FiFileText />
              )}
              {renderField(
                "Warning Signs",
                treatmentPlan.monitoring_plan.warning_signs,
                <FiAlertCircle />
              )}
              {renderField(
                "Treatment Milestones",
                treatmentPlan.monitoring_plan.treatment_milestones,
                <FiCheckCircle />
              )}
            </div>
          )}

          {renderField(
            "Follow-up Instructions (Overall)",
            treatmentPlan.follow_up_instructions,
            <FiArrowLeft />
          )}
          {renderField(
            "Additional Recommendations",
            treatmentPlan.additional_recommendations,
            <FiList />
          )}

          <div className="mt-12 pt-8 border-t border-gray-200 text-xs text-gray-500">
            <div className="flex justify-between items-start">
              <div>
                <div className="h-0.5 w-40 bg-black mb-1"></div>
                <p className="text-sm">Generated by AI Mental Health System</p>
              </div>

              <div className="text-right">
                <p className="font-medium">EALTH</p>
                <p className="text-sm">SMART Health Monitoring System</p>
                <p className="text-sm">Contact: support@ealth-system.com</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex justify-between print:hidden mt-8">
        <Link
          href="/psychiatrist/treatment"
          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center"
        >
          <FiArrowLeft className="mr-2" />
          Back to Treatment Form
        </Link>

        <Link
          href="/psychiatrist"
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Complete Session
        </Link>
      </div>
    </div>
  );
}
