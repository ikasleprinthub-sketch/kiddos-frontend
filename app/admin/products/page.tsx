"use client";

import { useEffect, useState, useCallback } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import DataTable, { Column } from "@/components/admin/DataTable";
import { adminApi } from "@/lib/adminApi";
import { Plus, Pencil, Trash2, Search, X } from "lucide-react";

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
}

const EMPTY_FORM: FormState = {
  name: "", description: "", price: "", salePrice: "", stock: 0, sku: "",
  categoryId: "", isActive: true, isFeatured: false, isPopularBatter: false, isSpiceOil: false,
  weight: "", unit: "", tags: "", images: [],
  ingredients: "", healthBenefits: "", usageInstructions: "", nutrientFacts: "",
  shelfLife: "", storageInstructions: "",
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

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
      const data = await adminApi.get<{ products: Product[]; total: number; pages: number }>(
        `/admin/products?page=${page}&search=${search}`
      );
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

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
  const openEdit = (p: Product) => {
    setForm({
      name: p.name,
      description: p.description || "",
      price: p.price,
      salePrice: p.salePrice || "",
      stock: p.stock,
      sku: p.sku || "",
      categoryId: p.category.id,
      isActive: p.isActive,
      isFeatured: p.isFeatured,
      isPopularBatter: p.isPopularBatter || false,
      isSpiceOil: p.isSpiceOil || false,
      weight: p.weight !== null && p.weight !== undefined ? String(p.weight) : "",
      unit: p.unit || "",
      tags: p.tags ? p.tags.join(", ") : "",
      images: p.images.map((i) => i.url),
      ingredients: p.ingredients || "",
      healthBenefits: p.healthBenefits || "",
      usageInstructions: p.usageInstructions || "",
      nutrientFacts: p.nutrientFacts ? JSON.stringify(p.nutrientFacts) : "",
      shelfLife: p.shelfLife || "",
      storageInstructions: p.storageInstructions || "",
    });
    setEditing(p);
    setModal("edit");
    setError("");
    parseNutrientFacts(p.nutrientFacts ? JSON.stringify(p.nutrientFacts) : "");
  };


  const removeImage = (url: string) =>
    setForm((f) => ({ ...f, images: f.images.filter((i) => i !== url) }));

  const handleSave = async () => {
    setError("");
    if (!form.name.trim()) { setError("Name is required"); return; }
    if (!form.price || isNaN(Number(form.price))) { setError("Valid price is required"); return; }
    if (!form.categoryId) { setError("Category is required"); return; }
    let parsedNutrientFacts = null;
    if (form.nutrientFacts.trim()) {
      try { parsedNutrientFacts = JSON.parse(form.nutrientFacts); }
      catch { setError("Nutrient Facts must be valid JSON"); return; }
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        salePrice: form.salePrice ? Number(form.salePrice) : null,
        weight: form.weight ? Number(form.weight) : null,
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

  const handleDelete = async (p: Product) => {
    if (!confirm(`Delete "${p.name}"?`)) return;
    try {
      await adminApi.delete(`/admin/products/${p.id}`);
      load();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const columns: Column<Product>[] = [
    {
      key: "image",
      label: "Image",
      render: (row) => {
        const img = row.images.find((i) => i.isPrimary) || row.images[0];
        return img ? (
          <img src={img.url} alt={row.name} className="w-10 h-10 rounded object-cover bg-gray-100" />
        ) : (
          <div className="w-10 h-10 rounded bg-gray-100" />
        );
      },
    },
    { key: "name", label: "Name" },
    { key: "category", label: "Category", render: (row) => row.category.name },
    { key: "price", label: "Price", render: (row) => `₹${row.price}` },
    { key: "stock", label: "Stock", render: (row) => (
      row.stock <= 0 
        ? <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">Out of Stock</span>
        : <span className={row.stock <= 10 ? "text-orange-600 font-semibold" : ""}>{row.stock}</span>
    )},
    { key: "isActive", label: "Status", render: (row) => (
      <div className="flex flex-wrap gap-1.5 max-w-[200px]">
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${row.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
          {row.isActive ? "Active" : "Inactive"}
        </span>
        {row.isFeatured && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
            Best Seller
          </span>
        )}
        {row.isPopularBatter && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800">
            Popular Batter
          </span>
        )}
        {row.isSpiceOil && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 text-purple-800">
            Spice & Oil
          </span>
        )}
      </div>
    )},
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
      <AdminHeader title="Products" />
      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search products…"
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus size={16} /> Add Product
          </button>
        </div>
        <p className="text-sm text-gray-500">{total} products</p>
        <DataTable columns={columns} data={products} loading={loading} page={page} pages={pages} total={total} onPageChange={setPage} />
      </main>

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">{modal === "add" ? "Add Product" : "Edit Product"}</h2>
            {error && <p className="text-sm text-red-600 bg-red-50 rounded px-3 py-2">{error}</p>}

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                <input type="number" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price (₹)</label>
                <input type="number" value={form.salePrice} onChange={(e) => setForm((f) => ({ ...f, salePrice: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input type="number" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: Number(e.target.value) }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                <input value={form.sku} onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit (e.g. kg, g)</label>
                <input value={form.unit} onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                <input type="number" value={form.weight} onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select value={form.categoryId} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300">
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
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

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images <span className="text-gray-400 font-normal">(max 2)</span>
                </label>
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
                              onClick={() => removeImage(url)}
                              className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs flex items-center justify-center shadow transition-colors"
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <label className={`flex flex-col items-center justify-center w-full aspect-square rounded-xl border-2 border-dashed cursor-pointer transition-colors ${uploading ? "opacity-50 cursor-not-allowed" : "border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/40"}`}>
                            <span className="text-2xl mb-1">📷</span>
                            <span className="text-xs font-medium text-gray-400">Upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploading}
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setUploading(true);
                                try {
                                  const fd = new FormData();
                                  fd.append("file", file);
                                  fd.append("folder", "products");
                                  const res = await (await import("@/lib/adminApi")).adminApi.upload<{ url: string }>("/upload", fd);
                                  setForm((f) => {
                                    const imgs = [...f.images];
                                    imgs[slot] = res.url;
                                    return { ...f, images: imgs.filter(Boolean) };
                                  });
                                } catch { setError("Image upload failed"); }
                                finally { setUploading(false); }
                              }}
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
              </div>
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
