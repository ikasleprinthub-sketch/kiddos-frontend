"use client";

import { useEffect, useState, useCallback } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import DataTable, { Column } from "@/components/admin/DataTable";
import { adminApi } from "@/lib/adminApi";
import { Search, Eye } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  _count: { orders: number };
}

interface CustomerDetail extends Customer {
  updatedAt: string;
  orders: Array<{
    id: string;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    total: string;
    createdAt: string;
  }>;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState<{ customer: CustomerDetail; totalSpent: string } | null>(null);
  const [toggling, setToggling] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "", isVerified: false });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.get<{ customers: Customer[]; total: number; pages: number }>(
        `/admin/customers?page=${page}&search=${search}`
      );
      setCustomers(data.customers);
      setTotal(data.total);
      setPages(data.pages);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const openDetail = async (c: Customer) => {
    setIsEditing(false);
    const data = await adminApi.get<{ customer: CustomerDetail; totalSpent: string }>(`/admin/customers/${c.id}`);
    setDetail(data);
    setEditForm({
      name: data.customer.name,
      email: data.customer.email,
      phone: data.customer.phone || "",
      isVerified: data.customer.isVerified,
    });
  };

  const toggleActive = async () => {
    if (!detail) return;
    setToggling(true);
    try {
      await adminApi.put(`/admin/customers/${detail.customer.id}`, { isActive: !detail.customer.isActive });
      setDetail((d) => d ? { ...d, customer: { ...d.customer, isActive: !d.customer.isActive } } : null);
      load();
    } finally {
      setToggling(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!detail) return;
    setSaving(true);
    try {
      const updated = await adminApi.put<{ customer: Customer }>(`/admin/customers/${detail.customer.id}`, {
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone || null,
        isVerified: editForm.isVerified,
      });
      setDetail((d) => d ? {
        ...d,
        customer: {
          ...d.customer,
          name: updated.customer.name,
          email: updated.customer.email,
          phone: updated.customer.phone,
          isVerified: updated.customer.isVerified,
        }
      } : null);
      setIsEditing(false);
      load();
    } catch (err) {
      alert("Failed to save customer details");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!detail) return;
    const ok = confirm(`Are you sure you want to delete ${detail.customer.name}? This will permanently delete their account, wishlist, and all orders!`);
    if (!ok) return;

    setDeleting(true);
    try {
      await adminApi.delete(`/admin/customers/${detail.customer.id}`);
      setDetail(null);
      load();
    } catch (err) {
      alert("Failed to delete customer");
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<Customer>[] = [
    { key: "name", label: "Name", render: (row) => (
      <div>
        <p className="font-medium">{row.name}</p>
        <p className="text-xs text-gray-400">{row.email}</p>
      </div>
    )},
    { key: "phone", label: "Phone", render: (row) => row.phone || "—" },
    { key: "_count", label: "Orders", render: (row) => String(row._count.orders) },
    { key: "isVerified", label: "Verified", render: (row) => (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${row.isVerified ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
        {row.isVerified ? "Yes" : "No"}
      </span>
    )},
    { key: "isActive", label: "Status", render: (row) => (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${row.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
        {row.isActive ? "Active" : "Suspended"}
      </span>
    )},
    { key: "createdAt", label: "Joined", render: (row) => new Date(row.createdAt).toLocaleDateString("en-IN") },
    { key: "actions", label: "Actions", render: (row) => (
      <button onClick={() => openDetail(row)} className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded">
        <Eye size={15} />
      </button>
    )},
  ];

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <AdminHeader title="Customers" />
      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search customers…"
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300" />
          </div>
        </div>
        <p className="text-sm text-gray-500">{total} customers</p>
        <DataTable columns={columns} data={customers} loading={loading} page={page} pages={pages} total={total} onPageChange={setPage} />
      </main>

      {detail && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <div className="bg-white w-full max-w-lg h-full overflow-y-auto shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-800">Customer Details</h2>
              <button onClick={() => setDetail(null)} className="text-gray-500 hover:text-gray-700 text-xl">×</button>
            </div>
            <div className="flex-1 p-6 space-y-6 text-sm flex flex-col justify-between">
              <div className="space-y-6">
                {isEditing ? (
                  <form onSubmit={handleSave} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name</label>
                      <input
                        type="text"
                        required
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                      <input
                        type="email"
                        required
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone</label>
                      <input
                        type="text"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        placeholder="e.g. 9876543210"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
                      />
                    </div>
                    <div className="flex items-center gap-2 py-2">
                      <input
                        type="checkbox"
                        id="isVerified"
                        checked={editForm.isVerified}
                        onChange={(e) => setEditForm({ ...editForm, isVerified: e.target.checked })}
                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <label htmlFor="isVerified" className="text-sm font-medium text-gray-700">Email Verified</label>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg transition"
                      >
                        {saving ? "Saving..." : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="flex-1 border border-gray-200 hover:bg-gray-50 font-medium py-2 rounded-lg transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-lg font-bold text-gray-900">{detail.customer.name}</p>
                        <p className="text-gray-500">{detail.customer.email}</p>
                        {detail.customer.phone && <p className="text-gray-500">{detail.customer.phone}</p>}
                      </div>
                      <div className="flex flex-col gap-2">
                        <button onClick={toggleActive} disabled={toggling}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                            detail.customer.isActive
                              ? "bg-red-50 text-red-600 hover:bg-red-100"
                              : "bg-green-50 text-green-600 hover:bg-green-100"
                          }`}>
                          {toggling ? "…" : detail.customer.isActive ? "Suspend" : "Activate"}
                        </button>
                        <button onClick={() => setIsEditing(true)}
                          className="px-3 py-1.5 text-xs font-medium bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-lg transition-colors">
                          Edit
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-emerald-50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-emerald-700">{detail.customer._count.orders}</p>
                        <p className="text-xs text-emerald-600 mt-0.5">Total Orders</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-blue-700">₹{detail.totalSpent}</p>
                        <p className="text-xs text-blue-600 mt-0.5">Total Spent</p>
                      </div>
                    </div>

                    <div className="flex gap-3 text-xs">
                      <span className={`px-2 py-1 rounded-full ${detail.customer.isVerified ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {detail.customer.isVerified ? "Email Verified" : "Not Verified"}
                      </span>
                      <span className="text-gray-400">Joined {new Date(detail.customer.createdAt).toLocaleDateString("en-IN")}</span>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Recent Orders</h3>
                      {detail.customer.orders.length === 0 ? (
                        <p className="text-gray-400">No orders yet</p>
                      ) : (
                        <div className="divide-y divide-gray-100 border border-gray-100 rounded-lg overflow-hidden">
                          {detail.customer.orders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between px-4 py-3">
                              <div>
                                <p className="font-mono text-sm font-medium">#{order.orderNumber}</p>
                                <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-0.5 rounded-full ${order.status === "DELIVERED" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                                  {order.status}
                                </span>
                                <span className="font-semibold text-sm">₹{order.total}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4 mt-auto space-y-2">
                <button
                  onClick={handleDelete}
                  disabled={deleting || detail.customer.isActive}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-medium py-2.5 rounded-lg transition disabled:cursor-not-allowed"
                >
                  {deleting ? "Deleting..." : "Delete Customer"}
                </button>
                {detail.customer.isActive && (
                  <p className="text-center text-xs text-gray-400">
                    Please suspend the customer account before deleting.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
