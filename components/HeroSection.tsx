"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { api, type ApiBanner } from "@/lib/api";

const pastaPackages = [
  {
    name: "CARROT",
    subName: "WHEAT PASTA",
    color: "#ea580c", // orange-600
    borderColor: "border-orange-200",
    textColor: "text-orange-600",
    bgColor: "bg-orange-50/95",
    vegIcon: (
      <svg className="w-8 h-8 text-orange-600" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.78 4.22a3 3 0 0 0-4.24 0l-1.35 1.35c.78.29 1.48.77 2.02 1.37s1.08 1.24 1.37 2.02l1.35-1.35a3 3 0 0 0 0-4.24zM15.5 10.3l-8.6 8.6c-.4.4-.9.6-1.4.6H4v-1.5c0-.5.2-1 .6-1.4l8.6-8.6c.7 1 1.7 2 2.3 2.3z" />
        <path d="M12 2l1.5 2.5L12 7 9.5 4.5 12 2z" fill="#22c55e" />
      </svg>
    )
  },
  {
    name: "MULTIMILLET",
    subName: "PASTA",
    color: "#65a30d", // lime-600
    borderColor: "border-lime-200",
    textColor: "text-lime-700",
    bgColor: "bg-lime-50/95",
    vegIcon: (
      <svg className="w-8 h-8 text-lime-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 20V4M12 7l4-2M12 11l4-2M12 15l4-2M12 9l-4-2M12 13l-4-2M12 17l-4-2" strokeLinecap="round" />
      </svg>
    )
  },
  {
    name: "MORINGA",
    subName: "WHEAT PASTA",
    color: "#16a34a", // green-600
    borderColor: "border-green-200",
    textColor: "text-emerald-800",
    bgColor: "bg-emerald-50/95",
    vegIcon: (
      <svg className="w-8 h-8 text-emerald-700" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a10 10 0 0 0-1 4.5c0 3 2.5 5.5 5.5 5.5s5.5-2.5 5.5-5.5S19.5 2 16.5 2h-4.5zm-3 8a7 7 0 0 0-1 3.5c0 2.5 2 4.5 4.5 4.5s4.5-2 4.5-4.5S15 10 12.5 10H9zm-4 7a5 5 0 0 0-1 2.5C4 21 5.5 22 7 22s3-1 3-2.5S8.5 17 7 17H5z" />
      </svg>
    )
  },
  {
    name: "BEETROOT",
    subName: "WHEAT PASTA",
    color: "#be123c", // rose-700
    borderColor: "border-rose-250",
    textColor: "text-rose-700",
    bgColor: "bg-rose-50/95",
    vegIcon: (
      <svg className="w-8 h-8 text-rose-650" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="14" r="7" />
        <path d="M12 7c-2 0-4-2-4-5l4 2 4-2c0 3-2 5-4 5z" fill="#22c55e" />
      </svg>
    )
  },
  {
    name: "WHEAT",
    subName: "PASTA",
    color: "#ca8a04", // yellow-600
    borderColor: "border-amber-200",
    textColor: "text-amber-700",
    bgColor: "bg-amber-50/95",
    vegIcon: (
      <svg className="w-8 h-8 text-amber-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M8 22V10M16 22V10M12 22V2M7 6l5-2 5 2M6 10l6-3 6 3M6 14l6-3 6 3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    name: "TOMATO",
    subName: "WHEAT PASTA",
    color: "#e11d48", // rose-600
    borderColor: "border-rose-200",
    textColor: "text-rose-600",
    bgColor: "bg-rose-50/95",
    vegIcon: (
      <svg className="w-8 h-8 text-red-650" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="13" r="7" />
        <path d="M12 6c-1 0-2-2-1-4l1 1.5L13 2c1 2 0 4-1 4z" fill="#16a34a" />
      </svg>
    )
  }
];

const batterPackages = [
  {
    name: "CLASSIC IDLI DOSA",
    color: "#1e4620",
    textColor: "text-[#1e4620]",
    bgColor: "bg-emerald-50/90",
    grainIcon: (
      <svg className="w-10 h-10 text-emerald-800" viewBox="0 0 24 24" fill="currentColor">
        {/* Rice bowl or grain */}
        <path d="M2 12a10 10 0 0 0 20 0H2z" />
        <path d="M12 2c-.6 1.5-1.5 2.5-3 3.5 1.5.8 2.4 1.8 3 3.5.6-1.7 1.5-2.7 3-3.5-1.5-1-2.4-2-3-3.5z" fill="#f97316" />
      </svg>
    )
  },
  {
    name: "RAGI DOSA",
    color: "#7c2d12",
    textColor: "text-orange-950",
    bgColor: "bg-orange-50/90",
    grainIcon: (
      <svg className="w-10 h-10 text-orange-900" viewBox="0 0 24 24" fill="currentColor">
        {/* Millet spikes */}
        <path d="M12 3v18M12 5c-1 1-3 1.5-3 3s2 1.5 3 3M12 5c1 1 3 1.5 3 3s-2 1.5-3 3M12 11c-1 1-3 1.5-3 3s2 1.5 3 3M12 11c1 1 3 1.5 3 3s-2 1.5-3 3" />
      </svg>
    )
  },
  {
    name: "MULTI MILLET DOSA",
    color: "#3f6212",
    textColor: "text-lime-950",
    bgColor: "bg-lime-50/90",
    grainIcon: (
      <svg className="w-10 h-10 text-lime-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        {/* Multi grains */}
        <path d="M8 6c0 3 4 5 4 8s-4 5-4 8M16 6c0 3-4 5-4 8s4 5-4 8" strokeLinecap="round" />
      </svg>
    )
  },
  {
    name: "RED RICE IDLI DOSA",
    color: "#991b1b",
    textColor: "text-red-950",
    bgColor: "bg-red-50/90",
    grainIcon: (
      <svg className="w-10 h-10 text-red-800" viewBox="0 0 24 24" fill="currentColor">
        {/* Grain seed */}
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
      </svg>
    )
  }
];

function PastaPacket({ name, subName, color, borderColor, textColor, bgColor, vegIcon, className }: any) {
  return (
    <div className={`group relative flex flex-col items-center aspect-[1/2.05] transition-all duration-500 z-10 cursor-pointer ${className || "w-[14.5%] min-w-[52px] sm:min-w-[85px] max-w-[130px] hover:-translate-y-5 hover:scale-105"}`}>
      {/* 3D Drop Shadow on the Table */}
      <div className="absolute -bottom-1.5 left-2 right-2 h-2.5 bg-black/30 blur-md rounded-full scale-x-90 opacity-80 group-hover:scale-x-105 group-hover:opacity-50 transition-all duration-500" />
      
      {/* The Packet Body */}
      <div className={`relative flex flex-col w-full h-full bg-amber-50/90 rounded-t-md rounded-b-md border-x-2 border-y-[3px] border-amber-950/15 shadow-md overflow-hidden`}>
        
        {/* Heat Seal Crimping - Top */}
        <div className="h-2 w-full bg-amber-250/50 border-b border-amber-950/10 flex justify-between px-0.5 select-none opacity-80 shrink-0">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="w-[1.5px] h-full bg-amber-950/15" />
          ))}
        </div>
        
        {/* Pasta Texture Background inside the Bag */}
        <div className="flex-1 w-full relative flex flex-col justify-between p-1 bg-pasta-pattern overflow-hidden">
          {/* Glass glare overlay */}
          <div className="absolute inset-0 plastic-sheen pointer-events-none" />
          
          {/* Label Wrapper (opaque center section) */}
          <div className={`w-full ${bgColor} border ${borderColor} rounded-xl shadow-md p-1.5 flex flex-col items-center justify-between z-10 my-auto py-2.5 relative`}>
            {/* Vegetarian mark */}
            <div className="absolute top-1 right-1 veg-mark rounded-xs">
              <div className="veg-mark-dot" />
            </div>

            {/* Brand Logo */}
            <div className="flex flex-col items-center gap-0.5 mb-1 select-none">
              <div className="w-4 h-4 text-emerald-800 flex items-center justify-center font-bold">
                <svg className="w-3.5 h-3.5 fill-emerald-800" viewBox="0 0 24 24">
                  <path d="M17 8C8 8 4 14 4 20h2c0-3 3-5 7-5s7 2 7 5h2c0-6-4-12-10-12z" />
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#0f766e" />
                </svg>
              </div>
              <span className="text-[7.5px] font-black text-emerald-800 tracking-wider">Veir</span>
              <span className="text-[4.5px] text-zinc-500 uppercase tracking-widest leading-none">Organic Foods</span>
            </div>

            {/* Product Title */}
            <div className="text-center flex flex-col items-center gap-0.5 flex-1 justify-center my-0.5 select-none">
              <span className={`text-[8.5px] font-extrabold ${textColor} tracking-tight leading-none`}>
                {name}
              </span>
              <span className="text-[5.5px] font-extrabold text-zinc-650 tracking-wider leading-none">
                {subName}
              </span>
            </div>

            {/* Vegetable Icon/Graphic */}
            <div className="w-8 h-8 flex items-center justify-center my-0.5 select-none transform group-hover:scale-110 transition-transform duration-300">
              {vegIcon}
            </div>

            {/* Net Weight */}
            <div className="text-center mt-1 select-none leading-none">
              <p className="text-[4.5px] text-zinc-400 font-bold uppercase tracking-wider scale-90">Seasoning Masala Inside</p>
              <p className="text-[5.5px] text-zinc-650 font-black mt-0.5">Net Weight : 220 g</p>
            </div>
          </div>
        </div>

        {/* Heat Seal Crimping - Bottom */}
        <div className="h-2 w-full bg-amber-250/50 border-t border-amber-950/10 flex justify-between px-0.5 select-none opacity-80 shrink-0">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="w-[1.5px] h-full bg-amber-950/15" />
          ))}
        </div>
      </div>
    </div>
  );
}

function BatterPacket({ name, color, textColor, bgColor, grainIcon, className }: any) {
  return (
    <div className={`group relative flex flex-col items-center aspect-[1/1.3] transition-all duration-500 z-10 cursor-pointer ${className || "w-[20%] min-w-[68px] sm:min-w-[100px] max-w-[155px] hover:-translate-y-5 hover:scale-105"}`}>
      {/* 3D Drop Shadow on the Table */}
      <div className="absolute -bottom-1.5 left-2 right-2 h-2.5 bg-black/35 blur-md rounded-full scale-x-90 opacity-80 group-hover:scale-x-105 group-hover:opacity-50 transition-all duration-500" />
      
      {/* Pouch body */}
      <div className="relative flex flex-col w-full h-full bg-white rounded-t-3xl rounded-b-xl border border-zinc-200 shadow-md p-1.5 overflow-hidden">
        {/* Pouch Header/Carrying Handle cutout */}
        <div className="w-full flex flex-col items-center gap-0.5 mb-1.5 shrink-0">
          <div className="w-10 h-2.5 rounded-full border border-zinc-300 bg-zinc-50 flex items-center justify-center">
            <div className="w-6 h-0.5 bg-zinc-200 rounded-full" />
          </div>
          <div className="w-full h-[1px] bg-zinc-100" />
        </div>

        {/* Brand name */}
        <div className="flex items-center gap-1 justify-center mb-1 select-none">
          <span className="text-[8px] font-black text-brand-green tracking-wide">Kiddos Foods</span>
        </div>

        {/* Pouch label */}
        <div className={`flex-1 w-full ${bgColor} rounded-2xl border border-zinc-100 p-2 flex flex-col items-center justify-between text-center relative`}>
          <div className="veg-mark absolute top-1 right-1 rounded-xs scale-90">
            <div className="veg-mark-dot" />
          </div>

          <span className="text-[6.5px] font-bold text-zinc-400 uppercase tracking-widest select-none">Fresh Batter</span>
          
          <div className="my-0.5 select-none">
            <h4 className={`text-[10px] font-black ${textColor} leading-tight`}>{name}</h4>
            <p className="text-[5px] text-zinc-500 font-semibold mt-0.5">Idli & Dosa Batter</p>
          </div>

          <div className="w-10 h-10 flex items-center justify-center my-0.5 transform group-hover:rotate-12 transition-transform duration-300">
            {grainIcon}
          </div>

          <div className="w-full select-none">
            <div className="w-full h-[3px] bg-zinc-200 rounded-full overflow-hidden mb-0.5">
              <div className="h-full bg-brand-green" style={{ width: "100%" }} />
            </div>
            <p className="text-[6px] font-extrabold text-zinc-650">NET WT. 1 KG</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [banners, setBanners] = useState<ApiBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch("/api/banners?position=HOME")
      .then((r) => {
        if (!r.ok) throw new Error("API error");
        return r.json();
      })
      .then((data: ApiBanner[] | { banners: ApiBanner[] }) => {
        // Public route returns array directly; handle both shapes defensively
        const list: ApiBanner[] = Array.isArray(data)
          ? data
          : (data as { banners: ApiBanner[] }).banners ?? [];
        setBanners(list.filter((b) => b.isActive));
      })
      .catch((err) => console.error("Failed to load banners:", err))
      .finally(() => setLoading(false));
  }, []);

  const hasBanners = banners.length > 0;
  const totalSlides = hasBanners ? banners.length : 2;

  const startAutoplay = () => {
    stopAutoplay();
    if (totalSlides <= 1) return;
    timerRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    }, 6000);
  };

  const stopAutoplay = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    if (!isHovered) {
      startAutoplay();
    } else {
      stopAutoplay();
    }
    return () => stopAutoplay();
  }, [isHovered]);

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
    >
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="group/hero relative w-full h-[400px] sm:h-[460px] md:h-[500px] lg:h-[530px] rounded-[32px] overflow-hidden shadow-xs border border-zinc-100 dark:border-zinc-800">
          {/* SVG definitions for patterns */}
          <svg width="0" height="0" className="absolute pointer-events-none">
            <defs>
              <pattern id="pasta-pattern" width="16" height="16" patternUnits="userSpaceOnUse">
                <rect width="16" height="16" fill="#fef3c7" />
                <path d="M4,1 Q6,3 4,5 T4,9 T4,13" fill="none" stroke="#fbbf24" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M5,1 Q7,3 5,5 T5,9 T5,13" fill="none" stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M12,2 Q10,4 12,6 T12,10 T12,14" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
                <path d="M2,6 A3,3 0 0,1 6,8" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M10,4 A2,2 0 0,0 13,2" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
              </pattern>
            </defs>
          </svg>

          {/* CAROUSEL SLIDES WRAPPER */}
          <div className="relative w-full h-full">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
                <div className="w-10 h-10 border-4 border-zinc-300 dark:border-zinc-700 border-t-emerald-600 rounded-full animate-spin" />
              </div>
            ) : hasBanners ? (
              banners.map((banner, idx) => (
                <div
                  key={banner.id}
                  className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out flex flex-col md:flex-row items-center justify-between px-6 sm:px-12 md:px-16 lg:px-24 py-8 md:py-0 bg-[#e3f9ff] bg-dot-grid ${
                    activeSlide === idx ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                  }`}
                >
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    {banner.image ? (
                      <>
                        <Image
                          src={banner.image}
                          alt={banner.title || "Banner"}
                          fill
                          priority={idx === 0}
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/15" />
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-[#e3f9ff] bg-dot-grid" />
                    )}
                  </div>
                  <div className="relative z-10 text-left w-full md:w-[50%] lg:w-[45%] flex flex-col items-start px-4 md:px-8 justify-center">
                    {banner.title && (
                      <h1 className="text-[#253d4e] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-3 sm:mb-4">
                        {banner.title}
                      </h1>
                    )}
                    {banner.subtitle && (
                      <p className="text-[#7e7e7e] text-sm sm:text-base md:text-lg mb-8 max-w-md leading-relaxed">
                        {banner.subtitle}
                      </p>
                    )}
                    {banner.link && (
                      <Link
                        href={banner.link}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#3bb77e] hover:bg-[#2aa36c] text-white font-bold text-sm sm:text-base rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-md shadow-emerald-700/10 cursor-pointer"
                      >
                        Shop Now
                        <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                      </Link>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <>
                {/* SLIDE 1: MILLET PASTA (REDESIGNED) */}
                <div
                  className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out flex flex-col md:flex-row items-center justify-between px-6 sm:px-12 md:px-16 lg:px-20 py-8 md:py-0 bg-[#e3f9ff] bg-dot-grid ${
                    activeSlide === 0 ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                  }`}
                >
                  {/* Left Side: Content */}
                  <div className="w-full md:w-[50%] lg:w-[45%] flex flex-col justify-center text-left items-start z-10 relative">
                    <h1 className="text-[#253d4e] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-3 sm:mb-4">
                      Don&apos;t miss amazing<br />
                      <span className="font-playfair italic text-[#3bb77e] font-normal">grocery</span> deals
                    </h1>
                    <p className="text-[#7e7e7e] text-sm sm:text-base md:text-lg mb-8 max-w-md leading-relaxed">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, eiusmod tempor incididunt ut aliquip.
                    </p>
                    <Link
                      href="/category/millet-based"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#3bb77e] hover:bg-[#2aa36c] text-white font-bold text-sm sm:text-base rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-md shadow-emerald-700/10 cursor-pointer"
                    >
                      Shop Now
                      <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Link>
                  </div>

                  {/* Right Side: Visuals */}
                  <div className="w-full md:w-[50%] lg:w-[55%] h-full flex items-center justify-center relative mt-6 md:mt-0 z-10 select-none">
                    <div className="relative flex items-center justify-center w-[260px] sm:w-[300px] md:w-[360px] lg:w-[400px] aspect-[1.2/1]">
                      {/* Left Package */}
                      <PastaPacket
                        {...pastaPackages[1]}
                        className="w-[110px] sm:w-[130px] md:w-[150px] lg:w-[170px] rotate-[-12deg] -translate-x-[15%] translate-y-[5%] hover:rotate-[-6deg] hover:scale-105 transition-all duration-500 z-10"
                      />
                      {/* Right Package */}
                      <PastaPacket
                        {...pastaPackages[3]}
                        className="w-[110px] sm:w-[130px] md:w-[150px] lg:w-[170px] rotate-[12deg] translate-x-[15%] -translate-y-[5%] hover:rotate-[6deg] hover:scale-105 transition-all duration-500 z-20"
                      />
                    </div>
                  </div>

                  {/* Floating Ingredients */}
                  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="hidden lg:block absolute left-[38%] top-[15%] w-[8%] aspect-square pointer-events-auto cursor-pointer animate-float-slow group transition-all duration-300">
                      <Image
                        src="/images/carrot.png"
                        alt="Floating carrot"
                        width={60}
                        height={60}
                        className="object-contain transform -rotate-12 group-hover:scale-110 group-hover:rotate-6 transition-all duration-350"
                        style={{ mixBlendMode: "multiply" }}
                      />
                    </div>
                    <div className="absolute left-[40%] top-[68%] w-[4%] aspect-square pointer-events-auto cursor-pointer animate-drift-spin group">
                      <Image
                        src="/images/pasta_spiral.png"
                        alt="Floating fusilli pasta"
                        width={30}
                        height={30}
                        className="object-contain group-hover:scale-125 transition-transform duration-350"
                        style={{ mixBlendMode: "multiply" }}
                      />
                    </div>
                    <div className="absolute right-[5%] top-[15%] w-[4%] aspect-square pointer-events-auto cursor-pointer animate-drift-spin group">
                      <Image
                        src="/images/pasta_spiral.png"
                        alt="Floating fusilli pasta"
                        width={30}
                        height={30}
                        className="object-contain transform rotate-45 group-hover:scale-125 transition-transform duration-350"
                        style={{ mixBlendMode: "multiply" }}
                      />
                    </div>
                  </div>
                </div>

                {/* SLIDE 2: FRESH BATTER SLIDER (REDESIGNED) */}
                <div
                  className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out flex flex-col md:flex-row items-center justify-between px-6 sm:px-12 md:px-16 lg:px-20 py-8 md:py-0 bg-[#fffcf8] bg-dot-grid ${
                    activeSlide === 1 ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                  }`}
                >
                  {/* Left Side: Content */}
                  <div className="w-full md:w-[50%] lg:w-[45%] flex flex-col justify-center text-left items-start z-10 relative">
                    <h2 className="text-[#253d4e] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-3 sm:mb-4">
                      Fresh & traditional<br />
                      <span className="font-playfair italic text-[#f97316] font-normal">organic</span> batters
                    </h2>
                    <p className="text-[#7e7e7e] text-sm sm:text-base md:text-lg mb-8 max-w-md leading-relaxed">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, eiusmod tempor incididunt ut aliquip.
                    </p>
                    <Link
                      href="/category/batter"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#f97316] hover:bg-[#e05e00] text-white font-bold text-sm sm:text-base rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-md shadow-orange-700/10 cursor-pointer"
                    >
                      Shop Now
                      <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Link>
                  </div>

                  {/* Right Side: Visuals */}
                  <div className="w-full md:w-[50%] lg:w-[55%] h-full flex items-center justify-center relative mt-6 md:mt-0 z-10 select-none">
                    <div className="relative flex items-center justify-center w-[260px] sm:w-[300px] md:w-[360px] lg:w-[400px] aspect-[1.2/1]">
                      {/* Left Batter Pouch */}
                      <BatterPacket
                        {...batterPackages[0]}
                        className="w-[120px] sm:w-[140px] md:w-[160px] lg:w-[180px] rotate-[-10deg] -translate-x-[15%] translate-y-[5%] hover:rotate-[-5deg] hover:scale-105 transition-all duration-500 z-10"
                      />
                      {/* Right Batter Pouch */}
                      <BatterPacket
                        {...batterPackages[1]}
                        className="w-[120px] sm:w-[140px] md:w-[160px] lg:w-[180px] rotate-[10deg] translate-x-[15%] -translate-y-[5%] hover:rotate-[5deg] hover:scale-105 transition-all duration-500 z-20"
                      />
                    </div>
                  </div>

                  {/* Floating Ingredients for Batter Slide */}
                  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="hidden lg:block absolute left-[38%] top-[25%] w-[5%] aspect-square pointer-events-auto cursor-pointer animate-float-slow group">
                      <div className="w-9 h-9 rounded-full bg-white/85 backdrop-blur-xs flex items-center justify-center shadow-xs border border-amber-200 text-amber-700 font-bold text-xs group-hover:scale-110 transition-transform">
                        🌾
                      </div>
                    </div>
                    <div className="absolute right-[6%] top-[20%] w-[5%] aspect-square pointer-events-auto cursor-pointer animate-float-medium group">
                      <div className="w-9 h-9 rounded-full bg-white/85 backdrop-blur-xs flex items-center justify-center shadow-xs border border-emerald-250 text-emerald-700 font-bold text-xs group-hover:scale-110 transition-transform">
                        🍃
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* CAROUSEL NAVIGATION CONTROLS */}
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-40 p-2 rounded-full border border-zinc-200 bg-white/70 hover:bg-white text-zinc-700 hover:text-zinc-950 backdrop-blur-xs shadow-xs transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center opacity-0 group-hover/hero:opacity-100"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-40 p-2 rounded-full border border-zinc-200 bg-white/70 hover:bg-white text-zinc-700 hover:text-zinc-950 backdrop-blur-xs shadow-xs transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center opacity-0 group-hover/hero:opacity-100"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Carousel Slide Indicators (Dots) inside the banner */}
          {totalSlides > 1 && (
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-40 flex gap-2">
              {Array.from({ length: totalSlides }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activeSlide === idx ? "w-6 bg-[#3bb77e] shadow-xs" : "w-2.5 bg-[#253d4e]/15 hover:bg-[#253d4e]/30"
                  }`}
                  aria-label={`Slide ${idx + 1} Indicator`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
