"use client";

import Image from "next/image";
import { Rocket } from "lucide-react";



export default function FranchiseHero() {
  return (
    <section className="relative bg-[#1e4620] overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }}
      />
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#f97316]/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-white/5 blur-2xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-0 lg:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:items-stretch">

          {/* Left — Text */}
          <div className="pb-16 lg:pb-0 flex flex-col justify-center space-y-7">
            {/* Badge */}
            <span className="w-fit inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f97316]/15 border border-[#f97316]/30 text-[#f97316] text-xs font-bold tracking-wide">
              <Rocket className="w-4 h-4" /> India&apos;s Growing Healthy Food Franchise
            </span>

            <h1 className="text-4xl md:text-5xl xl:text-6xl font-black text-white leading-[1.08] tracking-tight">
              Empower Your<br />
              Future With<br />
              <span className="text-[#f97316]">Kiddos Foods</span>
            </h1>

            <p className="text-white/60 text-base leading-relaxed max-w-md">
              Become part of one of India&apos;s fastest-growing healthy food
              networks — where tradition, nutrition, and innovation come
              together in every meal.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <a
                href="#inquiry-form"
                className="px-8 py-3.5 bg-[#f88636] hover:bg-[#e77525] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all text-sm hover:-translate-y-0.5"
              >
                Apply Now →
              </a>
            </div>

          
          </div>

          {/* Right — Image, flush to bottom */}
          <div className="relative flex justify-center lg:justify-end self-end mt-auto">
           
         <div className="relative w-full max-w-[480px] rounded-t-3xl overflow-hidden shadow-2xl border border-white/10">
              <Image
                src="/images/franchisis/franchisis_hero.svg"
                alt="Kiddos Foods Franchise Outlet"
                width={480}
                height={420}
                className="w-full h-auto object-cover"
                priority
              />
              {/* Gradient fade at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#1e4620] to-transparent" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
