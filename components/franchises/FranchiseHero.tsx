"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Rocket } from "lucide-react";

const CarrotIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg
    viewBox="0 0 64 64"
    className={className}
    style={style}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M38 26c3-6 8-12 16-16-6 6-8 12-8 16M38 26c1-8-2-15-7-20 0 8 2 14 5 18M38 26c-6-5-14-9-20-10 8 4 12 10 16 12"
      stroke="#22c55e"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M42 22C46 26 34 44 14 58c-4-2 10-26 22-34 3-2 5-2 6-2z"
      fill="url(#carrotGrad)"
    />
    <path
      d="M34 31c-2 1-4 0-5 1M28 38c-3 1-4 0-6 2M21 46c-2 1-3 0-4 1"
      stroke="#ea580c"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <defs>
      <linearGradient id="carrotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff9f43" />
        <stop offset="100%" stopColor="#ee5253" />
      </linearGradient>
    </defs>
  </svg>
);

const TomatoIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg
    viewBox="0 0 64 64"
    className={className}
    style={style}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <ellipse cx="32" cy="36" rx="22" ry="20" fill="url(#tomatoGrad)" />
    <ellipse cx="24" cy="26" rx="6" ry="3" transform="rotate(-15 24 26)" fill="#ffffff" opacity="0.6" />
    <path
      d="M32 16v-6M32 16l6-4M32 16l-6-4M32 16l9 3M32 16l-9 3M32 16l2 6M32 16l-2 6"
      stroke="#22c55e"
      strokeWidth="3.5"
      strokeLinecap="round"
      fill="none"
    />
    <defs>
      <linearGradient id="tomatoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff5252" />
        <stop offset="100%" stopColor="#c23616" />
      </linearGradient>
    </defs>
  </svg>
);

const BeetrootIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg
    viewBox="0 0 64 64"
    className={className}
    style={style}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M32 24C28 16 26 8 28 2C30 8 32 16 32 24z" fill="#22c55e" stroke="#b33939" strokeWidth="1" />
    <path d="M30 24C22 18 16 14 12 12C18 16 24 20 30 24z" fill="#22c55e" stroke="#b33939" strokeWidth="1" />
    <path d="M34 24C42 18 48 14 52 12C46 16 40 20 34 24z" fill="#22c55e" stroke="#b33939" strokeWidth="1" />
    <path d="M32 22C44 22 46 36 32 54C18 36 20 22 32 22z" fill="url(#beetrootGrad)" />
    <path d="M32 54c-1 3-2 6-4 8" stroke="#8c1b3f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <defs>
      <linearGradient id="beetrootGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#b33939" />
        <stop offset="100%" stopColor="#5c1d30" />
      </linearGradient>
    </defs>
  </svg>
);

const PastaSpiralIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg
    viewBox="0 0 64 64"
    className={className}
    style={style}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22 15 C 22 10, 42 10, 42 15 C 42 20, 22 20, 22 25 C 22 30, 42 30, 42 35 C 42 40, 22 40, 22 45 C 22 50, 42 50, 42 55"
      stroke="url(#pastaGrad)"
      strokeWidth="7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 15 C 22 10, 42 10, 42 15 C 42 20, 22 20, 22 25 C 22 30, 42 30, 42 35 C 42 40, 22 40, 22 45 C 22 50, 42 50, 42 55"
      stroke="#fef3c7"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.6"
    />
    <defs>
      <linearGradient id="pastaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="50%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
    </defs>
  </svg>
);

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
    <section className="relative bg-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "radial-gradient(circle, #1e4620 1px, transparent 1px)", backgroundSize: "32px 32px" }}
      />
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#1e4620]/5 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#f97316]/5 blur-2xl" />

      {/* Floating vegetables */}
      <CarrotIcon      className="absolute top-6   left-[20%]  w-20 h-20 opacity-80 animate-sway-lr  pointer-events-none select-none" style={{animationDelay:"0s"}} />
      <TomatoIcon      className="absolute top-10  right-[20%] w-18 h-18 opacity-70 animate-sway-rl  pointer-events-none select-none" style={{animationDelay:"1s"}} />
      <BeetrootIcon    className="absolute bottom-8 left-[28%] w-20 h-20 opacity-75 animate-sway-lr  pointer-events-none select-none" style={{animationDelay:"0.5s"}} />
      <PastaSpiralIcon className="absolute bottom-10 right-[28%] w-18 h-18 opacity-65 animate-sway-rl  pointer-events-none select-none" style={{animationDelay:"1.8s"}} />
      <CarrotIcon      className="absolute top-1/2  left-[14%]  w-16 h-16 opacity-50 animate-sway-lr-fast pointer-events-none select-none" style={{animationDelay:"2.2s"}} />
      <TomatoIcon      className="absolute top-1/3  right-[14%] w-16 h-16 opacity-50 animate-sway-rl-fast pointer-events-none select-none" style={{animationDelay:"0.8s"}} />

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
              Become part of one of India&apos;s fastest-growing healthy food
              networks, where tradition, nutrition, and innovation come
              together in every meal.
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

            <div className="relative w-full max-w-[820px] lg:max-w-[950px] xl:max-w-[1050px] lg:w-[115%] xl:w-[125%] lg:-mr-16 xl:-mr-24 z-10 transition-all duration-300">
              <Image
                src="/images/franchisis/f_hero2.svg"
                alt="Kiddos Foods Franchise Outlet"
                width={820}
                height={960}
                className="w-full h-auto object-contain drop-shadow-xl"
                priority
              />
            </div>
          </div>

        </div>
      </div>

      
    </section>
  );
}
