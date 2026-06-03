"use client";

import { useEffect, useState, useCallback } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import DataTable, { Column } from "@/components/admin/DataTable";
import { adminApi } from "@/lib/adminApi";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: string;
  minOrderAmount: string | null;
  maxUses: number | null;
  usedCount: number;
  isActive: boolean;
  expiresAt: string | null;
  _count: { orders: number };
}

interface FormState {
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: string;
  minOrderAmount: string;
  maxUses: string;
  isActive: boolean;
  expiresAt: string;
}

const EMPTY_FORM: FormState = {
  code: "", type: "PERCENTAGE", value: "", minOrderAmount: "", maxUses: "", isActive: true, expiresAt: "",
};

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.get<{ coupons: Coupon[]; total: number; pages: number }>(
        `/admin/coupons?page=${page}&search=${search}`
      );
      setCoupons(data.coupons);
      setTotal(data.total);
      setPages(data.pages);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setForm(EMPTY_FORM); setEditing(null); setModal("add"); setError(""); };
  const openEdit = (c: Coupon) => {
    setForm({
      code: c.code, type: c.type, value: c.value, minOrderAmount: c.minOrderAmount || "",
      maxUses: c.maxUses ? String(c.maxUses) : "", isActive: c.isActive,
      expiresAt: c.expiresAt ? c.expiresAt.slice(0, 10) : "",
    });
    setEditing(c);
    setModal("edit");
    setError("");
  };

  const handleSave = async () => {
    setError("");
    if (!form.code.trim()) { setError("Code is required"); return; }
    if (!form.value || isNaN(Number(form.value))) { setError("Valid value is required"); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        value: Number(form.value),
        minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : null,
        maxUses: form.maxUses ? Number(form.maxUses) : null,
        expiresAt: form.expiresAt || null,
      };
      if (modal === "add") await adminApi.post("/admin/coupons", payload);
      else if (editing) await adminApi.put(`/admin/coupons/${editing.id}`, payload);
      setModal(null);
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (c: Coupon) => {
    if (!confirm(`Delete coupon "${c.code}"?`)) return;
    try {
      await adminApi.delete(`/admin/coupons/${c.id}`);
      load();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const isExpired = (c: Coupon) => c.expiresAt && new Date(c.expiresAt) < new Date();

  const columns: Column<Coupon>[] = [
    { key: "code", label: "Code", render: (row) => <span className="font-mono font-semibold text-emerald-700">{row.code}</span> },
    { key: "type", label: "Type", render: (row) => (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${row.type === "PERCENTAGE" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}>
        {row.type === "PERCENTAGE" ? `${row.value}%` : `₹${row.value}`}
      </span>
    )},
    { key: "minOrderAmount", label: "Min Order", render: (row) => row.minOrderAmount ? `₹${row.minOrderAmount}` : "—" },
    { key: "usedCount", label: "Used", render: (row) => `${row.usedCount}${row.maxUses ? ` / ${row.maxUses}` : ""}` },
    { key: "expiresAt", label: "Expires", render: (row) => row.expiresAt ? (
      <span className={isExpired(row) ? "text-red-500" : ""}>
        {new Date(row.expiresAt).toLocaleDateString("en-IN")}
      </span>
    ) : "Never" },
    { key: "isActive", label: "Status", render: (row) => (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${row.isActive && !isExpired(row) ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
        {isExpired(row) ? "Expired" : row.isActive ? "Active" : "Inactive"}
      </span>
    )},
    { key: "actions", label: "Actions", render: (row) => (
      <div className="flex items-center gap-2">
        <button onClick={() => openEdit(row)} className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded">
          <Pencil size={15} />
        </button>
        <button onClick={() => handleDelete(row)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded">
          <Trash2 size={15} />
        </button>
      </div>
    )},
  ];

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <AdminHeader title="Coupons" />
      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search coupons…"
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300" />
          </div>
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700">
            <Plus size={16} /> Add Coupon
          </button>
        </div>
        <p className="text-sm text-gray-500">{total} coupons</p>
        <DataTable columns={columns} data={coupons} loading={loading} page={page} pages={pages} total={total} onPageChange={setPage} />
      </main>

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">{modal === "add" ? "Add Coupon" : "Edit Coupon"}</h2>
            {error && <p className="text-sm text-red-600 bg-red-50 rounded px-3 py-2">{error}</p>}

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
                <input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                  placeholder="SAVE10"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 font-mono uppercase" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as "PERCENTAGE" | "FIXED" }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300">
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Value *</label>
                  <input type="number" value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Order (₹)</label>
                  <input type="number" value={form.minOrderAmount} onChange={(e) => setForm((f) => ({ ...f, minOrderAmount: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Uses</label>
                  <input type="number" value={form.maxUses} onChange={(e) => setForm((f) => ({ ...f, maxUses: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expires At</label>
                <input type="date" value={form.expiresAt} onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                  className="w-4 h-4 accent-emerald-600" />
                <span className="text-sm text-gray-700">Active</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50">
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
