import Link from "next/link";

export default function AboutSection() {
  return (
    <section className="bg-[#f5f5f0] py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── LEFT: Image grid ── */}
          <div className="relative flex items-center justify-center">

            {/* Top-left green corner bracket */}
            <div className="absolute top-0 left-0 z-10 pointer-events-none">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <path d="M4 60 L4 4 L60 4" stroke="#1e4620" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </div>

            {/* Bottom-right gold corner bracket */}
            <div className="absolute bottom-0 right-0 z-10 pointer-events-none">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <path d="M60 4 L60 60 L4 60" stroke="#b8860b" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </div>

            {/* Sparkle stars — bottom left */}
            <div className="absolute bottom-6 left-4 z-10 pointer-events-none flex flex-col gap-2">
              {[18, 12, 18].map((size, i) => (
                <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="#1e4620" className={i === 1 ? "ml-3" : ""}>
                  <path d="M12 2 L13.5 9 L20 12 L13.5 15 L12 22 L10.5 15 L4 12 L10.5 9 Z" />
                </svg>
              ))}
            </div>

            {/* 2×2 image grid */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-md mx-auto">
              {/* Top-left — taller */}
              <div className="rounded-[20px] overflow-hidden h-48 sm:h-56 bg-[#e8f5e9]">
                <img
                  src="/images/journey/journey1.svg"
                  alt="About Kiddos Foods"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Top-right — shorter */}
              <div className="rounded-[20px] overflow-hidden h-36 sm:h-44 self-start bg-[#f0fdf4]">
                <img
                  src="/images/journey/journey2.svg"
                  alt="Fresh ingredients"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Bottom-left — shorter */}
              <div className="rounded-[20px] overflow-hidden h-36 sm:h-44 self-end bg-[#fef9e7]">
                <img
                  src="/images/journey/journey3.svg"
                  alt="Organic produce"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Bottom-right — taller */}
              <div className="rounded-[20px] overflow-hidden h-48 sm:h-56 bg-[#e8f5e9]">
                <img
                  src="/images/journey/journey4.svg"
                  alt="Kiddos quality"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* SHOP NOW circular badge — center overlap */}
            <Link
              href="/products"
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
              style={{ pointerEvents: "none" }}
            >
              <div
                className="w-20 h-20 rounded-full bg-[#1e4620] flex items-center justify-center shadow-lg"
                style={{ pointerEvents: "all" }}
              >
                {/* Circular text */}
                <svg viewBox="0 0 80 80" className="absolute w-20 h-20 animate-spin" style={{ animationDuration: "12s" }}>
                  <defs>
                    <path id="circle-text" d="M 40,40 m -26,0 a 26,26 0 1,1 52,0 a 26,26 0 1,1 -52,0" />
                  </defs>
                  <text fontSize="8.2" fill="#d4af37" letterSpacing="2.2" fontWeight="600">
                    <textPath href="#circle-text">SHOP NOW · SHOP NOW · </textPath>
                  </text>
                </svg>
                {/* Arrow icon in center */}
                <div className="w-8 h-8 rounded-full bg-[#d4af37] flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1e4620" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>

          {/* ── RIGHT: Content ── */}
          <div className="flex flex-col gap-5">
            {/* Label */}
            <span className="text-sm font-semibold text-[#2a7a2a] tracking-widest uppercase">
              About Us
            </span>

            {/* Heading */}
            <div>
              <h2 className="text-[#1a2e1a] font-black text-3xl sm:text-4xl leading-tight">
                Your Journey to
              </h2>
              <h2 className="text-[#b8860b] font-black text-3xl sm:text-4xl leading-tight italic">
                Wholesome Goodness
              </h2>
            </div>

            {/* Description */}
            <p className="text-zinc-500 text-sm sm:text-base leading-relaxed max-w-md">
              At Kiddos Foods, we believe every meal is a chance to nourish your family with the
              finest organic ingredients. From farm to your table, we craft products that are
              pure, healthy, and full of love.
            </p>

            {/* Stats card */}
            <div className="bg-[#1e4620] rounded-2xl px-6 py-5 grid grid-cols-3 gap-4 text-center mt-1">
              <div>
                <p className="text-[#d4af37] font-black text-2xl sm:text-3xl leading-none">15+</p>
                <p className="text-white/70 text-xs sm:text-sm mt-1 font-medium">Categories</p>
              </div>
              <div className="border-x border-white/10">
                <p className="text-[#d4af37] font-black text-2xl sm:text-3xl leading-none">250+</p>
                <p className="text-white/70 text-xs sm:text-sm mt-1 font-medium">Products</p>
              </div>
              <div>
                <p className="text-[#d4af37] font-black text-2xl sm:text-3xl leading-none">99%</p>
                <p className="text-white/70 text-xs sm:text-sm mt-1 font-medium">Satisfied Customers</p>
              </div>
            </div>

            {/* Signature */}
            <p
              className="text-[#1e4620] text-2xl mt-2"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic" }}
            >
              Kiddos Foods
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
