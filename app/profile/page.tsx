"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Phone, Lock, ChevronRight, Check, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

async function apiPut<T>(path: string, body: unknown): Promise<T> {
  const token = getToken();
  const res = await fetch(`/api${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [infoSaving, setInfoSaving] = useState(false);
  const [infoMsg, setInfoMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login?redirect=/profile");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#2a7a2a] border-t-transparent animate-spin" />
      </div>
    );
  }
  if (!user) return null;

  const handleInfoSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setInfoMsg(null);
    if (!name.trim()) {
      setInfoMsg({ type: "error", text: "Name cannot be empty" });
      return;
    }
    setInfoSaving(true);
    try {
      await apiPut("/auth/me", { name: name.trim(), phone: phone.trim() });
      setInfoMsg({ type: "success", text: "Profile updated successfully" });
    } catch (err) {
      setInfoMsg({ type: "error", text: err instanceof Error ? err.message : "Update failed" });
    } finally {
      setInfoSaving(false);
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg(null);
    if (!currentPassword) {
      setPwMsg({ type: "error", text: "Enter your current password" });
      return;
    }
    if (newPassword.length < 8) {
      setPwMsg({ type: "error", text: "New password must be at least 8 characters" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwMsg({ type: "error", text: "Passwords do not match" });
      return;
    }
    setPwSaving(true);
    try {
      await apiPut("/auth/me", { currentPassword, newPassword });
      setPwMsg({ type: "success", text: "Password changed successfully" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPwMsg({ type: "error", text: err instanceof Error ? err.message : "Password change failed" });
    } finally {
      setPwSaving(false);
    }
  };

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-zinc-400 dark:text-zinc-500 mb-8">
          <Link href="/" className="hover:text-[#2a7a2a] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-zinc-600 dark:text-zinc-300">My Profile</span>
        </div>

        {/* Avatar + name header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-[#2a7a2a]/10 flex items-center justify-center text-[#2a7a2a] font-bold text-xl select-none shrink-0">
            {initials}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{user.name}</h1>
            <p className="text-sm text-zinc-400 dark:text-zinc-500">{user.email}</p>
          </div>
        </div>

        <div className="space-y-5">

          {/* Personal info card */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 p-6">
            <h2 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-5 flex items-center gap-2">
              <User className="w-4 h-4 text-zinc-400" /> Personal Information
            </h2>

            {infoMsg && (
              <div className={`flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl mb-4 ${
                infoMsg.type === "success"
                  ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                  : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
              }`}>
                {infoMsg.type === "success" ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                {infoMsg.text}
              </div>
            )}

            <form onSubmit={handleInfoSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#2a7a2a]/40 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    value={user.email}
                    disabled
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 text-zinc-400 dark:text-zinc-500 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#2a7a2a]/40 transition"
                  />
                </div>
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={infoSaving}
                  className="px-6 py-2.5 text-sm font-semibold bg-[#1e4620] hover:bg-[#2a5e2c] text-white rounded-xl disabled:opacity-50 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                >
                  {infoSaving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>

          {/* Change password card */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 p-6">
            <h2 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-5 flex items-center gap-2">
              <Lock className="w-4 h-4 text-zinc-400" /> Change Password
            </h2>

            {pwMsg && (
              <div className={`flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl mb-4 ${
                pwMsg.type === "success"
                  ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                  : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
              }`}>
                {pwMsg.type === "success" ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                {pwMsg.text}
              </div>
            )}

            <form onSubmit={handlePasswordSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full pl-9 pr-10 py-2.5 text-sm border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#2a7a2a]/40 transition"
                  />
                  <button type="button" onClick={() => setShowCurrent((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full pl-9 pr-10 py-2.5 text-sm border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#2a7a2a]/40 transition"
                  />
                  <button type="button" onClick={() => setShowNew((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#2a7a2a]/40 transition"
                  />
                </div>
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={pwSaving}
                  className="px-6 py-2.5 text-sm font-semibold bg-[#1e4620] hover:bg-[#2a5e2c] text-white rounded-xl disabled:opacity-50 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                >
                  {pwSaving ? "Updating…" : "Update Password"}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
