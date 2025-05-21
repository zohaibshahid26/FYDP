import Image from "next/image";
import Link from "next/link";

export default function Page() {
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
    <div>
      {/* Hero Section */}
      <section className="disease-gradient py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12">
              <div className="text-left animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                  Cardiovascular Health{" "}
                  <span className="text-blue-600 relative inline-block">
                    Analysis
                    <svg
                      className="absolute -bottom-1 left-0 w-full"
                      height="6"
                      viewBox="0 0 200 6"
                      xmlns="http://www.w3.org/2000/svg"
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
              </div>
            </div>{" "}
            <div className="md:w-1/2 animate-float">
              <div className="relative h-64 md:h-80 w-full">
                <svg
                  viewBox="0 0 200 200"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                >
                  {/* ECG Line */}
                  <path
                    d="M10,100 L40,100 L50,60 L60,140 L70,40 L80,160 L90,100 L120,100 L130,40 L140,100 L160,100 L170,80 L180,100 L190,100"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    fill="none"
                    className="ecg-line"
                  />
                  {/* Heart Shape */}
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
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
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

                  {/* Pulse Circles */}
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
      {/* Services Section */}
      <section className="py-16 px-6 lg:px-20 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {services.map((service, index) => (
              <Link
                key={index}
                href={service.href}
                className="w-full max-w-md mx-auto"
              >
                <div className="bg-white rounded-2xl shadow-lg hover-card overflow-hidden h-full group">
                  <div className="relative w-full h-60 sm:h-64 overflow-hidden">
                    <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10"></div>
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-t-2xl transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center text-2xl shadow-md">
                      {service.icon}
                    </div>
                  </div>
                  <div className="p-6 sm:p-7 border-t border-gray-100">
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                      {service.title}
                    </h2>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-600 font-medium inline-flex items-center group-hover:translate-x-2 transition-transform duration-300">
                        Analyze Now
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 ml-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
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
      </section>{" "}
      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-20">
          <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Our cardiac health analysis platform uses advanced AI to provide
            accurate diagnostics
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">Input Your Data</h3>
              <p className="text-gray-600 text-sm">
                Enter your medical information and test results
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">AI Analysis</h3>
              <p className="text-gray-600 text-sm">
                Our AI model processes your data using advanced algorithms
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">Medical Diagnosis</h3>
              <p className="text-gray-600 text-sm">
                Receive a comprehensive cardiac health assessment
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl mx-auto mb-4">
                4
              </div>
              <h3 className="font-semibold mb-2">Recommendations</h3>
              <p className="text-gray-600 text-sm">
                Get personalized health recommendations and next steps
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to analyze your heart health?
          </h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto text-blue-100">
            Choose one of our specialized cardiac analysis tools above to get
            started
          </p>
        </div>
      </section>
    </div>
  );
}
