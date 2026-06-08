"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ApiBanner } from "@/lib/api";

// Fallback banners shown when no PROMO banners exist in the database
const FALLBACK_BANNERS: ApiBanner[] = [
  {
    id: "fallback-1",
    title: "Fresh Vegetable & Fruit Basket",
    subtitle: "Fresh Packed to order",
    image: "/images/promo_veg.jpg",
    link: "/products",
    isActive: true,
    sortOrder: 0,
  },
  {
    id: "fallback-2",
    title: "Best Organic Produce",
    subtitle: "Farm fresh, delivered daily",
    image: "/images/promo_organic.jpg",
    link: "/products",
    isActive: true,
    sortOrder: 1,
  },
];

// Palette for fallback cards when no image is available
const CARD_PALETTES = [
  {
    bg: "bg-[#f5a623]",
    text: "text-white",
    subtitleText: "text-white/80",
    btnBg: "bg-white/20 hover:bg-white/30 text-white",
  },
  {
    bg: "bg-[#2c2c2c]",
    text: "text-white",
    subtitleText: "text-white/70",
    btnBg: "bg-white/15 hover:bg-white/25 text-white",
  },
  {
    bg: "bg-emerald-700",
    text: "text-white",
    subtitleText: "text-emerald-100",
    btnBg: "bg-white/20 hover:bg-white/30 text-white",
  },
  {
    bg: "bg-rose-600",
    text: "text-white",
    subtitleText: "text-rose-100",
    btnBg: "bg-white/20 hover:bg-white/30 text-white",
  },
];

export default function PromoBanners() {
  const [banners, setBanners] = useState<ApiBanner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/banners?position=PROMO&limit=4")
      .then((r) => {
        if (!r.ok) throw new Error("API error");
        return r.json();
      })
      .then((data: ApiBanner[]) => {
        // The public route returns the array directly
        const list = Array.isArray(data) ? data : [];
        setBanners(list.filter((b) => b.isActive));
      })
      .catch(() => setBanners([]))
      .finally(() => setLoading(false));
  }, []);

  const display = loading ? [] : banners.length > 0 ? banners.slice(0, 4) : FALLBACK_BANNERS;
  const showFallbackStyle = !loading && banners.length === 0;

  if (loading) {
    return (
      <section className="bg-gray-50 pt-6 pb-0 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-36 rounded-2xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Grid layout: 2 banners = side by side, 3 = 2+1, 4 = 2x2
  const gridClass =
    display.length === 1
      ? "grid-cols-1"
      : display.length === 3
      ? "grid-cols-1 sm:grid-cols-3"
      : "grid-cols-1 sm:grid-cols-2";

  return (
    <section className="bg-gray-50 pt-6 pb-0 px-4">
      <div className="max-w-7xl mx-auto">
        <div className={`grid ${gridClass} gap-4`}>
          {display.map((banner, idx) => {
            const palette = CARD_PALETTES[idx % CARD_PALETTES.length];
            const hasImage = banner.image && !banner.image.startsWith("/images/promo_");

            return (
              <div
                key={banner.id}
                className="relative overflow-hidden rounded-2xl h-36 sm:h-40 group cursor-pointer"
              >
                {/* Background: image from DB or solid colour fallback */}
                {hasImage ? (
                  <>
                    <Image
                      src={banner.image}
                      alt={banner.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Gradient overlay so text is always readable */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/10" />
                  </>
                ) : showFallbackStyle ? (
                  // Coloured fallback background when no DB banners
                  <div className={`absolute inset-0 ${palette.bg}`} />
                ) : (
                  // DB banner but broken/missing image
                  <div className="absolute inset-0 bg-gray-800" />
                )}

                {/* Decorative circles (design detail like the screenshot) */}
                <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />
                <div className="absolute -right-2 -bottom-8 w-20 h-20 rounded-full bg-white/10 pointer-events-none" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-between p-5">
                  <div>
                    <h3
                      className={`font-bold text-base sm:text-lg leading-tight max-w-[70%] ${
                        hasImage ? "text-white drop-shadow" : palette.text
                      }`}
                    >
                      {banner.title}
                    </h3>
                    {banner.subtitle && (
                      <p
                        className={`text-xs mt-1 max-w-[70%] ${
                          hasImage ? "text-white/80" : palette.subtitleText
                        }`}
                      >
                        {banner.subtitle}
                      </p>
                    )}
                  </div>

                  {banner.link && (
                    <Link
                      href={banner.link}
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all w-fit ${
                        hasImage
                          ? "bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                          : palette.btnBg
                      }`}
                    >
                      Shop Now <ArrowRight size={12} />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
