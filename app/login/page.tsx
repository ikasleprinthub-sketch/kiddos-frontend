"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefillEmail = searchParams.get("email") || "";

  const [form, setForm] = useState({ email: prefillEmail, password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await login(form.email, form.password);

    if (result.success) {
      if (result.user?.role === "ADMIN") {
        localStorage.removeItem("token");
        setError("Admin accounts must sign in through the Admin Panel, not here.");
        setLoading(false);
        return;
      }
      router.push("/");
    } else {
      setError(result.message || "Invalid email or password");
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
            Bringing Amma&apos;s love to your plate with{" "}
            <span className="text-[#f97316] font-semibold">
              20 unique dosa batters
            </span>
            . Pure, traditional, and irresistibly delicious.
          </p>
        </div>

        {/* Feature pills */}
        <div className="relative z-10 flex flex-col gap-3 w-full max-w-xs">
          {[
            "100% Natural Ingredients",
            "No Preservatives",
            "Traditional Recipes",
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
            Welcome back!
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            Sign in to your Kiddos Foods account
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-800 text-sm border border-red-200 flex flex-col gap-2">
              <div className="flex items-start gap-2">
                <span className="font-semibold shrink-0">Error:</span>
                <span>{error}</span>
              </div>
              {error.toLowerCase().includes("verify") && (
                <Link
                  href={`/verify-otp?email=${encodeURIComponent(form.email)}`}
                  className="text-brand-green font-semibold hover:underline mt-1"
                >
                  Verify your account now &rarr;
                </Link>
              )}
              {error.toLowerCase().includes("admin") && (
                <Link
                  href="/admin/login"
                  className="text-[#1e4620] font-semibold hover:underline mt-1"
                >
                  Go to Admin Panel &rarr;
                </Link>
              )}
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
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[#1e4620] hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
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
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
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
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">or continue with</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Google OAuth button */}
            <button
              type="button"
              className="w-full py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm flex items-center justify-center gap-3 transition hover:shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
          </form>

          {/* Sign up link */}
          <p className="text-center text-sm text-gray-500 mt-8">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-[#1e4620] font-semibold hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
