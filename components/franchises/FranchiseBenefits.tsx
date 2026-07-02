"use client";

import { Heart, TrendingUp, Truck, Headset } from "lucide-react";

const benefits = [
  {
    num: "01",
    icon: <Heart className="w-7 h-7 text-[#f97316]" />,
    title: "Trusted Brand",
    desc: "Built on traditional recipes, premium-quality ingredients, and hygienic preparation, Kiddos Foods is trusted by families seeking healthier food choices.",
  },
  {
    num: "02",
    icon: <TrendingUp className="w-7 h-7 text-[#f97316]" />,
    title: "Profitable Business Model",
    desc: "Benefit from a scalable franchise model with high-demand products, repeat customers, and excellent long-term growth potential.",
  },
  {
    num: "03",
    icon: <Truck className="w-7 h-7 text-[#f97316]" />,
    title: "Centralized Supply Chain",
    desc: "Receive quality-assured products through our efficient procurement and distribution network, ensuring consistency across every outlet.",
  },
  {
    num: "04",
    icon: <Headset className="w-7 h-7 text-[#f97316]" />,
    title: "Complete Business Support",
    desc: "From outlet setup and staff training to marketing assistance and ongoing operational guidance, we support you at every stage of your business journey.",
  },
];

export default function FranchiseBenefits() {
  return (
    <section className="bg-[#f7f9f7] dark:bg-zinc-950 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-8">
          <p className="text-[#f97316] text-xs font-bold tracking-widest uppercase mb-3">
            Why Partner With Us
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white leading-tight">
            Why Choose Kiddos Foods?
          </h2>
          {/* <div className="w-12 h-1 bg-[#f97316] rounded-full mt-4 mx-auto" /> */}
        </div>

        {/* Four cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ">
          {benefits.map((b) => (
            <div
              key={b.num}
              className="bg-white dark:bg-zinc-900 rounded-2xl p-7 shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col gap-4 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-[#f97316]/10 border border-[#f97316]/20 flex items-center justify-center group-hover:bg-[#f97316]/30 group-hover:border-[#f97316] group-hover:shadow-lg group-hover:scale-110 transition-all duration-300 shrink-0">
                <div className="group-hover:scale-125 transition-transform duration-300">
                  {b.icon}
                </div>
              </div>

              {/* Number
              <span className="text-xs font-bold text-[#f97316]/60 tracking-widest">{b.num}</span> */}

              {/* Title */}
              <h3 className="text-base font-extrabold text-gray-800 dark:text-zinc-100 leading-snug">
                {b.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">
                {b.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Wave Separator flowing into white background section
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none pointer-events-none z-10">
        <svg className="relative block w-full h-[30px] text-white dark:text-zinc-900 fill-current" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,1,321.39,56.44Z"></path>
        </svg>
      </div> */}
    </section>
  );
}
