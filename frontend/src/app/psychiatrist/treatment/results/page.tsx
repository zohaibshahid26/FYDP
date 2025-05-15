"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PrescriptionResponse } from "@/types/psychiatristTypes";
import { FiPrinter, FiArrowLeft, FiFileText } from "react-icons/fi";

export default function TreatmentPlanResultsPage() {
  const router = useRouter();
  const [treatmentPlan, setTreatmentPlan] =
    useState<PrescriptionResponse | null>(null);

  useEffect(() => {
    // Retrieve prescription result from localStorage
    const storedResult = localStorage.getItem("prescriptionResult");

    if (storedResult) {
      try {
        setTreatmentPlan(JSON.parse(storedResult));
      } catch (e) {
        console.error("Error parsing treatment plan result", e);
      }
    } else {
      // Redirect if no result found
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

  const printTreatmentPlan = () => {
    window.print();
  };

  // Helper function to safely render content that might be an object
  const renderContent = (content: any) => {
    if (content === null || content === undefined) {
      return "";
    }

    if (typeof content === "object") {
      // If it's an object with recommendation categories
      if (
        content.immediate_recommendations ||
        content.lifestyle_modifications ||
        content.medication_considerations ||
        content.psychotherapy ||
        content.self_care_strategies
      ) {
        return (
          <div>
            {content.immediate_recommendations && (
              <div className="mb-3">
                <h4 className="font-semibold">Immediate Recommendations:</h4>
                <p className="whitespace-pre-line">
                  {content.immediate_recommendations}
                </p>
              </div>
            )}
            {content.lifestyle_modifications && (
              <div className="mb-3">
                <h4 className="font-semibold">Lifestyle Modifications:</h4>
                <p className="whitespace-pre-line">
                  {content.lifestyle_modifications}
                </p>
              </div>
            )}
            {content.medication_considerations && (
              <div className="mb-3">
                <h4 className="font-semibold">Medication Considerations:</h4>
                <p className="whitespace-pre-line">
                  {content.medication_considerations}
                </p>
              </div>
            )}
            {content.psychotherapy && (
              <div className="mb-3">
                <h4 className="font-semibold">Psychotherapy:</h4>
                <p className="whitespace-pre-line">{content.psychotherapy}</p>
              </div>
            )}
            {content.self_care_strategies && (
              <div className="mb-3">
                <h4 className="font-semibold">Self-Care Strategies:</h4>
                <p className="whitespace-pre-line">
                  {content.self_care_strategies}
                </p>
              </div>
            )}
          </div>
        );
      }

      // For other types of objects, convert to string
      return JSON.stringify(content);
    }

    // For arrays, strings, numbers, etc.
    return content;
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
            className="px-4 py-2 flex items-center border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
          >
            <FiPrinter className="mr-2" />
            Print Plan
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 print:shadow-none">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-5 text-white print:bg-white print:text-black print:border-b-2 print:border-gray-800">
          <h2 className="text-xl font-bold text-center">
            MENTAL HEALTH TREATMENT PLAN
          </h2>
          <p className="text-center text-purple-100 print:text-gray-600">
            EALTH - SMART Health Monitoring System
          </p>
        </div>

        <div className="p-8">
          {treatmentPlan.patient_information && (
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Name</p>
                  <p className="font-medium">
                    {treatmentPlan.patient_information.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Age</p>
                  <p className="font-medium">
                    {treatmentPlan.patient_information.age}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Gender</p>
                  <p className="font-medium">
                    {treatmentPlan.patient_information.gender}
                  </p>
                </div>
              </div>
            </div>
          )}

          {treatmentPlan.condition && (
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">
                Mental Health Assessment
              </h3>
              <div className="bg-purple-50 border border-purple-100 p-4 rounded-lg">
                <p>
                  <span className="font-medium text-purple-800">
                    Condition:
                  </span>{" "}
                  {renderContent(treatmentPlan.condition)}
                </p>
              </div>
            </div>
          )}

          {treatmentPlan.medications &&
            treatmentPlan.medications.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">
                  Medication Recommendations
                </h3>
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                  <ul className="space-y-3">
                    {treatmentPlan.medications.map((med, i) => (
                      <li key={i} className="flex items-start">
                        <span className="inline-block h-5 w-5 bg-blue-200 text-blue-800 rounded-full text-xs flex items-center justify-center font-bold mr-2 mt-0.5">
                          {i + 1}
                        </span>
                        <span>{renderContent(med)}</span>
                      </li>
                    ))}
                  </ul>

                  {treatmentPlan.dosage_instructions && (
                    <div className="mt-6 pt-4 border-t border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2">
                        Dosage Instructions:
                      </h4>
                      <p className="whitespace-pre-line">
                        {renderContent(treatmentPlan.dosage_instructions)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

          {treatmentPlan.treatment_plan && (
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">
                Treatment Approach
              </h3>
              <div className="bg-green-50 border border-green-100 p-4 rounded-lg">
                <div className="whitespace-pre-line">
                  {renderContent(treatmentPlan.treatment_plan)}
                </div>
              </div>
            </div>
          )}

          {treatmentPlan.follow_up_instructions && (
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">
                Follow-up Instructions
              </h3>
              <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-lg">
                <div className="whitespace-pre-line">
                  {renderContent(treatmentPlan.follow_up_instructions)}
                </div>
              </div>
            </div>
          )}

          {treatmentPlan.additional_recommendations &&
            treatmentPlan.additional_recommendations.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">
                  Additional Recommendations
                </h3>
                <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg">
                  <ul className="space-y-3">
                    {treatmentPlan.additional_recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-indigo-600 mr-2">•</span>
                        <span>{renderContent(rec)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

          <div className="mt-12 pt-8 border-t border-gray-200">
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
        </div>
      </div>

      <div className="flex justify-between print:hidden">
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
