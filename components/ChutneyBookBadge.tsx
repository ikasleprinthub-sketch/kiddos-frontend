"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function ChutneyBookBadge() {
  return (
    <Link
      href="/category/chutney-book"
      className="group fixed bottom-4 left-4 z-50 inline-flex h-14 w-14 cursor-pointer select-none items-center justify-center sm:bottom-5 sm:left-5 sm:h-16 sm:w-16"
      title="View Chutney Book Recipes"
      aria-label="Chutney Book Recipes"
    >
      {/* Spinning circular text */}
      <svg
        viewBox="0 0 160 160"
        className="absolute inset-0 w-full h-full drop-shadow-lg"
        style={{ animation: "chutney-spin 10s linear infinite" }}
      >
        <defs>
          <path
            id="chutney-circle"
            d="M 80,80 m -62,0 a 62,62 0 1,1 124,0 a 62,62 0 1,1 -124,0"
          />
        </defs>
        <circle cx="80" cy="80" r="76" fill="white" className="dark:fill-zinc-900" />
        <text
          fill="#1e4620"
          fontSize="12"
          fontWeight="800"
          letterSpacing="2.8"
          fontFamily="sans-serif"
        >
          <textPath href="#chutney-circle">
            CHUTNEY BOOK • RECIPE •&nbsp;
          </textPath>
        </text>
      </svg>

      {/* Center circle */}
      <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-amber-600 shadow-md transition-transform duration-300 group-hover:scale-110 sm:h-9 sm:w-9">
        <BookOpen className="h-4 w-4 text-white" strokeWidth={2} />
      </div>

      <style jsx>{`
        @keyframes chutney-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </Link>
  );
}
