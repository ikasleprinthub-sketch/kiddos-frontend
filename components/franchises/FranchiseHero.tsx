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

  const handleEnquireClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById("inquiry-form");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="relative bg-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "radial-gradient(circle, #1e4620 1px, transparent 1px)", backgroundSize: "32px 32px" }}
      />
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#1e4620]/5 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#f97316]/5 blur-2xl" />


      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-0 lg:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:items-center">

          {/* Left — Text */}
          <div className="pb-16 lg:pb-16 flex flex-col justify-center space-y-7">
            {/* Badge */}
            <span className="w-fit inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1e4620]/10 border border-[#1e4620]/20 text-[#1e4620] dark:bg-[#ca8a04]/10 dark:border-[#ca8a04]/20 dark:text-[#ca8a04] text-xs font-bold tracking-wide">
              <Rocket className="w-4 h-4" /> India&apos;s Growing Healthy Food Franchise
            </span>

            <h1 className="text-3xl md:text-[2rem] xl:text-[2.6rem] font-bold text-[#1e4620] leading-tight tracking-tight">
              Empower Your Future With<br />
              <span className="text-[#f97316]">Kiddos Foods</span>
            </h1>

            <p className="text-zinc-400 text-sm font-normal leading-relaxed max-w-md">
              Become part of one of India&apos;s fastest growing healthy food
              networks, where tradition, nutrition, and innovation come
              together in every meal.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="#inquiry-form"
                onClick={handleEnquireClick}
                className="px-8 py-3.5 bg-[#1e4620] hover:bg-[#134e15] dark:bg-[#ca8a04] dark:hover:bg-[#a16e03] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all text-sm hover:-translate-y-0.5"
              >
                Enquire Now
              </a>
            </div>
          </div>

          {/* Right — Image, flush to bottom */}
          <div className="relative flex justify-center lg:justify-end self-end mt-auto">

            <div className="relative w-full max-w-[820px] lg:max-w-[950px] xl:max-w-[1050px] lg:w-[115%] xl:w-[125%] lg:-mr-16 xl:-mr-24 z-10 transition-all duration-300">
              <Image
                src="/images/franchisis/f_hero2.svg"
                alt="Kiddos Foods Franchise Outlet"
                width={820}
                height={960}
                className="w-full h-auto object-contain drop-shadow-xl rounded-3xl"
                priority
              />
            </div>
          </div>

        </div>
      </div>

      
    </section>
  );
}
