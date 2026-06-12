"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ApiCategory } from "@/lib/api";

const COLOR_CLASSES = [
  { bg: "#fcd34d", text: "#ffffff" },  // amber
  { bg: "#86efac", text: "#ffffff" },  // green
  { bg: "#f87171", text: "#ffffff" },  // red
  { bg: "#c084fc", text: "#ffffff" },  // purple
  { bg: "#67e8f9", text: "#ffffff" },  // cyan
  { bg: "#fde047", text: "#ffffff" },  // yellow
  { bg: "#60a5fa", text: "#ffffff" },  // blue
  { bg: "#f472b6", text: "#ffffff" },  // pink
  { bg: "#bef264", text: "#ffffff" },  // lime
  { bg: "#fb923c", text: "#ffffff" },  // orange
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
  const [animated, setAnimated] = useState(true);
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

  // Advance forward; when at end, snap instantly to start (no animation)
  const goNext = () => {
    if (currentIndex >= maxIndex) {
      setAnimated(false);
      setCurrentIndex(0);
      setTimeout(() => setAnimated(true), 50);
    } else {
      setAnimated(true);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const goPrev = () => {
    setAnimated(true);
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  // Auto-scroll left → right only, snaps back to start at end
  useEffect(() => {
    if (maxIndex <= 0) return;
    const id = setInterval(() => {
      if (!isHovered.current) goNext();
    }, 3000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxIndex, currentIndex]);

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

          {/* Left arrow */}
          {maxIndex > 0 && (
            <button
              onClick={goPrev}
              className="absolute left-[-20px] sm:left-[-28px] top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-md flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:bg-[#1e4620] hover:text-white hover:border-[#1e4620] transition-all duration-200"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Right arrow */}
          {maxIndex > 0 && (
            <button
              onClick={goNext}
              className="absolute right-[-20px] sm:right-[-28px] top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-md flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:bg-[#1e4620] hover:text-white hover:border-[#1e4620] transition-all duration-200"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Sliding track */}
          <div className="overflow-hidden py-4 px-2 -mx-2">
            <div
              className={`flex ${animated ? "transition-transform duration-500 ease-in-out" : ""} ${
                maxIndex === 0 ? "justify-center" : ""
              }`}
              style={{
                gap: `${gap}px`,
                transform: `translateX(-${currentIndex * (cardWidth + gap)}px)`,
              }}
            >
              {displayCategories.map((cat, idx) => {
                const color = COLOR_CLASSES[idx % COLOR_CLASSES.length];

                return (
                  <Link
                    key={cat.id}
                    href={`/products?category=${cat.slug}`}
                    className="flex flex-col items-center shrink-0 group text-center bg-white dark:bg-zinc-900 border border-zinc-100/80 dark:border-zinc-800/80 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.45)] hover:border-zinc-200/60 dark:hover:border-zinc-750 hover:-translate-y-1.5 transition-all duration-300"
                    style={{ width: `${cardWidth}px` }}
                  >
                    <div
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center overflow-hidden transition-transform duration-350 group-hover:scale-105 mb-4 shadow-lg"
                      style={{ backgroundColor: color.bg }}
                    >
                      {cat.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-full h-full object-contain"
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
                onClick={() => { setAnimated(true); setCurrentIndex(idx); }}
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
