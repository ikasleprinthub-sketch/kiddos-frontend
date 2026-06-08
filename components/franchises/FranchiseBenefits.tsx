"use client";

import Image from "next/image";
import { Heart, TrendingUp, Truck } from "lucide-react";

const benefits = [
  {
    num: "01",
    icon: <Heart className="w-5 h-5 text-[#f97316]" />,
    title: "Trusted Brand",
    desc: "Built on clean-label principles, trusted by modern families seeking healthier traditional food choices without preservatives or artificial additives.",
  },
  {
    num: "02",
    icon: <TrendingUp className="w-5 h-5 text-[#f97316]" />,
    title: "High Profit Margin",
    desc: "A scalable model with strong product demand, recurring purchases, and healthy operational margins designed for long-term growth.",
  },
  {
    num: "03",
    icon: <Truck className="w-5 h-5 text-[#f97316]" />,
    title: "Centralized Supply Chain",
    desc: "Streamlined sourcing and standardized supply systems ensure consistent quality, reliable inventory, and efficiency across every outlet.",
  },
];

export default function FranchiseBenefits() {
  return (
    <section className="relative bg-[#edf2ee] dark:bg-[#061410]/70 py-20 pb-24 lg:pb-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — Image */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-xl">
              <Image
                src="/images/franchisis/what.svg"
                alt="Why Choose Kiddos Foods"
                width={600}
                height={500}
                className="w-full h-auto object-cover"
              />
            </div>
          
          </div>

          {/* Right — Content */}
          <div className="space-y-10">
            <div>
              <p className="text-[#f97316] text-xs font-bold tracking-widest uppercase mb-3">
                Why Partner With Us
              </p>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white leading-tight">
                Why Choose<br />Kiddos Foods?
              </h2>
              <div className="w-12 h-1 bg-[#f97316] rounded-full mt-4" />
            </div>

            <div className="space-y-7">
              {benefits.map((b) => (
                <div key={b.num} className="flex gap-5 group">
                  {/* Number + icon pill */}
                  <div className="shrink-0 flex flex-col items-center gap-1">
                    
                    <div className="w-11 h-11 rounded-2xl bg-[#f97316]/10 border border-[#f97316]/20 flex items-center justify-center group-hover:bg-[#f97316]/20 transition-colors">
                      {b.icon}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-base font-extrabold text-gray-800 dark:text-zinc-100">
                      {b.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">
                      {b.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Wave Separator flowing into white background section */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none pointer-events-none z-10">
        <svg className="relative block w-full h-[30px] text-white dark:text-zinc-900 fill-current" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,1,321.39,56.44Z"></path>
        </svg>
      </div>
    </section>
  );
}
