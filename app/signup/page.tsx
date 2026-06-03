"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Basic Validation
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const result = await signup(form.name, form.email, form.password);

    if (result.success) {
      // Redirect to OTP verification with pre-filled email
      router.push(`/verify-otp?email=${encodeURIComponent(form.email)}`);
    } else {
      setError(result.message || "Registration failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 min-h-[calc(100vh-140px)]">
      {/* ── Left brand panel ── */}
      <div className="hidden lg:flex w-[45%] bg-[#1e4620] flex-col items-center justify-center gap-8 px-12 relative overflow-hidden">
        {/* Background decoration circles */}
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/5" />
        <div className="absolute -bottom-28 -right-16 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute top-1/2 left-1/4 w-40 h-40 rounded-full bg-[#f97316]/10" />

        {/* Logo */}
        <div className="relative z-10 flex flex-col items-center gap-4 text-center">
          <Image
            src="/logo.svg"
            alt="Kiddos Foods"
            width={130}
            height={130}
            className="object-contain drop-shadow-xl"
          />
          <div>
            <h1 className="text-white font-black text-3xl leading-tight">
              Kiddos Foods
            </h1>
            <p className="text-[#f97316] font-medium text-sm mt-1 tracking-wide">
              Make Healthy Posterity
            </p>
          </div>
        </div>

        {/* Tagline */}
        <div className="relative z-10 text-center max-w-xs">
          <p className="text-white/80 text-sm leading-relaxed">
            Create an account to order from our collection of{" "}
            <span className="text-[#f97316] font-semibold">
              20 unique traditional batters
            </span>
            . Pure, natural, and preservative-free.
          </p>
        </div>

        {/* Feature pills */}
        <div className="relative z-10 flex flex-col gap-3 w-full max-w-xs">
          {[
            "Fast Home Delivery",
            "Secure Online Payments",
            "Easy Account Management",
          ].map((f) => (
            <div
              key={f}
              className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3"
            >
              <div className="w-2 h-2 rounded-full bg-[#f97316] shrink-0" />
              <span className="text-white/90 text-sm">{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden justify-center mb-8">
            <Image src="/logo.svg" alt="Kiddos Foods" width={80} height={80} className="object-contain" />
          </div>

          <h2 className="text-gray-900 font-extrabold text-2xl mb-1">
            Create your account
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            Join Kiddos Foods to start ordering healthy food for your children
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-800 text-sm border border-red-200 flex items-start gap-2">
              <span className="font-semibold shrink-0">Error:</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e4620]/40 focus:border-[#1e4620] transition"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline strokeLinecap="round" strokeLinejoin="round" points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e4620]/40 focus:border-[#1e4620] transition"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Minimum 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e4620]/40 focus:border-[#1e4620] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line strokeLinecap="round" strokeLinejoin="round" x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Repeat your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e4620]/40 focus:border-[#1e4620] transition"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#1e4620] hover:bg-[#2c5e2f] text-white font-semibold text-sm tracking-wide shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Creating Account…
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-sm text-gray-500 mt-8">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#1e4620] font-semibold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
