"use client";

import { useState } from "react";
import Image from "next/image";

const cards = [
  {
    title: "Our Promise",
    image: "/images/whatwedo/what1.svg",
    items: [
      "Made with carefully selected natural ingredients",
      "No preservatives or artificial additives",
      "No added colours or synthetic flavours",
      "Traditional processing with clean label standards",
      "Healthy wholesome family friendly products",
      "Crafted for everyday nutrition and authentic taste",
      "Trusted food choices for modern families",
    ],
  },
  {
    title: "We Specialize in",
    image: "/images/whatwedo/what2.svg",
    items: [
      "30+ varieties of idli dosa batters",
      "Traditional spice powders masala blends",
      "Homemade style pickles healthy condiments",
      "Millet based food products healthy mixes",
      "Cold pressed oils traditional ingredients",
      "Ready to cook and everyday healthy essentials",
    ],
  },
  {
    title: "Our Recipes are Inspired by",
    image: "/images/whatwedo/what3.svg",
    items: [
      "Traditional home style cooking practices",
      "Authentic regional flavours and heritage recipes",
      "Clean balanced nutritious ingredients",
      "The belief that healthy food should never compromise taste",
      "A mission to build healthier future generations",
      "Food made with care, trust, and long-term wellness in mind",
    ],
  },
];

export default function WhatWeDo() {
  const [active, setActive] = useState(0);
  const card = cards[active];

  return (
    <section className="bg-[#e8eceb] py-16 px-6 sm:px-10 lg:px-16">
      {/* Section heading */}
      <h2
        className="text-center text-[#1e4620] text-6xl mb-8"
        style={{ fontFamily: "'Times New Roman', Times, serif", fontWeight: 700 }}
      >
        What We Do
      </h2>

      {/* Tab selectors */}
      <div className="flex items-center justify-center gap-3 mb-8 flex-wrap">
        {cards.map((c, idx) => (
          <button
            key={c.title}
            onClick={() => setActive(idx)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
              active === idx
                ? "bg-[#1e4620] text-white shadow-md"
                : "bg-white text-[#1e4620] hover:bg-[#1e4620]/10"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${active === idx ? "bg-white" : "bg-[#2a7a2a]"}`} />
            {c.title}
          </button>
        ))}
      </div>

      {/* Content panel — full width */}
      <div className="w-full bg-white rounded-3xl shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row min-h-[420px]">
          {/* Left: image */}
          <div className="md:w-[42%] bg-[#f0fdf4] flex items-center justify-center p-6 lg:p-8">
            <Image
              key={card.image}
              src={card.image}
              alt={card.title}
              width={600}
              height={600}
              className="w-full max-w-[520px] h-auto object-contain rounded-2xl"
            />
          </div>

          {/* Right: content */}
          <div className="md:w-[58%] pl-16 pr-12 lg:pl-20 lg:pr-16 py-12 flex flex-col justify-center">
            <h3 className="text-[#1e4620] font-bold text-2xl mb-8">
              {card.title}
            </h3>
            <ol className="flex flex-col gap-4">
              {card.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-4 text-base text-gray-700 leading-relaxed">
                  <span className="w-6 h-6 rounded-full bg-[#1e4620]/10 text-[#1e4620] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
