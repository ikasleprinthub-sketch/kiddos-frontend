"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Wrench } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Header from "./Header";
import Footer from "./Footer";
import FloatingWhatsApp from "@/components/common/FloatingWhatsApp";
import FloatingCatalogue from "@/components/common/FloatingCatalogue";
import ChutneyBookBadge from "@/components/ChutneyBookBadge";

export type MaintenanceSettings = { enabled: boolean; message: string; storeName: string };
export const DEFAULT_MAINTENANCE_MESSAGE = "We are improving your shopping experience. Please check back soon.";
const SITE_OPEN: MaintenanceSettings = { enabled: false, message: "", storeName: "Kiddos Foods" };

/**
 * `initialMaintenance` is read on the server (root layout) so pages render immediately.
 * If the server couldn't reach the API (null) the site renders as open and we re-check from the browser.
 */
export default function PublicShell({ children, initialMaintenance }: { children: React.ReactNode; initialMaintenance: MaintenanceSettings | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const isAdminPath = pathname.startsWith("/admin");
  const isProductDetailPath = pathname.startsWith("/products/");
  const [maintenance, setMaintenance] = useState<MaintenanceSettings>(initialMaintenance ?? SITE_OPEN);

  useEffect(() => {
    if (isAdminPath || initialMaintenance) return;
    let active = true;
    fetch("/api/settings?group=general", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : {})
      .then((data: Record<string, string>) => {
        if (!active || data.maintenance_mode !== "true") return;
        setMaintenance({
          enabled: true,
          message: data.maintenance_message || DEFAULT_MAINTENANCE_MESSAGE,
          storeName: data.store_name || "Kiddos Foods",
        });
      })
      .catch(() => { /* keep the site open */ });
    return () => { active = false; };
  }, [isAdminPath, initialMaintenance]);

  useEffect(() => {
    if (!isAdminPath && !loading && user?.role === "ADMIN") router.replace("/admin");
  }, [user, loading, isAdminPath, router]);

  if (isAdminPath) return <>{children}</>;

  if (!loading && user?.role === "ADMIN") {
    return <div className="flex h-screen flex-col items-center justify-center gap-4 bg-gray-50"><div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" /><p className="animate-pulse text-sm font-medium text-gray-500">Redirecting to admin portal...</p></div>;
  }

  if (maintenance.enabled) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-950 via-[#173d25] to-emerald-900 px-4 py-10 text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:18px_18px]" />
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-emerald-300/10 blur-3xl" />
        <section className="relative z-10 w-full max-w-xl rounded-3xl border border-white/15 bg-white/10 p-6 text-center shadow-2xl backdrop-blur-md sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400 text-emerald-950 shadow-lg sm:h-20 sm:w-20"><Wrench className="h-8 w-8 sm:h-10 sm:w-10" /></div>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.24em] text-amber-300">Scheduled maintenance</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">We’ll be back soon</h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-emerald-50/80 sm:text-base">{maintenance.message}</p>
          <div className="mt-7 border-t border-white/10 pt-5 text-xs font-semibold text-emerald-100/70">— {maintenance.storeName}</div>
        </section>
      </main>
    );
  }

  if (pathname === "/login") return <main className="flex flex-1 flex-col">{children}</main>;

  return <><Header /><main className="flex flex-1 flex-col">{children}</main>{!isProductDetailPath && <Footer />}<FloatingWhatsApp /><FloatingCatalogue /><ChutneyBookBadge /></>;
}