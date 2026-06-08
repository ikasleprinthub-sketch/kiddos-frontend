"use client";

import { FlaskConical, ShieldCheck, BadgeDollarSign, Leaf } from "lucide-react";

const FEATURES = [
  {
    icon: FlaskConical,
    title: "Chemical Free",
    sub: "100% Organic",
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
            className="group flex flex-col items-center text-center gap-3 px-4 py-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-lg hover:border-brand-green/30 dark:hover:border-brand-gold/30 hover:-translate-y-1 transition-all duration-200 cursor-default"
          >
            <div className="w-14 h-14 rounded-full bg-brand-green/10 dark:bg-brand-gold/10 group-hover:bg-brand-green/20 dark:group-hover:bg-brand-gold/20 flex items-center justify-center transition-colors duration-200">
              <Icon className="w-7 h-7 text-brand-green dark:text-brand-gold group-hover:scale-110 transition-transform duration-200" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100 group-hover:text-brand-green dark:group-hover:text-brand-gold transition-colors duration-200">{title}</p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
