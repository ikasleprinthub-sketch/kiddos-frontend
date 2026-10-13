"use client";

import { useEffect, useState, useCallback } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminPagination from "@/components/admin/AdminPagination";
import { adminApi } from "@/lib/adminApi";
import { Search, Eye, X } from "lucide-react";

type InquiryStatus = "NEW" | "PENDING" | "CONTACTED";

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
  status?: InquiryStatus;
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
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

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

  // eslint-disable-next-line react-hooks/set-state-in-effect
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
    } catch {
      alert("Failed to delete inquiry");
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusChange = async (inquiry: Inquiry, status: InquiryStatus) => {
    setUpdatingStatusId(inquiry.id);
    try {
      await adminApi.put(`/admin/franchise-inquiries/${inquiry.id}`, { status });
      setInquiries((current) => current.map((item) => item.id === inquiry.id ? { ...item, status } : item));
      setSelected((current) => current?.id === inquiry.id ? { ...current, status } : current);
    } catch {
      alert("Failed to update inquiry status");
    } finally {
      setUpdatingStatusId(null);
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
    "1-3-months": "1â€“3 Months",
    "3-6-months": "3â€“6 Months",
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
              placeholder="Search by name, email, cityâ€¦"
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>
          <p className="text-sm text-gray-400">{total} inquiries</p>
        </div>

        {/* Card grid */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="h-5 w-2/3 animate-pulse rounded bg-gray-100" />
                <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                <div className="h-4 w-4/5 animate-pulse rounded bg-gray-100" />
              </div>
            ))
          ) : inquiries.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 bg-white px-4 py-12 text-center text-sm text-gray-400 md:col-span-2 xl:col-span-3">
              No franchise inquiries yet.
            </div>
          ) : (
            inquiries.map((inq) => (
              <article key={inq.id} className="flex min-w-0 flex-col rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
                <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-bold text-gray-800">{inq.name}</h3>
                    <p className="truncate text-xs text-gray-400">{inq.email}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                    {PACKAGE_LABEL[inq.package ?? ""] || inq.package || "—"}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Lead status</span>
                  <select
                    value={(inq.status ?? "NEW").toUpperCase()}
                    onChange={(event) => handleStatusChange(inq, event.target.value as InquiryStatus)}
                    disabled={updatingStatusId === inq.id}
                    aria-label={`Update status for ${inq.name}`}
                    className={`rounded-lg border px-2.5 py-1.5 text-xs font-bold outline-none transition focus:ring-2 focus:ring-emerald-200 disabled:opacity-60 ${(inq.status ?? "NEW") === "CONTACTED" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : (inq.status ?? "NEW") === "PENDING" ? "border-amber-200 bg-amber-50 text-amber-700" : "border-sky-200 bg-sky-50 text-sky-700"}`}
                  >
                    <option value="NEW">New</option>
                    <option value="PENDING">Pending</option>
                    <option value="CONTACTED">Contacted</option>
                  </select>
                </div>                <dl className="grid grid-cols-2 gap-x-4 gap-y-3 py-4 text-sm">
                  <div><dt className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Mobile</dt><dd className="mt-0.5 font-medium text-gray-700">{inq.mobile || "—"}</dd></div>
                  <div><dt className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Location</dt><dd className="mt-0.5 truncate font-medium text-gray-700">{[inq.city, inq.state].filter(Boolean).join(", ") || "—"}</dd></div>
                  <div><dt className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Ready to start</dt><dd className="mt-0.5 text-xs font-medium text-gray-700">{READY_LABEL[inq.readyToStart ?? ""] || inq.readyToStart || "—"}</dd></div>
                  <div><dt className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Submitted</dt><dd className="mt-0.5 text-xs font-medium text-gray-700">{new Date(inq.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</dd></div>
                </dl>
                <button onClick={() => setSelected(inq)} className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-50">
                  <Eye size={15} /> View details
                </button>
              </article>
            ))
          )}
        </div>
        {/* Pagination */}
        <div className="flex justify-center"><AdminPagination page={page} pages={pages} onPageChange={setPage} /></div>
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
                <label className="block rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500">Lead status</span>
                  <select
                    value={(selected.status ?? "NEW").toUpperCase()}
                    onChange={(event) => handleStatusChange(selected, event.target.value as InquiryStatus)}
                    disabled={updatingStatusId === selected.id}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:opacity-60"
                  >
                    <option value="NEW">New</option>
                    <option value="PENDING">Pending</option>
                    <option value="CONTACTED">Contacted</option>
                  </select>
                </label>
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
