import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-8">
          Welcome to the Mental Health Analysis System
        </h1>
        <p className="text-xl mb-12">
          Our AI-powered system helps analyze emotions and generate appropriate
          mental health assessments and prescriptions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-bold mb-4">Emotion Analysis</h2>
            <p className="mb-6">
              Upload facial expressions and speech data to analyze emotions and
              receive a mental health assessment.
            </p>
            <Link
              href="/analysis"
              className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Start Analysis
            </Link>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-bold mb-4">Prescription Generation</h2>
            <p className="mb-6">
              Based on analysis results, generate appropriate prescriptions and
              treatment recommendations.
            </p>
            <Link
              href="/prescription"
              className="inline-block px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Generate Prescription
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
