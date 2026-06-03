"use client";

import { useState } from "react";

const allCategories = [
  {
    label: "Batter",
    emoji: "🫙",
    gradient: "from-amber-100 to-orange-200",
    href: "/category/batter",
  },
  {
    label: "Spice Blends",
    emoji: "🌶️",
    gradient: "from-red-100 to-rose-200",
    href: "/category/spice-blends",
  },
  {
    label: "Raw Spices",
    emoji: "🌿",
    gradient: "from-green-100 to-emerald-200",
    href: "/category/raw-spices",
  },
  {
    label: "Oils",
    emoji: "🫒",
    gradient: "from-yellow-100 to-lime-200",
    href: "/category/oils",
  },
  {
    label: "Pickles",
    emoji: "🥒",
    gradient: "from-teal-100 to-green-200",
    href: "/category/pickles",
  },
  {
    label: "Chutney Book",
    emoji: "📖",
    gradient: "from-orange-100 to-amber-200",
    href: "/category/chutney-book",
  },
  {
    label: "Millets",
    emoji: "🌾",
    gradient: "from-yellow-50 to-yellow-200",
    href: "/category/millets",
  },
  {
    label: "Rice",
    emoji: "🍚",
    gradient: "from-sky-100 to-blue-200",
    href: "/category/rice",
  },
  {
    label: "Ghee",
    emoji: "🧈",
    gradient: "from-amber-50 to-yellow-200",
    href: "/category/ghee",
  },
  {
    label: "Honey",
    emoji: "🍯",
    gradient: "from-orange-100 to-yellow-300",
    href: "/category/honey",
  },
  {
    label: "Snacks",
    emoji: "🥜",
    gradient: "from-stone-100 to-amber-200",
    href: "/category/snacks",
  },
  {
    label: "Masala",
    emoji: "✨",
    gradient: "from-purple-100 to-pink-200",
    href: "/category/masala",
  },
];

const ITEMS_PER_PAGE = 6;
const totalPages = Math.ceil(allCategories.length / ITEMS_PER_PAGE);

export default function TasteDifference() {
  const [page, setPage] = useState(0);

  const visible = allCategories.slice(
    page * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  return (
    <section className="bg-white py-14 px-4">
      {/* Heading */}
      <h2 className="text-center text-gray-900 font-extrabold text-xl tracking-[0.2em] uppercase mb-10">
        Taste The Difference
      </h2>

      {/* Category circles */}
      <div className="max-w-5xl mx-auto grid grid-cols-3 sm:grid-cols-6 gap-6">
        {visible.map((cat) => (
          <a
            key={cat.label}
            href={cat.href}
            className="flex flex-col items-center gap-3 group"
          >
            {/* Circle */}
            <div
              className={`w-28 h-28 rounded-full bg-gradient-to-br ${cat.gradient} flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300`}
            >
              <span className="text-4xl select-none">{cat.emoji}</span>
            </div>
            {/* Label */}
            <span className="text-sm text-gray-700 font-medium text-center leading-tight">
              {cat.label}
            </span>
          </a>
        ))}
      </div>

      {/* Dot pagination */}
      <div className="flex items-center justify-center gap-2 mt-10">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            aria-label={`Page ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === page
                ? "bg-gray-800 w-7 h-3"
                : "bg-gray-300 w-3 h-3 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
