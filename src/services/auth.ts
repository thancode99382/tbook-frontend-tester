import axios from "axios";

// Define the base URL for API calls
// const API_URL =
//   process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

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
    console.log(response.data);
    // Store token in localStorage for future authenticated requests
    if (response.data.DT.access_token) {
      localStorage.setItem("auth_token", response.data.DT.access_token);
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

    // Store token in localStorage after successful registration
    if (response.data.token) {
      localStorage.setItem("auth_token", response.data.token);
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
export const logout = (): void => {
  localStorage.removeItem("auth_token");
};

/**
 * Get current authentication token
 * @returns The auth token or null if not authenticated
 */
export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token");
  }
  return null;
};
