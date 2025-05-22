"use client";

import { useState, useContext, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthContext } from "@/app/context/AuthContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const { user, logout } = useContext(AuthContext);
  const pathname = usePathname();

  // Close the menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  }, [pathname]);

  // Handle smart scroll effect and background change
  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== "undefined") {
        // Handle visibility
        if (window.scrollY > 20 && window.scrollY > lastScrollY.current) {
          setVisible(false);
        } else {
          setVisible(true);
        }

        // Handle background change
        if (window.scrollY > 10) {
          setScrolled(true);
        } else {
          setScrolled(false);
        }

        // Update last scroll position
        lastScrollY.current = window.scrollY;
      }
    };

    window.addEventListener("scroll", controlNavbar);
    // Clean up event listener
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, []);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
        ${visible ? "transform-none" : "-translate-y-full"} 
        ${scrolled ? "bg-white shadow-md" : "bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link
                href="/"
                className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                EALTH
              </Link>
            </div>
            <div className="hidden sm:ml-12 sm:flex sm:items-center sm:space-x-8">
              <Link
                href="/"
                className={`text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-all border-b-2 hover:border-blue-300 ${
                  pathname === "/"
                    ? "border-blue-600 text-blue-700"
                    : "border-transparent"
                }`}
              >
                Home
              </Link>
              <Link
                href="/disease-detection"
                className={`text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-all border-b-2 hover:border-blue-300 ${
                  pathname.includes("/disease-detection")
                    ? "border-blue-600 text-blue-700"
                    : "border-transparent"
                }`}
              >
                Disease Detection
              </Link>
              <Link
                href="/psychiatrist"
                className={`text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-all border-b-2 hover:border-blue-300 ${
                  pathname.includes("/psychiatrist")
                    ? "border-blue-600 text-blue-700"
                    : "border-transparent"
                }`}
              >
                Psychiatrist
              </Link>
              <Link
                href="/fall-detection"
                className={`text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-all border-b-2 hover:border-blue-300 ${
                  pathname.includes("/fall-detection")
                    ? "border-blue-600 text-blue-700"
                    : "border-transparent"
                }`}
              >
                Fall Detection
              </Link>
              <Link
                href="/about"
                className={`text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-all border-b-2 hover:border-blue-300 ${
                  pathname === "/about"
                    ? "border-blue-600 text-blue-700"
                    : "border-transparent"
                }`}
              >
                About
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="relative">
                <div>
                  <button
                    type="button"
                    className="bg-blue-50 hover:bg-blue-100 rounded-full flex text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 p-1"
                    id="user-menu"
                    aria-expanded="false"
                    aria-haspopup="true"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-9 w-9 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center text-white font-semibold shadow-md hover:shadow-lg transition-shadow">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </button>
                </div>
                {isDropdownOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-60 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transform transition-all"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu"
                  >
                    <div className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100 bg-blue-50/50">
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      href="/profile"
                      className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                      role="menuitem"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-3 text-gray-400 group-hover:text-blue-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Your Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="group w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                      role="menuitem"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-3 text-gray-400 group-hover:text-blue-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-blue-600 px-4 py-2 text-sm font-medium transition-colors rounded-md hover:bg-blue-50 border border-transparent hover:border-blue-100"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2 rounded-md text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-blue-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
              aria-expanded="false"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="sm:hidden bg-white shadow-lg rounded-b-lg overflow-hidden transition-all animate-fadeIn">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className={`${
                pathname === "/"
                  ? "bg-blue-50 border-l-4 border-blue-500 text-blue-700"
                  : "text-gray-700 hover:bg-blue-50 hover:border-l-4 hover:border-blue-300"
              } block pl-3 pr-4 py-2 text-base font-medium transition-colors`}
            >
              Home
            </Link>
            <Link
              href="/disease-detection"
              className={`${
                pathname.includes("/disease-detection")
                  ? "bg-blue-50 border-l-4 border-blue-500 text-blue-700"
                  : "text-gray-700 hover:bg-blue-50 hover:border-l-4 hover:border-blue-300"
              } block pl-3 pr-4 py-2 text-base font-medium transition-colors`}
            >
              Disease Detection
            </Link>
            <Link
              href="/psychiatrist"
              className={`${
                pathname.includes("/psychiatrist")
                  ? "bg-blue-50 border-l-4 border-blue-500 text-blue-700"
                  : "text-gray-700 hover:bg-blue-50 hover:border-l-4 hover:border-blue-300"
              } block pl-3 pr-4 py-2 text-base font-medium transition-colors`}
            >
              Psychiatrist
            </Link>
            <Link
              href="/fall-detection"
              className={`${
                pathname.includes("/fall-detection")
                  ? "bg-blue-50 border-l-4 border-blue-500 text-blue-700"
                  : "text-gray-700 hover:bg-blue-50 hover:border-l-4 hover:border-blue-300"
              } block pl-3 pr-4 py-2 text-base font-medium transition-colors`}
            >
              Fall Detection
            </Link>
            <Link
              href="/about"
              className={`${
                pathname === "/about"
                  ? "bg-blue-50 border-l-4 border-blue-500 text-blue-700"
                  : "text-gray-700 hover:bg-blue-50 hover:border-l-4 hover:border-blue-300"
              } block pl-3 pr-4 py-2 text-base font-medium transition-colors`}
            >
              About
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 bg-gray-50">
            {user ? (
              <>
                <div className="flex items-center px-4 py-2">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-md">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      {user.name}
                    </div>
                    <div className="text-sm font-medium text-gray-500 truncate max-w-[200px]">
                      {user.email}
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-2 text-base font-medium text-gray-700 hover:bg-blue-50 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Your Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-base font-medium text-gray-700 hover:bg-blue-50 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-3 space-y-1 px-4 py-2">
                <Link
                  href="/login"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-blue-50 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 011-1H4a1 1 0 01-1-1V3zm5.707 8.707a1 1 0 01-1.414 0L5.586 9H13a1 1 0 110-2H5.586l1.707-1.707a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                  </svg>
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
