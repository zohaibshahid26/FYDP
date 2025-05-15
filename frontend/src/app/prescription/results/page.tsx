"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PrescriptionResponse } from "@/types/psychiatristTypes";

export default function PrescriptionResultsPage() {
  const router = useRouter();
  const [prescriptionResult, setPrescriptionResult] =
    useState<PrescriptionResponse | null>(null);

  useEffect(() => {
    // Retrieve prescription result from localStorage
    const storedResult = localStorage.getItem("prescriptionResult");

    if (storedResult) {
      try {
        setPrescriptionResult(JSON.parse(storedResult));
      } catch (e) {
        console.error("Error parsing prescription result", e);
      }
    } else {
      // Redirect if no result found
      router.push("/prescription");
    }
  }, [router]);

  if (!prescriptionResult) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const printPrescription = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="print:hidden mb-6">
        <h1 className="text-3xl font-bold">Prescription</h1>
        <p className="text-gray-500">
          Generated on {prescriptionResult.generation_date}
        </p>
      </div>

      <div
        id="prescription"
        className="bg-white p-6 rounded-lg shadow-lg mb-8 print:shadow-none"
      >
        <div className="border-b-2 border-gray-800 pb-4 mb-6 print:border-b-2 print:pb-4">
          <h2 className="text-2xl font-bold text-center">
            MEDICAL PRESCRIPTION
          </h2>
          <p className="text-center text-gray-500">
            Date: {prescriptionResult.generation_date}
          </p>
        </div>

        {prescriptionResult.patient_information && (
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-2">Patient Information</h3>
            <p>
              <span className="font-medium">Name:</span>{" "}
              {prescriptionResult.patient_information.name}
            </p>
            <p>
              <span className="font-medium">Age:</span>{" "}
              {prescriptionResult.patient_information.age}
            </p>
            <p>
              <span className="font-medium">Gender:</span>{" "}
              {prescriptionResult.patient_information.gender}
            </p>
          </div>
        )}

        {prescriptionResult.condition && (
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-2">Clinical Assessment</h3>
            <p>
              <span className="font-medium">Condition:</span>{" "}
              {prescriptionResult.condition}
            </p>
          </div>
        )}

        {prescriptionResult.medications &&
          prescriptionResult.medications.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-2">Medications</h3>
              <ul className="list-disc pl-6">
                {prescriptionResult.medications.map((med, i) => (
                  <li key={i} className="mb-2">
                    {med}
                  </li>
                ))}
              </ul>

              {prescriptionResult.dosage_instructions && (
                <div className="mt-4">
                  <h4 className="font-medium">Dosage Instructions:</h4>
                  <p className="whitespace-pre-line">
                    {prescriptionResult.dosage_instructions}
                  </p>
                </div>
              )}
            </div>
          )}

        {prescriptionResult.treatment_plan && (
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-2">Treatment Plan</h3>
            <p className="whitespace-pre-line">
              {prescriptionResult.treatment_plan}
            </p>
          </div>
        )}

        {prescriptionResult.follow_up_instructions && (
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-2">Follow-up Instructions</h3>
            <p className="whitespace-pre-line">
              {prescriptionResult.follow_up_instructions}
            </p>
          </div>
        )}

        {prescriptionResult.additional_recommendations &&
          prescriptionResult.additional_recommendations.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-2">
                Additional Recommendations
              </h3>
              <ul className="list-disc pl-6">
                {prescriptionResult.additional_recommendations.map((rec, i) => (
                  <li key={i} className="mb-2">
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

        <div className="mt-12 pt-8 border-t">
          <div className="flex justify-between items-start">
            <div>
              <div className="h-0.5 w-32 bg-black mb-1"></div>
              <p className="text-sm">Doctor's Signature</p>
            </div>

            <div className="text-right">
              <p className="font-medium">AI Mental Health System</p>
              <p className="text-sm">Medical License: AI-MH-2023</p>
              <p className="text-sm">Contact: support@aimentalhealth.org</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between print:hidden">
        <Link
          href="/prescription"
          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Back to Prescription Form
        </Link>

        <button
          onClick={printPrescription}
          className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          Print Prescription
        </button>
      </div>
    </div>
  );
}
