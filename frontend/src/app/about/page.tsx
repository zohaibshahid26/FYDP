"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  const [visibleSections, setVisibleSections] = useState({
    intro: false,
    modules: false,
    team: false,
  });

  // Intersection Observer setup for scroll animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSections((prev) => ({
            ...prev,
            [entry.target.id]: true,
          }));
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    const sections = ["intro", "modules", "team"];
    sections.forEach((section) => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="absolute inset-0 bg-[url('/about-pattern.svg')] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/30"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
              About EALTH
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl text-blue-100 animate-fade-in animation-delay-300">
              Empowering healthcare through intelligent technology and
              innovative solutions
            </p>
            <div className="mt-8 animate-fade-in animation-delay-600">
              <a
                href="#intro"
                className="inline-flex items-center bg-white text-blue-700 px-6 py-3 rounded-lg font-medium shadow-lg hover:bg-blue-50 transition-all transform hover:-translate-y-1"
              >
                Learn More
                <svg
                  className="ml-2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  ></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Introduction Section */}
        <section
          id="intro"
          className={`mb-20 ${
            visibleSections.intro ? "animate-fade-in-up" : "opacity-0"
          }`}
        >
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 p-8 md:p-12">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">
                  SMART Health Monitoring & Diagnostic System
                </h2>
                <p className="text-lg text-gray-700 mb-6">
                  EALTH is an innovative Final Year Project (FYP) that combines
                  cutting-edge artificial intelligence with healthcare expertise
                  to create a comprehensive health monitoring and diagnostic
                  system.
                </p>
                <p className="text-gray-700 mb-6">
                  Our mission is to leverage modern technology to improve
                  healthcare outcomes, enhance patient monitoring, and provide
                  intelligent diagnostic assistance to healthcare professionals.
                </p>
                <div className="flex space-x-2">
                  <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse-blue"></div>
                  <div
                    className="h-2 w-2 rounded-full bg-blue-500 animate-pulse-blue"
                    style={{ animationDelay: "0.3s" }}
                  ></div>
                  <div
                    className="h-2 w-2 rounded-full bg-blue-400 animate-pulse-blue"
                    style={{ animationDelay: "0.6s" }}
                  ></div>
                </div>
              </div>
              <div className="md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-600 p-12 flex items-center justify-center">
                <div className="text-center animate-float">
                  <div className="inline-block p-4 bg-white bg-opacity-20 rounded-full mb-4">
                    <svg
                      className="w-24 h-24 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      ></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    Intelligent Solutions
                  </h3>
                  <p className="text-blue-100 mt-2">
                    Powered by AI and machine learning
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Modules Section */}
        <section
          id="modules"
          className={`mb-20 ${
            visibleSections.modules ? "animate-fade-in-up" : "opacity-0"
          }`}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 inline-block relative">
              Our Modules
              <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 transform -translate-y-1"></span>
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Our comprehensive healthcare platform consists of specialized
              modules designed to enhance different aspects of healthcare
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg hover-card">
              <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-3xl mb-4">
                ⚠️
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                Person Fall Detection
              </h3>
              <p className="text-gray-600">
                Our fall detection system uses computer vision and machine
                learning to monitor and detect falls in real-time. This is
                particularly useful for elderly care and hospital settings,
                where immediate response to falls is critical for patient
                safety.
              </p>
              <Link
                href="/fall-detection"
                className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium"
              >
                Learn more →
              </Link>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover-card">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl mb-4">
                👨‍⚕️
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                AI-Powered Psychiatrist
              </h3>
              <p className="text-gray-600">
                This module combines emotion analysis from facial expressions
                and speech patterns with natural language processing to provide
                mental health assessments, diagnostic assistance, and treatment
                recommendations for healthcare professionals.
              </p>
              <Link
                href="/psychiatrist"
                className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium"
              >
                Learn more →
              </Link>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover-card">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-3xl mb-4">
                🔬
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                Disease Detection
              </h3>
              <p className="text-gray-600">
                Using advanced image processing and deep learning, our disease
                detection module helps identify potential health issues early
                through analysis of medical images and symptomatic data,
                providing valuable insights for clinical decision-making.
              </p>
              <Link
                href="/disease-detection"
                className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium"
              >
                Learn more →
              </Link>
            </div>
          </div>
        </section>

        {/* Team & Development */}
        <section
          id="team"
          className={`mb-20 ${
            visibleSections.team ? "animate-fade-in-up" : "opacity-0"
          }`}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 inline-block relative">
              Team & Development
              <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 transform -translate-y-1"></span>
            </h2>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg mb-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-100 rounded-full transform translate-x-20 -translate-y-20"></div>
            <div className="absolute bottom-0 left-0 w-28 h-28 bg-indigo-100 rounded-full transform -translate-x-14 translate-y-14"></div>

            <div className="relative">
              <p className="text-gray-700 mb-6 leading-relaxed">
                EALTH is developed by a team of dedicated computer science and
                healthcare students as part of their Final Year Project. We
                combine expertise in artificial intelligence, machine learning,
                computer vision, and healthcare to create solutions that address
                real-world challenges.
              </p>

              <p className="text-gray-700 leading-relaxed">
                Our development approach focuses on creating reliable, accurate,
                and user-friendly systems that can be integrated into existing
                healthcare workflows to enhance patient care and clinical
                decision-making.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <div className="bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-700">
                  Artificial Intelligence
                </div>
                <div className="bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-700">
                  Machine Learning
                </div>
                <div className="bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-700">
                  Computer Vision
                </div>
                <div className="bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-700">
                  Healthcare Technology
                </div>
                <div className="bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-700">
                  Clinical Decision Support
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl overflow-hidden shadow-xl">
            <div className="md:flex items-center">
              <div className="md:w-2/3 p-8 md:p-12">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Ready to Experience EALTH?
                </h2>
                <p className="text-blue-100 mb-8 max-w-xl">
                  Explore our modules and discover how our intelligent
                  healthcare solutions
                  <br className="hidden sm:block" /> can transform patient care
                  and clinical outcomes.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/signup"
                    className="bg-white text-blue-700 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-all shadow-md"
                  >
                    Sign Up Now
                  </Link>
                  <Link
                    href="/disease-detection"
                    className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-all"
                  >
                    Try Disease Detection
                  </Link>
                </div>
              </div>
              <div className="hidden md:block md:w-1/3">
                <div className="p-12">
                  <div className="bg-white/20 p-6 rounded-2xl backdrop-blur-sm">
                    <div className="animate-heart-beat">
                      <svg
                        className="w-24 h-24 mx-auto text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Disclaimer</h2>
          <p className="text-gray-700">
            EALTH is a demonstration project and is not intended to replace
            professional medical diagnosis or treatment. All AI-generated
            assessments and recommendations should be reviewed by qualified
            healthcare professionals before clinical use.
          </p>
        </div>
      </div>
    </div>
  );
}
