"use client";

import { startTransition, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { type ApiBanner } from "@/lib/api";

const BANNER_SIZES = "(min-width: 1400px) 1400px, 100vw";

/**
 * Home hero carousel.
 * `initialBanners` is fetched on the server so the first banner image is in the initial HTML (LCP);
 * `null` means the server couldn't reach the API, so we retry from the browser.
 */
export default function HeroSection({ initialBanners }: { initialBanners: ApiBanner[] | null }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [banners, setBanners] = useState<ApiBanner[] | null>(initialBanners);
  const [failedBannerImages, setFailedBannerImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (initialBanners !== null) return;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10000);

    fetch("/api/banners?position=HOME", { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error("API error");
        return r.json();
      })
      .then((data: ApiBanner[] | { banners: ApiBanner[] }) => {
        // Public route returns array directly; handle both shapes defensively
        const list: ApiBanner[] = Array.isArray(data) ? data : data.banners ?? [];
        startTransition(() => setBanners(list.filter((b) => b.isActive)));
      })
      .catch((err: unknown) => {
        if (!(err instanceof DOMException && err.name === "AbortError")) {
          console.error("Failed to load banners:", err);
        }
        startTransition(() => setBanners([]));
      })
      .finally(() => window.clearTimeout(timeout));

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [initialBanners]);

  const isLoading = banners === null;
  const slides = banners ?? [];
  const totalSlides = slides.length;

  useEffect(() => {
    if (isHovered || totalSlides <= 1) return;

    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    }, 6000);

    return () => window.clearInterval(timer);
  }, [isHovered, totalSlides]);

  const handlePrev = () => {
    if (totalSlides <= 1) return;
    setActiveSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNext = () => {
    if (totalSlides <= 1) return;
    setActiveSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  return (
    <section
      className="w-full bg-white dark:bg-zinc-950 py-4 sm:py-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-roledescription="carousel"
      aria-label="Kiddos Foods highlights"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="group/hero relative w-full h-[25svh] min-h-[160px] max-h-[220px] sm:h-[500px] sm:min-h-0 sm:max-h-none md:h-[600px] lg:h-[700px] rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-xs border border-zinc-100 dark:border-zinc-800">
          <div className="relative w-full h-full">
            {isLoading ? (
              // Browser retry in progress — neutral placeholder, never stand-in content
              <div className="absolute inset-0 animate-pulse bg-emerald-50 dark:bg-zinc-900" aria-hidden="true" />
            ) : totalSlides > 0 ? (
              slides.map((banner, idx) => (
                <div
                  key={banner.id}
                  aria-hidden={activeSlide !== idx}
                  className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out flex flex-col md:flex-row items-center justify-between px-6 sm:px-12 md:px-16 lg:px-24 py-6 sm:py-8 md:py-0 bg-[#e3f9ff] bg-dot-grid ${
                    activeSlide === idx ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                  }`}
                >
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    {banner.image ? (
                      <>
                        <Image
                          src={failedBannerImages.has(banner.id) ? "/images/hero_millet_bg.webp" : banner.image}
                          alt={banner.title || ""}
                          fill
                          sizes={BANNER_SIZES}
                          preload={idx === 0}
                          loading={idx === 0 ? "eager" : "lazy"}
                          className="object-cover"
                          onError={() => setFailedBannerImages((current) => new Set(current).add(banner.id))}
                        />
                        <div className="absolute inset-0 bg-black/15" />
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-[#e3f9ff] bg-dot-grid" />
                    )}
                  </div>
                  <div className="relative z-10 text-left w-full md:w-[50%] lg:w-[45%] flex flex-col items-start px-0 md:px-4 justify-center">
                    {banner.title && (
                      <h2 className="text-[#253d4e] text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-2 sm:mb-4">
                        {banner.title}
                      </h2>
                    )}
                    {banner.subtitle && !["nil", "null", "undefined"].includes(banner.subtitle.trim().toLowerCase()) && (
                      <p className="text-[#4b5563] text-xs sm:text-base md:text-lg mb-4 sm:mb-6 max-w-md leading-relaxed line-clamp-2 sm:line-clamp-none">
                        {banner.subtitle}
                      </p>
                    )}
                    {banner.link && (
                      <Link
                        href={banner.link}
                        tabIndex={activeSlide === idx ? undefined : -1}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3.5 bg-brand-green hover:bg-brand-green-light text-white font-bold text-xs sm:text-base rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-md cursor-pointer"
                      >
                        Shop Now
                        <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                </div>
              ))
            ) : (
              // No banners published yet — a single on-brand slide
              <div className="absolute inset-0 flex items-center px-6 sm:px-12 md:px-16 lg:px-24">
                <Image
                  src="/images/hero_millet_bg.webp"
                  alt=""
                  fill
                  sizes={BANNER_SIZES}
                  preload
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-white/0" />
                <div className="relative z-10 max-w-xl">
                  <h2 className="text-brand-green text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-2 sm:mb-4">
                    Make Healthy <span className="font-playfair italic font-normal text-brand-gold">Posterity</span>
                  </h2>
                  <p className="text-zinc-700 text-xs sm:text-base md:text-lg mb-4 sm:mb-6 max-w-md leading-relaxed line-clamp-2 sm:line-clamp-none">
                    Traditional batters, millet foods, cold-pressed oils and spices — made the natural way by Kiddos Foods.
                  </p>
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3.5 bg-brand-green hover:bg-brand-green-light text-white font-bold text-xs sm:text-base rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-md"
                  >
                    Shop Now
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {totalSlides > 1 && (
            <>
              {/* CAROUSEL NAVIGATION CONTROLS */}
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-40 p-2 rounded-full border border-zinc-200 bg-white/70 hover:bg-white text-zinc-700 hover:text-zinc-950 backdrop-blur-xs shadow-xs transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center opacity-0 group-hover/hero:opacity-100 focus-visible:opacity-100"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-40 p-2 rounded-full border border-zinc-200 bg-white/70 hover:bg-white text-zinc-700 hover:text-zinc-950 backdrop-blur-xs shadow-xs transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center opacity-0 group-hover/hero:opacity-100 focus-visible:opacity-100"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Slide indicators — the visible dot stays small, the tap target is 24px */}
              <div className="absolute bottom-3 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-40 flex">
                {slides.map((banner, idx) => (
                  <button
                    key={banner.id}
                    onClick={() => setActiveSlide(idx)}
                    className="flex h-6 min-w-6 items-center justify-center px-1 cursor-pointer"
                    aria-label={`Go to slide ${idx + 1}`}
                    aria-current={activeSlide === idx}
                  >
                    <span
                      className={`block h-2.5 rounded-full transition-all duration-300 ${
                        activeSlide === idx ? "w-6 bg-brand-green shadow-xs" : "w-2.5 bg-[#253d4e]/30 hover:bg-[#253d4e]/50"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
