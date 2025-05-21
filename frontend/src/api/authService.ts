// Auth service for handling authentication requests
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  access_token?: string;
  refresh_token?: string;
  user?: User;
  message?: string;
  errors?: Record<string, string>;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// Set token in localStorage and axios defaults
const setAuthToken = (token: string | null): void => {
  if (token) {
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  }
};

// Set refresh token in localStorage
const setRefreshToken = (token: string | null): void => {
  if (token) {
    localStorage.setItem("refreshToken", token);
  } else {
    localStorage.removeItem("refreshToken");
  }
};

// Register new user
export const register = async (
  userData: RegisterData
): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/register`, userData);
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    return {
      success: false,
      message: error.message || "Registration failed",
    };
  }
};

// Log in user
export const login = async (credentials: LoginData): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, credentials);
    const data = response.data;

    if (data.success && data.access_token) {
      setAuthToken(data.access_token);
      setRefreshToken(data.refresh_token || null);
      return data;
    }

    return data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    return {
      success: false,
      message: error.message || "Login failed",
    };
  }
};

// Log out user
export const logout = (): void => {
  setAuthToken(null);
  setRefreshToken(null);
  // Clear any user data in localStorage
  localStorage.removeItem("user");
};

// Get current user
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    // Set token in request headers
    setAuthToken(token);

    const response = await axios.get(`${API_URL}/api/auth/me`);
    if (response.data.success && response.data.user) {
      return response.data.user;
    }

    return null;
  } catch (error) {
    return null;
  }
};

// Refresh token when access token is expired
export const refreshAuthToken = async (): Promise<boolean> => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return false;

    const response = await axios.post(
      `${API_URL}/api/auth/refresh`,
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );

    const data = response.data;
    if (data.success && data.access_token) {
      setAuthToken(data.access_token);
      return true;
    }

    return false;
  } catch (error) {
    logout(); // Clear tokens on refresh failure
    return false;
  }
};

// Initialize auth header with token from storage
export const initializeAuth = (): void => {
  const token = localStorage.getItem("token");
  if (token) {
    setAuthToken(token);
  }
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  refreshAuthToken,
  initializeAuth,
};

export default authService;
