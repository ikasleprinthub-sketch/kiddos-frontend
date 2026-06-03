"use client";

import { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
}

interface Props<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  page?: number;
  pages?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  emptyText?: string;
}

export default function DataTable<T extends { id: string }>({
  columns,
  data,
  loading,
  page = 1,
  pages = 1,
  total,
  onPageChange,
  emptyText = "No data found",
}: Props<T>) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-gray-400">
                  <div className="flex justify-center">
                    <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-gray-400">
                  {emptyText}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-gray-700">
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && onPageChange && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500">
            {total !== undefined ? `${total} total` : `Page ${page} of ${pages}`}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs text-gray-600 px-2">
              {page} / {pages}
            </span>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= pages}
              className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
