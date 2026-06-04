"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function ChutneyBookBadge() {
  return (
    <Link
      href="/category/chutney-book"
      className="fixed bottom-6 left-6 z-50 inline-flex items-center justify-center w-20 h-20 group cursor-pointer select-none"
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
      <div className="relative z-10 w-11 h-11 rounded-full border-2 border-white shadow-md group-hover:scale-110 transition-transform duration-300 bg-amber-600 flex items-center justify-center">
        <BookOpen className="w-5 h-5 text-white" strokeWidth={2} />
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
