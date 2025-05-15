import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mental Health Analysis System",
  description: "AI-powered mental health analysis and prescription system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold">
              Mental Health Analysis System
            </h1>
          </div>
        </header>
        <main className="container mx-auto p-4">{children}</main>
        <footer className="bg-gray-100 p-4 mt-8">
          <div className="container mx-auto text-center text-gray-600">
            &copy; {new Date().getFullYear()} Mental Health Analysis System
          </div>
        </footer>
      </body>
    </html>
  );
}
