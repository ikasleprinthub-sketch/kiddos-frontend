"use client";

import { useRouter } from "next/navigation";

export default function FranchiseCTA() {
  const router = useRouter();

  const handleEnquireClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById("inquiry-form");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      router.push("/franchises#inquiry-form");
    }
  };

  return (
    <section className="relative bg-[#1e4620] py-12 px-6 sm:px-12 lg:px-20 overflow-hidden">

      {/* Decorative leaves — bottom left (mirrored) */}
      <div className="absolute bottom-0 left-6 pointer-events-none select-none scale-x-[-1]" aria-hidden>
        <svg width="130" height="100" viewBox="0 0 130 100" fill="none">
          <path d="M110 95 C 110 95, 30 75, 10 10 C 50 35, 90 65, 110 95Z" fill="#2a6e2a" opacity="0.85" />
          <path d="M10 10 C 50 35, 90 65, 110 95" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
          <path d="M120 90 C 120 90, 65 65, 60 20 C 80 50, 105 70, 120 90Z" fill="#3a8a3a" opacity="0.7" />
          <path d="M60 20 C 80 50, 105 70, 120 90" stroke="#22c55e" strokeWidth="1.2" strokeLinecap="round" opacity="0.35" />
        </svg>
      </div>

      {/* Decorative leaves — bottom right */}
      <div className="absolute bottom-0 right-6 pointer-events-none select-none" aria-hidden>
        <svg width="130" height="100" viewBox="0 0 130 100" fill="none">
          <path d="M110 95 C 110 95, 30 75, 10 10 C 50 35, 90 65, 110 95Z" fill="#2a6e2a" opacity="0.85" />
          <path d="M10 10 C 50 35, 90 65, 110 95" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
          <path d="M120 90 C 120 90, 65 65, 60 20 C 80 50, 105 70, 120 90Z" fill="#3a8a3a" opacity="0.7" />
          <path d="M60 20 C 80 50, 105 70, 120 90" stroke="#22c55e" strokeWidth="1.2" strokeLinecap="round" opacity="0.35" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">

        {/* Text */}
        <div>
          <h2 className="text-white font-black text-2xl sm:text-3xl leading-snug mb-1">
            Ready to Start Your Own Business?
          </h2>
          <p className="text-white/60 text-sm font-normal">
            Fill out the form and our team will contact you.
          </p>
        </div>

        {/* Button */}
        <a
          href="#inquiry-form"
          onClick={handleEnquireClick}
          className="shrink-0 px-8 py-3.5 bg-[#f5c518] hover:bg-[#e6b800] text-[#1e4620] font-black text-sm rounded-xl shadow-md hover:-translate-y-0.5 transition-all duration-200 active:scale-95 whitespace-nowrap"
        >
          Enquire Now
        </a>

      </div>
    </section>
  );
}
