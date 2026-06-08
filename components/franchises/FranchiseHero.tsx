"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Rocket } from "lucide-react";

export default function FranchiseHero() {
  const [heroData, setHeroData] = useState({
    title: "Franchise Opportunity",
    subtitle: "Be a part of Kiddos Foods family and grow with us",
    image: "/images/franchisis/franchisis_hero.svg"
  });

  useEffect(() => {
    fetch("/api/settings?group=franchise")
      .then(async (res) => {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return res.json();
        }
        const text = await res.text();
        throw new Error(`Non-JSON response received: ${text.slice(0, 100)}`);
      })
      .then((data) => {
        if (data && (data.franchise_hero_title || data.franchise_hero_subtitle || data.franchise_hero_image)) {
          setHeroData({
            title: data.franchise_hero_title || "Franchise Opportunity",
            subtitle: data.franchise_hero_subtitle || "Be a part of Kiddos Foods family and grow with us",
            image: data.franchise_hero_image || "/images/franchisis/franchisis_hero.svg"
          });
        }
      })
      .catch((err) => console.error("Failed to load franchise settings:", err));
  }, []);

  return (
    <section className="relative bg-[#faf8f5] dark:bg-[#081814] overflow-hidden pb-12 lg:pb-16">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: "radial-gradient(circle, #ca8a04 1px, transparent 1px)", backgroundSize: "32px 32px" }}
      />
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#ca8a04]/5 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#1e4620]/5 blur-2xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-0 lg:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:items-center">

          {/* Left — Text */}
          <div className="pb-16 lg:pb-16 flex flex-col justify-center space-y-7">
            {/* Badge */}
            <span className="w-fit inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1e4620]/10 border border-[#1e4620]/20 text-[#1e4620] dark:bg-[#ca8a04]/10 dark:border-[#ca8a04]/20 dark:text-[#ca8a04] text-xs font-bold tracking-wide">
              <Rocket className="w-4 h-4" /> India&apos;s Growing Healthy Food Franchise
            </span>

            <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold text-zinc-900 dark:text-zinc-100 leading-[1.08] tracking-tight">
              {heroData.title}
            </h1>

            <p className="text-zinc-550 dark:text-zinc-405 text-base sm:text-lg leading-relaxed max-w-md">
              {heroData.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="#inquiry-form"
                className="px-8 py-3.5 bg-[#1e4620] hover:bg-[#134e15] dark:bg-[#ca8a04] dark:hover:bg-[#a16e03] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all text-sm hover:-translate-y-0.5"
              >
                Enquire Now
              </a>
            </div>
          </div>

          {/* Right — Image, flush to bottom */}
          <div className="relative flex justify-center lg:justify-end self-end mt-auto">
            <div className="relative w-full max-w-[480px] rounded-t-3xl overflow-hidden shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900">
              <Image
                src={heroData.image}
                alt="Kiddos Foods Franchise Outlet"
                width={480}
                height={420}
                className="w-full h-auto object-cover"
                priority
              />
              {/* Gradient fade at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#faf8f5] dark:from-[#081814] to-transparent" />
            </div>
          </div>

        </div>
      </div>

      {/* Wave Separator */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none pointer-events-none z-10">
        <svg className="relative block w-full h-[30px] text-[#edf2ee] dark:text-[#061410] fill-current" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"></path>
        </svg>
      </div>
    </section>
  );
}
