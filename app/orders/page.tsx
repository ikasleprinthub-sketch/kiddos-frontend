"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShoppingBag,
  ChevronRight,
  X,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  RotateCcw,
  MapPin,
  Tag,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface OrderItem {
  id: string;
  quantity: number;
  price: string;
  product: { name: string; images?: { url: string; isPrimary: boolean }[] };
}

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
  items: OrderItem[];
}

interface OrderDetail extends Order {
  notes: string | null;
  shippingAddress: Record<string, string>;
  coupon: { code: string } | null;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  PENDING:    { label: "Pending",    color: "bg-amber-100 text-amber-700 border-amber-200",    icon: <Clock className="w-3.5 h-3.5" /> },
  CONFIRMED:  { label: "Confirmed",  color: "bg-blue-100 text-blue-700 border-blue-200",        icon: <CheckCircle className="w-3.5 h-3.5" /> },
  PROCESSING: { label: "Processing", color: "bg-purple-100 text-purple-700 border-purple-200",  icon: <Package className="w-3.5 h-3.5" /> },
  SHIPPED:    { label: "Shipped",    color: "bg-indigo-100 text-indigo-700 border-indigo-200",  icon: <Truck className="w-3.5 h-3.5" /> },
  DELIVERED:  { label: "Delivered",  color: "bg-green-100 text-green-700 border-green-200",     icon: <CheckCircle className="w-3.5 h-3.5" /> },
  CANCELLED:  { label: "Cancelled",  color: "bg-red-100 text-red-700 border-red-200",           icon: <XCircle className="w-3.5 h-3.5" /> },
  REFUNDED:   { label: "Refunded",   color: "bg-zinc-100 text-zinc-600 border-zinc-200",        icon: <RotateCcw className="w-3.5 h-3.5" /> },
};

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

async function fetchWithAuth<T>(path: string): Promise<T> {
  const token = getToken();
  const res = await fetch(`/api${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || "Request failed");
  }
  return res.json();
}

export default function MyOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<OrderDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login?redirect=/orders");
    }
  }, [authLoading, user, router]);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page) });
      const data = await fetchWithAuth<{ orders: Order[]; total: number; pages: number }>(
        `/orders?${params}`
      );
      setOrders(data.orders);
      setTotal(data.total);
      setPages(data.pages);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [page, user]);

  useEffect(() => {
    load();
  }, [load]);

  const openDetail = async (order: Order) => {
    setDetailLoading(true);
    setDetail(order as OrderDetail);
    try {
      const data = await fetchWithAuth<{ order: OrderDetail }>(`/orders/${order.id}`);
      setDetail(data.order);
    } catch {
      // keep the basic order data shown
    } finally {
      setDetailLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-brand-green border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-zinc-400 dark:text-zinc-500 mb-3">
            <Link href="/" className="hover:text-brand-green transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-zinc-600 dark:text-zinc-300">My Orders</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-green/10 rounded-xl">
              <ShoppingBag className="w-6 h-6 text-brand-green" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">My Orders</h1>
              {!loading && (
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {total} {total === 1 ? "order" : "orders"} placed
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 p-5 animate-pulse">
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    <div className="h-3 w-24 bg-zinc-100 dark:bg-zinc-800 rounded" />
                  </div>
                  <div className="h-6 w-20 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
                </div>
                <div className="h-3 w-48 bg-zinc-100 dark:bg-zinc-800 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-5">
              <ShoppingBag className="w-9 h-9 text-zinc-300 dark:text-zinc-700" />
            </div>
            <h2 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 mb-2">No orders yet</h2>
            <p className="text-sm text-zinc-400 dark:text-zinc-500 mb-6 max-w-xs">
              Looks like you haven&apos;t placed any orders yet. Start shopping to see your orders here.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-brand-green hover:bg-brand-green-light rounded-full shadow transition-all duration-200 hover:-translate-y-0.5"
            >
              Browse Products
            </Link>
          </div>
        )}

        {/* Orders list */}
        {!loading && orders.length > 0 && (
          <div className="space-y-3">
            {orders.map((order) => {
              const statusCfg = STATUS_CONFIG[order.status] ?? { label: order.status, color: "bg-zinc-100 text-zinc-600 border-zinc-200", icon: null };
              return (
                <button
                  key={order.id}
                  onClick={() => openDetail(order)}
                  className="w-full text-left bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 p-5 hover:shadow-md hover:border-brand-green/30 dark:hover:border-brand-green/20 transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                        Order <span className="font-mono">#{order.orderNumber}</span>
                      </p>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusCfg.color}`}>
                        {statusCfg.icon}
                        {statusCfg.label}
                      </span>
                      <ChevronRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600 group-hover:text-brand-green transition-colors" />
                    </div>
                  </div>

                  {/* Items preview */}
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3 line-clamp-1">
                    {order.items.map((i) => `${i.product.name} ×${i.quantity}`).join(" · ")}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                      order.paymentStatus === "PAID"
                        ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800"
                        : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800"
                    }`}>
                      {order.paymentStatus === "PAID" ? "Paid" : order.paymentStatus}
                    </span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">₹{order.total}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm font-medium rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-zinc-500 dark:text-zinc-400 px-2">
              {page} / {pages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page === pages}
              className="px-4 py-2 text-sm font-medium rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Order Detail Drawer */}
      {detail && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end" onClick={() => setDetail(null)}>
          <div
            className="bg-white dark:bg-zinc-900 w-full max-w-md h-full overflow-y-auto shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 sticky top-0 bg-white dark:bg-zinc-900 z-10">
              <div>
                <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Order <span className="font-mono">#{detail.orderNumber}</span>
                </h2>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                  {new Date(detail.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric", month: "long", year: "numeric",
                  })}
                </p>
              </div>
              <button
                onClick={() => setDetail(null)}
                className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-6 space-y-6 text-sm">
              {detailLoading && (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 rounded-full border-2 border-brand-green border-t-transparent animate-spin" />
                </div>
              )}

              {/* Status badges */}
              <div className="flex items-center gap-2 flex-wrap">
                {(() => {
                  const s = STATUS_CONFIG[detail.status] ?? { label: detail.status, color: "bg-zinc-100 text-zinc-600 border-zinc-200", icon: null };
                  return (
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${s.color}`}>
                      {s.icon}{s.label}
                    </span>
                  );
                })()}
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                  detail.paymentStatus === "PAID"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}>
                  {detail.paymentStatus === "PAID" ? "Payment Received" : `Payment ${detail.paymentStatus}`}
                </span>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-semibold text-zinc-700 dark:text-zinc-300 mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4 text-zinc-400" /> Items
                </h3>
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-xl overflow-hidden">
                  {detail.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between px-4 py-3 bg-zinc-50/50 dark:bg-zinc-800/30">
                      <div>
                        <p className="font-medium text-zinc-800 dark:text-zinc-200">{item.product.name}</p>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">×{item.quantity} @ ₹{item.price}</p>
                      </div>
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                        ₹{(Number(item.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping address */}
              {(detail as OrderDetail).shippingAddress && Object.keys((detail as OrderDetail).shippingAddress).length > 0 && (
                <div>
                  <h3 className="font-semibold text-zinc-700 dark:text-zinc-300 mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-zinc-400" /> Shipping Address
                  </h3>
                  <div className="bg-zinc-50 dark:bg-zinc-800/40 rounded-xl p-3.5 space-y-1 text-zinc-600 dark:text-zinc-400">
                    {Object.entries((detail as OrderDetail).shippingAddress).map(([k, v]) => (
                      <p key={k}>
                        <span className="font-medium capitalize text-zinc-700 dark:text-zinc-300">{k}: </span>
                        {v}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Coupon */}
              {(detail as OrderDetail).coupon && (
                <div className="flex items-center gap-2 px-3.5 py-2.5 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl">
                  <Tag className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-green-700 dark:text-green-400 text-xs font-medium">
                    Coupon applied: <span className="font-mono">{(detail as OrderDetail).coupon!.code}</span>
                  </span>
                </div>
              )}

              {/* Totals */}
              <div className="bg-zinc-50 dark:bg-zinc-800/40 rounded-xl p-4 space-y-2.5">
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Subtotal</span>
                  <span>₹{detail.subtotal}</span>
                </div>
                {Number(detail.discount) > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Discount</span>
                    <span>−₹{detail.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Delivery Fee</span>
                  <span>₹{detail.deliveryFee}</span>
                </div>
                <div className="flex justify-between font-bold text-zinc-900 dark:text-zinc-100 border-t border-zinc-200 dark:border-zinc-700 pt-2.5">
                  <span>Total</span>
                  <span>₹{detail.total}</span>
                </div>
              </div>

              {/* Notes */}
              {(detail as OrderDetail).notes && (
                <div>
                  <h3 className="font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Notes</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl p-3.5">
                    {(detail as OrderDetail).notes}
                  </p>
                </div>
              )}

              {/* Payment method */}
              {detail.paymentMethod && (
                <p className="text-xs text-zinc-400 dark:text-zinc-500 text-right">
                  Paid via {detail.paymentMethod}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
