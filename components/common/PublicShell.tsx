"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Header from "./Header";
import Footer from "./Footer";
import FloatingWhatsApp from "@/components/common/FloatingWhatsApp";
import ChutneyBookBadge from "@/components/ChutneyBookBadge";

export default function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const isAdminPath = pathname.startsWith("/admin");

  useEffect(() => {
    if (!isAdminPath && !loading && user?.role === "ADMIN") {
      router.replace("/admin");
    }
  }, [user, loading, isAdminPath, router]);

  if (isAdminPath) {
    return <>{children}</>;
  }

  if (!loading && user?.role === "ADMIN") {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 flex-col gap-4">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm font-medium animate-pulse">Redirecting to admin portal...</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
      <FloatingWhatsApp />
      <ChutneyBookBadge />
    </>
  );
}
