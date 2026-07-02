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
    answer: "Kiddos Foods is a trusted food brand offering fresh, healthy, and traditionally prepared food products. We are known for our wide range of Idli and Dosa batters, along with spices, oils, pickles, millet products, health mixes, and other pantry essentials.",
  },
  {
    question: "What types of products does Kiddos Foods offer?",
    answer: "We offer 30+ varieties of fresh Idli and Dosa Batters, along with raw spices, spice blends, pickles, cold-pressed oils, millet products, health mixes, instant mixes, noodles, pasta, teas, and other traditional food essentials.",
  },
  {
    question: "Are your batters traditionally prepared?",
    answer: "Yes. Our batters are prepared using traditional methods with carefully selected ingredients to deliver authentic taste, freshness, and quality.",
  },
  {
    question: "What makes Kiddos Foods products healthy for my family?",
    answer: "We focus on using quality ingredients, traditional recipes, and hygienic preparation methods to provide nutritious and wholesome food products for everyday meals.",
  },
  {
    question: "Do your products contain artificial additives or preservatives?",
    answer: "Our products are prepared with a focus on quality and freshness. (Only mention \"No preservatives\" or \"No artificial additives\" if this is true for every applicable product.)",
  },
  {
    question: "How many varieties of batter do you offer?",
    answer: "We offer 30+ varieties of fresh Idli and Dosa Batters, including millet-based, traditional, and specialty batter options.",
  },
  {
    question: "How can I purchase Kiddos Foods products or contact you?",
    answer: "You can explore our products through our website, visit our store, or contact us via phone, WhatsApp, or social media for orders and franchise enquiries.",
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
