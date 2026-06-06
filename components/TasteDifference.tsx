"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ApiCategory } from "@/lib/api";

const COLOR_CLASSES = [
  { bg: "#f2fcf4", text: "#3bb77e" }, // Light green
  { bg: "#fff3eb", text: "#f97316" }, // Light peach/orange
  { bg: "#f2f3fd", text: "#6366f1" }, // Light blue
  { bg: "#fcf2fa", text: "#ec4899" }, // Light pink
  { bg: "#fefce8", text: "#eab308" }, // Light yellow
  { bg: "#ecfeff", text: "#06b6d4" }, // Light cyan
  { bg: "#fff1f2", text: "#f43f5e" }, // Light rose
  { bg: "#faf5ff", text: "#a855f7" }, // Light purple
];

export default function TasteDifference() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(6);
  const [cardWidth, setCardWidth] = useState(175);
  const [gap, setGap] = useState(24);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Add cache: "no-store" and a timestamp query parameter to bypass all caches
    fetch(`/api/categories?limit=100&t=${Date.now()}`, { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error("HTTP error " + r.status);
        return r.json();
      })
      .then((data) => {
        const list: ApiCategory[] = Array.isArray(data) ? data : (data.categories ?? []);
        setCategories(list.filter((c) => c.isActive));
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setCategories([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setVisibleCount(2);
        setCardWidth(140);
        setGap(16);
      } else if (width < 768) {
        setVisibleCount(3);
        setCardWidth(175);
        setGap(24);
      } else if (width < 1024) {
        setVisibleCount(4);
        setCardWidth(175);
        setGap(24);
      } else if (width < 1280) {
        setVisibleCount(5);
        setCardWidth(175);
        setGap(24);
      } else {
        setVisibleCount(6);
        setCardWidth(175);
        setGap(24);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, categories.length - visibleCount);

  const handlePrev = () => {
    if (maxIndex <= 0) return;
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    if (maxIndex <= 0) return;
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  // Auto-scroll effect: moves right to left one by one
  useEffect(() => {
    if (isHovered || maxIndex <= 0) return;
    const interval = setInterval(() => {
      handleNext();
    }, 3500);
    return () => clearInterval(interval);
  }, [isHovered, maxIndex, categories]); // Add categories dependency

  // Adjust current index if screen size changes and maxIndex becomes smaller than currentIndex
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  if (loading) {
    return (
      <section className="bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1680px] mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="h-8 w-48 bg-zinc-100 rounded-md animate-pulse" />
            <div className="flex gap-2">
              <div className="w-9 h-9 rounded-full bg-zinc-100 animate-pulse" />
              <div className="w-9 h-9 rounded-full bg-zinc-100 animate-pulse" />
            </div>
          </div>
          <div className="flex gap-4 sm:gap-6 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="w-[140px] sm:w-[175px] h-[180px] sm:h-[220px] bg-zinc-50 border border-zinc-100 rounded-2xl animate-pulse shrink-0"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section 
      className="bg-white py-12 px-4 sm:px-6 lg:px-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-[1680px] mx-auto">
        {/* Heading Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-[#253d4e] font-extrabold text-2xl sm:text-3xl tracking-tight">
              Featured Categories
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1">
              Choose from our organic and freshly made items
            </p>
          </div>
          
          {/* Navigation Arrows */}
          {maxIndex > 0 && (
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                className="p-2.5 rounded-full border border-zinc-200 bg-white hover:bg-emerald-50 text-zinc-650 hover:text-emerald-700 transition-all duration-300 shadow-xs cursor-pointer hover:scale-105 active:scale-95"
                aria-label="Previous Category"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-2.5 rounded-full border border-zinc-200 bg-white hover:bg-emerald-50 text-zinc-650 hover:text-emerald-700 transition-all duration-300 shadow-xs cursor-pointer hover:scale-105 active:scale-95"
                aria-label="Next Category"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Carousel Container */}
        <div className="w-full overflow-hidden py-2">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              gap: `${gap}px`,
              transform: `translateX(-${currentIndex * (cardWidth + gap)}px)`,
            }}
          >
            {categories.map((cat, idx) => {
              const colorClass = COLOR_CLASSES[idx % COLOR_CLASSES.length];
              const productCount = cat._count?.products ?? 0;

              return (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="group flex flex-col items-center bg-white border border-zinc-100/80 rounded-[20px] p-5 shadow-[0_5px_15px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1.5 shrink-0 text-center select-none cursor-pointer"
                  style={{ width: `${cardWidth}px` }}
                >
                  {/* Rounded background blob for image using style tags for dynamic colors */}
                  <div
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-105 overflow-hidden"
                    style={{ backgroundColor: colorClass.bg }}
                  >
                    {cat.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-[85%] h-[85%] object-contain transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <span 
                        className="text-2xl font-bold"
                        style={{ color: colorClass.text }}
                      >
                        {cat.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  
                  {/* Category Name */}
                  <h3 className="font-bold text-[#253d4e] text-sm sm:text-base leading-tight mb-1 group-hover:text-emerald-600 transition-colors duration-200">
                    {cat.name}
                  </h3>
                  
                  {/* Product Count */}
                  <span className="text-xs text-[#7e7e7e]">
                    {productCount} {productCount === 1 ? "product" : "products"}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Carousel Slide Indicators (Dots) */}
        {maxIndex > 0 && (
          <div className="flex justify-center gap-1.5 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === idx ? "w-6 bg-emerald-600" : "w-2 bg-zinc-200 hover:bg-zinc-350"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
