"use client";

import { useEffect, useState, useCallback } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { adminApi } from "@/lib/adminApi";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image: string;
  link: string | null;
  isActive: boolean;
  sortOrder: number;
  position: string;
}

interface FormState {
  title: string;
  subtitle: string;
  image: string;
  link: string;
  isActive: boolean;
  sortOrder: number;
  position: string;
}

const EMPTY_FORM: FormState = {
  title: "", subtitle: "", image: "", link: "", isActive: true, sortOrder: 0, position: "HOME",
};

const POSITIONS = ["HOME", "PROMO", "CATEGORY", "PRODUCT", "CHECKOUT"];

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [positionFilter, setPositionFilter] = useState("HOME");
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.get<{ banners: Banner[] }>(
        `/admin/banners?position=${positionFilter}`
      );
      setBanners(data.banners);
    } finally {
      setLoading(false);
    }
  }, [positionFilter]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setForm({ ...EMPTY_FORM, position: positionFilter }); setEditing(null); setModal("add"); setError(""); };
  const openEdit = (b: Banner) => {
    setForm({ title: b.title, subtitle: b.subtitle || "", image: b.image, link: b.link || "", isActive: b.isActive, sortOrder: b.sortOrder, position: b.position });
    setEditing(b);
    setModal("edit");
    setError("");
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "banners");
    setUploading(true);
    try {
      const res = await adminApi.upload<{ url: string }>("/upload", fd);
      setForm((f) => ({ ...f, image: res.url }));
    } catch {
      setError("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setError("");
    if (!form.title.trim()) { setError("Title is required"); return; }
    if (!form.image.trim()) { setError("Image is required"); return; }
    setSaving(true);
    try {
      if (modal === "add") await adminApi.post("/admin/banners", form);
      else if (editing) await adminApi.put(`/admin/banners/${editing.id}`, form);
      setModal(null);
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (b: Banner) => {
    if (!confirm(`Delete banner "${b.title}"?`)) return;
    try {
      await adminApi.delete(`/admin/banners/${b.id}`);
      load();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const toggleActive = async (b: Banner) => {
    await adminApi.put(`/admin/banners/${b.id}`, { isActive: !b.isActive });
    load();
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <AdminHeader title="Banners" />
      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-2">
            {POSITIONS.map((pos) => (
              <button key={pos} onClick={() => setPositionFilter(pos)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  positionFilter === pos
                    ? "bg-emerald-600 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}>
                {pos}
              </button>
            ))}
          </div>
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700">
            <Plus size={16} /> Add Banner
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : banners.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 py-16 text-center text-gray-400">
            No banners for this position
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {banners.map((banner) => (
              <div key={banner.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="relative aspect-[16/6] bg-gray-100">
                  <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white font-semibold text-sm truncate">{banner.title}</p>
                    {banner.subtitle && <p className="text-white/80 text-xs truncate">{banner.subtitle}</p>}
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button onClick={() => toggleActive(banner)}
                      className={`px-2 py-0.5 rounded text-xs font-medium ${banner.isActive ? "bg-green-500 text-white" : "bg-gray-500 text-white"}`}>
                      {banner.isActive ? "Live" : "Off"}
                    </button>
                  </div>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <GripVertical size={14} />
                    <span className="text-xs">Order: {banner.sortOrder}</span>
                    {banner.link && <span className="text-xs truncate max-w-24">{banner.link}</span>}
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(banner)} className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(banner)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">{modal === "add" ? "Add Banner" : "Edit Banner"}</h2>
            {error && <p className="text-sm text-red-600 bg-red-50 rounded px-3 py-2">{error}</p>}

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input value={form.subtitle} onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image *</label>
                {form.image && (
                  <img src={form.image} alt="preview" className="w-full h-24 rounded object-cover mb-2 bg-gray-100" />
                )}
                <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading}
                  className="text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-emerald-50 file:text-emerald-700 file:text-sm file:font-medium hover:file:bg-emerald-100" />
                {uploading && <p className="text-xs text-gray-400 mt-1">Uploading…</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
                <input value={form.link} onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
                  placeholder="/products or /category/organic"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  <select value={form.position} onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300">
                    {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                  <input type="number" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300" />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                  className="w-4 h-4 accent-emerald-600" />
                <span className="text-sm text-gray-700">Active (show on site)</span>
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
