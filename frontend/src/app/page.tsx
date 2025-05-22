import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-white to-blue-50/30">
      {/* Hero Section - Enhanced with animation and better styling */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-28 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col-reverse md:flex-row items-center justify-between px-4 md:px-10">
            <div className="md:w-1/2 text-center md:text-left">
              <div className="animate-fade-in-up max-w-xl mx-auto md:mx-0">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                  Smart Healthcare
                  <br />
                  <span className="text-blue-600 relative group">
                    Redefined
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 transform origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
                  </span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  EALTH combines cutting-edge AI technology with healthcare
                  expertise to provide intelligent diagnostics and monitoring
                  solutions for better patient outcomes.
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <Link
                    href="/disease-detection"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 flex items-center"
                  >
                    <span>Try Disease Detection</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
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
            <div className="md:w-1/2 mb-10 md:mb-0 flex justify-center">
              <div className="relative h-64 md:h-96 w-full flex items-center justify-center animate-float">
                <div className="absolute w-full h-full bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full opacity-30 blur-2xl transform scale-75"></div>
                <svg
                  viewBox="0 0 200 200"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full max-w-md max-h-md hover:scale-105 transition-transform duration-300 filter drop-shadow-xl"
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

                    {/* Add glossy effect */}
                    <filter
                      id="shadow"
                      x="-20%"
                      y="-20%"
                      width="140%"
                      height="140%"
                    >
                      <feDropShadow
                        dx="0"
                        dy="3"
                        stdDeviation="5"
                        floodColor="rgba(0,0,0,0.2)"
                      />
                    </filter>

                    {/* Reflection gradient */}
                    <linearGradient
                      id="reflection"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="white" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="white" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="url(#grad1)"
                    opacity="0.2"
                  />
                  <path
                    d="M100 40 C 70 40 50 60 50 90 C 50 130 100 170 100 170 C 100 170 150 130 150 90 C 150 60 130 40 100 40 Z"
                    fill="url(#grad1)"
                    stroke="white"
                    strokeWidth="3"
                    transform="scale(0.8) translate(25, 20)"
                    filter="url(#shadow)"
                  />
                  {/* Add highlight */}
                  <path
                    d="M80 50 C 60 50 55 70 60 85"
                    stroke="url(#reflection)"
                    strokeWidth="4"
                    fill="none"
                    opacity="0.7"
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
                    opacity="0.8"
                    filter="url(#shadow)"
                  >
                    <animate
                      attributeName="r"
                      values="8;9;8"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle
                    cx="140"
                    cy="70"
                    r="6"
                    fill="url(#grad2)"
                    opacity="0.8"
                    filter="url(#shadow)"
                  >
                    <animate
                      attributeName="r"
                      values="6;7;6"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle
                    cx="70"
                    cy="140"
                    r="5"
                    fill="url(#grad3)"
                    opacity="0.8"
                    filter="url(#shadow)"
                  >
                    <animate
                      attributeName="r"
                      values="5;6;5"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle
                    cx="130"
                    cy="130"
                    r="7"
                    fill="url(#grad3)"
                    opacity="0.8"
                    filter="url(#shadow)"
                  >
                    <animate
                      attributeName="r"
                      values="7;8;7"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <line
                    x1="65"
                    y1="75"
                    x2="85"
                    y2="95"
                    stroke="url(#grad2)"
                    strokeWidth="2"
                    opacity="0.6"
                  >
                    <animate
                      attributeName="opacity"
                      values="0.6;0.8;0.6"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </line>
                  <line
                    x1="135"
                    y1="75"
                    x2="115"
                    y2="95"
                    stroke="url(#grad2)"
                    strokeWidth="2"
                    opacity="0.6"
                  >
                    <animate
                      attributeName="opacity"
                      values="0.6;0.8;0.6"
                      dur="2.5s"
                      repeatCount="indefinite"
                    />
                  </line>
                  <path
                    d="M 40 100 L 160 100 M 100 40 L 100 160"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  <text
                    x="100"
                    y="185"
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="bold"
                    fill="rgb(59, 130, 246)"
                  >
                    EALTH AI
                  </text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Section - Enhanced with better visual effects */}
      <section className="py-10 bg-white shadow-md relative z-20">
        <div className="container mx-auto px-6 md:px-10">
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              href="/disease-detection"
              className="flex items-center gap-3 px-6 py-4 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors group shadow-sm hover:shadow-md transform hover:-translate-y-1 transition-all duration-200"
            >
              <span className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center text-white shadow-inner group-hover:scale-110 transition-transform">
                ❤️
              </span>
              <span className="font-medium">Disease Detection</span>
              <span className="transform transition-transform group-hover:translate-x-1 text-red-500">
                →
              </span>
            </Link>
            <Link
              href="/psychiatrist"
              className="flex items-center gap-3 px-6 py-4 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors group shadow-sm hover:shadow-md transform hover:-translate-y-1 transition-all duration-200"
            >
              <span className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white shadow-inner group-hover:scale-110 transition-transform">
                🧠
              </span>
              <span className="font-medium">AI Psychiatrist</span>
              <span className="transform transition-transform group-hover:translate-x-1 text-blue-500">
                →
              </span>
            </Link>
            <Link
              href="/fall-detection"
              className="flex items-center gap-3 px-6 py-4 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition-colors group shadow-sm hover:shadow-md transform hover:-translate-y-1 transition-all duration-200"
            >
              <span className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-inner group-hover:scale-110 transition-transform">
                ⚠️
              </span>
              <span className="font-medium">Fall Detection</span>
              <span className="transform transition-transform group-hover:translate-x-1 text-indigo-500">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced cards with better hover effects */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6 md:px-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 relative inline-block">
              Our Innovative Modules
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-6">
              EALTH's integrated platform offers multiple healthcare solutions
              powered by state-of-the-art AI technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Disease Detection Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group border border-gray-100">
              <div className="h-48 bg-gradient-to-br from-red-50 to-red-200 flex items-center justify-center relative overflow-hidden">
                <div className="text-red-600 text-6xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  ❤️
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                {/* Decorative elements */}
                <div className="absolute top-5 left-5 w-10 h-10 border-2 border-red-300 rounded-full opacity-30 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="absolute bottom-5 right-5 w-20 h-20 border border-red-300 rounded-full opacity-20 group-hover:scale-125 transition-transform duration-500"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-red-600 transition-colors">
                  Disease Detection
                </h3>
                <p className="text-gray-600 mb-6">
                  AI-powered cardiac disease detection and analysis system for
                  early diagnosis of heart conditions including coronary artery
                  disease and arrhythmia.
                </p>
                <div className="flex justify-between items-center">
                  <Link
                    href="/disease-detection"
                    className="inline-block px-5 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-colors shadow-sm hover:shadow-md transform group-hover:scale-105"
                  >
                    Access Module
                  </Link>
                  <span className="text-gray-400 text-sm">Cardiac Health</span>
                </div>
              </div>
            </div>

            {/* AI Psychiatrist Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group border border-gray-100">
              <div className="h-48 bg-gradient-to-br from-blue-50 to-blue-200 flex items-center justify-center relative overflow-hidden">
                <div className="text-blue-600 text-6xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  🧠
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                {/* Decorative elements */}
                <div className="absolute top-5 left-5 w-10 h-10 border-2 border-blue-300 rounded-full opacity-30 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="absolute bottom-5 right-5 w-20 h-20 border border-blue-300 rounded-full opacity-20 group-hover:scale-125 transition-transform duration-500"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors">
                  AI-Powered Psychiatrist
                </h3>
                <p className="text-gray-600 mb-6">
                  Advanced mental health analysis and diagnosis system that uses
                  emotion recognition and natural language processing to provide
                  professional psychiatric support.
                </p>
                <div className="flex justify-between items-center">
                  <Link
                    href="/psychiatrist"
                    className="inline-block px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors shadow-sm hover:shadow-md transform group-hover:scale-105"
                  >
                    Access Module
                  </Link>
                  <span className="text-gray-400 text-sm">Mental Health</span>
                </div>
              </div>
            </div>

            {/* Fall Detection Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group border border-gray-100">
              <div className="h-48 bg-gradient-to-br from-indigo-50 to-indigo-200 flex items-center justify-center relative overflow-hidden">
                <div className="text-indigo-600 text-6xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  ⚠️
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                {/* Decorative elements */}
                <div className="absolute top-5 left-5 w-10 h-10 border-2 border-indigo-300 rounded-full opacity-30 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="absolute bottom-5 right-5 w-20 h-20 border border-indigo-300 rounded-full opacity-20 group-hover:scale-125 transition-transform duration-500"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-indigo-600 transition-colors">
                  Person Fall Detection
                </h3>
                <p className="text-gray-600 mb-6">
                  Real-time monitoring system that detects falls and alerts
                  caregivers, ensuring quick response to potential emergencies,
                  particularly useful for elderly care.
                </p>
                <div className="flex justify-between items-center">
                  <Link
                    href="/fall-detection"
                    className="inline-block px-5 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-colors shadow-sm hover:shadow-md transform group-hover:scale-105"
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

      {/* How It Works Section - Enhanced with better visual hierarchy */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-50 rounded-full"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-indigo-50 rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 relative inline-block">
              How EALTH Works
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-6">
              Our platform seamlessly integrates multiple AI technologies to
              provide comprehensive healthcare solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-100 via-blue-200 to-indigo-100 transform -translate-y-6 z-0"></div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl text-center hover:shadow-md transition-shadow z-10 transform hover:-translate-y-1 transition-transform duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-xl mx-auto mb-5 shadow-md">
                1
              </div>
              <h3 className="font-bold text-lg mb-3 text-blue-800">
                Data Collection
              </h3>
              <p className="text-gray-600">
                Secure collection of health data through our integrated platform
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl text-center hover:shadow-md transition-shadow z-10 transform hover:-translate-y-1 transition-transform duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-xl mx-auto mb-5 shadow-md">
                2
              </div>
              <h3 className="font-bold text-lg mb-3 text-blue-800">
                AI Processing
              </h3>
              <p className="text-gray-600">
                Advanced algorithms analyze patterns and detect anomalies
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl text-center hover:shadow-md transition-shadow z-10 transform hover:-translate-y-1 transition-transform duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-xl mx-auto mb-5 shadow-md">
                3
              </div>
              <h3 className="font-bold text-lg mb-3 text-blue-800">
                Diagnosis
              </h3>
              <p className="text-gray-600">
                Accurate assessment and diagnosis across multiple health domains
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl text-center hover:shadow-md transition-shadow z-10 transform hover:-translate-y-1 transition-transform duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-xl mx-auto mb-5 shadow-md">
                4
              </div>
              <h3 className="font-bold text-lg mb-3 text-blue-800">
                Continuous Monitoring
              </h3>
              <p className="text-gray-600">
                Ongoing tracking of health status with real-time alerts
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
