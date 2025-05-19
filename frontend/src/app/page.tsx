import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col-reverse md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                Smart Healthcare
                <br />
                <span className="text-blue-600">Redefined</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                EALTH combines cutting-edge AI technology with healthcare
                expertise to provide intelligent diagnostics and monitoring
                solutions.
              </p>
              <div className="flex space-x-4">
                <Link
                  href="/psychiatrist"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                >
                  Try AI Psychiatrist
                </Link>
                <Link
                  href="/about"
                  className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 mb-10 md:mb-0">
              <div className="relative h-64 md:h-96 w-full flex items-center justify-center">
                <svg
                  viewBox="0 0 200 200"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full max-w-md max-h-md"
                >
                  <defs>
                    <linearGradient
                      id="grad1"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        style={{
                          stopColor: "rgb(59, 130, 246)",
                          stopOpacity: 1,
                        }}
                      />
                      <stop
                        offset="100%"
                        style={{
                          stopColor: "rgb(37, 99, 235)",
                          stopOpacity: 1,
                        }}
                      />
                    </linearGradient>
                    <linearGradient
                      id="grad2"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        style={{
                          stopColor: "rgb(16, 185, 129)",
                          stopOpacity: 1,
                        }}
                      />
                      <stop
                        offset="100%"
                        style={{
                          stopColor: "rgb(5, 150, 105)",
                          stopOpacity: 1,
                        }}
                      />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="url(#grad1)"
                    opacity="0.1"
                  />
                  <path
                    d="M100 40 C 70 40 50 60 50 90 C 50 130 100 170 100 170 C 100 170 150 130 150 90 C 150 60 130 40 100 40 Z"
                    fill="url(#grad1)"
                    stroke="white"
                    strokeWidth="3"
                    transform="scale(0.8) translate(25, 20)"
                  />
                  <rect
                    x="92"
                    y="75"
                    width="16"
                    height="50"
                    fill="white"
                    rx="3"
                    transform="scale(0.8) translate(25, 20)"
                  />
                  <rect
                    x="75"
                    y="92"
                    width="50"
                    height="16"
                    fill="white"
                    rx="3"
                    transform="scale(0.8) translate(25, 20)"
                  />
                  <circle
                    cx="60"
                    cy="70"
                    r="8"
                    fill="url(#grad2)"
                    opacity="0.7"
                  />
                  <circle
                    cx="140"
                    cy="70"
                    r="6"
                    fill="url(#grad2)"
                    opacity="0.7"
                  />
                  <circle
                    cx="70"
                    cy="140"
                    r="5"
                    fill="url(#grad2)"
                    opacity="0.6"
                  />
                  <circle
                    cx="130"
                    cy="130"
                    r="7"
                    fill="url(#grad2)"
                    opacity="0.8"
                  />
                  <line
                    x1="65"
                    y1="75"
                    x2="85"
                    y2="95"
                    stroke="url(#grad2)"
                    strokeWidth="2"
                    opacity="0.5"
                  />
                  <line
                    x1="135"
                    y1="75"
                    x2="115"
                    y2="95"
                    stroke="url(#grad2)"
                    strokeWidth="2"
                    opacity="0.5"
                  />
                  <path
                    d="M 40 100 L 160 100 M 100 40 L 100 160"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  <text
                    x="100"
                    y="185"
                    textAnchor="middle"
                    fontSize="10"
                    fill="rgb(55, 65, 81)"
                  >
                    EALTH AI
                  </text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our Innovative Modules
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* AI Psychiatrist Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-blue-100 flex items-center justify-center">
                <div className="text-blue-600 text-6xl">👨‍⚕️</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">
                  AI-Powered Psychiatrist
                </h3>
                <p className="text-gray-600 mb-4">
                  Advanced mental health analysis and diagnosis system that uses
                  emotion recognition and natural language processing to provide
                  professional psychiatric support.
                </p>
                <Link
                  href="/psychiatrist"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Access Module
                </Link>
              </div>
            </div>

            {/* Fall Detection Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-indigo-100 flex items-center justify-center">
                <div className="text-indigo-600 text-6xl">⚠️</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">
                  Person Fall Detection
                </h3>
                <p className="text-gray-600 mb-4">
                  Real-time monitoring system that detects falls and alerts
                  caregivers, ensuring quick response to potential emergencies,
                  particularly useful for elderly care.
                </p>
                <Link
                  href="/fall-detection"
                  className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Access Module
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Trusted by Healthcare Professionals
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                  DR
                </div>
                <div>
                  <h4 className="font-bold">Dr. Robert Chen</h4>
                  <p className="text-gray-500 text-sm">Neurologist</p>
                </div>
              </div>
              <p className="text-gray-600">
                "EALTH's fall detection system has revolutionized how we monitor
                our elderly patients. The accuracy and quick alerts have
                genuinely saved lives."
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                  JP
                </div>
                <div>
                  <h4 className="font-bold">Dr. Jessica Patel</h4>
                  <p className="text-gray-500 text-sm">Psychiatrist</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The AI psychiatrist module provides remarkably accurate initial
                assessments, allowing me to focus more time on complex
                therapeutic interventions."
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                  MM
                </div>
                <div>
                  <h4 className="font-bold">Dr. Michael Morrison</h4>
                  <p className="text-gray-500 text-sm">Chief Medical Officer</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Implementing EALTH across our hospital network has improved
                efficiency and patient outcomes. The integration between modules
                is seamless."
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
