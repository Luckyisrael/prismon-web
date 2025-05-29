import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "wouter";

import { AuthResponse, getTokenPayload, queryClient } from "@/lib/queryClient";
import { register, login, } from "@/lib/auth";

interface AuthContextType {
  isAuthenticated: boolean;
  user: { id: string; email: string } | null;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (email: string, password: string, confirmPassword: string) => Promise<AuthResponse>;
  logout: () => void;
  isLoading: boolean;
  isOnboardingComplete: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => ({ 
    succeeded: false, 
    message: "No context provider", 
    developerId: "", 
    token: "", 
    isOnboardingComplete: false 
  }),
  register: async () => ({ 
    succeeded: false, 
    message: "No context provider", 
    developerId: "", 
    token: "", 
    isOnboardingComplete: false 
  }),
  logout: () => {},
  isLoading: true,
  isOnboardingComplete: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [, setLocation] = useLocation();

  // Check for token on mount
  useEffect(() => {
    const token = localStorage.getItem("developerToken");
    if (token) {
      try {
        const payload = getTokenPayload(token);
        setUser({
          id: payload.nameidentifier || "",
          email: payload.sub || "",
        });
        setIsAuthenticated(true);
        
        // Get onboarding status from localStorage or set to false
        const onboardingStatus = localStorage.getItem("isOnboardingComplete") === "true";
        setIsOnboardingComplete(onboardingStatus);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("developerToken");
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await login(email, password);
      if (response.succeeded && response.token) {
        localStorage.setItem("developerToken", response.token);
        
        // Store onboarding status
        //localStorage.setItem("isOnboardingComplete", String(response.isOnboardingCompleted));
        //setIsOnboardingComplete(response.isOnboardingCompleted);
        
        const payload = getTokenPayload(response.token);
        setUser({
          id: payload.nameidentifier || "",
          email: payload.sub || "",
        });
        setIsAuthenticated(true);
        
        // Invalidate any cached queries to refresh data with new auth state
        queryClient.invalidateQueries();
        
        // Redirect based on onboarding status
        if (response.token) {
          setLocation("/dashboard");
        } else {
          setLocation("/login");
        }
      }
      setIsLoading(false);
      return response;
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      return {
        succeeded: false,
        message: error instanceof Error ? error.message : "Login failed",
        developerId: "",
        token: "",
        isOnboardingComplete: false
      };
    }
  };

  const handleRegister = async (email: string, password: string, confirmPassword: string) => {
    setIsLoading(true);
    try {
      const response = await register(email, password, confirmPassword);
      setIsLoading(false);
      
      if (response.succeeded && response.token) {
        localStorage.setItem("developerToken", response.token);
        
        // Store onboarding status
        //localStorage.setItem("isOnboardingComplete", String(response.isOnboardingCompleted));
        //setIsOnboardingComplete(response.isOnboardingCompleted);
        
        const payload = getTokenPayload(response.token);
        setUser({
          id: payload.nameidentifier || "",
          email: payload.sub || "",
        });
        setIsAuthenticated(true);
        
        // Invalidate any cached queries to refresh data with new auth state
        queryClient.invalidateQueries();
        
        // Always redirect to onboarding after registration
        setLocation("/login");
        return response;
      }
      
      // If no successful registration with token, redirect to login
      setLocation("/login");
      return response;
    } catch (error) {
      console.error("Registration error:", error);
      setIsLoading(false);
      return {
        succeeded: false,
        message: error instanceof Error ? error.message : "Registration failed",
        developerId: "",
        token: "",
        isOnboardingComplete: false
      };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("developerToken");
    localStorage.removeItem("isOnboardingComplete");
    setUser(null);
    setIsAuthenticated(false);
    setIsOnboardingComplete(false);
    
    // Clear all query cache on logout
    queryClient.clear();
    
    setLocation("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login: handleLogin as (email: string, password: string) => Promise<AuthResponse>,
        register: handleRegister as (email: string, password: string, confirmPassword: string) => Promise<AuthResponse>,
        logout: handleLogout,
        isLoading,
        isOnboardingComplete,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);