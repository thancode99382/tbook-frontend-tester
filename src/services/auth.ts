import axios from "axios";
import Cookies from 'js-cookie';

// Define the base URL for API calls
const API_URL = "https://tbookvd-api.azurewebsites.net/api/v1";

// Create axios instance with default config
const authApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Types for request and response
interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
  };
  token: string;
}

interface LoginResponse {
  DT: {
    username: string;
    email: string;
    access_token: string;
  };
}

/**
 * Login user with email and password
 * @param credentials User login credentials
 * @returns Promise with user data and token
 */
export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  try {
    const response = await authApi.post<LoginResponse>("/login", credentials);
    // Store token in cookie for future authenticated requests
    if (response.data.DT.access_token) {
      Cookies.set('auth_token', response.data.DT.access_token, { 
        expires: 7, // Token expires in 7 days
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
      });
      localStorage.setItem('user', JSON.stringify({
        username: response.data.DT.username,
        email: response.data.DT.email
      }));
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
    throw new Error("An unexpected error occurred");
  }
};

/**
 * Register new user
 * @param userData User registration data
 * @returns Promise with user data and token
 */
export const register = async (
  userData: RegisterRequest
): Promise<AuthResponse> => {
  try {
    const response = await authApi.post<AuthResponse>("/register", userData);

    // Store token in cookie after successful registration
    if (response.data.token) {
      Cookies.set('auth_token', response.data.token, { 
        expires: 7,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
      });
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
    throw new Error("An unexpected error occurred");
  }
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  Cookies.remove('auth_token', { path: '/' });
  localStorage.removeItem('user');
  // Force a hard refresh to ensure middleware catches the removed token
  window.location.href = '/login';
};

/**
 * Get current authentication token
 * @returns The auth token or null if not authenticated
 */
export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return Cookies.get('auth_token') || null;
  }
  return null;
};
