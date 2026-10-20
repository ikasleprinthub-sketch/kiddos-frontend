"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminPagination from "@/components/admin/AdminPagination";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { adminApi } from "@/lib/adminApi";
import {
  AlertCircle, Box, Check, CheckCircle2, CircleX,
  Download, Pencil, Plus, Search, Tag, Trash2, Upload, X,
} from "lucide-react";

interface Category {
  id: string; name: string; slug: string; description: string | null; image: string | null;
  isActive: boolean; sortOrder: number; createdAt: string; _count: { products: number };
}
interface FormState { name: string; description: string; image: string; isActive: boolean; sortOrder: number }
const EMPTY_FORM: FormState = { name: "", description: "", image: "", isActive: true, sortOrder: 0 };
const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<Category | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [summary, setSummary] = useState<{ total: number; list: Category[] }>({ total: 0, list: [] });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = debouncedSearch ? `&search=${encodeURIComponent(debouncedSearch)}` : "";
      const data = await adminApi.get<{ categories: Category[]; total: number; pages: number }>(`/admin/categories?page=${page}${q}`);
      setCategories(data.categories); setTotal(data.total); setPages(data.pages);
      // Summary cards describe the whole catalog, so only refresh them from unfiltered results
      if (!debouncedSearch) setSummary({ total: data.total, list: data.categories });
    } finally { setLoading(false); }
  }, [page, debouncedSearch]);

  // Wait until typing pauses before querying
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 250);
    return () => clearTimeout(t);
  }, [search]);
  // The callback performs the initial and query-driven API synchronization.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  const visibleCategories = useMemo(() => [...categories].sort((a, b) => a.name.localeCompare(b.name)), [categories]);

  const activeCount = summary.list.filter((cat) => cat.isActive).length;
  const inactiveCount = summary.list.length - activeCount;
  const uncategorizedCount = summary.list.reduce((sum, cat) => sum + (cat._count.products === 0 ? 1 : 0), 0);
  const missingImages = summary.list.filter((cat) => !cat.image).length;

  const openAdd = () => { setForm(EMPTY_FORM); setEditing(null); setModal("add"); setError(""); };
  const openEdit = (cat: Category) => { setForm({ name: cat.name, description: cat.description || "", image: cat.image || "", isActive: cat.isActive, sortOrder: cat.sortOrder }); setEditing(cat); setModal("edit"); setError(""); };
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const MAX_MB = 5;
    if (file.size > MAX_MB * 1024 * 1024) { setError(`Image is too large. Maximum allowed size is ${MAX_MB} MB. Your file is ${(file.size / (1024 * 1024)).toFixed(1)} MB.`); e.target.value = ""; return; }
    const fd = new FormData(); fd.append("file", file); fd.append("folder", "categories"); setUploadingImage(true); setError("");
    try { const res = await adminApi.upload<{ url: string }>("/upload", fd); setForm((f) => ({ ...f, image: res.url })); }
    catch { setError("Image upload failed. Please try again."); } finally { setUploadingImage(false); }
  };
  const handleSave = async () => {
    setError(""); if (!form.name.trim()) { setError("Name is required"); return; } if (!form.image) { setError("Category image is required"); return; }
    setSaving(true);
    try { if (modal === "add") await adminApi.post("/admin/categories", form); else if (editing) await adminApi.put(`/admin/categories/${editing.id}`, form); setModal(null); load(); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : "Save failed"); } finally { setSaving(false); }
  };
  // Errors (e.g. the category still has products) are shown inside the dialog
  const handleDelete = async () => {
    if (!deleting) return;
    await adminApi.delete(`/admin/categories/${deleting.id}`);
    setDeleting(null);
    load();
  };
  const exportCategories = () => {
    const rows = [["Category", "Slug", "Products", "Status", "Display order"], ...visibleCategories.map((cat) => [cat.name, cat.slug, String(cat._count.products), cat.isActive ? "Active" : "Inactive", String(cat.sortOrder)])];
    const csv = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" })); const link = document.createElement("a"); link.href = url; link.download = "categories.csv"; link.click(); URL.revokeObjectURL(url);
  };

  return <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[#f7f9f8]">
    <AdminHeader title="Categories" />
    <main className="flex-1 overflow-y-auto"><div className="mx-auto max-w-[1600px] space-y-5 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h2 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">Category management</h2><p className="mt-1 text-sm text-slate-500">Organize your products and control storefront visibility.</p></div><div className="flex gap-2"><button onClick={exportCategories} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"><Download size={17} /> Export</button><button onClick={openAdd} className="flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"><Plus size={18} /> Add category</button></div></div>

      <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <SummaryCard icon={Tag} tone="emerald" label="Total categories" value={summary.total} />
        <SummaryCard icon={CheckCircle2} tone="emerald" label="Active categories" value={activeCount} />
        <SummaryCard icon={CircleX} tone="rose" label="Inactive categories" value={inactiveCount} />
        <SummaryCard icon={Box} tone="slate" label="Categories without products" value={uncategorizedCount} />
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><h3 className="text-lg font-extrabold text-slate-950">All categories</h3><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">{total}</span></div><div className="relative w-full sm:w-64"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="search" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name or slug..." aria-label="Search categories" className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-9 pr-3 text-sm outline-none focus:border-emerald-500" /></div></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[820px] text-left text-sm"><thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-bold text-slate-500"><tr><th className="px-3 py-3">Category</th><th className="px-3 py-3">Slug</th><th className="px-3 py-3">Products</th><th className="px-3 py-3">Visibility</th><th className="px-3 py-3">Display order</th><th className="px-5 py-3">Actions</th></tr></thead>
          <tbody className="divide-y divide-slate-100">{loading ? <tr><td colSpan={6} className="py-16 text-center"><span className="inline-block h-7 w-7 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" /></td></tr> : visibleCategories.length === 0 ? <tr><td colSpan={6} className="py-16 text-center text-slate-400">{debouncedSearch ? `No categories match "${debouncedSearch}"` : "No categories found"}</td></tr> : visibleCategories.map((cat) => <tr key={cat.id} className="transition hover:bg-emerald-50/30"><td className="px-3 py-3"><div className="flex items-center gap-3">{cat.image ? <img src={cat.image} alt={cat.name} className="h-10 w-10 rounded-lg border border-slate-100 bg-slate-100 object-cover" /> : <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-[11px] font-bold text-slate-500">{cat.name.slice(0, 2).toUpperCase()}</div>}<div><p className="font-bold text-slate-900">{cat.name}</p><p className="mt-0.5 text-xs text-slate-400">{cat.image ? "Image uploaded" : "No image uploaded"}</p></div></div></td><td className="px-3 py-3 text-slate-500">{cat.slug}</td><td className="px-3 py-3"><span className="font-medium text-emerald-700 underline underline-offset-2">{cat._count.products} {cat._count.products === 1 ? "product" : "products"}</span></td><td className="px-3 py-3"><span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${cat.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}><span className={`h-2 w-2 rounded-full ${cat.isActive ? "bg-emerald-600" : "bg-slate-400"}`} />{cat.isActive ? "Active" : "Inactive"}</span></td><td className="px-3 py-3 font-medium text-slate-600">{cat.sortOrder}</td><td className="px-5 py-3"><div className="flex items-center gap-1"><button onClick={() => openEdit(cat)} aria-label={`Edit ${cat.name}`} title="Edit" className="rounded-lg p-2 text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-700"><Pencil size={16} /></button><button onClick={() => setDeleting(cat)} aria-label={`Delete ${cat.name}`} title="Delete" className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"><Trash2 size={16} /></button></div></td></tr>)}</tbody>
        </table></div>
        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-5 py-3 sm:flex-row"><p className="text-xs text-slate-500">Showing {visibleCategories.length ? (page - 1) * 10 + 1 : 0}–{Math.min(page * 10, total)} of {total} categories</p><AdminPagination page={page} pages={pages} onPageChange={setPage} /></div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><h3 className="border-b border-slate-200 px-5 py-3 text-sm font-bold text-slate-900">Category checklist</h3><div className="flex items-center gap-4 px-5 py-3"><span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${missingImages ? "bg-orange-500 text-white" : "bg-emerald-600 text-white"}`}>{missingImages ? <AlertCircle size={16} /> : <Check size={16} />}</span><div className="flex-1"><p className="text-sm font-bold text-slate-800">{missingImages ? `${missingImages} categories need an image` : "All categories have an image"}</p><p className="text-xs text-slate-500">{missingImages ? "Add images to give your categories a recognizable look on the storefront." : "Great! Every category has a storefront image."}</p></div></div><div className="flex items-center gap-4 border-t border-slate-100 px-5 py-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white"><Check size={16} /></span><div><p className="text-sm font-bold text-slate-800">Category records are ready</p><p className="text-xs text-slate-500">Product assignments and storefront visibility are shown above.</p></div></div></section>
    </div></main>

    {modal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm" onMouseDown={(e) => { if (e.target === e.currentTarget) setModal(null); }}><div role="dialog" aria-modal="true" className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-2xl"><div className="flex items-center justify-between border-b border-slate-100 px-6 py-5"><div><h2 className="text-xl font-extrabold text-slate-950">{modal === "add" ? "Add category" : "Edit category"}</h2><p className="mt-1 text-xs text-slate-500">Category details and storefront visibility</p></div><button onClick={() => setModal(null)} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"><X size={20} /></button></div><div className="space-y-4 p-6">
      {error && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
      <Field label="Name *"><input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={inputClass} /></Field>
      <Field label="Description"><textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} className={`${inputClass} resize-none`} /></Field>
      <Field label="Image *"><div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">{form.image && <div className="relative mb-3 w-fit"><img src={form.image} alt="Category preview" className="h-24 w-24 rounded-xl border border-slate-200 object-cover" /><button type="button" onClick={() => setForm((f) => ({ ...f, image: "" }))} className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-rose-500 text-white shadow"><X size={14} /></button></div>}<label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100"><Upload size={15} /> {uploadingImage ? "Uploading..." : "Choose image"}<input type="file" accept="image/*" onChange={handleUpload} disabled={uploadingImage} className="hidden" /></label><p className="mt-2 text-[11px] text-slate-400">PNG, JPG or WebP, up to 5 MB.</p></div></Field>
      <div className="grid gap-4 sm:grid-cols-2"><Field label="Sort order"><input type="number" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))} className={inputClass} /></Field><label className="mt-6 flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} className="h-4 w-4 accent-emerald-700" /> Active category</label></div>
    </div><div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4"><button onClick={() => setModal(null)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button><button onClick={handleSave} disabled={saving || uploadingImage} className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50">{saving ? "Saving..." : "Save category"}</button></div></div></div>}
    <ConfirmDialog
      open={!!deleting}
      title="Delete category?"
      message={deleting && <>
        <p>You are about to delete <b className="text-slate-900">{deleting.name}</b>. This cannot be undone.</p>
        {deleting._count.products > 0 && <p className="mt-2 font-medium text-amber-700">It still has {deleting._count.products} {deleting._count.products === 1 ? "product" : "products"}. Move or delete them first — a category with products can&apos;t be deleted.</p>}
      </>}
      confirmLabel="Delete category"
      onConfirm={handleDelete}
      onCancel={() => setDeleting(null)}
    />
  </div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block"><span className="mb-1.5 block text-xs font-bold text-slate-600">{label}</span>{children}</label>; }
function SummaryCard({ icon: Icon, tone, label, value }: { icon: React.ComponentType<{ size?: number }>; tone: "emerald" | "rose" | "slate"; label: string; value: number }) {
  const colors = tone === "emerald" ? "bg-emerald-100 text-emerald-700" : tone === "rose" ? "bg-rose-100 text-rose-600" : "bg-slate-100 text-slate-600";
  return <div className="flex min-w-0 items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:gap-4 sm:p-5"><div className={`shrink-0 rounded-xl p-2 sm:p-3 ${colors}`}><Icon size={21} /></div><div className="min-w-0"><p className="text-[11px] font-medium leading-tight text-slate-500 sm:text-sm">{label}</p><p className="mt-1 text-xl font-extrabold text-slate-950 sm:text-2xl">{value}</p></div></div>;
}
