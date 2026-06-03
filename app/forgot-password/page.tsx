"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email) {
      setError("Email address is required.");
      return;
    }

    setLoading(true);
    const result = await forgotPassword(email);

    if (result.success) {
      setSuccess("Reset OTP code sent! Redirecting to password reset page...");
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 3000);
    } else {
      setError(result.message || "Failed to send reset code. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-gray-150 shadow-xl">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <Image
            src="/logo.svg"
            alt="Kiddos Foods"
            width={80}
            height={80}
            className="object-contain mb-3"
          />
          <h2 className="text-gray-900 font-extrabold text-2xl">
            Reset Password
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Enter your email to receive a password reset OTP code
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-800 text-sm border border-red-200 flex items-start gap-2">
            <span className="font-semibold shrink-0">Error:</span>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 text-green-800 text-sm border border-green-200 flex items-start gap-2">
            <span className="font-semibold shrink-0">Success:</span>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e4620]/40 focus:border-[#1e4620] transition"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !!success}
            className="w-full py-3 rounded-xl bg-[#1e4620] hover:bg-[#2c5e2f] text-white font-semibold text-sm tracking-wide shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Sending OTP…
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8">
          Back to{" "}
          <Link
            href="/login"
            className="text-[#1e4620] font-semibold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
