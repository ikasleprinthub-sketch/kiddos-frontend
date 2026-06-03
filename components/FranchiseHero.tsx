import Image from "next/image";

export default function FranchiseHero() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        
        {/* Left Column: Heading and Buttons */}
        <div className="space-y-8 max-w-xl">
          
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-5.5xl font-black tracking-tight text-[#1e4620] dark:text-zinc-150 leading-tight">
              Empower Your <br className="hidden md:inline" />
              Future With Kiddos <br className="hidden md:inline" />
              Foods
            </h1>
            
            <p className="text-zinc-550 dark:text-zinc-400 text-sm md:text-base leading-relaxed font-medium">
              Become part of one of India&apos;s fastest-growing healthy food networks where tradition, nutrition, and innovation come together in every meal.
            </p>
          </div>

          {/* Buttons Layout */}
          <div className="flex">
            <a
              href="#inquiry-form"
              className="w-full sm:w-auto text-center px-8 py-3.5 bg-[#ff5252] hover:bg-[#ff4444] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-sm shrink-0"
            >
              Apply Now
            </a>
          </div>

        </div>

        {/* Right Column: Framed Photo Mockup */}
        <div className="flex justify-center lg:justify-end">
          <div className="bg-white dark:bg-zinc-900 p-4 sm:p-5 pb-8 sm:pb-10 rounded-3xl shadow-[0_15px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_15px_30px_rgba(0,0,0,0.3)] border border-zinc-150/40 dark:border-zinc-800/40 max-w-[500px] w-full transform hover:scale-1.02 transition-transform duration-300">
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
              <Image
                src="/images/franchisis/franchisis_hero.svg"
                alt="Kiddos Foods Storefront Franchise"
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-cover"
                priority
              />
            </div>
            <div className="mt-5 text-center">
              <p className="font-caveat text-xl sm:text-2xl text-brand-gold dark:text-brand-gold-light select-none">
                Kiddos Foods Model Outlet
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
