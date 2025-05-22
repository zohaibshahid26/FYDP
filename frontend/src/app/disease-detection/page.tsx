"use client";

import Image from "next/image";
import Link from "next/link";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { useRef } from "react";

export default function Page() {
  // Reference to services section for scroll functionality
  const servicesRef = useRef<HTMLDivElement>(null);

  const scrollToServices = () => {
    servicesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const services = [
    {
      title: "Detect & Analyse Coronary Artery Disease",
      description:
        "Identify risk factors and diagnose coronary artery disease using advanced AI analysis.",
      image: "/images/coronary.jpg",
      href: "/disease-detection/coronary-artery-disease",
      icon: "❤️",
    },
    {
      title: "Detect & Analyse Heart Failure",
      description:
        "Early detection and assessment of heart failure symptoms and severity.",
      image: "/images/heart-failure.jpg",
      href: "/disease-detection/heart-failure",
      icon: "💔",
    },
    {
      title: "Detect & Analyse Arrhythmias",
      description:
        "Detect irregular heart rhythms and analyze ECG patterns for cardiac arrhythmias.",
      image: "/images/arrhythmia.jpg",
      href: "/disease-detection/arrhythmia",
      icon: "⚡",
    },
  ];

  return (
    <ProtectedRoute>
      <div className="bg-gradient-to-b from-white to-blue-50/30">
        {/* Hero Section - Improved accessibility and visual hierarchy */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20 md:py-28">
          <div className="container mx-auto px-6 md:px-10">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 md:pr-12 text-center md:text-left">
                <div className="animate-fade-in-up max-w-xl mx-auto md:mx-0">
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                    Cardiovascular Health
                    <span className="text-blue-600 relative inline-block">
                      Analysis
                      <svg
                        className="absolute -bottom-1 left-0 w-full"
                        height="6"
                        viewBox="0 0 200 6"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          d="M 0 3 Q 50 0 100 3 Q 150 6 200 3"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                          className="text-blue-400"
                        />
                      </svg>
                    </span>
                  </h1>
                  <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                    Advanced AI-powered diagnostic tools for early detection and
                    analysis of cardiac conditions with medical-grade accuracy
                  </p>
                  {/* Added CTA button for better UX */}
                  <button
                    onClick={scrollToServices}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 flex items-center mx-auto md:mx-0"
                    aria-label="Explore cardiac analysis tools"
                  >
                    <span>Explore Analysis Tools</span>
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
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="relative h-64 md:h-80 w-full max-w-md animate-float">
                  <svg
                    viewBox="0 0 200 200"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                    aria-labelledby="heartTitle"
                    role="img"
                  >
                    <title id="heartTitle">Animated heart with ECG line</title>
                    <path
                      d="M10,100 L40,100 L50,60 L60,140 L70,40 L80,160 L90,100 L120,100 L130,40 L140,100 L160,100 L170,80 L180,100 L190,100"
                      stroke="#3b82f6"
                      strokeWidth="3"
                      fill="none"
                      className="ecg-line"
                    />
                    <path
                      d="M100,30 C90,10 60,10 50,30 C35,60 60,120 100,150 C140,120 165,60 150,30 C140,10 110,10 100,30 Z"
                      fill="url(#heartGradient)"
                      stroke="white"
                      strokeWidth="2"
                      opacity="0.8"
                      className="animate-heart-beat"
                    />
                    <defs>
                      <linearGradient
                        id="heartGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          stopColor="#3b82f6"
                          stopOpacity="0.8"
                        />
                        <stop
                          offset="100%"
                          stopColor="#2563eb"
                          stopOpacity="0.9"
                        />
                      </linearGradient>
                      <style>
                        {`
                        @keyframes pulse {
                          0% { transform: scale(0.95); }
                          50% { transform: scale(1.05); }
                          100% { transform: scale(0.95); }
                        }
                        @keyframes ecg-animate {
                          0% { stroke-dashoffset: 1000; }
                          100% { stroke-dashoffset: 0; }
                        }
                        .ecg-line {
                          stroke-dasharray: 1000;
                          stroke-dashoffset: 1000;
                          animation: ecg-animate 3s linear forwards infinite;
                        }
                      `}
                      </style>
                    </defs>
                    <circle
                      cx="100"
                      cy="90"
                      r="55"
                      fill="none"
                      stroke="#bfdbfe"
                      strokeWidth="1"
                      strokeOpacity="0.6"
                    />
                    <circle
                      cx="100"
                      cy="90"
                      r="75"
                      fill="none"
                      stroke="#bfdbfe"
                      strokeWidth="1"
                      strokeOpacity="0.4"
                    />
                    <circle
                      cx="100"
                      cy="90"
                      r="95"
                      fill="none"
                      stroke="#bfdbfe"
                      strokeWidth="1"
                      strokeOpacity="0.2"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section - Enhanced with clear grouping and labels */}
        <section
          ref={servicesRef}
          id="services"
          className="py-16 px-6 lg:px-20 bg-white scroll-mt-20"
          aria-labelledby="servicesHeading"
        >
          <div className="container mx-auto">
            <h2
              id="servicesHeading"
              className="text-3xl font-bold text-center mb-6 relative inline-block"
            >
              Our Services
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
            </h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Choose from our specialized cardiac diagnostic tools
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {services.map((service, index) => (
                <Link
                  key={index}
                  href={service.href}
                  className="w-full max-w-md mx-auto focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-2xl group"
                  aria-labelledby={`service-title-${index}`}
                >
                  <div className="bg-white rounded-2xl shadow-lg hover-card overflow-hidden h-full group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1 border border-gray-100">
                    <div className="relative w-full h-60 sm:h-64 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-0 group-hover:opacity-20 transition-opacity duration-300 z-10"></div>
                      <Image
                        src={service.image}
                        alt=""
                        fill
                        style={{ objectFit: "cover" }}
                        className="rounded-t-2xl transform group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl shadow-md">
                        <span aria-hidden="true">{service.icon}</span>
                      </div>
                    </div>
                    <div className="p-6 sm:p-7 border-t border-gray-100">
                      <h3
                        id={`service-title-${index}`}
                        className="text-xl md:text-2xl font-semibold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors"
                      >
                        {service.title}
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {service.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-600 font-medium inline-flex items-center group-hover:translate-x-2 transition-transform duration-300">
                          Analyze Now
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 ml-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section - Enhanced for better cognitive processing */}
        <section
          className="py-16 bg-gradient-to-b from-gray-50 to-white"
          aria-labelledby="howItWorksHeading"
        >
          <div className="container mx-auto px-6 lg:px-20">
            <h2
              id="howItWorksHeading"
              className="text-3xl font-bold text-center mb-4 relative inline-block"
            >
              How It Works
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
            </h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto mt-6">
              Our cardiac health analysis platform uses advanced AI to provide
              accurate diagnostics
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              {/* Connecting line */}
              <div
                className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-100 via-blue-200 to-indigo-100 transform -translate-y-6 z-0"
                aria-hidden="true"
              ></div>

              {/* Step 1 */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl text-center hover:shadow-md transition-shadow z-10 transform hover:-translate-y-1 transition-transform duration-300">
                <div
                  className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-xl mx-auto mb-5 shadow-md"
                  aria-hidden="true"
                >
                  1
                </div>
                <h3 className="font-bold text-lg mb-3 text-blue-800">
                  Input Your Data
                </h3>
                <p className="text-gray-600">
                  Enter your medical information and test results securely
                </p>
              </div>

              {/* Steps 2-4... */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl text-center hover:shadow-md transition-shadow z-10 transform hover:-translate-y-1 transition-transform duration-300">
                <div
                  className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-xl mx-auto mb-5 shadow-md"
                  aria-hidden="true"
                >
                  2
                </div>
                <h3 className="font-bold text-lg mb-3 text-blue-800">
                  AI Analysis
                </h3>
                <p className="text-gray-600">
                  Our AI model processes your data using advanced algorithms
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl text-center hover:shadow-md transition-shadow z-10 transform hover:-translate-y-1 transition-transform duration-300">
                <div
                  className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-xl mx-auto mb-5 shadow-md"
                  aria-hidden="true"
                >
                  3
                </div>
                <h3 className="font-bold text-lg mb-3 text-blue-800">
                  Medical Diagnosis
                </h3>
                <p className="text-gray-600">
                  Receive a comprehensive cardiac health assessment
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl text-center hover:shadow-md transition-shadow z-10 transform hover:-translate-y-1 transition-transform duration-300">
                <div
                  className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-xl mx-auto mb-5 shadow-md"
                  aria-hidden="true"
                >
                  4
                </div>
                <h3 className="font-bold text-lg mb-3 text-blue-800">
                  Recommendations
                </h3>
                <p className="text-gray-600">
                  Get personalized health recommendations and next steps
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Enhanced with clear purpose */}
        <section
          className="py-16 bg-gradient-to-r from-blue-800 to-indigo-900 text-white"
          aria-labelledby="ctaHeading"
        >
          <div className="container mx-auto px-6 text-center">
            <h2 id="ctaHeading" className="text-2xl md:text-3xl font-bold mb-6">
              Ready to analyze your heart health?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-blue-100">
              Choose one of our specialized cardiac analysis tools to get
              started with your health assessment
            </p>
            <button
              onClick={scrollToServices}
              className="px-8 py-3 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-colors shadow-md inline-flex items-center focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-800"
            >
              Get Started
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </div>
        </section>
      </div>
    </ProtectedRoute>
  );
}
