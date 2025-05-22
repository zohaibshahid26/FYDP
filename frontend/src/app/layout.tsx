"use client";

import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { AuthProvider } from "@/app/context/AuthContext";
import Navbar from "@/app/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

// Metadata must be in a separate file when using 'use client' directive
// or alternatively use a metadata object within the component

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased text-gray-800`}>
        <AuthProvider>
          <Navbar />
          <main className="min-h-[80vh] pt-16">{children}</main>
          <footer className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white py-12">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="transform hover:translate-y-[-5px] transition-transform duration-300">
                  <h2 className="text-2xl font-bold mb-5 flex items-center">
                    <span className="bg-white text-blue-800 w-8 h-8 rounded-md flex items-center justify-center mr-2 shadow-md">
                      E
                    </span>
                    ALTH
                  </h2>
                  <p className="text-blue-100 leading-relaxed">
                    SMART Health Monitoring and Diagnostic System, providing
                    innovative solutions for modern healthcare challenges.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-5 text-lg border-l-4 border-blue-400 pl-3">
                    Modules
                  </h3>
                  <ul className="space-y-3">
                    <li>
                      <Link
                        href="/psychiatrist"
                        className="text-blue-100 hover:text-white transition-colors flex items-center group"
                      >
                        <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          →
                        </span>
                        AI Powered Psychiatrist
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/fall-detection"
                        className="text-blue-100 hover:text-white transition-colors flex items-center group"
                      >
                        <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          →
                        </span>
                        Fall Detection
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/disease-detection"
                        className="text-blue-100 hover:text-white transition-colors flex items-center group"
                      >
                        <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          →
                        </span>
                        Disease Detection
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-5 text-lg border-l-4 border-blue-400 pl-3">
                    Contact
                  </h3>
                  <div className="space-y-3">
                    <p className="text-blue-100 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-3 text-blue-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      contact@ealth-system.com
                    </p>
                    <p className="text-blue-100 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-3 text-blue-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      +1 (555) 123-4567
                    </p>
                  </div>
                </div>
              </div>
              <div className="border-t border-blue-700/50 mt-8 pt-8 text-center text-blue-200">
                <div className="flex justify-center space-x-6 mb-4">
                  {/* Social Icons */}
                  <a
                    href="#"
                    className="text-blue-300 hover:text-white transition-colors"
                  >
                    <span className="sr-only">Twitter</span>
                    <svg
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="text-blue-300 hover:text-white transition-colors"
                  >
                    <span className="sr-only">GitHub</span>
                    <svg
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="text-blue-300 hover:text-white transition-colors"
                  >
                    <span className="sr-only">LinkedIn</span>
                    <svg
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                </div>
                <div>
                  &copy; {new Date().getFullYear()} EALTH - SMART Health
                  Monitoring System. All rights reserved.
                </div>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
