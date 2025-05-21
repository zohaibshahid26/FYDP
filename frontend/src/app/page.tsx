import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      {/* Hero Section - Enhanced with animation and better spacing */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col-reverse md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12">
              <div className="animate-fade-in-up">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                  Smart Healthcare
                  <br />
                  <span className="text-blue-600 relative">
                    Redefined
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
                  </span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  EALTH combines cutting-edge AI technology with healthcare
                  expertise to provide intelligent diagnostics and monitoring
                  solutions for better patient outcomes.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/disease-detection"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                  >
                    Try Disease Detection
                  </Link>
                  <Link
                    href="/psychiatrist"
                    className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-1"
                  >
                    AI Psychiatrist
                  </Link>
                  <Link
                    href="/about"
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 mb-10 md:mb-0">
              <div className="relative h-64 md:h-96 w-full flex items-center justify-center animate-float">
                <svg
                  viewBox="0 0 200 200"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full max-w-md max-h-md hover:scale-105 transition-transform duration-300"
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
                    <linearGradient
                      id="grad3"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        style={{
                          stopColor: "rgb(236, 72, 153)",
                          stopOpacity: 1,
                        }}
                      />
                      <stop
                        offset="100%"
                        style={{
                          stopColor: "rgb(219, 39, 119)",
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
                    fill="url(#grad3)"
                    opacity="0.6"
                  />
                  <circle
                    cx="130"
                    cy="130"
                    r="7"
                    fill="url(#grad3)"
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

      {/* Quick Access Section - New section for better UX */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              href="/disease-detection"
              className="flex items-center gap-2 px-5 py-3 bg-red-50 text-red-700 rounded-full hover:bg-red-100 transition-colors group"
            >
              <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200 transition-colors">
                ❤️
              </span>
              <span>Disease Detection</span>
              <span className="transform transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
            <Link
              href="/psychiatrist"
              className="flex items-center gap-2 px-5 py-3 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors group"
            >
              <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                🧠
              </span>
              <span>AI Psychiatrist</span>
              <span className="transform transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
            <Link
              href="/fall-detection"
              className="flex items-center gap-2 px-5 py-3 bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 transition-colors group"
            >
              <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                ⚠️
              </span>
              <span>Fall Detection</span>
              <span className="transform transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section - Added Disease Detection, better layout and animation */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Our Innovative Modules
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            EALTH's integrated platform offers multiple healthcare solutions
            powered by state-of-the-art AI technology
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Disease Detection Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="h-48 bg-gradient-to-r from-red-100 to-red-200 flex items-center justify-center relative overflow-hidden">
                <div className="text-red-600 text-6xl group-hover:scale-110 transition-transform duration-300">
                  ❤️
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800">
                  Disease Detection
                </h3>
                <p className="text-gray-600 mb-4">
                  AI-powered cardiac disease detection and analysis system for
                  early diagnosis of heart conditions including coronary artery
                  disease and arrhythmia.
                </p>
                <div className="flex justify-between items-center">
                  <Link
                    href="/disease-detection"
                    className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm hover:shadow-md"
                  >
                    Access Module
                  </Link>
                  <span className="text-gray-400 text-sm">Cardiac Health</span>
                </div>
              </div>
            </div>

            {/* AI Psychiatrist Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="h-48 bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center relative overflow-hidden">
                <div className="text-blue-600 text-6xl group-hover:scale-110 transition-transform duration-300">
                  🧠
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800">
                  AI-Powered Psychiatrist
                </h3>
                <p className="text-gray-600 mb-4">
                  Advanced mental health analysis and diagnosis system that uses
                  emotion recognition and natural language processing to provide
                  professional psychiatric support.
                </p>
                <div className="flex justify-between items-center">
                  <Link
                    href="/psychiatrist"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
                  >
                    Access Module
                  </Link>
                  <span className="text-gray-400 text-sm">Mental Health</span>
                </div>
              </div>
            </div>

            {/* Fall Detection Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="h-48 bg-gradient-to-r from-indigo-100 to-indigo-200 flex items-center justify-center relative overflow-hidden">
                <div className="text-indigo-600 text-6xl group-hover:scale-110 transition-transform duration-300">
                  ⚠️
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800">
                  Person Fall Detection
                </h3>
                <p className="text-gray-600 mb-4">
                  Real-time monitoring system that detects falls and alerts
                  caregivers, ensuring quick response to potential emergencies,
                  particularly useful for elderly care.
                </p>
                <div className="flex justify-between items-center">
                  <Link
                    href="/fall-detection"
                    className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md"
                  >
                    Access Module
                  </Link>
                  <span className="text-gray-400 text-sm">Elderly Care</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - New section for better UX */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            How EALTH Works
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Our platform seamlessly integrates multiple AI technologies to
            provide comprehensive healthcare solutions
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-6 rounded-xl text-center hover:bg-blue-100 transition-colors">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">Data Collection</h3>
              <p className="text-gray-600 text-sm">
                Secure collection of health data through our integrated platform
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl text-center hover:bg-blue-100 transition-colors">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">AI Processing</h3>
              <p className="text-gray-600 text-sm">
                Advanced algorithms analyze patterns and detect anomalies
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl text-center hover:bg-blue-100 transition-colors">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">Diagnosis</h3>
              <p className="text-gray-600 text-sm">
                Accurate assessment and diagnosis across multiple health domains
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl text-center hover:bg-blue-100 transition-colors">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl mx-auto mb-4">
                4
              </div>
              <h3 className="font-semibold mb-2">Continuous Monitoring</h3>
              <p className="text-gray-600 text-sm">
                Ongoing tracking of health status with real-time alerts
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Enhanced design */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Trusted by Healthcare Professionals
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            See what medical experts are saying about our innovative healthcare
            solutions
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 mr-4 font-semibold">
                  RC
                </div>
                <div>
                  <h4 className="font-bold">Dr. Robert Chen</h4>
                  <p className="text-gray-500 text-sm">Neurologist</p>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-yellow-500">★★★★★</span>
              </div>
              <p className="text-gray-600 mt-3">
                "EALTH's fall detection system has revolutionized how we monitor
                our elderly patients. The accuracy and quick alerts have
                genuinely saved lives in critical situations."
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 mr-4 font-semibold">
                  JP
                </div>
                <div>
                  <h4 className="font-bold">Dr. Jessica Patel</h4>
                  <p className="text-gray-500 text-sm">Psychiatrist</p>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-yellow-500">★★★★★</span>
              </div>
              <p className="text-gray-600 mt-3">
                "The AI psychiatrist module provides remarkably accurate initial
                assessments, allowing me to focus more time on complex
                therapeutic interventions with my patients."
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 mr-4 font-semibold">
                  MM
                </div>
                <div>
                  <h4 className="font-bold">Dr. Michael Morrison</h4>
                  <p className="text-gray-500 text-sm">Chief Medical Officer</p>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-yellow-500">★★★★★</span>
              </div>
              <p className="text-gray-600 mt-3">
                "Implementing EALTH across our hospital network has improved
                efficiency and patient outcomes. The disease detection module
                has been particularly valuable in early diagnosis."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - New section for better UX */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Experience Smart Healthcare?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
            Start using EALTH's intelligent health monitoring and diagnostic
            solutions today
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/disease-detection"
              className="px-8 py-3 bg-white text-blue-700 rounded-lg hover:bg-gray-100 transition-colors shadow-md"
            >
              Try Disease Detection
            </Link>
            <Link
              href="/psychiatrist"
              className="px-8 py-3 bg-blue-500 text-white border border-blue-400 rounded-lg hover:bg-blue-600 transition-colors shadow-md"
            >
              AI Psychiatrist
            </Link>
            <Link
              href="/fall-detection"
              className="px-8 py-3 bg-blue-500 text-white border border-blue-400 rounded-lg hover:bg-blue-600 transition-colors shadow-md"
            >
              Fall Detection
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
