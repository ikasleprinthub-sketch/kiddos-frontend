"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  User,
  ShoppingBag,
  Heart,
  LogOut,
  Shield,
  Bell,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SettingsPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login?redirect=/settings");
    }
  }, [authLoading, user, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#2a7a2a] border-t-transparent animate-spin" />
      </div>
    );
  }
  if (!user) return null;

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
          <span className="text-zinc-600 dark:text-zinc-300">Settings</span>
        </div>

        {/* User info row */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-full bg-[#2a7a2a]/10 flex items-center justify-center text-[#2a7a2a] font-bold text-lg select-none shrink-0">
            {initials}
          </div>
          <div>
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">{user.name}</p>
            <p className="text-sm text-zinc-400 dark:text-zinc-500">{user.email}</p>
          </div>
        </div>

        <div className="space-y-4">

          {/* Account section */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden">
            <p className="px-5 py-3 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-800">
              Account
            </p>
            <nav>
              <Link
                href="/profile"
                className="flex items-center justify-between px-5 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#2a7a2a]/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-[#2a7a2a]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">My Profile</p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">Update name, phone & password</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600 group-hover:text-[#2a7a2a] transition-colors" />
              </Link>

              <Link
                href="/orders"
                className="flex items-center justify-between px-5 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group border-t border-zinc-100 dark:border-zinc-800/60"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">My Orders</p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">View your order history</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600 group-hover:text-[#2a7a2a] transition-colors" />
              </Link>

              <Link
                href="/wishlist"
                className="flex items-center justify-between px-5 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group border-t border-zinc-100 dark:border-zinc-800/60"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
                    <Heart className="w-4 h-4 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Wishlist</p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">Your saved products</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600 group-hover:text-[#2a7a2a] transition-colors" />
              </Link>
            </nav>
          </div>

          {/* Preferences section */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden">
            <p className="px-5 py-3 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-800">
              Preferences
            </p>
            <div className="px-5 py-4 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/60">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Order Notifications</p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">Get updates on your orders</p>
                </div>
              </div>
              <span className="text-xs text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">Email</span>
            </div>
            <div className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Account Security</p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">Password & verification</p>
                </div>
              </div>
              <Link href="/profile" className="text-xs text-[#2a7a2a] font-medium hover:underline">Manage</Link>
            </div>
          </div>

          {/* Sign out */}
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-5 py-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-200 dark:hover:border-red-800/50 transition-colors group text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/30 flex items-center justify-center group-hover:bg-red-100 dark:group-hover:bg-red-950/50 transition-colors">
              <LogOut className="w-4 h-4 text-red-500" />
            </div>
            <p className="text-sm font-medium text-red-600 dark:text-red-400">Sign Out</p>
          </button>

        </div>
      </div>
    </div>
  );
}
