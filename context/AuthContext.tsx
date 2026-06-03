"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string; user?: User }>;
  logout: () => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  verifyOtp: (email: string, otp: string) => Promise<{ success: boolean; message: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Helper to fetch authorization headers
  const getHeaders = () => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  };

  // Check login status on mount
  useEffect(() => {
    async function checkLogin() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }

        const res = await fetch("/api/auth/me", {
          headers: getHeaders(),
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          // Token expired or invalid
          localStorage.removeItem("token");
          setUser(null);
        }
      } catch (err) {
        console.error("Error checking login status:", err);
      } finally {
        setLoading(false);
      }
    }

    checkLogin();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: data.message || "Invalid email or password",
        };
      }

      localStorage.setItem("token", data.token);

      // Load user details
      const meRes = await fetch("/api/auth/me", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${data.token}`,
        },
      });

      if (meRes.ok) {
        const meData = await meRes.json();
        setUser(meData.user);
        return { success: true, user: meData.user as User };
      } else {
        return { success: false, message: "Failed to load user profile." };
      }
    } catch (err) {
      console.error("Login context error:", err);
      return { success: false, message: "Network error occurred. Please try again." };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: getHeaders(),
      });
    } catch (err) {
      console.error("Logout request error:", err);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      setLoading(false);
      router.push("/login");
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.message || "Registration failed" };
      }

      return { success: true, message: data.message };
    } catch (err) {
      console.error("Signup request error:", err);
      return { success: false, message: "Network error. Please try again." };
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.message || "Verification failed" };
      }

      return { success: true, message: data.message };
    } catch (err) {
      console.error("OTP Verification request error:", err);
      return { success: false, message: "Network error. Please try again." };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.message || "Failed to process request" };
      }

      return { success: true, message: data.message };
    } catch (err) {
      console.error("Forgot password request error:", err);
      return { success: false, message: "Network error. Please try again." };
    }
  };

  const resetPassword = async (email: string, otp: string, newPassword: string) => {
    try {
      // First verify the OTP to see if it's correct
      const verifyRes = await fetch("/api/auth/verify-reset-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) {
        return { success: false, message: verifyData.message || "Invalid OTP" };
      }

      // If OTP is verified, perform the password reset
      const resetRes = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const resetData = await resetRes.json();
      if (!resetRes.ok) {
        return { success: false, message: resetData.message || "Reset password failed" };
      }

      return { success: true, message: resetData.message };
    } catch (err) {
      console.error("Reset password request error:", err);
      return { success: false, message: "Network error. Please try again." };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        signup,
        verifyOtp,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
