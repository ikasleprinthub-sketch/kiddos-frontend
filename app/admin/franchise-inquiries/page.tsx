"use client";

import { useEffect, useState, useCallback } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { adminApi } from "@/lib/adminApi";
import { Search, Eye, X, ChevronLeft, ChevronRight } from "lucide-react";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  mobile: string;
  alternate?: string;
  preferredLocation?: string;
  hearAboutUs?: string;
  country?: string;
  state?: string;
  city?: string;
  zipcode?: string;
  profession?: string;
  aboutBusiness?: string;
  package?: string;
  readyToStart?: string;
  message?: string;
  image?: string;
  createdAt: string;
}

export default function FranchiseInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.get<{ inquiries: Inquiry[]; total: number; pages: number }>(
        `/admin/franchise-inquiries?page=${page}&search=${encodeURIComponent(search)}`
      );
      setInquiries(data.inquiries ?? []);
      setTotal(data.total ?? 0);
      setPages(data.pages ?? 1);
    } catch {
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    if (!selected) return;
    const ok = confirm(`Are you sure you want to delete the franchise inquiry from ${selected.name}?`);
    if (!ok) return;

    setDeleting(true);
    try {
      await adminApi.delete(`/admin/franchise-inquiries/${selected.id}`);
      setSelected(null);
      load();
    } catch (err) {
      alert("Failed to delete inquiry");
    } finally {
      setDeleting(false);
    }
  };

  const downloadImage = async (url: string, filename: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, "_blank");
    }
  };

  const PACKAGE_LABEL: Record<string, string> = {
    kiosk: "Kiosk Model",
    express: "Express Outlet",
    full: "Full Store",
    master: "Master Franchise",
  };

  const READY_LABEL: Record<string, string> = {
    immediately: "Immediately",
    "1-3-months": "1–3 Months",
    "3-6-months": "3–6 Months",
    "6-plus-months": "6+ Months",
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <AdminHeader title="Franchise Inquiries" />
      <main className="flex-1 overflow-y-auto p-6 space-y-4">

        {/* Top bar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name, email, city…"
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>
          <p className="text-sm text-gray-400">{total} inquiries</p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Mobile</th>
                <th className="px-4 py-3">City / State</th>
                <th className="px-4 py-3">Package</th>
                <th className="px-4 py-3">Ready To Start</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-gray-100 rounded animate-pulse w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : inquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400 text-sm">
                    No franchise inquiries yet.
                  </td>
                </tr>
              ) : (
                inquiries.map((inq) => (
                  <tr key={inq.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800">{inq.name}</p>
                      <p className="text-xs text-gray-400">{inq.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{inq.mobile}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {[inq.city, inq.state].filter(Boolean).join(", ") || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                        {PACKAGE_LABEL[inq.package ?? ""] || inq.package || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {READY_LABEL[inq.readyToStart ?? ""] || inq.readyToStart || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(inq.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelected(inq)}
                        className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                        title="View details"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="p-1.5 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50">
              <ChevronLeft size={15} />
            </button>
            <span className="text-sm text-gray-500">Page {page} of {pages}</span>
            <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages}
              className="p-1.5 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50">
              <ChevronRight size={15} />
            </button>
          </div>
        )}
      </main>

      {/* Detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <div className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-800">Inquiry Details</h2>
              <button onClick={() => setSelected(null)} className="p-1.5 text-gray-400 hover:text-gray-700 rounded">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4 text-sm flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                {[
                  ["Name", selected.name],
                  ["Email", selected.email],
                  ["Mobile", selected.mobile],
                  ["Alternate", selected.alternate],
                  ["Preferred Location", selected.preferredLocation],
                  ["Heard About Us", selected.hearAboutUs],
                  ["Country", selected.country],
                  ["State", selected.state],
                  ["City", selected.city],
                  ["Zipcode", selected.zipcode],
                  ["Profession", selected.profession],
                  ["About Business", selected.aboutBusiness],
                  ["Package", PACKAGE_LABEL[selected.package ?? ""] || selected.package],
                  ["Ready To Start", READY_LABEL[selected.readyToStart ?? ""] || selected.readyToStart],
                  ["Message", selected.message],
                  ["Submitted", new Date(selected.createdAt).toLocaleString("en-IN")],
                ].map(([label, value]) =>
                  value ? (
                    <div key={label} className="grid grid-cols-[140px_1fr] gap-2">
                      <span className="font-semibold text-gray-500">{label}</span>
                      <span className="text-gray-800 break-words">{value}</span>
                    </div>
                  ) : null
                )}

                {selected.image && (
                  <div className="pt-4 border-t border-gray-150 space-y-2">
                    <p className="font-semibold text-gray-550">Storefront / Location Photo</p>
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selected.image}
                        alt="Storefront photo preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity duration-200">
                        <a
                          href={selected.image}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white hover:bg-gray-100 text-gray-800 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition"
                        >
                          View Full Size
                        </a>
                        <button
                          type="button"
                          onClick={() => downloadImage(selected.image!, `storefront_${selected.name.replace(/\s+/g, "_")}.jpg`)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4 mt-auto">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Delete Inquiry"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
