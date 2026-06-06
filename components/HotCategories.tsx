"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ApiCategory } from "@/lib/api";

const COLOR_CLASSES = [
  { bg: "#fef3c7", text: "#d97706" },
  { bg: "#f0fdf4", text: "#16a34a" },
  { bg: "#fef2f2", text: "#dc2626" },
  { bg: "#f5f3ff", text: "#7c3aed" },
  { bg: "#f0fdfa", text: "#0d9488" },
  { bg: "#fefce8", text: "#ca8a04" },
  { bg: "#eff6ff", text: "#2563eb" },
  { bg: "#fdf2f8", text: "#be185d" },
  { bg: "#f7fee7", text: "#65a30d" },
  { bg: "#fff7ed", text: "#ea580c" },
];

export default function HotCategories() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(6);
  const [cardWidth, setCardWidth] = useState(130);
  const [gap, setGap] = useState(24);
  const isHovered = useRef(false);

  useEffect(() => {
    fetch(`/api/categories?limit=100&t=${Date.now()}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        const list: ApiCategory[] = Array.isArray(data) ? data : (data.categories ?? []);
        setCategories(list.filter((c) => c.isActive));
      })
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setVisibleCount(3);
        setCardWidth(110);
        setGap(16);
      } else if (w < 768) {
        setVisibleCount(4);
        setCardWidth(120);
        setGap(20);
      } else if (w < 1024) {
        setVisibleCount(5);
        setCardWidth(130);
        setGap(24);
      } else if (w < 1280) {
        setVisibleCount(6);
        setCardWidth(130);
        setGap(24);
      } else {
        setVisibleCount(7);
        setCardWidth(130);
        setGap(24);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, categories.length - visibleCount);

  useEffect(() => {
    if (currentIndex > maxIndex) setCurrentIndex(maxIndex);
  }, [maxIndex, currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  // Auto-scroll every 3 seconds, pauses on hover
  useEffect(() => {
    if (maxIndex <= 0) return;
    const id = setInterval(() => {
      if (!isHovered.current) {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
      }
    }, 3000);
    return () => clearInterval(id);
  }, [maxIndex]);

  if (loading) {
    return (
      <section className="bg-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center mb-8">
            <div className="h-8 w-40 bg-zinc-100 rounded animate-pulse mb-2" />
            <div className="h-3 w-16 bg-zinc-100 rounded-full animate-pulse" />
          </div>
          <div className="flex gap-6 justify-center">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className="w-28 h-28 rounded-full bg-zinc-100 animate-pulse" />
                <div className="h-4 w-20 bg-zinc-100 rounded animate-pulse" />
                <div className="h-3 w-14 bg-zinc-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section
      className="bg-white py-10 px-4 sm:px-6 lg:px-8"
      onMouseEnter={() => { isHovered.current = true; }}
      onMouseLeave={() => { isHovered.current = false; }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-[#1a2e1a] font-black text-2xl sm:text-3xl tracking-tight">
            Hot categories
          </h2>
          <svg viewBox="0 0 80 14" className="mt-1.5 w-16 h-3" fill="none">
            <path
              d="M4 10 Q20 2 40 7 Q60 12 76 4"
              stroke="#2a7a2a"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Carousel wrapper */}
        <div className="relative">
          {/* Prev button */}
          {maxIndex > 0 && (
            <button
              onClick={handlePrev}
              className="absolute -left-4 sm:-left-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full border border-zinc-200 bg-white shadow-sm flex items-center justify-center text-zinc-500 hover:text-emerald-700 hover:border-emerald-200 hover:bg-emerald-50 transition-all duration-200 active:scale-95"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Sliding track */}
          <div className="overflow-hidden py-2">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                gap: `${gap}px`,
                transform: `translateX(-${currentIndex * (cardWidth + gap)}px)`,
              }}
            >
              {categories.map((cat, idx) => {
                const color = COLOR_CLASSES[idx % COLOR_CLASSES.length];
                const count = cat._count?.products ?? 0;

                return (
                  <Link
                    key={cat.id}
                    href={`/products?category=${cat.slug}`}
                    className="flex flex-col items-center shrink-0 group text-center"
                    style={{ width: `${cardWidth}px` }}
                  >
                    <div
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center overflow-hidden border border-zinc-100/60 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300"
                      style={{ backgroundColor: color.bg }}
                    >
                      {cat.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-[80%] h-[80%] object-contain"
                        />
                      ) : (
                        <span
                          className="text-3xl font-black select-none"
                          style={{ color: color.text }}
                        >
                          {cat.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <p className="mt-3 text-[13px] font-bold text-zinc-800 leading-snug line-clamp-2 group-hover:text-[#2a7a2a] transition-colors px-1">
                      {cat.name}
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      {count} {count === 1 ? "product" : "products"}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Next button */}
          {maxIndex > 0 && (
            <button
              onClick={handleNext}
              className="absolute -right-4 sm:-right-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full border border-zinc-200 bg-white shadow-sm flex items-center justify-center text-zinc-500 hover:text-emerald-700 hover:border-emerald-200 hover:bg-emerald-50 transition-all duration-200 active:scale-95"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dot indicators */}
        {maxIndex > 0 && (
          <div className="flex justify-center gap-1.5 mt-6">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === idx
                    ? "w-6 bg-emerald-600"
                    : "w-2 bg-zinc-200 hover:bg-zinc-300"
                }`}
                aria-label={`Go to ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
