export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">About EALTH</h1>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
          <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
            <h2 className="text-3xl font-bold text-white">
              SMART Health Monitoring & Diagnostic System
            </h2>
          </div>

          <div className="p-8">
            <p className="text-lg text-gray-600 mb-6">
              EALTH is an innovative Final Year Project (FYP) that combines
              cutting-edge artificial intelligence with healthcare expertise to
              create a comprehensive health monitoring and diagnostic system.
            </p>

            <p className="text-gray-600 mb-6">
              Our mission is to leverage modern technology to improve healthcare
              outcomes, enhance patient monitoring, and provide intelligent
              diagnostic assistance to healthcare professionals.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-gray-800">Our Modules</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-3xl mb-4">
              ⚠️
            </div>
            <h3 className="text-xl font-bold mb-3">Person Fall Detection</h3>
            <p className="text-gray-600">
              Our fall detection system uses computer vision and machine
              learning to monitor and detect falls in real-time. This is
              particularly useful for elderly care and hospital settings, where
              immediate response to falls is critical for patient safety.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl mb-4">
              👨‍⚕️
            </div>
            <h3 className="text-xl font-bold mb-3">AI-Powered Psychiatrist</h3>
            <p className="text-gray-600">
              This module combines emotion analysis from facial expressions and
              speech patterns with natural language processing to provide mental
              health assessments, diagnostic assistance, and treatment
              recommendations for healthcare professionals.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Team & Development
        </h2>

        <div className="bg-white p-8 rounded-xl shadow-lg mb-12">
          <p className="text-gray-600 mb-6">
            EALTH is developed by a team of dedicated computer science and
            healthcare students as part of their Final Year Project. We combine
            expertise in artificial intelligence, machine learning, computer
            vision, and healthcare to create solutions that address real-world
            challenges.
          </p>

          <p className="text-gray-600">
            Our development approach focuses on creating reliable, accurate, and
            user-friendly systems that can be integrated into existing
            healthcare workflows to enhance patient care and clinical
            decision-making.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Disclaimer</h2>
          <p className="text-gray-600">
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
