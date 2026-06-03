"use client";

import { useState, useEffect } from "react";
import type { ApiCategory } from "@/lib/api";

// Cycle through these gradients & emojis for dynamically-fetched categories
const GRADIENTS = [
  "from-amber-100 to-orange-200",
  "from-red-100 to-rose-200",
  "from-green-100 to-emerald-200",
  "from-yellow-100 to-lime-200",
  "from-teal-100 to-green-200",
  "from-orange-100 to-amber-200",
  "from-yellow-50 to-yellow-200",
  "from-sky-100 to-blue-200",
  "from-amber-50 to-yellow-200",
  "from-orange-100 to-yellow-300",
  "from-stone-100 to-amber-200",
  "from-purple-100 to-pink-200",
];


const ITEMS_PER_PAGE = 6;

export default function TasteDifference() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetch("/api/categories?limit=100")
      .then((r) => r.json())
      .then((data) => {
        // Support both { categories: [...] } and a plain array response
        const list: ApiCategory[] = Array.isArray(data) ? data : (data.categories ?? []);
        setCategories(list.filter((c) => c.isActive));
      })
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);
  const visible = categories.slice(page * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE + ITEMS_PER_PAGE);

  return (
    <section className="bg-white py-14 px-4">
      {/* Heading */}
      <h2 className="text-center text-zinc-800 font-bold text-sm sm:text-[15px] tracking-[0.1em] uppercase mb-10">
        Taste The Difference
      </h2>

      {/* Loading skeleton */}
      {loading && (
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-6 sm:gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-32 h-32 sm:w-[150px] sm:h-[150px] rounded-full bg-gray-100 animate-pulse" />
              <div className="h-3 w-16 rounded bg-gray-100 animate-pulse mt-4" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && categories.length === 0 && (
        <p className="text-center text-gray-400 text-sm">No categories available yet.</p>
      )}

      {/* Category circles */}
      {!loading && categories.length > 0 && (
        <>
          <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-6 sm:gap-8">
            {visible.map((cat, idx) => {
              const globalIdx = page * ITEMS_PER_PAGE + idx;
              const gradient = GRADIENTS[globalIdx % GRADIENTS.length];

              return (
                <a
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="flex flex-col items-center group w-[100px] sm:w-auto"
                >
                  {/* Circle */}
                  <div
                    className={`w-28 h-28 sm:w-[150px] sm:h-[150px] rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300 overflow-hidden`}
                  >
                    {cat.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl font-bold text-white/50">{cat.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  {/* Label */}
                  <span className="mt-4 text-xs sm:text-sm text-zinc-900 font-semibold text-center leading-tight group-hover:text-brand-green transition-colors">
                    {cat.name}
                  </span>
                </a>
              );
            })}
          </div>

          {/* Dot pagination (only if more than one page) */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-10">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  aria-label={`Page ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    i === page
                      ? "bg-[#333333] w-6 h-1.5"
                      : "bg-[#999999] w-1.5 h-1.5 hover:bg-[#666666]"
                  }`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
