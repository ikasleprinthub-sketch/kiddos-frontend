"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function AdminPagination({ page, pages, onPageChange, className = "" }: Props) {
  const safePages = Math.max(1, pages || 1);
  const safePage = Math.min(Math.max(1, page || 1), safePages);
  return (
    <nav aria-label="Pagination" className={`inline-flex items-center gap-2 ${className}`}>
      <button type="button" aria-label="Previous page" onClick={() => onPageChange(Math.max(1, safePage - 1))} disabled={safePage <= 1}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 transition hover:border-emerald-600 hover:text-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-300">
        <ChevronLeft size={16} />
      </button>
      <span aria-current="page" className="flex h-10 min-w-10 items-center justify-center rounded-lg border border-emerald-600 bg-white px-3 text-sm font-semibold text-emerald-700 shadow-sm">{safePage}</span>
      <button type="button" aria-label="Next page" onClick={() => onPageChange(Math.min(safePages, safePage + 1))} disabled={safePage >= safePages}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 transition hover:border-emerald-600 hover:text-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-300">
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
