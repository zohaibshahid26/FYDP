"use client";

import React, { createContext, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import authService, {
  User,
  LoginData,
  RegisterData,
  AuthResponse,
} from "@/api/authService";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Try to load cached user data immediately to prevent flickering
  useEffect(() => {
    // First try to load from localStorage to have some data immediately
    try {
      const cachedUser = localStorage.getItem("user");
      if (cachedUser) {
        setUser(JSON.parse(cachedUser));
      }
    } catch (err) {
      console.error("Failed to load cached user:", err);
    }
  }, []);

  // Check if user is authenticated on initial load
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        // Initialize auth headers
        authService.initializeAuth();

        // Verify/refresh token with server
        const userData = await authService.getCurrentUser();

        // Only update state if component is still mounted
        if (isMounted) {
          if (userData) {
            setUser(userData);

            // Update cache with fresh data
            localStorage.setItem("user", JSON.stringify(userData));
          } else {
            // Clear cached user if server verification fails
            setUser(null);
            localStorage.removeItem("user");
          }

          setLoading(false);
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        if (isMounted) {
          setLoading(false);
          setUser(null);
          localStorage.removeItem("user");
        }
      }
    };

    initAuth();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle login
  const login = async (credentials: LoginData): Promise<AuthResponse> => {
    setError(null);
    setLoading(true);

    try {
      const response = await authService.login(credentials);

      if (response.success && response.user) {
        setUser(response.user);

        // Store user info in localStorage
        localStorage.setItem("user", JSON.stringify(response.user));
      } else {
        setError(response.message || "Login failed");
      }

      setLoading(false);
      return response;
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
      setLoading(false);
      return { success: false, message: err.message || "Login failed" };
    }
  };

  // Handle registration
  const register = async (userData: RegisterData): Promise<AuthResponse> => {
    setError(null);
    setLoading(true);

    try {
      const response = await authService.register(userData);
      setLoading(false);

      if (response.success) {
        // Automatically log the user in after successful registration
        return await login({
          email: userData.email,
          password: userData.password,
        });
      }

      if (response.message) {
        setError(response.message);
      }

      return response;
    } catch (err: any) {
      setError(err.message || "An error occurred during registration");
      setLoading(false);
      return { success: false, message: err.message || "Registration failed" };
    }
  };

  // Handle logout
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);

    // Redirect to login page if not already there
    if (pathname !== "/login") {
      router.push("/login");
    }
  }, [router, pathname]);

  // Handle token refresh
  useEffect(() => {
    // Check token expiration every minute
    const tokenRefreshInterval = setInterval(async () => {
      if (user) {
        try {
          const refreshed = await authService.refreshAuthToken();
          if (!refreshed) {
            logout();
          }
        } catch (err) {
          logout();
        }
      }
    }, 60000); // 1 minute

    return () => clearInterval(tokenRefreshInterval);
  }, [user, logout]);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
