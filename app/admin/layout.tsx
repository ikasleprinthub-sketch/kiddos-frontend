"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/admin/Sidebar";
import { AdminMobileProvider } from "@/context/AdminMobileContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) return;
    if (!loading && (!user || user.role !== "ADMIN")) {
      window.location.href = "/admin/login?expired=true";
    }
  }, [user, loading, isLoginPage]);

  // Admin login renders without the sidebar shell
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 flex-col gap-4">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm font-medium animate-pulse">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <AdminMobileProvider>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          {children}
        </div>
      </div>
    </AdminMobileProvider>
  );
}
