"use client";

import Image from "next/image";
import { Playball } from "next/font/google";
import { Leaf, Globe, Sparkles, Heart, Users } from "lucide-react";

const playball = Playball({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function HealthyPosterity() {
  return (
    <section className="relative bg-[#f4f7f4] py-16 px-6 sm:px-10 lg:px-16 overflow-hidden">
      {/* Decorative leaf backgrounds */}
      <div className="absolute -top-12 -left-12 w-48 h-48 opacity-10 pointer-events-none select-none">
        <svg viewBox="0 0 100 100" fill="#2a7a2a">
          <path d="M10 90 C 10 90, 70 70, 90 10 C 50 30, 30 70, 10 90 Z" />
        </svg>
      </div>
      <div className="absolute -bottom-12 -right-12 w-48 h-48 opacity-10 pointer-events-none select-none">
        <svg viewBox="0 0 100 100" fill="#2a7a2a" className="rotate-180">
          <path d="M10 90 C 10 90, 70 70, 90 10 C 50 30, 30 70, 10 90 Z" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

          {/* ── Left Column: Image ── */}
          <div className="lg:col-span-5 relative w-full aspect-[4/5] sm:aspect-square lg:aspect-[4/5] xl:aspect-[3/4] rounded-3xl overflow-hidden shadow-lg border-4 border-white">
            <Image
              src="/images/about/healthy-posterity.png"
              alt="Healthy family eating Kiddos Foods millet products"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>

          {/* ── Right Column: Content ── */}
          <div className="lg:col-span-7 flex flex-col justify-center">

            {/* Heading */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-1 mb-2">
              <h2 className="text-[#1e4620] font-black text-3xl sm:text-4xl lg:text-5xl leading-tight uppercase tracking-tight flex flex-wrap items-baseline justify-center lg:justify-start gap-x-2.5">
                <span>Make</span>
                <span className="text-[#2a7a2a]">Healthy</span>
                <span className={`${playball.className} normal-case text-4xl sm:text-5xl lg:text-6xl text-[#4c9b4c] font-normal tracking-wide block relative mt-1 lg:mt-0`}>
                  Posterity
                  <span className="inline-block animate-pulse ml-1 text-2xl" aria-hidden="true">🍃</span>
                </span>
              </h2>
            </div>

            {/* Subheading with horizontal decorative lines */}
            <div className="flex items-center gap-4 my-3">
              <div className="h-[1.5px] bg-[#8a5d3b]/20 flex-grow"></div>
              <p className="text-[#8a5d3b] font-extrabold text-[11px] sm:text-xs tracking-widest uppercase text-center">
                Nurturing a Healthier Future Generation
              </p>
              <div className="h-[1.5px] bg-[#8a5d3b]/20 flex-grow"></div>
            </div>

            {/* Description */}
            <p className="text-zinc-600 text-sm sm:text-base leading-relaxed text-center lg:text-left mb-6 font-medium">
              At Kiddos Foods, we believe that good health begins with good food. Our mission is to create a healthier posterity by providing nutritious, natural, and traditional food products that support the well-being of families and future generations.
            </p>

            {/* Commitment Box */}
            <div className="relative border border-[#2a7a2a]/20 bg-white/70 dark:bg-zinc-900/40 backdrop-blur-sm rounded-2xl p-5 pt-8 mb-6 shadow-sm">
              {/* Badge */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1e4620] text-white px-5 py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest whitespace-nowrap shadow-sm">
                Our Commitment
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Item 1 */}
                <div className="flex items-start gap-3 group cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-[#2a7a2a]/10 group-hover:bg-[#2a7a2a] flex items-center justify-center shrink-0 transition-all duration-300 ease-out group-hover:scale-110 shadow-sm group-hover:shadow-md group-hover:shadow-[#2a7a2a]/20">
                    <Leaf className="w-4 h-4 text-[#2a7a2a] group-hover:text-white transition-all duration-300 ease-out group-hover:rotate-[15deg]" strokeWidth={2} />
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-zinc-700 group-hover:text-[#1e4620] leading-snug transition-colors duration-300">
                    Promote natural and nutritious foods
                  </p>
                </div>

                {/* Item 2 */}
                <div className="flex items-start gap-3 group cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-[#2a7a2a]/10 group-hover:bg-[#2a7a2a] flex items-center justify-center shrink-0 transition-all duration-300 ease-out group-hover:scale-110 shadow-sm group-hover:shadow-md group-hover:shadow-[#2a7a2a]/20">
                    <Globe className="w-4 h-4 text-[#2a7a2a] group-hover:text-white transition-all duration-300 ease-out group-hover:rotate-[180deg]" strokeWidth={2} />
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-zinc-700 group-hover:text-[#1e4620] leading-snug transition-colors duration-300">
                    Encourage sustainable and responsible food practices
                  </p>
                </div>

                {/* Item 3 */}
                <div className="flex items-start gap-3 group cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-[#2a7a2a]/10 group-hover:bg-[#2a7a2a] flex items-center justify-center shrink-0 transition-all duration-300 ease-out group-hover:scale-110 shadow-sm group-hover:shadow-md group-hover:shadow-[#2a7a2a]/20">
                    <Sparkles className="w-4 h-4 text-[#2a7a2a] group-hover:text-white transition-all duration-300 ease-out group-hover:scale-125 group-hover:rotate-12" strokeWidth={2} />
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-zinc-700 group-hover:text-[#1e4620] leading-snug transition-colors duration-300">
                    Preserve traditional food heritage
                  </p>
                </div>

                {/* Item 4 */}
                <div className="flex items-start gap-3 group cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-[#2a7a2a]/10 group-hover:bg-[#2a7a2a] flex items-center justify-center shrink-0 transition-all duration-300 ease-out group-hover:scale-110 shadow-sm group-hover:shadow-md group-hover:shadow-[#2a7a2a]/20">
                    <Users className="w-4 h-4 text-[#2a7a2a] group-hover:text-white transition-all duration-300 ease-out group-hover:-translate-y-0.5" strokeWidth={2} />
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-zinc-700 group-hover:text-[#1e4620] leading-snug transition-colors duration-300">
                    Build a stronger and healthier future generation
                  </p>
                </div>

                {/* Item 5 */}
                <div className="flex items-start gap-3 sm:col-span-2 group cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-[#2a7a2a]/10 group-hover:bg-[#2a7a2a] flex items-center justify-center shrink-0 transition-all duration-300 ease-out group-hover:scale-110 shadow-sm group-hover:shadow-md group-hover:shadow-[#2a7a2a]/20">
                    <Heart className="w-4 h-4 text-[#2a7a2a] group-hover:text-white transition-all duration-300 ease-out group-hover:scale-110" strokeWidth={2} />
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-zinc-700 group-hover:text-[#1e4620] leading-snug transition-colors duration-300">
                    Support healthy lifestyles for all ages
                  </p>
                </div>
              </div>
            </div>

            {/* Vision Section */}
            <div className="flex flex-col items-center text-center mt-2">
              <div className="flex items-center gap-3 text-[#8a5d3b] text-xs font-black tracking-widest uppercase mb-1.5 select-none">
                <span className="opacity-60">➤ ➤</span>
                <span>Our Vision</span>
                <span className="opacity-60">⮘ ⮘</span>
              </div>
              <blockquote className="text-[#1e4620] font-bold italic text-sm sm:text-base max-w-xl leading-relaxed">
                "To create a healthy posterity by making nutritious, traditional, and wholesome foods accessible to every family."
              </blockquote>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
