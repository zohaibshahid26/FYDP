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
      {" "}
      <body className={`${inter.className} antialiased text-gray-800`}>
        {" "}
        <AuthProvider>
          <Navbar />
          <main className="min-h-[80vh] pt-16">{children}</main>
          <footer className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white py-8">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h2 className="text-xl font-bold mb-4">EALTH</h2>
                  <p className="text-blue-200">
                    SMART Health Monitoring and Diagnostic System, providing
                    innovative solutions for modern healthcare challenges.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Modules</h3>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="/psychiatrist"
                        className="text-blue-200 hover:text-white transition-colors"
                      >
                        AI Powered Psychiatrist
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/fall-detection"
                        className="text-blue-200 hover:text-white transition-colors"
                      >
                        Fall Detection
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/disease-detection"
                        className="text-blue-200 hover:text-white transition-colors"
                      >
                        Disease Detection
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Contact</h3>
                  <p className="text-blue-200">
                    Email: contact@ealth-system.com
                  </p>
                  <p className="text-blue-200">Phone: +1 (555) 123-4567</p>
                </div>
              </div>
              <div className="border-t border-blue-700 mt-6 pt-6 text-center text-blue-200">
                &copy; {new Date().getFullYear()} EALTH - SMART Health
                Monitoring System. All rights reserved.
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
