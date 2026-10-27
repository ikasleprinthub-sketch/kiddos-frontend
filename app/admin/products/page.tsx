"use client";

import { useEffect, useState, useCallback } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminPagination from "@/components/admin/AdminPagination";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { adminApi } from "@/lib/adminApi";
import { AlertTriangle, Box, CheckCircle2, CircleX, Download, ImagePlus, Pencil, Plus, Search, Trash2, X, Zap } from "lucide-react";

interface NutrientRow { name: string; value: string }

const DEFAULT_NUTRIENTS: NutrientRow[] = [
  { name: "Total Fat", value: "" },
  { name: "Saturated Fat", value: "" },
  { name: "Trans Fat", value: "" },
  { name: "Cholesterol", value: "" },
  { name: "Sodium", value: "" },
  { name: "Total Carbohydrate", value: "" },
  { name: "Dietary Fibre", value: "" },
  { name: "Total Sugars", value: "" },
  { name: "Protein", value: "" },
];

interface Category { id: string; name: string }
interface ProductImage { url: string; isPrimary: boolean }
interface ProductVariant {
  id: string;
  weight: string | number | null;
  unit: string | null;
  price: string;
  salePrice: string | null;
  stock: number;
  sku: string | null;
  isActive: boolean;
}
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  salePrice: string | null;
  stock: number;
  sku: string | null;
  isActive: boolean;
  isFeatured: boolean;
  isPopularBatter: boolean;
  isSpiceOil: boolean;
  isOffer: boolean;
  isCombo: boolean;
  weight: string | number | null;
  unit: string | null;
  tags: string[];
  category: { id: string; name: string };
  images: ProductImage[];
  ingredients: string | null;
  healthBenefits: string | null;
  usageInstructions: string | null;
  nutrientFacts: Record<string, string | number> | null;
  shelfLife: string | null;
  storageInstructions: string | null;
  variants?: ProductVariant[];
}

interface FormVariant {
  id?: string;
  weight: string;
  unit: string;
  price: string;
  salePrice: string;
  stock: number;
  sku: string;
  isActive: boolean;
}

interface FormState {
  name: string;
  description: string;
  price: string;
  salePrice: string;
  stock: number;
  sku: string;
  categoryId: string;
  isActive: boolean;
  isFeatured: boolean;
  isPopularBatter: boolean;
  isSpiceOil: boolean;
  isOffer: boolean;
  isCombo: boolean;
  weight: string;
  unit: string;
  tags: string;
  images: string[];
  ingredients: string;
  healthBenefits: string;
  usageInstructions: string;
  nutrientFacts: string;
  shelfLife: string;
  storageInstructions: string;
  variants: FormVariant[];
}

const EMPTY_FORM: FormState = {
  name: "", description: "", price: "", salePrice: "", stock: 0, sku: "",
  categoryId: "", isActive: true, isFeatured: false, isPopularBatter: false, isSpiceOil: false,
  isOffer: false, isCombo: false,
  weight: "", unit: "", tags: "", images: [],
  ingredients: "", healthBenefits: "", usageInstructions: "", nutrientFacts: "",
  shelfLife: "", storageInstructions: "",
  variants: [{ price: "", salePrice: "", stock: 0, sku: "", weight: "", unit: "g", isActive: true }],
};

const PRESET_UNITS = ["g", "kg", "ml", "L", "pcs", "packet", "box"];

const PAGE_SIZE = 10;
/** Catalogue-wide counts from the API (respecting the search box, ignoring the status tab) */
interface ProductCounts { all: number; active: number; inactive: number; lowStock: number; outOfStock: number }
const MAX_UPLOAD_MB = 5;

// Form keeps images as fixed slots: [primary, hover]; "" means the slot is empty
function toImageSlots(images: ProductImage[] | undefined): string[] {
  if (!Array.isArray(images) || images.length === 0) return [];
  const primary = images.find((i) => i.isPrimary) ?? images[0];
  const hover = images.find((i) => i !== primary);
  return [primary.url, hover?.url ?? ""];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [counts, setCounts] = useState<ProductCounts>({ all: 0, active: 0, inactive: 0, lowStock: 0, outOfStock: 0 });
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  // Nutrient facts visual editor state
  const [nutrientAmountPer, setNutrientAmountPer] = useState("100 gram");
  const [nutrientCalories, setNutrientCalories] = useState("");
  const [nutrientRows, setNutrientRows] = useState<NutrientRow[]>(DEFAULT_NUTRIENTS);

  const syncNutrientFacts = (amountPer: string, calories: string, rows: NutrientRow[]) => {
    const filled = rows.filter((r) => r.name.trim() && r.value.trim());
    if (!amountPer && !calories && filled.length === 0) {
      setForm((f) => ({ ...f, nutrientFacts: "" }));
      return;
    }
    const obj: Record<string, string | number> = {};
    if (amountPer) obj["amountPer"] = amountPer;
    if (calories) obj["Calories"] = isNaN(Number(calories)) ? calories : Number(calories);
    filled.forEach((r) => { obj[r.name.trim()] = r.value.trim(); });
    setForm((f) => ({ ...f, nutrientFacts: JSON.stringify(obj) }));
  };

  const parseNutrientFacts = (jsonStr: string) => {
    if (!jsonStr) {
      setNutrientAmountPer("100 gram");
      setNutrientCalories("");
      setNutrientRows(DEFAULT_NUTRIENTS.map((r) => ({ ...r })));
      return;
    }
    try {
      const obj: Record<string, string | number> = JSON.parse(jsonStr);
      setNutrientAmountPer(String(obj["amountPer"] ?? "100 gram"));
      setNutrientCalories(obj["Calories"] !== undefined ? String(obj["Calories"]) : "");
      const skip = new Set(["amountPer", "Calories"]);
      const rows: NutrientRow[] = Object.entries(obj)
        .filter(([k]) => !skip.has(k))
        .map(([name, value]) => ({ name, value: String(value) }));
      const defaultNames = DEFAULT_NUTRIENTS.map((r) => r.name);
      const merged = DEFAULT_NUTRIENTS.map((def) => {
        const found = rows.find((r) => r.name === def.name);
        return found ?? { ...def };
      });
      rows.filter((r) => !defaultNames.includes(r.name)).forEach((r) => merged.push(r));
      setNutrientRows(merged);
    } catch {
      setNutrientAmountPer("100 gram");
      setNutrientCalories("");
      setNutrientRows(DEFAULT_NUTRIENTS.map((r) => ({ ...r })));
    }
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      // The status tab is filtered on the server so pagination and totals match the tab
      const status = statusFilter === "all" ? "" : `&isActive=${statusFilter === "active"}`;
      const data = await adminApi.get<{ products: Product[]; total: number; pages: number; counts?: ProductCounts }>(
        `/admin/products?page=${page}&limit=${PAGE_SIZE}&search=${encodeURIComponent(search)}${status}`
      );
      setProducts(data.products);
      setTotal(data.total);
      setPages(Math.max(1, data.pages));
      if (data.counts) setCounts(data.counts);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    adminApi
      .get<{ categories: Category[] }>("/admin/categories?limit=100")
      .then((d) => setCategories(d.categories));
  }, []);

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditing(null);
    setModal("add");
    setError("");
    parseNutrientFacts("");
  };
  const openEdit = async (p: Product) => {
    setError("");
    setModal("edit");
    setLoadingEdit(true);
    setEditing(p);
    try {
      const response = await adminApi.get<{ product: Product } | Product>(`/admin/products/${p.id}`);
      const fullProduct = ('product' in response) ? response.product : response;
      setForm({
        name: fullProduct.name,
        description: fullProduct.description || "",
        price: fullProduct.price,
        salePrice: fullProduct.salePrice || "",
        stock: fullProduct.stock,
        sku: fullProduct.sku || "",
        categoryId: fullProduct.category?.id || "",
        isActive: fullProduct.isActive,
        isFeatured: fullProduct.isFeatured,
        isPopularBatter: fullProduct.isPopularBatter || false,
        isSpiceOil: fullProduct.isSpiceOil || false,
        isOffer: fullProduct.isOffer || false,
        isCombo: fullProduct.isCombo || false,
        weight: fullProduct.weight !== null && fullProduct.weight !== undefined ? String(fullProduct.weight) : "",
        unit: fullProduct.unit || "",
        tags: Array.isArray(fullProduct.tags) ? fullProduct.tags.join(", ") : "",
        images: toImageSlots(fullProduct.images),
        ingredients: fullProduct.ingredients || "",
        healthBenefits: fullProduct.healthBenefits || "",
        usageInstructions: fullProduct.usageInstructions || "",
        nutrientFacts: fullProduct.nutrientFacts ? JSON.stringify(fullProduct.nutrientFacts) : "",
        shelfLife: fullProduct.shelfLife || "",
        storageInstructions: fullProduct.storageInstructions || "",
        variants: Array.isArray(fullProduct.variants) && fullProduct.variants.length > 0 ? fullProduct.variants.map(v => ({
          id: v?.id,
          price: String(v?.price || ""),
          salePrice: v?.salePrice ? String(v.salePrice) : "",
          stock: Number(v?.stock || 0),
          sku: v?.sku || "",
          weight: v?.weight !== null && v?.weight !== undefined ? String(v.weight) : "",
          unit: v?.unit || "",
          isActive: v?.isActive ?? true,
        })) : [{
          price: String(fullProduct.price || ""),
          salePrice: fullProduct.salePrice ? String(fullProduct.salePrice) : "",
          stock: Number(fullProduct.stock || 0),
          sku: fullProduct.sku || "",
          weight: fullProduct.weight !== null && fullProduct.weight !== undefined ? String(fullProduct.weight) : "",
          unit: fullProduct.unit || "",
          isActive: fullProduct.isActive ?? true,
        }],
      });
      setEditing(fullProduct);
      parseNutrientFacts(fullProduct.nutrientFacts ? JSON.stringify(fullProduct.nutrientFacts) : "");
    } catch (e: unknown) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      console.error("Error loading product:", errorMsg, e);
      setError(`Failed: ${errorMsg}`);
      setLoadingEdit(false);
    } finally {
      setLoadingEdit(false);
    }
  };


  // Clear one slot without shifting the other (removing the primary must not turn the hover image into the primary)
  const removeImage = (slot: number) =>
    setForm((f) => {
      const imgs = [...f.images];
      imgs[slot] = "";
      return { ...f, images: imgs };
    });

  const uploadImage = async (slot: number, input: HTMLInputElement) => {
    const file = input.files?.[0];
    input.value = ""; // allow re-selecting the same file after an error
    if (!file) return;
    if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
      setError(`Image is too large. Maximum allowed size is ${MAX_UPLOAD_MB} MB. Your file is ${(file.size / (1024 * 1024)).toFixed(1)} MB.`);
      return;
    }
    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "products");
      const res = await adminApi.upload<{ url: string }>("/upload", fd);
      setForm((f) => {
        const imgs = [...f.images];
        imgs[slot] = res.url;
        return { ...f, images: imgs };
      });
    } catch (e: unknown) {
      setError(`Image upload failed: ${e instanceof Error ? e.message : "please try again"}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setError("");
    const [primaryImage, hoverImage] = form.images;
    if (hoverImage && !primaryImage) {
      setError("Add a primary image (Image 1) — the hover image is only shown on top of a primary image.");
      return;
    }
    let parsedNutrientFacts = null;
    if (form.nutrientFacts.trim()) {
      try { parsedNutrientFacts = JSON.parse(form.nutrientFacts); }
      catch { setError("Nutrient Facts must be valid JSON"); return; }
    }
    setSaving(true);
    try {
      const firstVar = form.variants[0] || { price: "0", salePrice: "", weight: "", unit: "", stock: 0, sku: "", isActive: true };
      const payload = {
        ...form,
        price: Number(firstVar.price),
        salePrice: firstVar.salePrice ? Number(firstVar.salePrice) : null,
        weight: firstVar.weight ? Number(firstVar.weight) : null,
        unit: firstVar.unit === "custom_temp" ? "" : firstVar.unit,
        stock: firstVar.stock,
        sku: firstVar.sku,
        // Index 0 = primary, 1 = hover (checked above that a hover image always has a primary)
        images: [primaryImage, hoverImage].filter(Boolean),
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        nutrientFacts: parsedNutrientFacts,
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

  // Errors (e.g. the product appears in orders) are shown inside the confirm dialog
  const handleDelete = async () => {
    if (!deleting) return;
    await adminApi.delete(`/admin/products/${deleting.id}`);
    setDeleting(null);
    load();
  };

  // Already filtered by status on the server
  const visibleProducts = products;
  const changeStatusFilter = (filter: "all" | "active" | "inactive") => { setStatusFilter(filter); setPage(1); };
  const missingImages = products.filter((p) => !p.images?.length).length;
  const exportProducts = () => { const rows=[["Product","SKU","Category","Price","Stock","Status"],...visibleProducts.map((p)=>[p.name,p.sku||"",p.category?.name||"",p.price,String(p.stock),p.isActive?"Active":"Inactive"])]; const csv=rows.map((row)=>row.map((cell)=>`"${cell.replaceAll('"','""')}"`).join(",")).join("\n"); const url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"})); const link=document.createElement("a"); link.href=url; link.download="products.csv"; link.click(); URL.revokeObjectURL(url); };

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[#f7f9f8]">
      <AdminHeader title="Products" />
      <main className="flex-1 overflow-y-auto"><div className="mx-auto max-w-[1600px] space-y-5 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h2 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">Product management</h2><p className="mt-1 text-sm text-slate-500">Manage your catalog, pricing and availability.</p></div><div className="flex gap-2"><button onClick={exportProducts} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold"><Download size={17}/> Export</button><button onClick={openAdd} className="flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white"><Plus size={18}/> Add product</button></div></div>
        <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4"><ProductSummary icon={Box} tone="emerald" label="Total products" value={counts.all}/><ProductSummary icon={CheckCircle2} tone="emerald" label="Active products" value={counts.active}/><ProductSummary icon={AlertTriangle} tone="amber" label="Low stock" value={counts.lowStock}/><ProductSummary icon={CircleX} tone="rose" label="Out of stock" value={counts.outOfStock}/></section>
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 px-5 pt-4 pb-3">
            <div className="flex gap-6">
              <button
                type="button"
                onClick={() => changeStatusFilter("all")}
                className={`pb-2 text-sm font-bold transition-colors ${statusFilter === "all" ? "border-b-2 border-emerald-700 text-emerald-700" : "text-slate-500 hover:text-slate-800"}`}
              >
                All products ({counts.all})
              </button>
              <button
                type="button"
                onClick={() => changeStatusFilter("active")}
                className={`pb-2 text-sm font-bold transition-colors ${statusFilter === "active" ? "border-b-2 border-emerald-700 text-emerald-700" : "text-slate-500 hover:text-slate-800"}`}
              >
                Active ({counts.active})
              </button>
              <button
                type="button"
                onClick={() => changeStatusFilter("inactive")}
                className={`pb-2 text-sm font-bold transition-colors ${statusFilter === "inactive" ? "border-b-2 border-emerald-700 text-emerald-700" : "text-slate-500 hover:text-slate-800"}`}
              >
                Inactive ({counts.inactive})
              </button>
            </div>
            <div className="relative w-full sm:w-64">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search products..."
                className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-9 pr-3 text-sm outline-none focus:border-emerald-500"
              />
            </div>
          </div><div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-slate-50 text-xs font-bold text-slate-500"><tr><th className="px-3 py-3">Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{loading?<tr><td colSpan={6} className="py-16 text-center"><span className="inline-block h-7 w-7 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent"/></td></tr>:visibleProducts.length===0?<tr><td colSpan={6} className="py-16 text-center text-slate-400">No products found</td></tr>:visibleProducts.map((p)=>{const image=p.images?.find((i)=>i.isPrimary)||p.images?.[0];return <tr key={p.id} className="hover:bg-emerald-50/30"><td className="px-3 py-3"><div className="flex items-center gap-3">{image?<img src={image.url} alt={p.name} className="h-12 w-12 rounded-xl object-cover"/>:<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold">{p.name.slice(0,2).toUpperCase()}</div>}<div><p className="max-w-72 font-bold text-slate-900">{p.name}</p><p className="text-xs text-slate-400">{p.sku||"No SKU"}</p></div></div></td><td>{p.category?.name||"Uncategorized"}</td><td className="font-bold">₹{Number(p.price).toLocaleString("en-IN")}</td><td><p>{p.stock} units</p><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${p.stock<=0?"bg-rose-100 text-rose-700":p.stock<=10?"bg-amber-100 text-amber-700":"bg-emerald-100 text-emerald-700"}`}>{p.stock<=0?"Out of stock":p.stock<=10?"Low stock":"In stock"}</span></td><td><span className={`rounded-full px-3 py-1 text-xs font-bold ${p.isActive?"bg-emerald-100 text-emerald-700":"bg-slate-100 text-slate-500"}`}>{p.isActive?"Active":"Inactive"}</span></td><td><div className="flex items-center gap-1"><button onClick={()=>openEdit(p)} aria-label={`Edit ${p.name}`} title="Edit" className="rounded-lg p-2 text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-700"><Pencil size={16}/></button><button onClick={()=>setDeleting(p)} aria-label={`Delete ${p.name}`} title="Delete" className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"><Trash2 size={16}/></button></div></td></tr>})}</tbody></table></div><div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-5 py-3 sm:flex-row"><div className="flex items-center gap-3"><span className="text-xs text-slate-500">Showing {visibleProducts.length?((page-1)*PAGE_SIZE)+1:0}–{Math.min(page*PAGE_SIZE,total)} of {total}</span><AdminPagination page={page} pages={pages} onPageChange={setPage} /></div></div></section>
        <div className="grid gap-5 lg:grid-cols-2"><section className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5"><span className="rounded-xl bg-amber-100 p-3 text-amber-600"><ImagePlus size={20}/></span><div><h3 className="font-bold">Catalog checks</h3><p className="text-sm font-semibold">{missingImages} products without images</p><p className="text-xs text-slate-500">Add product images to create a better shopping experience.</p></div></section><section className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5"><span className="rounded-xl bg-emerald-100 p-3 text-emerald-700"><Zap size={20}/></span><div><h3 className="font-bold">Quick actions</h3><p className="text-xs text-slate-500">Use Add product or Edit to manage your catalog.</p></div></section></div>
      </div></main>      {modal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">{modal === "add" ? "Add Product" : "Edit Product"}</h2>
            {/* Sticky so upload/save errors stay visible while scrolled down to the images or Save button */}
            {error && <p role="alert" className="sticky top-0 z-20 text-sm text-red-600 bg-red-50 rounded px-3 py-2 shadow-sm">{error}</p>}
            {loadingEdit && (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="inline-block w-6 h-6 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin mb-2" />
                  <p className="text-sm text-gray-500">Loading product details...</p>
                </div>
              </div>
            )}

            {!loadingEdit && <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-none" />
              </div>

              {/* ── Variants Section ── */}
              <div className="col-span-2 border-t border-gray-100 pt-3">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Product Variants (Sizes/Weights)</p>
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, variants: [...f.variants, { price: "", salePrice: "", stock: 0, sku: "", weight: "", unit: "g", isActive: true }] }))}
                    className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    <Plus size={13} /> Add Variant
                  </button>
                </div>
                
                <div className="space-y-3">
                  {form.variants.map((variant, vIdx) => (
                    <div key={vIdx} className="grid grid-cols-[1fr_1fr_1fr_1fr_0.5fr_0.5fr_auto] gap-2 items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Weight/Qty</label>
                        <input type="number" value={variant.weight} onChange={(e) => {
                          const newV = [...form.variants];
                          newV[vIdx] = { ...variant, weight: e.target.value };
                          setForm({ ...form, variants: newV });
                        }} className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-300" placeholder="e.g. 500" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Unit</label>
                        <select value={variant.unit} onChange={(e) => {
                          const newV = [...form.variants];
                          newV[vIdx] = { ...variant, unit: e.target.value };
                          setForm({ ...form, variants: newV });
                        }} className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-300 bg-white">
                          <option value="">None</option>
                          {PRESET_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Price (₹)</label>
                        <input type="number" value={variant.price} onChange={(e) => {
                          const newV = [...form.variants];
                          newV[vIdx] = { ...variant, price: e.target.value };
                          setForm({ ...form, variants: newV });
                        }} className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-300" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Sale Price (₹)</label>
                        <input type="number" value={variant.salePrice} onChange={(e) => {
                          const newV = [...form.variants];
                          newV[vIdx] = { ...variant, salePrice: e.target.value };
                          setForm({ ...form, variants: newV });
                        }} className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-300" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Stock</label>
                        <input type="number" value={variant.stock} onChange={(e) => {
                          const newV = [...form.variants];
                          newV[vIdx] = { ...variant, stock: Number(e.target.value) };
                          setForm({ ...form, variants: newV });
                        }} className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-300" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">SKU</label>
                        <input value={variant.sku} onChange={(e) => {
                          const newV = [...form.variants];
                          newV[vIdx] = { ...variant, sku: e.target.value };
                          setForm({ ...form, variants: newV });
                        }} className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-300" />
                      </div>
                      <div className="flex flex-col items-center justify-end h-full pb-1.5 px-1">
                        <button type="button" onClick={() => {
                          if (form.variants.length > 1) {
                            setForm({ ...form, variants: form.variants.filter((_, i) => i !== vIdx) });
                          }
                        }} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-50" disabled={form.variants.length === 1}>
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={form.categoryId} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300">
                  <option value="">Select category</option>
                  {Array.isArray(categories) && categories.map((c) => <option key={c?.id} value={c?.id || ""}>{c?.name || "Unknown"}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                <input value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                  placeholder="organic, fresh, premium"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300" />
              </div>

              {/* ── Product Detail Fields ── */}
              <div className="col-span-2 border-t border-gray-100 pt-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Product Details</p>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients</label>
                <textarea value={form.ingredients} onChange={(e) => setForm((f) => ({ ...f, ingredients: e.target.value }))}
                  rows={3} placeholder="Rice, Urad Dal, Salt..."
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Health Benefits</label>
                <textarea value={form.healthBenefits} onChange={(e) => setForm((f) => ({ ...f, healthBenefits: e.target.value }))}
                  rows={3} placeholder="Rich in protein, aids digestion..."
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Usage Instructions</label>
                <textarea value={form.usageInstructions} onChange={(e) => setForm((f) => ({ ...f, usageInstructions: e.target.value }))}
                  rows={3} placeholder="Mix well before use, add water as needed..."
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shelf Life</label>
                <input value={form.shelfLife} onChange={(e) => setForm((f) => ({ ...f, shelfLife: e.target.value }))}
                  placeholder="e.g. 6 months"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Storage Instructions</label>
                <input value={form.storageInstructions} onChange={(e) => setForm((f) => ({ ...f, storageInstructions: e.target.value }))}
                  placeholder="Store in a cool, dry place"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300" />
              </div>
              {/* ── Nutrient Facts Visual Editor ── */}
              {/* False comment is hide this */}
              {false && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nutrient Facts</label>
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    {/* Amount Per + Calories header */}
                    <div className="bg-gray-800 text-white px-4 py-3 grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Amount Per</p>
                        <input
                          value={nutrientAmountPer}
                          onChange={(e) => { setNutrientAmountPer(e.target.value); syncNutrientFacts(e.target.value, nutrientCalories, nutrientRows); }}
                          placeholder="100 gram"
                          className="w-full bg-gray-700 text-white text-sm px-2.5 py-1.5 rounded-lg border border-gray-600 focus:outline-none focus:border-emerald-400"
                        />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Calories</p>
                        <input
                          value={nutrientCalories}
                          onChange={(e) => { setNutrientCalories(e.target.value); syncNutrientFacts(nutrientAmountPer, e.target.value, nutrientRows); }}
                          placeholder="133"
                          className="w-full bg-gray-700 text-white text-sm px-2.5 py-1.5 rounded-lg border border-gray-600 focus:outline-none focus:border-emerald-400"
                        />
                      </div>
                    </div>

                    {/* Column headers */}
                    <div className="grid grid-cols-[1fr_120px_32px] gap-2 px-3 py-2 bg-gray-50 border-b border-gray-200">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Nutrient</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Value</span>
                      <span />
                    </div>

                    {/* Nutrient rows */}
                    <div className="divide-y divide-gray-100">
                      {nutrientRows.map((row, idx) => (
                        <div key={idx} className="grid grid-cols-[1fr_120px_32px] gap-2 items-center px-3 py-2">
                          <input
                            value={row.name}
                            onChange={(e) => {
                              const rows = nutrientRows.map((r, i) => i === idx ? { ...r, name: e.target.value } : r);
                              setNutrientRows(rows);
                              syncNutrientFacts(nutrientAmountPer, nutrientCalories, rows);
                            }}
                            placeholder="Nutrient name"
                            className="text-sm px-2.5 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-300"
                          />
                          <input
                            value={row.value}
                            onChange={(e) => {
                              const rows = nutrientRows.map((r, i) => i === idx ? { ...r, value: e.target.value } : r);
                              setNutrientRows(rows);
                              syncNutrientFacts(nutrientAmountPer, nutrientCalories, rows);
                            }}
                            placeholder="e.g. 0.3g"
                            className="text-sm px-2.5 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-300"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const rows = nutrientRows.filter((_, i) => i !== idx);
                              setNutrientRows(rows);
                              syncNutrientFacts(nutrientAmountPer, nutrientCalories, rows);
                            }}
                            className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add row button */}
                    <div className="px-3 py-2 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => {
                          const rows = [...nutrientRows, { name: "", value: "" }];
                          setNutrientRows(rows);
                        }}
                        className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                      >
                        <Plus size={13} /> Add Nutrient Row
                      </button>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">Leave values empty to omit a nutrient from the label.</p>
                </div>
              )}

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images <span className="text-gray-400 font-normal">(max 2)</span>
                </label>

                {/* Hover Preview */}
                {form.images.some(Boolean) && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">Preview (Hover Effect)</p>
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-white border border-gray-200 group cursor-pointer">
                      {/* Primary Image */}
                      {form.images[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={form.images[0]}
                          alt="Primary"
                          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
                        />
                      )}
                      {/* Hover Image */}
                      {form.images[1] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={form.images[1]}
                          alt="Hover"
                          className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        />
                      )}
                      {!form.images[0] && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
                          No primary image
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500 mt-2">Hover over the preview to see the effect</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 mb-3">
                  {[0, 1].map((slot) => {
                    const url = form.images[slot];
                    const label = slot === 0 ? "Image 1 · Primary" : "Image 2 · Hover";
                    return (
                      <div key={slot} className="relative">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">{label}</p>
                        {url ? (
                          <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt={label} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={(e) => { e.preventDefault(); removeImage(slot); }}
                              className="absolute top-2 right-2 w-7 h-7 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full text-lg flex items-center justify-center shadow-lg transition-all hover:scale-105 cursor-pointer"
                              title="Remove image"
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <label className={`flex flex-col items-center justify-center w-full aspect-square rounded-xl border-2 border-dashed cursor-pointer transition-colors ${uploading ? "opacity-50 cursor-not-allowed" : "border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/40"}`}>
                            <ImagePlus className="w-6 h-6 mb-1 text-gray-400" />
                            <span className="text-xs font-medium text-gray-400">Upload</span>
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp,image/gif"
                              className="hidden"
                              disabled={uploading}
                              onChange={(e) => uploadImage(slot, e.target)}
                            />
                          </label>
                        )}
                      </div>
                    );
                  })}
                </div>
                {uploading && (
                  <p className="text-xs text-emerald-600 flex items-center gap-1.5">
                    <span className="inline-block w-3 h-3 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
                    Uploading image…
                  </p>
                )}
                <p className="text-[11px] text-gray-400 mt-1">Image 1 is shown by default. Image 2 appears on hover in the product listing.</p>
              </div>
              <div className="col-span-2 flex flex-wrap gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                    className="w-4 h-4 accent-emerald-600" />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))}
                    className="w-4 h-4 accent-emerald-600" />
                  <span className="text-sm text-gray-700">Best Seller</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isPopularBatter} onChange={(e) => setForm((f) => ({ ...f, isPopularBatter: e.target.checked }))}
                    className="w-4 h-4 accent-emerald-600" />
                  <span className="text-sm text-gray-700">Popular Batter</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isSpiceOil} onChange={(e) => setForm((f) => ({ ...f, isSpiceOil: e.target.checked }))}
                    className="w-4 h-4 accent-emerald-600" />
                  <span className="text-sm text-gray-700">Spice & Oil</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isOffer} onChange={(e) => setForm((f) => ({ ...f, isOffer: e.target.checked }))}
                    className="w-4 h-4 accent-emerald-600" />
                  <span className="text-sm text-gray-700">Offers</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isCombo} onChange={(e) => setForm((f) => ({ ...f, isCombo: e.target.checked }))}
                    className="w-4 h-4 accent-emerald-600" />
                  <span className="text-sm text-gray-700">Combo</span>
                </label>
              </div>
            </div>
            }

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50">
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
      <ConfirmDialog
        open={!!deleting}
        title="Delete product?"
        message={deleting && <>
          <p>You are about to delete <b className="text-slate-900">{deleting.name}</b>. This cannot be undone.</p>
          <p className="mt-2">Products that appear in orders can&apos;t be deleted — mark them inactive instead to hide them from the store.</p>
        </>}
        confirmLabel="Delete product"
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}

function ProductSummary({ icon: Icon, tone, label, value }: { icon: React.ComponentType<{ size?: number }>; tone: "emerald" | "amber" | "rose"; label: string; value: number }) {
  const colors = tone === "emerald" ? "bg-emerald-100 text-emerald-700" : tone === "amber" ? "bg-amber-100 text-amber-600" : "bg-rose-100 text-rose-600";
  return <div className="flex min-w-0 items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:gap-4 sm:p-5"><div className={`shrink-0 rounded-xl p-2 sm:p-3 ${colors}`}><Icon size={22}/></div><div className="min-w-0"><p className="text-[11px] font-medium leading-tight text-slate-500 sm:text-sm">{label}</p><p className="mt-1 text-xl font-extrabold text-slate-950 sm:text-2xl">{value}</p></div></div>;
}
