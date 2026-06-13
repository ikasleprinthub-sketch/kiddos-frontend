"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "What is Kiddos Foods?",
    answer: "Kiddos Foods is a company dedicated to making healthy, traditional, and authentic food products, with a core mission to \"Make healthy posterity\" by ensuring the health and well being of future generations.",
  },
  {
    question: "What types of products does Kiddos Foods sell?",
    answer: "We primarily sell South Indian food essentials, including 30+ types of Idli and Dosa Batter. We also offer other products like Raw Spices, Spice Blends, Pickles, and Cold Pressed Oils.",
  },
  {
    question: "Are your batters genuinely home made and traditional?",
    answer: "Yes, our products are 100% Home Made and follow \"Amma's Receipe\" (recipe) for an authentic, traditional taste, just like a mother's touch. They are made with love and ensure premium quality.",
  },
  {
    question: "What makes Kiddos Foods products healthy for my family and kids?",
    answer: "Our products are made with Pure Ingredients, are Protein Rich, Healthy & Nutritious, and are Easily Digestible. We also strictly follow the policy of: No Preservatives, No Added Colors, No Artificial Flavors, Zero Additives, and No Sugar/Rising Agents.",
  },
  {
    question: "Do you use any artificial additives or preservatives?",
    answer: "Absolutely not. We promise: No Preservatives, No Added Colours, No Artificial Flavors, Zero Additives, and No Sugar/Rising Agents. We ensure a 100% Natural and safe product for your kids.",
  },
  {
    question: "How can I purchase or contact Kiddos Foods?",
    answer: "You can contact us at +91 78459 45455 or email care@kiddosfoods.com. Our locations are at No.380, Sreevari Gardens, KNG Pudhur Pirivu, Coimbatore 641025. You can also find us on social media: @kiddosfoodskovai",
  },
  {
    question: "How many varieties of batter do you offer?",
    answer: "We offer 30+ types of Idli and Dosa batter to provide a wide range of healthy meal options.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null); // All closed by default

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
      {/* Left Side: Header & Text */}
      <div className="md:col-span-5 md:pr-12 md:sticky md:top-32 h-fit">
        <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white leading-tight mb-6 tracking-tight">
          Frequently Asked<br className="hidden md:block" /> Questions
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
          We have answered the most common questions about our products. If you
          don't find what you're looking for, you can{" "}
          <Link href="/contact" className="text-[#f97316] hover:underline font-medium">
            contact our support team
          </Link>{" "}
          directly.
        </p>
      </div>

      {/* Right Side: Accordion */}
      <div className="md:col-span-7 flex flex-col gap-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index} 
              className="border-b border-zinc-200 dark:border-zinc-800 last:border-0"
            >
              <button
                onClick={() => toggleOpen(index)}
                className="w-full flex items-center justify-between py-5 text-left transition-colors"
              >
                <span 
                  className={`text-sm md:text-base font-medium transition-colors duration-200 ${
                    isOpen 
                      ? "text-[#d96621] dark:text-[#f97316]" 
                      : "text-zinc-800 dark:text-zinc-200 hover:text-[#d96621] dark:hover:text-[#f97316]"
                  }`}
                >
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ml-4 ${
                    isOpen ? "rotate-180 text-[#d96621] dark:text-[#f97316]" : "text-zinc-500 dark:text-zinc-400"
                  }`}
                />
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? "max-h-96 opacity-100 pb-6" : "max-h-0 opacity-0 pb-0"
                }`}
              >
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed pr-8">
                  {faq.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
