"use client";

import { useEffect, useState, useCallback } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminPagination from "@/components/admin/AdminPagination";
import { adminApi } from "@/lib/adminApi";
import { Search, Eye, X } from "lucide-react";

interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  createdAt: string;
}

const SUBJECT_COLORS: Record<string, string> = {
  "General Inquiry": "bg-blue-50 text-blue-700",
  "Franchise": "bg-emerald-50 text-emerald-700",
  "Order Issue": "bg-red-50 text-red-700",
  "Feedback": "bg-yellow-50 text-yellow-700",
  "Other": "bg-zinc-100 text-zinc-600",
};

export default function ContactInquiriesPage() {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ContactInquiry | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.get<{ inquiries: ContactInquiry[]; total: number; pages: number }>(
        `/admin/contact-inquiries?page=${page}&search=${encodeURIComponent(search)}`
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
    const ok = confirm(`Are you sure you want to delete the contact inquiry from ${selected.name}?`);
    if (!ok) return;

    setDeleting(true);
    try {
      await adminApi.delete(`/admin/contact-inquiries/${selected.id}`);
      setSelected(null);
      load();
    } catch {
      alert("Failed to delete inquiry");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <AdminHeader title="Contact Inquiries" />
      <main className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">

        {/* Top bar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name, email, subject…"
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>
          <p className="text-sm text-gray-400">{total} messages</p>
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
              No contact messages yet.
            </div>
          ) : (
            inquiries.map((inq) => (
              <article key={inq.id} className="flex min-w-0 flex-col rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
                <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-bold text-gray-800">{inq.name}</h3>
                    <p className="truncate text-xs text-gray-400">{inq.email}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${SUBJECT_COLORS[inq.subject ?? ""] ?? "bg-zinc-100 text-zinc-600"}`}>
                    {inq.subject || "—"}
                  </span>
                </div>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3 py-4 text-sm">
                  <div><dt className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Phone</dt><dd className="mt-0.5 font-medium text-gray-700">{inq.phone || "—"}</dd></div>
                  <div><dt className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Submitted</dt><dd className="mt-0.5 text-xs font-medium text-gray-700">{new Date(inq.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</dd></div>
                </dl>
                <div className="mb-4 rounded-xl bg-gray-50 p-3">
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Message</p>
                  <p className="line-clamp-2 text-xs leading-relaxed text-gray-600">{inq.message}</p>
                </div>
                <button onClick={() => setSelected(inq)} className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-50">
                  <Eye size={15} /> View message
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
              <h2 className="text-base font-bold text-gray-800">Message Details</h2>
              <button onClick={() => setSelected(null)} className="p-1.5 text-gray-400 hover:text-gray-700 rounded">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4 text-sm flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                {[
                  ["Name", selected.name],
                  ["Email", selected.email],
                  ["Phone", selected.phone],
                  ["Subject", selected.subject],
                  ["Submitted", new Date(selected.createdAt).toLocaleString("en-IN")],
                ].map(([label, value]) =>
                  value ? (
                    <div key={label} className="grid grid-cols-[120px_1fr] gap-2">
                      <span className="font-semibold text-gray-500">{label}</span>
                      <span className="text-gray-800 break-words">{value}</span>
                    </div>
                  ) : null
                )}
                <div className="pt-2 border-t border-gray-100">
                  <p className="font-semibold text-gray-500 mb-2">Message</p>
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>
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
