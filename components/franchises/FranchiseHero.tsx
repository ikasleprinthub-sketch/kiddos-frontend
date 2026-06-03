import Image from "next/image";

const stats = [
  { value: "20+", label: "Products" },
  { value: "100+", label: "Partners" },
  { value: "35%+", label: "Avg. ROI" },
  { value: "5★", label: "Brand Trust" },
];

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-end">

          {/* Left — Text */}
          <div className="pb-16 space-y-7">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f97316]/15 border border-[#f97316]/30 text-[#f97316] text-xs font-bold tracking-wide">
              🌿 India&apos;s Growing Healthy Food Franchise
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
                className="px-8 py-3.5 bg-[#f05252] hover:bg-[#e53e3e] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all text-sm hover:-translate-y-0.5"
              >
                Apply Now →
              </a>
              <a
                href="#downloads"
                className="px-8 py-3.5 border border-white/30 hover:border-white/60 hover:bg-white/10 text-white font-bold rounded-xl transition-all text-sm"
              >
                Download Brochure
              </a>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-4 pt-4 border-t border-white/10">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-black text-white">{s.value}</p>
                  <p className="text-white/50 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Image, flush to bottom */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Floating badge */}
            <div className="absolute top-6 -left-4 z-10 bg-white rounded-2xl px-4 py-3 shadow-xl">
              <p className="text-[10px] text-gray-400 font-medium">Monthly Revenue</p>
              <p className="text-[#1e4620] font-black text-lg leading-none mt-0.5">₹1.5 L+</p>
              <p className="text-emerald-500 text-[10px] font-bold mt-1">↑ 32% avg growth</p>
            </div>

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
