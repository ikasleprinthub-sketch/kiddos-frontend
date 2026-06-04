"use client";

import { useEffect, useState, useCallback } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { adminApi } from "@/lib/adminApi";
import { Plus, Pencil, Trash2, BookOpen, X } from "lucide-react";

interface ChutneyBook {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  ingredients: string | null;
  usageInstructions: string | null;
  isActive: boolean;
  images: { url: string; isPrimary: boolean }[];
}

interface FormState {
  name: string;
  description: string;
  ingredients: string;
  usageInstructions: string;
  isActive: boolean;
  imageUrl: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  description: "",
  ingredients: "",
  usageInstructions: "",
  isActive: true,
  imageUrl: "",
};

export default function ChutneyBookPage() {
  const [books, setBooks] = useState<ChutneyBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<ChutneyBook | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploadingImg, setUploadingImg] = useState(false);
  const [categoryId, setCategoryId] = useState<string | null>(null);

  // Fetch chutney-book category ID, then load its products
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const catData = await adminApi.get<{ categories: { id: string; slug: string }[] }>(
        "/admin/categories?page=1&limit=100"
      );
      const cat = catData.categories.find((c) => c.slug === "chutney-book");
      if (!cat) { setLoading(false); return; }
      setCategoryId(cat.id);

      const data = await adminApi.get<{ products: ChutneyBook[] }>(
        `/admin/products?categoryId=${cat.id}&limit=100`
      );
      const all: ChutneyBook[] = Array.isArray(data) ? data : (data.products ?? []);
      setBooks(all);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditing(null);
    setError("");
    setModal("add");
  };

  const openEdit = (book: ChutneyBook) => {
    const img = book.images?.find((i) => i.isPrimary)?.url ?? book.images?.[0]?.url ?? "";
    setForm({
      name: book.name,
      description: book.description ?? "",
      ingredients: book.ingredients ?? "",
      usageInstructions: book.usageInstructions ?? "",
      isActive: book.isActive,
      imageUrl: img,
    });
    setEditing(book);
    setError("");
    setModal("edit");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "chutney-book");
    setUploadingImg(true);
    try {
      const res = await adminApi.upload<{ url: string }>("/upload", fd);
      setForm((f) => ({ ...f, imageUrl: res.url }));
    } catch {
      setError("Image upload failed");
    } finally {
      setUploadingImg(false);
    }
  };

  const handleSave = async () => {
    setError("");
    if (!form.name.trim()) { setError("Name is required"); return; }
    if (!categoryId) { setError("Chutney Book category not found. Create it in Categories first."); return; }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description,
        ingredients: form.ingredients,
        usageInstructions: form.usageInstructions,
        isActive: form.isActive,
        categoryId,
        price: 1,
        stock: 0,
        images: form.imageUrl ? [form.imageUrl] : [],
      };

      if (modal === "add") {
        await adminApi.post("/admin/products", payload);
      } else if (editing) {
        await adminApi.put(`/admin/products/${editing.id}`, payload);
      }
      setModal(null);
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (book: ChutneyBook) => {
    if (!confirm(`Delete "${book.name}"? This cannot be undone.`)) return;
    try {
      await adminApi.delete(`/admin/products/${book.id}`);
      load();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <AdminHeader title="Chutney Book" />
      <main className="flex-1 overflow-y-auto p-6">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-500">{books.length} recipes · view-only, not for sale</p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus size={16} /> Add Recipe
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-gray-100 animate-pulse aspect-[3/4]" />
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400">
            <BookOpen size={48} strokeWidth={1} />
            <p className="text-sm font-medium">No chutney recipes yet</p>
            <button
              onClick={openAdd}
              className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700"
            >
              Add First Recipe
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {books.map((book) => {
              const img = book.images?.find((i) => i.isPrimary)?.url ?? book.images?.[0]?.url;
              return (
                <div
                  key={book.id}
                  className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow"
                >
                  {/* Cover */}
                  <div className="aspect-[3/4] bg-amber-50 overflow-hidden">
                    {img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img} alt={book.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen size={40} className="text-amber-300" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3 flex-1 flex flex-col gap-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Kiddos Foods</p>
                    <p className="text-sm font-bold text-gray-800 leading-snug line-clamp-2">{book.name}</p>
                    <span className={`mt-1 self-start text-[10px] px-2 py-0.5 rounded-full font-medium ${book.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {book.isActive ? "Active" : "Hidden"}
                    </span>
                  </div>

                  {/* Hover actions */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEdit(book)}
                      className="w-8 h-8 bg-white rounded-lg shadow flex items-center justify-center text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(book)}
                      className="w-8 h-8 bg-white rounded-lg shadow flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Add / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg my-8 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                {modal === "add" ? "Add Recipe" : "Edit Recipe"}
              </h2>
              <button onClick={() => setModal(null)} className="p-1 text-gray-400 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            {!categoryId && (
              <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                ⚠️ "Chutney Book" category not found. Go to <strong>Admin → Categories</strong> and create a category with slug <code>chutney-book</code> first.
              </p>
            )}

            {error && <p className="text-sm text-red-600 bg-red-50 rounded px-3 py-2">{error}</p>}

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipe Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Dal Chutney / பருப்பு சட்னி"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
                {form.imageUrl && (
                  <div className="relative inline-block mb-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.imageUrl} alt="cover" className="w-24 h-32 rounded-lg object-cover border border-gray-200" />
                    <button
                      onClick={() => setForm((f) => ({ ...f, imageUrl: "" }))}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImg}
                  className="text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-emerald-50 file:text-emerald-700 file:text-sm file:font-medium hover:file:bg-emerald-100"
                />
                {uploadingImg && <p className="text-xs text-gray-400 mt-1">Uploading…</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={2}
                  placeholder="Brief intro about this chutney…"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-none"
                />
              </div>

              {/* Ingredients / Recipe */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients / Recipe</label>
                <textarea
                  value={form.ingredients}
                  onChange={(e) => setForm((f) => ({ ...f, ingredients: e.target.value }))}
                  rows={5}
                  placeholder={"e.g.\n• 1 cup roasted chana dal\n• 2 dried red chillies\n• Salt to taste\n• Tamarind (small piece)"}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-y font-mono"
                />
              </div>

              {/* Usage / How to Make */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">How to Make</label>
                <textarea
                  value={form.usageInstructions}
                  onChange={(e) => setForm((f) => ({ ...f, usageInstructions: e.target.value }))}
                  rows={4}
                  placeholder={"e.g.\n1. Dry roast chana dal until golden.\n2. Grind with red chillies and tamarind.\n3. Add salt and water as needed."}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-y"
                />
              </div>

              {/* Active toggle */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                  className="w-4 h-4 accent-emerald-600"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">Show on website</label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
              <button
                onClick={() => setModal(null)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !categoryId}
                className="px-5 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save Recipe"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
