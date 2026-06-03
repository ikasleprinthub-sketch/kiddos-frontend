"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function VerifyOtpForm() {
  const { verifyOtp } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const emailParam = searchParams.get("email") || "";
  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState("");
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

    if (otp.length !== 6 || isNaN(Number(otp))) {
      setError("OTP must be a 6-digit number.");
      return;
    }

    setLoading(true);
    const result = await verifyOtp(email, otp);

    if (result.success) {
      setSuccess("Account verified successfully! Redirecting you to login...");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } else {
      setError(result.message || "Invalid OTP code. Please try again.");
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
            Verify your account
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            We have sent a 6-digit OTP code to verify your email
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-800 text-sm border border-red-200 flex items-start gap-2 animate-pulse-subtle">
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
          {/* Email (Hidden or Read-Only if present in query) */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!!emailParam}
              className="w-full px-4 py-3 rounded-xl border border-gray-250 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e4620]/40 focus:border-[#1e4620] transition disabled:bg-gray-100 disabled:text-gray-500"
            />
          </div>

          {/* OTP Code */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="otp" className="text-sm font-medium text-gray-700">
              One-Time Password (OTP)
            </label>
            <input
              id="otp"
              type="text"
              required
              maxLength={6}
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="w-full text-center tracking-[1em] text-xl font-bold py-3.5 rounded-xl border border-gray-250 bg-white text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e4620]/40 focus:border-[#1e4620] transition"
            />
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
                Verifying OTP…
              </>
            ) : (
              "Verify Code"
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

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-gray-150 shadow-xl flex flex-col items-center justify-center gap-4 min-h-[300px]">
          <svg className="w-8 h-8 animate-spin text-[#1e4620]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <span className="text-gray-500 text-sm font-medium">Loading verification form...</span>
        </div>
      </div>
    }>
      <VerifyOtpForm />
    </Suspense>
  );
}
