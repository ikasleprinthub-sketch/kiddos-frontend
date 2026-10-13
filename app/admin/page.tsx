"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import StatsCard from "@/components/admin/StatsCard";
import { adminApi } from "@/lib/adminApi";
import { AlertTriangle, ArrowRight, IndianRupee, Package, ShoppingCart, Sparkles, TrendingUp, Users } from "lucide-react";

interface DashboardData {
  stats: { totalOrders: number; monthOrders: number; orderGrowth: number; totalCustomers: number; newCustomers: number; totalProducts: number; lowStockProducts: number; totalRevenue: string; monthRevenue: string; revenueGrowth: string };
  recentOrders: Array<{ id: string; orderNumber: string; status: string; paymentStatus: string; total: string; createdAt: string; user: { name: string; email: string } }>;
  topProducts: Array<{ id: string; name: string; price: string; totalSold: number; images: Array<{ url: string }> }>;
  ordersByStatus: Array<{ status: string; _count: { id: number } }>;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 ring-amber-600/10", CONFIRMED: "bg-sky-50 text-sky-700 ring-sky-600/10",
  PROCESSING: "bg-violet-50 text-violet-700 ring-violet-600/10", SHIPPED: "bg-indigo-50 text-indigo-700 ring-indigo-600/10",
  DELIVERED: "bg-emerald-50 text-emerald-700 ring-emerald-600/10", CANCELLED: "bg-rose-50 text-rose-700 ring-rose-600/10",
  REFUNDED: "bg-slate-100 text-slate-700 ring-slate-600/10",
};
const STATUS_BARS: Record<string, string> = { PENDING: "bg-amber-400", CONFIRMED: "bg-sky-500", PROCESSING: "bg-violet-500", SHIPPED: "bg-indigo-500", DELIVERED: "bg-emerald-500", CANCELLED: "bg-rose-500", REFUNDED: "bg-slate-400" };
const money = (value?: string | number) => `₹${Number(value ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
const LoadingBlock = ({ className = "h-24" }: { className?: string }) => <div className={`${className} animate-pulse rounded-2xl bg-slate-100`} />;

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => { adminApi.get<DashboardData>("/admin/dashboard").then(setData).catch((e) => setError(e.message)).finally(() => setLoading(false)); }, []);
  const statusTotal = useMemo(() => data?.ordersByStatus.reduce((sum, item) => sum + item._count.id, 0) ?? 0, [data]);
  const today = new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long" }).format(new Date());

  return <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[#f6f8f7]">
    <AdminHeader title="Dashboard" />
    <main className="flex-1 overflow-y-auto"><div className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8">
      <section className="relative overflow-hidden rounded-[28px] bg-[#073f32] px-6 py-7 text-white shadow-[0_20px_50px_-24px_rgba(4,76,58,0.65)] sm:px-8 sm:py-8">
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-emerald-300/10" /><div className="absolute bottom-0 right-28 h-32 w-32 translate-y-1/2 rounded-full bg-amber-300/10" />
        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div><div className="mb-3 flex items-center gap-2 text-sm font-medium text-emerald-100"><Sparkles size={16} /> Business overview</div><h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Welcome back to Kiddos Foods</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-50/75">Here is a live snapshot of your store performance, orders and inventory.</p></div><div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3 backdrop-blur-sm"><p className="text-xs font-medium uppercase tracking-[0.16em] text-emerald-100/70">Today</p><p className="mt-1 font-semibold">{today}</p></div></div>
      </section>
      {error && <div role="alert" className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"><AlertTriangle size={18} className="shrink-0" /><span>{error}</span></div>}
      <section aria-label="Key performance indicators" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Total revenue" value={loading ? "—" : money(data?.stats.totalRevenue)} sub={`${money(data?.stats.monthRevenue)} this month`} icon={IndianRupee} color="green" trend={data ? Number(data.stats.revenueGrowth) : undefined} />
        <StatsCard title="Total orders" value={loading ? "—" : data?.stats.totalOrders ?? 0} sub={`${data?.stats.monthOrders ?? 0} this month`} icon={ShoppingCart} color="blue" trend={data?.stats.orderGrowth} />
        <StatsCard title="Customers" value={loading ? "—" : data?.stats.totalCustomers ?? 0} sub={`+${data?.stats.newCustomers ?? 0} new this month`} icon={Users} color="purple" />
        <StatsCard title="Products" value={loading ? "—" : data?.stats.totalProducts ?? 0} sub={`${data?.stats.lowStockProducts ?? 0} low stock`} icon={Package} color={data?.stats.lowStockProducts ? "orange" : "green"} />
      </section>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6"><div><h2 className="font-bold text-slate-900">Recent orders</h2><p className="mt-1 text-xs text-slate-500">Latest customer purchases across your store</p></div><Link href="/admin/orders" className="group flex items-center gap-1.5 text-sm font-semibold text-emerald-700">View all <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" /></Link></div>
          {loading ? <div className="space-y-3 p-6"><LoadingBlock /><LoadingBlock /></div> : !data?.recentOrders.length ? <div className="px-6 py-16 text-center text-sm text-slate-500">No orders yet</div> : <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead className="bg-slate-50/70 text-xs font-semibold uppercase tracking-wider text-slate-500"><tr><th className="px-6 py-3">Order</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Date</th><th className="px-6 py-3 text-right">Amount</th></tr></thead><tbody className="divide-y divide-slate-100">{data.recentOrders.map((order) => <tr key={order.id} className="transition-colors hover:bg-emerald-50/30"><td className="px-6 py-4 font-semibold text-slate-900">#{order.orderNumber}</td><td className="px-4 py-4"><p className="font-medium text-slate-800">{order.user.name}</p><p className="mt-0.5 max-w-48 truncate text-xs text-slate-400">{order.user.email}</p></td><td className="px-4 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset ${STATUS_COLORS[order.status] || "bg-slate-100 text-slate-600 ring-slate-600/10"}`}>{order.status}</span></td><td className="px-4 py-4 text-slate-500">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td><td className="px-6 py-4 text-right font-bold text-slate-900">{money(order.total)}</td></tr>)}</tbody></table></div>}
        </section>
        <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between"><div><h2 className="font-bold text-slate-900">Order status</h2><p className="mt-1 text-xs text-slate-500">Distribution of all orders</p></div><div className="rounded-xl bg-emerald-50 p-2 text-emerald-700"><TrendingUp size={18} /></div></div>
          {loading ? <div className="mt-7 space-y-4"><LoadingBlock className="h-10" /><LoadingBlock className="h-10" /><LoadingBlock className="h-10" /></div> : !data?.ordersByStatus.length ? <p className="py-16 text-center text-sm text-slate-500">No data</p> : <div className="mt-7 space-y-5">{data.ordersByStatus.map(({ status, _count }) => { const percent = statusTotal ? Math.round((_count.id / statusTotal) * 100) : 0; return <div key={status}><div className="mb-2 flex items-center justify-between text-xs"><span className="font-semibold capitalize text-slate-700">{status.toLowerCase()}</span><span className="text-slate-500"><b className="text-slate-900">{_count.id}</b> · {percent}%</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${STATUS_BARS[status] || "bg-slate-400"}`} style={{ width: `${percent}%` }} /></div></div> })}</div>}
          {!!data?.stats.lowStockProducts && <Link href="/admin/products" className="mt-7 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 transition-colors hover:bg-amber-100"><div className="rounded-xl bg-white p-2 text-amber-600 shadow-sm"><AlertTriangle size={17} /></div><div className="min-w-0 flex-1"><p className="text-sm font-bold text-amber-900">Low stock alert</p><p className="mt-0.5 text-xs text-amber-700">{data.stats.lowStockProducts} products need attention</p></div><ArrowRight size={16} className="text-amber-700" /></Link>}
        </section>
      </div>
      <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6"><div><h2 className="font-bold text-slate-900">Top-selling products</h2><p className="mt-1 text-xs text-slate-500">Products your customers love most</p></div><Link href="/admin/products" className="group flex items-center gap-1.5 text-sm font-semibold text-emerald-700">View products <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" /></Link></div>
        {loading ? <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3"><LoadingBlock /><LoadingBlock /><LoadingBlock /></div> : !data?.topProducts.length ? <div className="px-6 py-14 text-center text-sm text-slate-500">No product sales yet</div> : <div className="grid gap-px bg-slate-100 sm:grid-cols-2 xl:grid-cols-3">{data.topProducts.map((product, index) => <div key={product.id} className="flex items-center gap-4 bg-white p-5 transition-colors hover:bg-emerald-50/30"><div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-slate-100">{product.images?.[0]?.url ? <img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-slate-400"><Package size={20} /></div>}<span className="absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded-md bg-white/90 text-[10px] font-bold text-slate-700 shadow-sm">{index + 1}</span></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-slate-900">{product.name}</p><p className="mt-1 text-xs text-slate-500">{product.totalSold} units sold</p></div><p className="text-sm font-bold text-emerald-700">{money(product.price)}</p></div>)}</div>}
      </section>
    </div></main>
  </div>;
}
