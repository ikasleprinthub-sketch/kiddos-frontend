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
    <section className="bg-[#f7f9f7] dark:bg-zinc-950 py-20">
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
            {/* Floating stat card */}
            <div className="absolute -bottom-6 -right-4 bg-[#1e4620] text-white rounded-2xl px-6 py-4 shadow-xl">
              <p className="text-3xl font-black">35%+</p>
              <p className="text-white/70 text-xs mt-0.5">Average Profit Margin</p>
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
                    <span className="text-[#1e4620]/20 dark:text-white/10 font-black text-xl leading-none">
                      {b.num}
                    </span>
                    <div className="w-11 h-11 rounded-2xl bg-[#f97316]/10 border border-[#f97316]/20 flex items-center justify-center group-hover:bg-[#f97316]/20 transition-colors">
                      {b.icon}
                    </div>
                  </div>
                  <div className="pt-6 space-y-1.5">
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
    </section>
  );
}
