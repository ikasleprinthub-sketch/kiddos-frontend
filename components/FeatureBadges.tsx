"use client";

import { Truck, ShieldCheck, BadgeDollarSign, Leaf } from "lucide-react";

const FEATURES = [
  {
    icon: Truck,
    title: "Fast Delivery",
    sub: "Under 60 Minutes",
  },
  {
    icon: ShieldCheck,
    title: "Pure & Safe",
    sub: "Certified Organic",
  },
  {
    icon: BadgeDollarSign,
    title: "Best Prices",
    sub: "Value for Money",
  },
  {
    icon: Leaf,
    title: "Always Fresh",
    sub: "Made Daily",
  },
];

export default function FeatureBadges() {
  return (
    <section className="bg-[#f5f9f5] dark:bg-zinc-950 py-10 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
        {FEATURES.map(({ icon: Icon, title, sub }) => (
          <div
            key={title}
            className="flex flex-col items-center text-center gap-3 px-4 py-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-14 h-14 rounded-full bg-brand-green/10 dark:bg-brand-gold/10 flex items-center justify-center">
              <Icon className="w-7 h-7 text-brand-green dark:text-brand-gold" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">{title}</p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
