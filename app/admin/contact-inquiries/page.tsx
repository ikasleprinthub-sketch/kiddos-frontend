"use client";

import { useEffect, useState, useCallback } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { adminApi } from "@/lib/adminApi";
import { Search, Eye, X, ChevronLeft, ChevronRight } from "lucide-react";

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

  useEffect(() => { load(); }, [load]);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <AdminHeader title="Contact Inquiries" />
      <main className="flex-1 overflow-y-auto p-6 space-y-4">

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

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {Array.from({ length: 6 }).map((__, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-gray-100 rounded animate-pulse w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : inquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400 text-sm">
                    No contact messages yet.
                  </td>
                </tr>
              ) : (
                inquiries.map((inq) => (
                  <tr key={inq.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800">{inq.name}</p>
                      <p className="text-xs text-gray-400">{inq.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{inq.phone || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${SUBJECT_COLORS[inq.subject ?? ""] ?? "bg-zinc-100 text-zinc-600"}`}>
                        {inq.subject || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 max-w-[200px] truncate">
                      {inq.message}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                      {new Date(inq.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelected(inq)}
                        className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                        title="View message"
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
              <h2 className="text-base font-bold text-gray-800">Message Details</h2>
              <button onClick={() => setSelected(null)} className="p-1.5 text-gray-400 hover:text-gray-700 rounded">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4 text-sm flex-1">
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
          </div>
        </div>
      )}
    </div>
  );
}
