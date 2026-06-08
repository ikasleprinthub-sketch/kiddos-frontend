import { Heart, TrendingUp, Truck } from "lucide-react";

const benefits = [
  {
    num: "01",
    icon: <Heart className="w-7 h-7 text-[#f97316]" />,
    title: "Trusted Brand",
    desc: "Built on clean-label principles, trusted by modern families seeking healthier traditional food choices without preservatives or artificial additives.",
  },
  {
    num: "02",
    icon: <TrendingUp className="w-7 h-7 text-[#f97316]" />,
    title: "High Profit Margin",
    desc: "A scalable model with strong product demand, recurring purchases, and healthy operational margins designed for long-term growth.",
  },
  {
    num: "03",
    icon: <Truck className="w-7 h-7 text-[#f97316]" />,
    title: "Centralized Supply Chain",
    desc: "Streamlined sourcing and standardized supply systems ensure consistent quality, reliable inventory, and efficiency across every outlet.",
  },
];

export default function FranchiseBenefits() {
  return (
    <section className="bg-[#f7f9f7] dark:bg-zinc-950 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
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

        {/* Three cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 ">
          {benefits.map((b) => (
            <div
              key={b.num}
              className="bg-white dark:bg-zinc-900 rounded-2xl p-7 shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col gap-4 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-[#f97316]/10 border border-[#f97316]/20 flex items-center justify-center group-hover:bg-[#f97316]/20 transition-colors shrink-0">
                {b.icon}
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
    </section>
  );
}
