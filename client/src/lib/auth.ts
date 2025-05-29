import { AuthData, AuthResponse } from "@/types";
import { API_BASE_URL, apiRequest, queryClient } from "./queryClient";
import { useMutation } from "@tanstack/react-query";

export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  try {
    const response = await apiRequest("POST", `${API_BASE_URL}/auth/login`, {
      email,
      password,
    });
    const data = await response.json();
    
    // Store the token in localStorage
    if (data.succeeded && data.token) {
      localStorage.setItem("developerToken", data.token);
    }
    
    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw new Error(error instanceof Error ? error.message : "Login failed");
  }
}

export async function register(
  email: string,
  password: string,
  confirmPassword: string,
): Promise<AuthResponse> {
  try {
    const response = await apiRequest(
      "POST",
      `${API_BASE_URL}/auth/register`,
      { email, password, confirmPassword },
    );
    const data = await response.json();
    
    // Store the token in localStorage if registration was successful
    if (data.succeeded && data.token) {
      localStorage.setItem("developerToken", data.token);
    }
    
    return data;
  } catch (error) {
    console.error("Registration error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Registration failed",
    );
  }
}

// Hook for login with React Query
export function useLogin() {
  return useMutation({
    mutationFn: async ({ email, password }: AuthData) => {
      return await login(email, password);
    },
    onSuccess: (data) => {
      // Invalidate relevant queries after successful login
      if (data.succeeded) {
        queryClient.invalidateQueries({ queryKey: [`${API_BASE_URL}/developers/profile`] });
      }
    }
  });
}

// Hook for registration with React Query
export function useRegister() {
  return useMutation({
    mutationFn: async ({ email, password, confirmPassword }: AuthData) => {
      return await register(email, password, confirmPassword);
    },
    onSuccess: (data) => {
      // Invalidate relevant queries after successful registration
      if (data.succeeded) {
        queryClient.invalidateQueries({ queryKey: [`${API_BASE_URL}/developers/profile`] });
      }
    }
  });
}

export function getTokenPayload(token: string): any {
  try {
    // Split the token and get the payload part (second part)
    const base64Url = token.split(".")[1];
    // Replace characters that are URL-safe with normal base64 characters and pad if needed
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    // Decode the base64 string
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error parsing token:", error);
    throw new Error("Invalid token format");
  }
}

export function getAuthHeader(): { Authorization: string } | undefined {
  const token = localStorage.getItem("developerToken");
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}
