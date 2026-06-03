"use client";

import { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatsCard from "@/components/admin/StatsCard";
import { adminApi } from "@/lib/adminApi";
import {
  ShoppingCart, Users, Package, DollarSign,
  AlertTriangle, TrendingUp,
} from "lucide-react";

interface DashboardData {
  stats: {
    totalOrders: number;
    monthOrders: number;
    orderGrowth: number;
    totalCustomers: number;
    newCustomers: number;
    totalProducts: number;
    lowStockProducts: number;
    totalRevenue: string;
    monthRevenue: string;
    revenueGrowth: string;
  };
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    total: string;
    createdAt: string;
    user: { name: string; email: string };
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    price: string;
    totalSold: number;
    images: Array<{ url: string }>;
  }>;
  ordersByStatus: Array<{ status: string; _count: { id: number } }>;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-purple-100 text-purple-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  REFUNDED: "bg-gray-100 text-gray-700",
};

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi
      .get<DashboardData>("/admin/dashboard")
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <AdminHeader title="Dashboard" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Revenue"
            value={loading ? "—" : `₹${data?.stats.totalRevenue}`}
            sub={`₹${data?.stats.monthRevenue ?? "0"} this month`}
            icon={DollarSign}
            color="green"
            trend={data ? Number(data.stats.revenueGrowth) : undefined}
          />
          <StatsCard
            title="Total Orders"
            value={loading ? "—" : data?.stats.totalOrders ?? 0}
            sub={`${data?.stats.monthOrders ?? 0} this month`}
            icon={ShoppingCart}
            color="blue"
            trend={data?.stats.orderGrowth}
          />
          <StatsCard
            title="Customers"
            value={loading ? "—" : data?.stats.totalCustomers ?? 0}
            sub={`+${data?.stats.newCustomers ?? 0} this month`}
            icon={Users}
            color="purple"
          />
          <StatsCard
            title="Products"
            value={loading ? "—" : data?.stats.totalProducts ?? 0}
            sub={`${data?.stats.lowStockProducts ?? 0} low stock`}
            icon={Package}
            color={data?.stats.lowStockProducts ? "orange" : "green"}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-800">Recent Orders</h2>
              <a href="/admin/orders" className="text-xs text-emerald-600 hover:underline">
                View all
              </a>
            </div>
            <div className="divide-y divide-gray-50">
              {loading ? (
                <div className="py-10 flex justify-center">
                  <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : data?.recentOrders.length === 0 ? (
                <p className="px-5 py-8 text-sm text-gray-400 text-center">No orders yet</p>
              ) : (
                data?.recentOrders.map((order) => (
                  <div key={order.id} className="px-5 py-3 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800">#{order.orderNumber}</p>
                      <p className="text-xs text-gray-400 truncate">{order.user.name}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {order.status}
                      </span>
                      <span className="text-sm font-semibold text-gray-700">₹{order.total}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Orders by Status */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-600" />
              <h2 className="font-semibold text-gray-800">Orders by Status</h2>
            </div>
            <div className="p-5 space-y-3">
              {loading ? (
                <div className="py-6 flex justify-center">
                  <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : data?.ordersByStatus.length === 0 ? (
                <p className="text-sm text-gray-400 text-center">No data</p>
              ) : (
                data?.ordersByStatus.map(({ status, _count }) => (
                  <div key={status} className="flex items-center justify-between">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        STATUS_COLORS[status] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {status}
                    </span>
                    <span className="text-sm font-bold text-gray-700">{_count.id}</span>
                  </div>
                ))
              )}
            </div>

            {data?.stats.lowStockProducts ? (
              <div className="mx-5 mb-5 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center gap-2">
                <AlertTriangle size={14} className="text-orange-500 shrink-0" />
                <p className="text-xs text-orange-700">
                  {data.stats.lowStockProducts} product(s) are low on stock
                </p>
              </div>
            ) : null}
          </div>
        </div>

        {/* Top Products */}
        {data?.topProducts && data.topProducts.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-800">Top Selling Products</h2>
              <a href="/admin/products" className="text-xs text-emerald-600 hover:underline">
                View all
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 py-2.5 text-left text-xs text-gray-500 font-semibold uppercase">Product</th>
                    <th className="px-5 py-2.5 text-left text-xs text-gray-500 font-semibold uppercase">Price</th>
                    <th className="px-5 py-2.5 text-left text-xs text-gray-500 font-semibold uppercase">Total Sold</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.topProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          {product.images?.[0]?.url && (
                            <img
                              src={product.images[0].url}
                              alt={product.name}
                              className="w-8 h-8 rounded object-cover bg-gray-100"
                            />
                          )}
                          <span className="font-medium text-gray-800">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-600">₹{product.price}</td>
                      <td className="px-5 py-3 font-semibold text-emerald-600">{product.totalSold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
