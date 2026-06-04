import Image from "next/image";

export default function AboutIntro() {
  return (
    <section className="bg-gray-50 py-16 px-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

        {/* ── Left: image card collage ── */}
        <div className="w-full lg:w-[55%] flex gap-4 h-[600px]">

          {/* Sub-left column — left.svg poster */}
          <div className="relative w-[44%] rounded-2xl overflow-hidden shadow-sm">
            <Image
              src="/images/about/right.svg"
              alt="Kiddos Foods – Make Healthy Posterity"
              fill
              className="object-cover"
            />
          </div>

          {/* Sub-right column — right.svg poster (full height) */}
          <div className="relative w-[56%] rounded-2xl overflow-hidden shadow-sm">
            <Image
              src="/images/about/left.svg"
              alt="20 Varieties of Idli & Dosa Batter"
              fill
              className="object-cover"
            />
          </div>

        </div>

        {/* ── Right: text content ── */}
        <div className="w-full lg:w-[45%] max-w-lg">
          <p className="text-gray-400 text-sm mb-3 tracking-wide">
            About Us
          </p>

          <h2 className="text-gray-900 font-extrabold text-2xl lg:text-3xl leading-snug mb-5">
            At Kiddos Foods, Our Mantra Is Simple Make Healthy Posterity.
          </h2>

          <p className="text-gray-500 text-sm leading-relaxed mb-7">
            We believe that the actions we take today decide the health and
            well-being of the next generation. Every product we make is created
            with this responsibility in mind especially for the little ones who
            deserve pure, honest and safe food.
          </p>

          <h3 className="text-[#1e4620] font-bold text-base mb-3">
            Why Kiddos Foods?
          </h3>

          <p className="text-gray-500 text-sm leading-relaxed mb-4">
            Because we cook like home with love, honesty and tradition, not
            like a factory.
          </p>

          <p className="text-gray-500 text-sm leading-relaxed">
            All products are made the way a mother would make at home with
            care, patience, and zero shortcuts.
          </p>
        </div>

      </div>
    </section>
  );
}
