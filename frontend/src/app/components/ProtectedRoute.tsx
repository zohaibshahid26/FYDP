"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthContext } from "@/app/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();
  const [showLoadingState, setShowLoadingState] = useState<boolean>(true);
  const [redirecting, setRedirecting] = useState<boolean>(false);

  // Handle authentication logic and redirect
  useEffect(() => {
    let redirectTimer: NodeJS.Timeout;

    // Always show loading immediately when component mounts
    // This prevents the flash of blank content
    setShowLoadingState(true);

    // If authentication state is determined
    if (!loading) {
      if (isAuthenticated) {
        // If authenticated, show content after a brief loading animation
        const timer = setTimeout(() => {
          setShowLoadingState(false);
        }, 500); // Short delay for smooth transition
        return () => clearTimeout(timer);
      } else {
        // If not authenticated, show redirect animation then redirect
        setRedirecting(true);

        // Store the path they were trying to access for after login
        if (pathname !== "/login" && pathname !== "/signup") {
          sessionStorage.setItem("redirectAfterLogin", pathname);
        }

        // Delay redirect slightly to show the redirect animation
        redirectTimer = setTimeout(() => {
          router.push("/login");
        }, 800);
      }
    }

    return () => {
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [isAuthenticated, loading, router, pathname]);

  // Render beautiful loading state or content
  if (showLoadingState || loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-white to-blue-50">
        <div className="relative">
          {/* Pulsing circles */}
          <div className="absolute inset-0 rounded-full bg-blue-400 opacity-20 animate-ping"></div>
          <div className="absolute inset-2 rounded-full bg-blue-300 opacity-20 animate-ping animation-delay-300"></div>
          <div className="absolute inset-4 rounded-full bg-blue-200 opacity-20 animate-ping animation-delay-600"></div>

          {/* Main spinner */}
          <div className="relative z-10 h-16 w-16 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
        </div>

        <h2 className="mt-6 text-xl font-semibold text-blue-900">
          {redirecting ? "Redirecting to login..." : "Loading..."}
        </h2>
        <p className="mt-2 text-blue-600">
          {redirecting
            ? "Please login to access this page"
            : "Please wait while we prepare your content"}
        </p>

        {/* Animated progress bar */}
        <div className="mt-6 w-64 h-2 bg-blue-100 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r from-blue-500 to-blue-700 ${
              redirecting
                ? "animate-redirect-progress"
                : "animate-loading-progress"
            }`}
          ></div>
        </div>
      </div>
    );
  }

  // If authenticated and not loading, show the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
