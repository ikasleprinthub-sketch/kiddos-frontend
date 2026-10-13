import type React from "react";

interface Props { title: string; value: string | number; sub?: string; icon: React.ComponentType<{ size?: number; className?: string }>; color?: "green" | "blue" | "orange" | "red" | "purple"; trend?: number }
const COLORS = { green: "bg-emerald-50 text-emerald-700", blue: "bg-sky-50 text-sky-700", orange: "bg-amber-50 text-amber-700", red: "bg-rose-50 text-rose-700", purple: "bg-violet-50 text-violet-700" };

export default function StatsCard({ title, value, sub, icon: Icon, color = "green", trend }: Props) {
  return <div className="group flex items-start gap-4 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/60">
    <div className={`rounded-2xl p-3.5 transition-transform duration-200 group-hover:scale-105 ${COLORS[color]}`}><Icon size={21} /></div>
    <div className="min-w-0 flex-1"><p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">{title}</p><p className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950">{value}</p>{sub && <p className="mt-1.5 text-xs text-slate-400">{sub}</p>}{trend !== undefined && <p className={`mt-2 text-xs font-bold ${trend >= 0 ? "text-emerald-600" : "text-rose-500"}`}>{trend >= 0 ? "↗" : "↘"} {Math.abs(trend)}% this month</p>}</div>
  </div>;
}
