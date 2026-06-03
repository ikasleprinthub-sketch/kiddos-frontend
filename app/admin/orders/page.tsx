"use client";

import { useEffect, useState, useCallback } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import DataTable, { Column } from "@/components/admin/DataTable";
import { adminApi } from "@/lib/adminApi";
import { Search, Eye, ChevronDown } from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  subtotal: string;
  discount: string;
  deliveryFee: string;
  total: string;
  createdAt: string;
  user: { id: string; name: string; email: string };
  items: Array<{ id: string; quantity: number; price: string; product: { name: string } }>;
}

interface OrderDetail extends Order {
  notes: string | null;
  shippingAddress: Record<string, string>;
  coupon: { code: string } | null;
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

const ORDER_STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];
const PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED"];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [detail, setDetail] = useState<OrderDetail | null>(null);
  const [updating, setUpdating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), search });
      if (statusFilter) params.set("status", statusFilter);
      const data = await adminApi.get<{ orders: Order[]; total: number; pages: number }>(
        `/admin/orders?${params}`
      );
      setOrders(data.orders);
      setTotal(data.total);
      setPages(data.pages);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const openDetail = async (order: Order) => {
    const data = await adminApi.get<{ order: OrderDetail }>(`/admin/orders/${order.id}`);
    setDetail(data.order);
  };

  const updateStatus = async (field: "status" | "paymentStatus", value: string) => {
    if (!detail) return;
    setUpdating(true);
    try {
      const data = await adminApi.put<{ order: OrderDetail }>(`/admin/orders/${detail.id}`, { [field]: value });
      setDetail(data.order);
      load();
    } finally {
      setUpdating(false);
    }
  };

  const columns: Column<Order>[] = [
    { key: "orderNumber", label: "Order #", render: (row) => <span className="font-mono text-sm">#{row.orderNumber}</span> },
    { key: "user", label: "Customer", render: (row) => (
      <div>
        <p className="font-medium text-sm">{row.user.name}</p>
        <p className="text-xs text-gray-400">{row.user.email}</p>
      </div>
    )},
    { key: "status", label: "Status", render: (row) => (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[row.status] || ""}`}>
        {row.status}
      </span>
    )},
    { key: "paymentStatus", label: "Payment", render: (row) => (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${row.paymentStatus === "PAID" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
        {row.paymentStatus}
      </span>
    )},
    { key: "total", label: "Total", render: (row) => <span className="font-semibold">₹{row.total}</span> },
    { key: "createdAt", label: "Date", render: (row) => new Date(row.createdAt).toLocaleDateString("en-IN") },
    { key: "actions", label: "Actions", render: (row) => (
      <button onClick={() => openDetail(row)} className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors">
        <Eye size={15} />
      </button>
    )},
  ];

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <AdminHeader title="Orders" />
      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search orders…"
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300" />
          </div>
          <div className="relative">
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300">
              <option value="">All statuses</option>
              {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <p className="text-sm text-gray-500">{total} orders</p>
        <DataTable columns={columns} data={orders} loading={loading} page={page} pages={pages} total={total} onPageChange={setPage} />
      </main>

      {/* Order Detail Drawer */}
      {detail && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <div className="bg-white w-full max-w-lg h-full overflow-y-auto shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-800">Order #{detail.orderNumber}</h2>
              <button onClick={() => setDetail(null)} className="text-gray-500 hover:text-gray-700 text-xl">×</button>
            </div>
            <div className="flex-1 p-6 space-y-6 text-sm">
              {/* Status controls */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Order Status</label>
                  <select value={detail.status} onChange={(e) => updateStatus("status", e.target.value)} disabled={updating}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300">
                    {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Payment Status</label>
                  <select value={detail.paymentStatus} onChange={(e) => updateStatus("paymentStatus", e.target.value)} disabled={updating}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300">
                    {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Customer */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Customer</h3>
                <p className="text-gray-800">{detail.user.name}</p>
                <p className="text-gray-500">{detail.user.email}</p>
              </div>

              {/* Shipping */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Shipping Address</h3>
                <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-gray-600">
                  {Object.entries(detail.shippingAddress || {}).map(([k, v]) => (
                    <p key={k}><span className="font-medium capitalize">{k}:</span> {v}</p>
                  ))}
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Items</h3>
                <div className="divide-y divide-gray-100 border border-gray-100 rounded-lg overflow-hidden">
                  {detail.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-800">{item.product.name}</p>
                        <p className="text-gray-500 text-xs">× {item.quantity} @ ₹{item.price}</p>
                      </div>
                      <span className="font-semibold text-gray-700">₹{(Number(item.price) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span><span>₹{detail.subtotal}</span>
                </div>
                {Number(detail.discount) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount {detail.coupon ? `(${detail.coupon.code})` : ""}</span>
                    <span>−₹{detail.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span><span>₹{detail.deliveryFee}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-2">
                  <span>Total</span><span>₹{detail.total}</span>
                </div>
              </div>

              {detail.notes && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">Notes</h3>
                  <p className="text-gray-600 bg-gray-50 rounded-lg p-3">{detail.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
