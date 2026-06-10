"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, ShieldAlert, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const { user, loading, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user?.role === "ADMIN") {
      window.location.href = "/admin";
    }
  }, [user, loading]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("expired=true")) {
      setError("Your session has expired. Please sign in again.");
      window.history.replaceState({}, document.title, "/admin/login");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await login(email.trim(), password);

      if (!result.success || !result.user) {
        setError(result.message || "Invalid credentials.");
        setSubmitting(false);
        return;
      }

      if (result.user.role !== "ADMIN") {
        localStorage.removeItem("token");
        setError("Access denied. This panel is for administrators only.");
        setSubmitting(false);
        return;
      }

      window.location.href = "/admin";
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
      setSubmitting(false);
    }
  };

  if (loading || (user && user.role === "ADMIN")) {
    return (
      <div className="flex h-screen items-center justify-center bg-emerald-950">
        <div className="bg-white p-8 rounded-3xl flex flex-col items-center gap-5 shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
          <p className="text-emerald-900 font-bold text-lg animate-pulse">Redirecting to Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 flex items-center justify-center p-4">
      {/* Back to Home Link */}
      <Link 
        href="/"
        className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-emerald-100 hover:text-white transition-colors group z-10"
      >
        <div className="p-2 bg-white/5 rounded-full backdrop-blur-sm border border-white/10 group-hover:bg-white/10 transition-colors">
          <ArrowLeft size={18} />
        </div>
        <span className="text-sm font-medium hidden sm:block">Back to Home</span>
      </Link>

      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 mb-4 backdrop-blur rounded-2xl bg-white/5 p-3 border border-white/10 shadow-lg">
            <Image
              src="/logo.svg"
              alt="Kiddos Foods"
              width={110}
              height={110}
              className="object-contain drop-shadow-xl"
            />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Kiddos Foods</h1>
          <p className="text-emerald-200 text-sm mt-1 font-medium">Admin Panel</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Admin Sign In</h2>
          <p className="text-sm text-gray-500 mb-6">Access restricted to administrators</p>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-5">
              <ShieldAlert size={15} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@kiddos.com"
                autoComplete="email"
                disabled={submitting}
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={submitting}
                  className="w-full px-4 py-3 pr-11 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign In to Admin Panel"
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Not an admin?{" "}
            <a href="/login" className="text-emerald-600 hover:underline font-medium">
              Go to customer login
            </a>
          </p>
        </div>

        <p className="text-center text-xs text-emerald-300/70 mt-6">
          Kiddos Organic Store &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
