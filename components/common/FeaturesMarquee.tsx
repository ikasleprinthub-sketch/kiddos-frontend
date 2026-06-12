"use client";

import React from 'react';

const features = [
  "100% NATURAL",
  "100% HOME-MADE",
  "100% HEALTHY",
  "NO PRESERVATIVE",
  "NO ADDED COLOR",
  "NO ARTIFICIAL FLAVORS"
];

export function FeaturesMarquee() {
  return (
    <div className="w-full bg-[#1e4620] overflow-hidden py-4 border-y border-[#2a5e2f] select-none pointer-events-none">
      {/* We duplicate the array to ensure smooth infinite scrolling */}
      <div className="flex whitespace-nowrap animate-marquee">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center mx-4">
            {features.map((feature, j) => (
              <div key={j} className="flex items-center mx-6 sm:mx-10 text-white font-semibold tracking-[0.1em] text-xs sm:text-sm">
                <svg className="w-4 h-4 mr-3 text-[#f97316]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.65 3.03C15.43 2.65 12.87 3.5 10.66 5.25C8.42 7.02 6.64 9.61 6.04 12.33L4.47 11.23C4.12 10.99 3.65 11.08 3.4 11.43C3.16 11.78 3.25 12.25 3.6 12.49L5.26 13.65C5.07 14.7 5.12 15.68 5.37 16.53L2.24 18.73C1.89 18.97 1.8 19.44 2.05 19.79C2.29 20.14 2.76 20.23 3.11 19.98L6.46 17.63C7.79 19.64 9.94 20.61 12.23 20.44C15.17 20.23 18.17 17.84 19.67 14.15C21.15 10.5 20.59 6.27 17.65 3.03ZM17.9 13.43C16.63 16.57 14.07 18.61 11.57 18.8C9.53 18.94 7.63 17.98 6.61 16.03L15.34 9.92C15.69 9.68 15.78 9.21 15.53 8.86C15.29 8.51 14.82 8.42 14.47 8.67L5.75 14.77C5.81 12.84 7.15 10.67 9.07 9.15C10.99 7.64 13.11 6.88 14.99 7.21C17.47 7.64 19.16 10.3 17.9 13.43Z" />
                </svg>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
