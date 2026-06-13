import Image from "next/image";

const stats = [
  { value: "1+",   label: "Years of Trust" },
  { value: "200+",  label: "Products" },
  { value: "5K+", label: "Happy Customers" },
  { value: "100%", label: "Natural & Safe" },
];

export default function AboutIntro() {
  return (
    <section className="bg-white py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Top: content left + image right */}
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14 mb-10">

          {/* ── Left: text ── */}
          <div className="w-full lg:w-[50%]">
            <h1 className="text-[#1a2e1a] font-black text-3xl sm:text-4xl mb-2 tracking-tight">
              About Kiddos Foods
            </h1>

            <p className="text-zinc-500 text-sm font-medium mb-5">
              Tasty &bull; Healthy &bull; Homemade
            </p>

            <p className="text-zinc-500 text-sm leading-relaxed mb-4">
              Kiddos Foods was started with a simple mission to bring homemade taste
              and nutrition to every home. We prepare fresh batters, spice blends, oils,
              pickles and more using traditional recipes and premium quality ingredients.
            </p>

            <p className="text-zinc-500 text-sm leading-relaxed">
              Every product is made with love, care and hygiene, just like it is made
              in our own kitchen.
            </p>
          </div>

          {/* ── Right: image ── */}
          <div className="w-full lg:w-[50%] rounded-2xl overflow-hidden">
            <Image
              src="/images/about/abouthero.svg"
              alt="Kiddos Foods products"
              width={640}
              height={420}
              className="w-full h-auto object-cover rounded-2xl"
            />
          </div>

        </div>

        {/* Bottom: stats full width */}
        <div className="border-t border-gray-100 pt-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <span className="text-[#1e4620] font-black text-2xl sm:text-3xl leading-none">
                {stat.value}
              </span>
              <span className="text-zinc-400 text-xs mt-1.5">{stat.label}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
