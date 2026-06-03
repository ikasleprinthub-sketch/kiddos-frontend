"use client";

import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { adminApi } from "@/lib/adminApi";
import { Upload, Eye, CheckCircle, AlertCircle, Loader2, ChevronDown, ChevronUp } from "lucide-react";

interface ParsedRow {
  sno: string;
  category: string;
  code: string;
  name: string;
  weight: string;
  mrp: string;
  sellingPrice: string;
}

interface ImportResult {
  code: string;
  name: string;
  status: "ok" | "error";
  message?: string;
}

// ─── Parse tab-separated or comma-separated product data ──────────────────────
function parseRows(raw: string): { rows: ParsedRow[]; dupCodes: string[] } {
  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const rawRows: ParsedRow[] = [];
  for (const line of lines) {
    const cols = line.includes("\t") ? line.split("\t") : line.split(",");
    if (cols.length < 5) continue;
    const sno = cols[0]?.trim();
    if (!sno || isNaN(Number(sno))) continue;
    rawRows.push({
      sno: cols[0]?.trim() ?? "",
      category: cols[1]?.trim().toUpperCase() ?? "",
      code: cols[2]?.trim() ?? "",
      name: cols[3]?.trim() ?? "",
      weight: cols[4]?.trim() ?? "",
      mrp: cols[5]?.trim() ?? "",
      sellingPrice: cols[6]?.trim() ?? "",
    });
  }

  // Deduplicate codes — suffix -2, -3, … when the same code appears again
  const seen = new Map<string, number>();
  const dupOriginals = new Set<string>();
  const rows = rawRows.map((r) => {
    const orig = r.code;
    const count = (seen.get(orig) ?? 0) + 1;
    seen.set(orig, count);
    if (count > 1) {
      dupOriginals.add(orig);
      return { ...r, code: `${orig}-${count}` };
    }
    return r;
  });

  return { rows, dupCodes: [...dupOriginals] };
}

function uniqueCategories(rows: ParsedRow[]): string[] {
  return [...new Set(rows.map((r) => r.category).filter(Boolean))];
}

// ─── Component ─────────────────────────────────────────────────────────────────
export default function ImportPage() {
  const [raw, setRaw] = useState("");
  const [parsed, setParsed] = useState<ParsedRow[]>([]);
  const [step, setStep] = useState<"paste" | "preview" | "importing" | "done">("paste");
  const [results, setResults] = useState<ImportResult[]>([]);
  const [defaultMrp, setDefaultMrp] = useState("");
  const [defaultSelling, setDefaultSelling] = useState("");
  const [priceMap, setPriceMap] = useState<Record<string, { mrp: string; selling: string }>>({});
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({});
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [dupCodes, setDupCodes] = useState<string[]>([]);
  const [error, setError] = useState("");

  // ── Step 1: Parse pasted text ────────────────────────────────────────────────
  const handleParse = () => {
    setError("");
    const { rows, dupCodes: dups } = parseRows(raw);
    if (rows.length === 0) {
      setError("No valid rows found. Paste the data copied directly from Excel/Sheets (tab-separated).");
      return;
    }
    const map: Record<string, { mrp: string; selling: string }> = {};
    rows.forEach((r) => {
      map[r.code] = { mrp: r.mrp || "", selling: r.sellingPrice || "" };
    });
    setPriceMap(map);
    setParsed(rows);
    setDupCodes(dups);
    setStep("preview");
  };

  // ── Price helpers ────────────────────────────────────────────────────────────
  const applyDefaultPrices = () => {
    setPriceMap((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((code) => {
        if (!next[code].mrp) next[code] = { ...next[code], mrp: defaultMrp };
        if (!next[code].selling) next[code] = { ...next[code], selling: defaultSelling };
      });
      return next;
    });
  };

  const updatePrice = (code: string, field: "mrp" | "selling", value: string) => {
    setPriceMap((prev) => ({ ...prev, [code]: { ...prev[code], [field]: value } }));
  };

  // ── Step 2: Import ───────────────────────────────────────────────────────────
  const handleImport = async () => {
    setStep("importing");
    setResults([]);
    const cats = uniqueCategories(parsed);

    // 1. Create / fetch categories
    const catIdMap: Record<string, string> = {};
    for (const cat of cats) {
      try {
        const res = await adminApi.post<{ category: { id: string } }>("/admin/categories", {
          name: cat,
          isActive: true,
          sortOrder: 0,
        });
        catIdMap[cat] = res.category.id;
      } catch {
        // Category may already exist — try fetching it
        try {
          const list = await adminApi.get<{ categories: Array<{ id: string; name: string }> }>(
            `/admin/categories?search=${encodeURIComponent(cat)}&limit=5`
          );
          const found = list.categories.find(
            (c) => c.name.toUpperCase() === cat.toUpperCase()
          );
          if (found) catIdMap[cat] = found.id;
        } catch {
          // will be caught per-product below
        }
      }
    }

    // 2. Create products
    setProgress({ done: 0, total: parsed.length });
    const res: ImportResult[] = [];

    for (let i = 0; i < parsed.length; i++) {
      const row = parsed[i];
      const prices = priceMap[row.code] ?? { mrp: "", selling: "" };
      const categoryId = catIdMap[row.category];

      try {
        if (!categoryId) throw new Error(`Category "${row.category}" not found`);
        if (!prices.selling) throw new Error("Selling price is required");

        const weightNum = parseFloat(row.weight.replace(/[^0-9.]/g, ""));
        const unit = row.weight.toLowerCase().includes("ml")
          ? "ml"
          : row.weight.toLowerCase().includes("l") && !row.weight.toLowerCase().includes("ml")
          ? "L"
          : "g";

        await adminApi.post("/admin/products", {
          name: `${row.name} (${row.weight}${unit === "g" ? "g" : ""})`.trim(),
          sku: row.code,
          categoryId,
          price: Number(prices.selling),
          salePrice: prices.mrp && Number(prices.mrp) > Number(prices.selling)
            ? Number(prices.mrp)
            : null,
          stock: 100,
          weight: isNaN(weightNum) ? null : weightNum,
          unit,
          isActive: true,
          isFeatured: false,
          images: [],
          tags: [row.category.toLowerCase(), row.name.toLowerCase()],
          description: `${row.name} — ${row.weight} | Category: ${row.category} | SKU: ${row.code}`,
        });

        res.push({ code: row.code, name: row.name, status: "ok" });
      } catch (e) {
        res.push({
          code: row.code,
          name: row.name,
          status: "error",
          message: e instanceof Error ? e.message : "Unknown error",
        });
      }

      setProgress({ done: i + 1, total: parsed.length });
      setResults([...res]);
    }

    setStep("done");
  };

  const toggleCat = (cat: string) =>
    setExpandedCats((p) => ({ ...p, [cat]: !p[cat] }));

  // ── Grouped preview ──────────────────────────────────────────────────────────
  const grouped = parsed.reduce<Record<string, ParsedRow[]>>((acc, r) => {
    (acc[r.category] = acc[r.category] || []).push(r);
    return acc;
  }, {});

  const successCount = results.filter((r) => r.status === "ok").length;
  const errorCount = results.filter((r) => r.status === "error").length;

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <AdminHeader title="Bulk Product Import" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* ── Step indicator ── */}
        <div className="flex items-center gap-2 text-sm">
          {["Paste Data", "Set Prices", "Import"].map((label, idx) => {
            const stepIdx = step === "paste" ? 0 : step === "preview" ? 1 : 2;
            const done = idx < stepIdx;
            const active = idx === stepIdx;
            return (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                  done ? "bg-emerald-600 border-emerald-600 text-white"
                  : active ? "border-emerald-600 text-emerald-700"
                  : "border-gray-200 text-gray-400"
                }`}>
                  {done ? "✓" : idx + 1}
                </div>
                <span className={active ? "font-semibold text-gray-800" : "text-gray-400"}>{label}</span>
                {idx < 2 && <div className="w-8 h-px bg-gray-200" />}
              </div>
            );
          })}
        </div>

        {/* ── STEP 1: Paste ── */}
        {step === "paste" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <div>
              <h2 className="font-semibold text-gray-800 mb-1">Paste your product data</h2>
              <p className="text-sm text-gray-500">
                Copy the rows directly from Excel / Google Sheets and paste below.
                Columns expected: <code className="bg-gray-100 px-1 rounded text-xs">S.NO · CATEGORY · CODE · NAME · WEIGHT · MRP · SELLING PRICE</code>
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                <AlertCircle size={15} className="shrink-0" />
                {error}
              </div>
            )}

            <textarea
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              rows={16}
              placeholder={"1\tSPICE BLENDS\tIDP100\tIDLI PODI\t150\t\t\n2\tSPICE BLENDS\tPPD100\tPARUPPU PODI\t150\t\t\n..."}
              className="w-full px-4 py-3 text-sm font-mono border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-y"
            />

            <div className="flex items-center gap-3">
              <button
                onClick={handleParse}
                disabled={!raw.trim()}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                <Eye size={16} /> Preview Data
              </button>
              <p className="text-xs text-gray-400">Prices can be left blank — you can set them in the next step.</p>
            </div>
          </div>
        )}

        {/* ── STEP 2: Preview + set prices ── */}
        {step === "preview" && (
          <div className="space-y-4">
            {/* Summary bar */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-3 flex items-center gap-6 text-sm">
              <span className="font-semibold text-emerald-800">{parsed.length} products found</span>
              <span className="text-emerald-700">{uniqueCategories(parsed).length} categories</span>
              <button onClick={() => setStep("paste")} className="ml-auto text-xs text-gray-500 hover:underline">
                ← Back to paste
              </button>
            </div>

            {/* Duplicate code warning */}
            {dupCodes.length > 0 && (
              <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm">
                <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-800">
                    {dupCodes.length} duplicate SKU code{dupCodes.length > 1 ? "s" : ""} detected in your data
                  </p>
                  <p className="text-amber-700 mt-0.5">
                    The following codes appeared more than once — duplicates have been auto-suffixed (-2, -3 …) so every row gets a unique SKU:{" "}
                    <span className="font-mono">{dupCodes.join(", ")}</span>
                  </p>
                </div>
              </div>
            )}

            {/* Default price setter */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
              <h3 className="font-semibold text-gray-800 text-sm">Set default prices (applies to blank fields)</h3>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-gray-600 whitespace-nowrap">MRP (₹)</label>
                  <input
                    type="number"
                    value={defaultMrp}
                    onChange={(e) => setDefaultMrp(e.target.value)}
                    placeholder="e.g. 150"
                    className="w-28 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-gray-600 whitespace-nowrap">Selling (₹)</label>
                  <input
                    type="number"
                    value={defaultSelling}
                    onChange={(e) => setDefaultSelling(e.target.value)}
                    placeholder="e.g. 120"
                    className="w-28 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
                  />
                </div>
                <button
                  onClick={applyDefaultPrices}
                  className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  Apply to all blank
                </button>
              </div>
            </div>

            {/* Per-category expandable rows */}
            {Object.entries(grouped).map(([cat, rows]) => (
              <div key={cat} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleCat(cat)}
                  className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-800 text-sm">{cat}</span>
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                      {rows.length} products
                    </span>
                  </div>
                  {expandedCats[cat] ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </button>

                {expandedCats[cat] && (
                  <div className="border-t border-gray-100">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">SKU</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Weight</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">MRP (₹)</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Selling (₹)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {rows.map((row, ri) => (
                          <tr key={`${row.code}-${ri}`}>
                            <td className="px-4 py-2 font-mono text-xs text-emerald-700">{row.code}</td>
                            <td className="px-4 py-2 text-gray-800 font-medium">{row.name}</td>
                            <td className="px-4 py-2 text-gray-500">{row.weight}</td>
                            <td className="px-4 py-2">
                              <input
                                type="number"
                                value={priceMap[row.code]?.mrp ?? ""}
                                onChange={(e) => updatePrice(row.code, "mrp", e.target.value)}
                                placeholder="—"
                                className="w-20 px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-300"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="number"
                                value={priceMap[row.code]?.selling ?? ""}
                                onChange={(e) => updatePrice(row.code, "selling", e.target.value)}
                                placeholder="required"
                                className="w-24 px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-300"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}

            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={handleImport}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <Upload size={16} /> Import {parsed.length} Products
              </button>
              <p className="text-xs text-gray-400">
                Categories will be created automatically. Products without a selling price will be skipped.
              </p>
            </div>
          </div>
        )}

        {/* ── STEP 3: Importing (progress) ── */}
        {step === "importing" && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 space-y-5">
            <div className="flex items-center gap-3">
              <Loader2 size={20} className="text-emerald-600 animate-spin" />
              <h2 className="font-semibold text-gray-800">
                Importing… {progress.done} / {progress.total}
              </h2>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div
                className="bg-emerald-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%` }}
              />
            </div>
            <div className="max-h-56 overflow-y-auto space-y-1">
              {results.map((r, i) => (
                <div key={`${r.code}-${i}`} className="flex items-center gap-2 text-sm">
                  {r.status === "ok"
                    ? <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                    : <AlertCircle size={14} className="text-red-500 shrink-0" />
                  }
                  <span className="font-mono text-xs text-gray-500 w-24 shrink-0">{r.code}</span>
                  <span className="text-gray-700 truncate">{r.name}</span>
                  {r.message && <span className="text-red-500 text-xs shrink-0">— {r.message}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 4: Done ── */}
        {step === "done" && (
          <div className="space-y-4">
            <div className={`rounded-xl border p-6 flex items-start gap-4 ${errorCount === 0 ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}>
              {errorCount === 0
                ? <CheckCircle size={24} className="text-emerald-600 shrink-0 mt-0.5" />
                : <AlertCircle size={24} className="text-amber-600 shrink-0 mt-0.5" />
              }
              <div>
                <p className="font-semibold text-gray-800 text-base">
                  Import complete — {successCount} succeeded, {errorCount} failed
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {errorCount > 0
                    ? "Products with errors were skipped. Check the list below, fix the issues, and re-import only the failed rows."
                    : "All products are now live in the system. Go to Products to add images and set featured items."}
                </p>
                <div className="flex gap-3 mt-3">
                  <a href="/admin/products" className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700">
                    View Products
                  </a>
                  <button onClick={() => { setStep("paste"); setRaw(""); setParsed([]); setResults([]); }}
                    className="px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50">
                    Import More
                  </button>
                </div>
              </div>
            </div>

            {errorCount > 0 && (
              <div className="bg-white rounded-xl border border-gray-200">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-800 text-sm">Failed rows ({errorCount})</h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {results.filter((r) => r.status === "error").map((r, i) => (
                    <div key={`${r.code}-${i}`} className="flex items-center gap-3 px-5 py-3 text-sm">
                      <span className="font-mono text-xs text-gray-500 w-24 shrink-0">{r.code}</span>
                      <span className="text-gray-700 flex-1">{r.name}</span>
                      <span className="text-red-600 text-xs">{r.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {successCount > 0 && (
              <div className="bg-white rounded-xl border border-gray-200">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-800 text-sm">Imported successfully ({successCount})</h3>
                </div>
                <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
                  {results.filter((r) => r.status === "ok").map((r, i) => (
                    <div key={`${r.code}-${i}`} className="flex items-center gap-3 px-5 py-2.5 text-sm">
                      <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                      <span className="font-mono text-xs text-gray-500 w-24 shrink-0">{r.code}</span>
                      <span className="text-gray-700">{r.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
