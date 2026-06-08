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

const FALLBACK_CATEGORIES: ApiCategory[] = [
  { id: "fb-1", name: "Ghee Laddu", slug: "ghee-laddu", isActive: true, sortOrder: 0, image: null },
  { id: "fb-2", name: "Noodles", slug: "noodles", isActive: true, sortOrder: 1, image: null },
  { id: "fb-3", name: "Oil", slug: "oil", isActive: true, sortOrder: 2, image: null },
  { id: "fb-4", name: "Pasta", slug: "pasta", isActive: true, sortOrder: 3, image: null },
  { id: "fb-5", name: "Pickles", slug: "pickles", isActive: true, sortOrder: 4, image: null },
  { id: "fb-6", name: "Spice Blends", slug: "spice-blends", isActive: true, sortOrder: 5, image: null },
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
      .then((r) => {
        if (!r.ok) throw new Error("API error");
        return r.json();
      })
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
        setVisibleCount(2);
        setCardWidth(155);
        setGap(12);
      } else if (w < 768) {
        setVisibleCount(3);
        setCardWidth(165);
        setGap(16);
      } else if (w < 1024) {
        setVisibleCount(4);
        setCardWidth(175);
        setGap(20);
      } else if (w < 1280) {
        setVisibleCount(5);
        setCardWidth(185);
        setGap(20);
      } else {
        setVisibleCount(6);
        setCardWidth(195);
        setGap(24);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const displayCategories = categories.length > 0 ? categories : FALLBACK_CATEGORIES;
  const maxIndex = Math.max(0, displayCategories.length - visibleCount);

  useEffect(() => {
    if (currentIndex > maxIndex) setCurrentIndex(maxIndex);
  }, [maxIndex, currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  // Auto-scroll every 3 seconds, pauses on hover (left-to-right)
  useEffect(() => {
    if (maxIndex <= 0) return;
    const id = setInterval(() => {
      if (!isHovered.current) {
        setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
      }
    }, 3000);
    return () => clearInterval(id);
  }, [maxIndex]);

  if (loading) {
    return (
      <section className="bg-zinc-50/30 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center mb-8">
            <div className="h-8 w-48 bg-zinc-100 rounded animate-pulse mb-2" />
          </div>
          <div className="flex gap-6 justify-center overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center shrink-0 bg-white border border-zinc-100 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)]"
                style={{ width: `${cardWidth}px` }}
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-zinc-100 animate-pulse mb-4" />
                <div className="h-5 w-20 bg-zinc-100 rounded animate-pulse mb-2" />
                <div className="h-4 w-14 bg-zinc-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (displayCategories.length === 0) return null;

  return (
    <section
      className="bg-zinc-50/30 dark:bg-zinc-950/10 py-12 px-4 sm:px-6 lg:px-8"
      onMouseEnter={() => { isHovered.current = true; }}
      onMouseLeave={() => { isHovered.current = false; }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="flex flex-col items-center mb-10">
          <h2 className="text-[#1a2e1a] dark:text-zinc-100 font-bold text-2xl sm:text-3xl tracking-tight">
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
        <div className="relative px-1">
          {/* Sliding track */}
          <div className="overflow-hidden py-4 px-2 -mx-2">
            <div
              className={`flex transition-transform duration-500 ease-in-out ${
                maxIndex === 0 ? "justify-center" : ""
              }`}
              style={{
                gap: `${gap}px`,
                transform: `translateX(-${currentIndex * (cardWidth + gap)}px)`,
              }}
            >
              {displayCategories.map((cat, idx) => {
                const color = COLOR_CLASSES[idx % COLOR_CLASSES.length];
                const count = cat._count?.products ?? 0;

                return (
                  <Link
                    key={cat.id}
                    href={`/products?category=${cat.slug}`}
                    className="flex flex-col items-center shrink-0 group text-center bg-white dark:bg-zinc-900 border border-zinc-100/80 dark:border-zinc-800/80 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.45)] hover:border-zinc-200/60 dark:hover:border-zinc-750 hover:-translate-y-1.5 transition-all duration-300"
                    style={{ width: `${cardWidth}px` }}
                  >
                    <div
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center overflow-hidden transition-transform duration-350 group-hover:scale-105 mb-4 shadow-sm"
                      style={{ backgroundColor: color.bg }}
                    >
                      {cat.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-[72%] h-[72%] object-contain"
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
                    <p className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 leading-snug line-clamp-2 group-hover:text-[#2a7a2a] transition-colors duration-200 px-1 min-h-[44px] flex items-center justify-center">
                      {cat.name}
                    </p>
                    {/* {count > 0 && (
                      <p className="text-xs text-zinc-450 dark:text-zinc-500 mt-2 font-medium">
                        {count} {count === 1 ? "product" : "products"}
                      </p>
                    )} */}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dot indicators */}
        {maxIndex > 0 && (
          <div className="flex justify-center gap-1.5 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx
                    ? "w-6 bg-[#2a7a2a]"
                    : "w-2.5 bg-zinc-200 hover:bg-zinc-300"
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
