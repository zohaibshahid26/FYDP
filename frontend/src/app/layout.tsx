import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EALTH - SMART Health Monitoring System",
  description: "AI-powered health monitoring and diagnostic system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-white shadow-md sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="font-bold text-2xl text-blue-600">
                  <span className="text-3xl">E</span>
                  ALTH
                </div>
                <span className="hidden sm:inline text-xs text-gray-500 border-l-2 pl-2">
                  SMART Health Monitoring System
                </span>
              </Link>

              <nav>
                <ul className="flex space-x-6">
                  <li>
                    <Link
                      href="/"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                    href="/Analysis"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                    Disease Detection
                  </Link>
                  </li>
                  <li>
                    <Link
                      href="/psychiatrist"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      AI Psychiatrist
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/fall-detection"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Fall Detection
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      About
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </header>
        <main className="min-h-[80vh]">{children}</main>
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
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Contact</h3>
                <p className="text-blue-200">Email: contact@ealth-system.com</p>
                <p className="text-blue-200">Phone: +1 (555) 123-4567</p>
              </div>
            </div>
            <div className="border-t border-blue-700 mt-6 pt-6 text-center text-blue-200">
              &copy; {new Date().getFullYear()} EALTH - SMART Health Monitoring
              System. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
