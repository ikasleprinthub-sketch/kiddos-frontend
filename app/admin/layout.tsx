"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/admin/Sidebar";
import AdminLoadingScreen from "@/components/admin/AdminLoadingScreen";
import { AdminMobileProvider } from "@/context/AdminMobileContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) return;
    if (!loading && (!user || user.role !== "ADMIN")) {
      window.location.href = "/admin/login";
    }
  }, [user, loading, isLoginPage]);

  // Admin login renders without the sidebar shell
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return <AdminLoadingScreen message="Loading dashboard..." />;
  }

  if (!user || user.role !== "ADMIN") {
    return <AdminLoadingScreen message="Redirecting to login..." />;
  }

  return (
    <AdminMobileProvider>
      <div className="flex h-screen overflow-hidden bg-[#f6f8f7] text-slate-900">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          {children}
        </div>
      </div>
    </AdminMobileProvider>
  );
}
