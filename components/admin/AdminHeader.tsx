"use client";

import { useAuth } from "@/context/AuthContext";
import { Menu, User } from "lucide-react";
import { useAdminMobile } from "@/context/AdminMobileContext";

export default function AdminHeader({ title }: { title: string }) {
  const { user } = useAuth();
  const { toggle } = useAdminMobile();
  return <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
    <div className="flex min-w-0 items-center gap-3"><button onClick={toggle} className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 md:hidden" aria-label="Open menu"><Menu size={20} /></button><div><p className="hidden text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700 sm:block">Admin workspace</p><h1 className="truncate text-lg font-bold tracking-tight text-slate-950">{title}</h1></div></div>
    <div className="flex items-center gap-3"><div className="hidden text-right sm:block"><p className="text-sm font-semibold text-slate-800">{user?.name || "Admin"}</p><p className="text-[11px] text-slate-400">Administrator</p></div><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#073f32] text-white shadow-sm"><User size={17} /></div></div>
  </header>;
}
