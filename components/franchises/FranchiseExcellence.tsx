import Image from "next/image";

export default function FranchiseExcellence() {
  return (
    <section className="bg-white dark:bg-zinc-900 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-center gap-4">
          <div>
            <p className="text-[#f97316] text-xs font-bold tracking-widest uppercase mb-3 text-center">
              Real Outlets  Real Growth
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white leading-tight">
              Experience The Excellence
            </h2>
            {/* <div className="w-12 h-1 bg-[#f97316] rounded-full mt-4" /> */}
          </div>
          {/* <a
            href="#inquiry-form"
            className="shrink-0 self-start sm:self-auto px-7 py-3 bg-[#1e4620] hover:bg-[#2c5e2f] text-white font-bold rounded-xl text-sm transition-all shadow hover:shadow-md"
          >
            Become A Partner →
          </a> */}
        </div>

        {/* Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative rounded-3xl overflow-hidden group shadow-lg">
            <Image
              src="/images/franchisis/experience1.svg"
              alt="Kiddos Foods Store Experience"
              width={640}
              height={480}
              className="w-full h-auto object-cover group-hover:scale-[1.03] transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5">
              <span className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold border border-white/30">
                Model Outlet, Coimbatore
              </span>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden group shadow-lg">
            <Image
              src="/images/franchisis/experience2.svg"
              alt="Kiddos Foods Production"
              width={640}
              height={480}
              className="w-full h-auto object-cover group-hover:scale-[1.03] transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5">
              <span className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold border border-white/30">
                Production &amp; Quality Control
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
