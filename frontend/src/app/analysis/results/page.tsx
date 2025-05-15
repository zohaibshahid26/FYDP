"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnalysisResponse } from "@/types/psychiatristTypes";

export default function AnalysisResultsPage() {
  const router = useRouter();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(
    null
  );

  useEffect(() => {
    // Retrieve analysis result from localStorage
    const storedResult = localStorage.getItem("analysisResult");

    if (storedResult) {
      try {
        setAnalysisResult(JSON.parse(storedResult));
      } catch (e) {
        console.error("Error parsing analysis result", e);
      }
    } else {
      // Redirect if no result found
      router.push("/analysis");
    }
  }, [router]);

  if (!analysisResult) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Analysis Results</h1>

      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <div className="mb-4 pb-3 border-b">
          <span className="text-gray-500">Generated on:</span>{" "}
          {analysisResult.timestamp}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Mental Health Assessment
            </h2>
            <p className="whitespace-pre-line">
              {analysisResult.mental_health_assessment}
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-2">
              Primary Condition
            </h3>
            <p className="bg-blue-50 p-3 rounded">{analysisResult.condition}</p>

            <h3 className="text-lg font-semibold mt-6 mb-2">Severity</h3>
            <p className="bg-blue-50 p-3 rounded">{analysisResult.severity}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">
              Differential Diagnosis
            </h2>
            <p className="whitespace-pre-line">
              {analysisResult.differential_diagnosis}
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-2">Risk Assessment</h3>
            <p className="bg-blue-50 p-3 rounded">
              {analysisResult.risk_assessment}
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-2">Prognosis</h3>
            <p className="bg-blue-50 p-3 rounded">{analysisResult.prognosis}</p>
          </div>
        </div>

        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Recommendations</h2>

          {analysisResult.recommendations.length > 0 ? (
            <ul className="list-disc pl-6 mb-6">
              {analysisResult.recommendations.map((rec, i) => (
                <li key={i} className="mb-2">
                  {rec}
                </li>
              ))}
            </ul>
          ) : (
            <p>No specific recommendations provided.</p>
          )}

          <h3 className="text-lg font-semibold mt-6 mb-2">Therapy Options</h3>
          {analysisResult.therapy_options.length > 0 ? (
            <ul className="list-disc pl-6 mb-6">
              {analysisResult.therapy_options.map((therapy, i) => (
                <li key={i} className="mb-2">
                  {therapy}
                </li>
              ))}
            </ul>
          ) : (
            <p>No specific therapy options provided.</p>
          )}

          <h3 className="text-lg font-semibold mt-6 mb-2">Follow-up</h3>
          <p>{analysisResult.follow_up}</p>

          {analysisResult.medication_considerations &&
            analysisResult.medication_considerations.length > 0 && (
              <>
                <h3 className="text-lg font-semibold mt-6 mb-2">
                  Medication Considerations
                </h3>
                <ul className="list-disc pl-6">
                  {analysisResult.medication_considerations.map((med, i) => (
                    <li key={i} className="mb-2">
                      {med}
                    </li>
                  ))}
                </ul>
              </>
            )}
        </div>
      </div>

      <div className="flex justify-between">
        <Link
          href="/analysis"
          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Back to Analysis
        </Link>

        <Link
          href="/prescription"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Generate Prescription
        </Link>
      </div>
    </div>
  );
}
