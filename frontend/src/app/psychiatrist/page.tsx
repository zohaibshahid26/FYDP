"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FiActivity,
  FiMessageSquare,
  FiArrowRight,
  FiBarChart2,
  FiBriefcase,
  FiShield,
} from "react-icons/fi";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function PsychiatristHome() {
  return (
    <ProtectedRoute>
      <div className="min-h-[80vh]">
        {/* Hero Section with Gradient Mesh Background */}
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-white relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
          <div className="container mx-auto px-4 py-20">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-16"
              >
                <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                  AI-Powered Mental Health Suite
                </h1>
                <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                  Our clinical-grade AI platform provides comprehensive mental
                  health assessment, analysis, and treatment planning with the
                  precision and care of professional healthcare.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Analysis Card - Primary Action */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="group bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-blue-100"
                  whileHover={{
                    y: -8,
                    transition: { duration: 0.2 },
                    boxShadow:
                      "0 20px 30px -5px rgba(0, 0, 0, 0.1), 0 10px 15px -5px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <div className="h-56 bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-pattern-dots opacity-10"></div>
                    <motion.div
                      className="text-white text-6xl relative z-10"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <FiActivity size={90} />
                    </motion.div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center mb-2">
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-full mr-2">
                        RECOMMENDED FIRST STEP
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-700 transition-colors">
                      Clinical Assessment
                    </h2>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      Begin with our comprehensive emotional analysis that
                      evaluates patterns, behaviors, and symptoms. Receive a
                      detailed professional assessment to guide treatment
                      decisions.
                    </p>
                    <Link
                      href="/psychiatrist/analysis"
                      className="inline-flex items-center justify-center w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-lg transition-all duration-300 shadow-md hover:shadow-lg font-medium"
                    >
                      Begin Assessment
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <FiArrowRight className="ml-2" />
                      </motion.div>
                    </Link>
                  </div>
                </motion.div>

                {/* Conversation Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="group bg-white rounded-2xl shadow-xl overflow-hidden"
                  whileHover={{
                    y: -8,
                    transition: { duration: 0.2 },
                    boxShadow:
                      "0 20px 30px -5px rgba(0, 0, 0, 0.1), 0 10px 15px -5px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <div className="h-56 bg-gradient-to-r from-emerald-600 to-emerald-700 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-pattern-circuit opacity-10"></div>
                    <motion.div
                      className="text-white text-6xl relative z-10"
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <FiMessageSquare size={90} />
                    </motion.div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center mb-2">
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-full mr-2">
                        THERAPEUTIC SUPPORT
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-emerald-700 transition-colors">
                      AI Therapeutic Chat
                    </h2>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      Engage in confidential conversations with our advanced AI
                      assistant that provides empathetic support and guidance
                      for mental health concerns.
                    </p>
                    <Link
                      href="/psychiatrist/chat"
                      className="inline-flex items-center justify-center w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white text-center rounded-lg transition-all duration-300 shadow-md hover:shadow-lg font-medium"
                    >
                      Start Conversation
                      <FiArrowRight className="ml-2" />
                    </Link>
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-16 max-w-3xl mx-auto"
              >
                <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <FiBarChart2 className="mr-2 text-blue-600" />
                    Professional Workflow
                  </h3>
                  <ol className="mb-6">
                    <li className="flex items-start mb-4">
                      <div className="bg-blue-100 text-blue-800 font-bold rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                        1
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          Complete Clinical Assessment
                        </p>
                        <p className="text-gray-600 mt-1">
                          Analyze emotional indicators to generate detailed
                          insights into mental health patterns and potential
                          conditions
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start mb-4">
                      <div className="bg-indigo-100 text-indigo-800 font-bold rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                        2
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          Review and Edit Professional Report
                        </p>
                        <p className="text-gray-600 mt-1">
                          Customize the comprehensive assessment report with
                          clinical observations and professional insights
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-purple-100 text-purple-800 font-bold rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                        3
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          Generate Treatment Recommendations
                        </p>
                        <p className="text-gray-600 mt-1">
                          Create personalized treatment plans based on
                          assessment results and clinical judgment
                        </p>
                      </div>
                    </li>
                  </ol>

                  <div className="flex flex-wrap gap-3 border-t border-gray-200 pt-5">
                    <div className="flex items-center text-sm text-gray-700">
                      <FiShield className="mr-1 text-blue-600" /> HIPAA
                      Compliant
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <FiBriefcase className="mr-1 text-blue-600" />{" "}
                      Professional Grade
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
          {/* Features Section */}
          <div className="bg-gray-50 py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold text-center mb-12">
                Advanced Clinical Capabilities
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Editable Reports
                  </h3>
                  <p className="text-gray-600">
                    Customize AI-generated reports with your professional
                    insights and observations
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Evidence-Based</h3>
                  <p className="text-gray-600">
                    Treatment recommendations based on the latest psychiatric
                    research and clinical guidelines
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Follow-up Care</h3>
                  <p className="text-gray-600">
                    Schedule and track follow-up appointments and monitor
                    treatment progress over time
                  </p>
                </div>
              </div>
            </div>
          </div>{" "}
        </div>
      </div>
    </ProtectedRoute>
  );
}
