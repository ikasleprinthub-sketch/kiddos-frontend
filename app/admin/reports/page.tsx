"use client";

import { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatsCard from "@/components/admin/StatsCard";
import { adminApi } from "@/lib/adminApi";
import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react";

interface ReportData {
  period: { days: number; from: string };
  summary: {
    totalRevenue: number;
    totalOrders: number;
    totalDiscount: number;
    newCustomers: number;
    avgOrderValue: number;
  };
  revenueChart: Array<{ date: string; revenue: number; orders: number }>;
  topProducts: Array<{
    id: string;
    name: string;
    price: string;
    totalSold: number;
    totalRevenue: number;
    category: { name: string };
    images: Array<{ url: string }>;
  }>;
  categoryRevenue: Array<{ name: string; revenue: number }>;
}

const RANGES = [
  { label: "Last 7 days", value: "7" },
  { label: "Last 30 days", value: "30" },
  { label: "Last 90 days", value: "90" },
];

export default function ReportsPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("30");

  useEffect(() => {
    setLoading(true);
    adminApi
      .get<ReportData>(`/admin/reports?range=${range}`)
      .then(setData)
      .finally(() => setLoading(false));
  }, [range]);

  const maxRevenue = data ? Math.max(...data.revenueChart.map((d) => d.revenue), 1) : 1;

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <AdminHeader title="Reports" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Range selector */}
        <div className="flex gap-2">
          {RANGES.map(({ label, value }) => (
            <button key={value} onClick={() => setRange(value)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                range === value
                  ? "bg-emerald-600 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}>
              {label}
            </button>
          ))}
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatsCard title="Revenue" value={loading ? "—" : `₹${data?.summary.totalRevenue}`} icon={DollarSign} color="green" />
          <StatsCard title="Orders" value={loading ? "—" : data?.summary.totalOrders ?? 0} icon={ShoppingCart} color="blue" />
          <StatsCard title="Avg Order" value={loading ? "—" : `₹${data?.summary.avgOrderValue}`} icon={TrendingUp} color="purple" />
          <StatsCard title="New Customers" value={loading ? "—" : data?.summary.newCustomers ?? 0} icon={Users} color="orange" />
          <StatsCard title="Discounts Given" value={loading ? "—" : `₹${data?.summary.totalDiscount}`} icon={DollarSign} color="red" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-800 mb-4">Revenue Over Time</h2>
            {loading ? (
              <div className="h-40 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="flex items-end gap-1 h-40 min-w-max">
                  {data?.revenueChart.map((point) => (
                    <div key={point.date} className="flex flex-col items-center gap-1 group">
                      <div className="relative">
                        <div
                          className="w-6 bg-emerald-400 rounded-t hover:bg-emerald-500 transition-colors"
                          style={{ height: `${Math.max(4, (point.revenue / maxRevenue) * 128)}px` }}
                          title={`₹${point.revenue}`}
                        />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-1.5 py-1 whitespace-nowrap z-10">
                          {point.date}<br />₹{point.revenue} ({point.orders} orders)
                        </div>
                      </div>
                      <span className="text-[9px] text-gray-400 rotate-45 origin-left w-6 truncate">
                        {point.date.slice(5)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Category Revenue */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-800 mb-4">Revenue by Category</h2>
            {loading ? (
              <div className="h-40 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : data?.categoryRevenue.length === 0 ? (
              <p className="text-sm text-gray-400 py-6 text-center">No data for this period</p>
            ) : (
              <div className="space-y-3">
                {data?.categoryRevenue.map((cat, i) => {
                  const maxCat = data.categoryRevenue[0]?.revenue || 1;
                  return (
                    <div key={cat.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 font-medium truncate">{cat.name}</span>
                        <span className="text-gray-500 shrink-0 ml-2">₹{cat.revenue}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${i === 0 ? "bg-emerald-500" : i === 1 ? "bg-blue-400" : "bg-purple-400"}`}
                          style={{ width: `${(cat.revenue / maxCat) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Top Selling Products</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Units Sold</th>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr><td colSpan={4} className="py-10 text-center text-gray-400">Loading…</td></tr>
                ) : data?.topProducts.length === 0 ? (
                  <tr><td colSpan={4} className="py-10 text-center text-gray-400">No sales in this period</td></tr>
                ) : (
                  data?.topProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          {product.images?.[0]?.url && (
                            <img src={product.images[0].url} alt={product.name} className="w-8 h-8 rounded object-cover bg-gray-100" />
                          )}
                          <span className="font-medium text-gray-800">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-500">{product.category?.name}</td>
                      <td className="px-5 py-3 font-semibold text-emerald-600">{product.totalSold}</td>
                      <td className="px-5 py-3 font-semibold text-gray-700">₹{product.totalRevenue}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
