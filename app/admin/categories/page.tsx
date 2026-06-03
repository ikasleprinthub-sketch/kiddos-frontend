"use client";

import { useEffect, useState, useCallback } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import DataTable, { Column } from "@/components/admin/DataTable";
import { adminApi } from "@/lib/adminApi";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  _count: { products: number };
}

interface FormState {
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  sortOrder: number;
}

const EMPTY_FORM: FormState = { name: "", description: "", image: "", isActive: true, sortOrder: 0 };

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.get<{ categories: Category[]; total: number; pages: number }>(
        `/admin/categories?page=${page}&search=${search}`
      );
      setCategories(data.categories);
      setTotal(data.total);
      setPages(data.pages);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setForm(EMPTY_FORM); setEditing(null); setModal("add"); setError(""); };
  const openEdit = (cat: Category) => {
    setForm({ name: cat.name, description: cat.description || "", image: cat.image || "", isActive: cat.isActive, sortOrder: cat.sortOrder });
    setEditing(cat);
    setModal("edit");
    setError("");
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "categories");
    setUploadingImage(true);
    try {
      const res = await adminApi.upload<{ url: string }>("/upload", fd);
      setForm((f) => ({ ...f, image: res.url }));
    } catch {
      setError("Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    setError("");
    if (!form.name.trim()) { setError("Name is required"); return; }
    setSaving(true);
    try {
      if (modal === "add") {
        await adminApi.post("/admin/categories", form);
      } else if (editing) {
        await adminApi.put(`/admin/categories/${editing.id}`, form);
      }
      setModal(null);
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat: Category) => {
    if (!confirm(`Delete "${cat.name}"? This cannot be undone.`)) return;
    try {
      await adminApi.delete(`/admin/categories/${cat.id}`);
      load();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const columns: Column<Category>[] = [
    {
      key: "image",
      label: "Image",
      render: (row) =>
        row.image ? (
          <img src={row.image} alt={row.name} className="w-10 h-10 rounded object-cover bg-gray-100" />
        ) : (
          <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-300 text-lg">
            ?
          </div>
        ),
    },
    { key: "name", label: "Name" },
    { key: "slug", label: "Slug" },
    { key: "_count", label: "Products", render: (row) => String(row._count.products) },
    {
      key: "isActive",
      label: "Status",
      render: (row) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${row.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
          {row.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEdit(row)} className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors">
            <Pencil size={15} />
          </button>
          <button onClick={() => handleDelete(row)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <AdminHeader title="Categories" />
      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search categories…"
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus size={16} /> Add Category
          </button>
        </div>

        <p className="text-sm text-gray-500">{total} categories</p>
        <DataTable
          columns={columns}
          data={categories}
          loading={loading}
          page={page}
          pages={pages}
          total={total}
          onPageChange={setPage}
        />
      </main>

      {/* Add/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {modal === "add" ? "Add Category" : "Edit Category"}
            </h2>

            {error && <p className="text-sm text-red-600 bg-red-50 rounded px-3 py-2">{error}</p>}

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                {form.image && (
                  <img src={form.image} alt="preview" className="w-16 h-16 rounded object-cover mb-2 bg-gray-100" />
                )}
                <input type="file" accept="image/*" onChange={handleUpload} disabled={uploadingImage}
                  className="text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-emerald-50 file:text-emerald-700 file:text-sm file:font-medium hover:file:bg-emerald-100"
                />
                {uploadingImage && <p className="text-xs text-gray-400 mt-1">Uploading…</p>}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
                  />
                </div>
                <div className="flex items-center gap-2 mt-5">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={form.isActive}
                    onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                    className="w-4 h-4 accent-emerald-600"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700">Active</label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setModal(null)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
