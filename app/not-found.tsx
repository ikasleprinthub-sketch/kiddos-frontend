"use client";

import Link from "next/link";
import Image from "next/image";
import { Home, ShoppingBag, Phone, Info, HelpCircle, Utensils, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] relative overflow-hidden">

      {/* Background decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#1e4620]/5" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#f97316]/8" />
        <div className="absolute top-1/2 left-1/4 w-40 h-40 rounded-full bg-[#1e4620]/4" />
      </div>

      {/* Dot grid overlay */}
      <div className="pointer-events-none absolute inset-0 bg-dot-grid opacity-40" />

      {/* Logo bar */}
      <div className="relative z-10 flex justify-center pt-10 pb-4">
        <Link href="/">
          <Image
            src="/orglogo.svg"
            alt="Kiddos Foods"
            width={180}
            height={78}
            className="object-contain"
          />
        </Link>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12 text-center">

        {/* Icon circle */}
        <div className="relative mb-6">
          <div className="w-32 h-32 rounded-full bg-[#1e4620] flex items-center justify-center shadow-2xl">
            <Search className="w-14 h-14 text-white" strokeWidth={1.5} />
          </div>
          <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-[#f97316] flex items-center justify-center shadow-lg">
            <HelpCircle className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
        </div>

        {/* 404 number */}
        <h1 className="font-playfair text-[8rem] leading-none font-bold text-[#1e4620] select-none">
          404
        </h1>

        {/* Divider */}
        <div className="flex items-center gap-3 my-3">
          <div className="h-px w-16 bg-[#1e4620]/20" />
          <Utensils className="w-4 h-4 text-[#f97316]" />
          <div className="h-px w-16 bg-[#1e4620]/20" />
        </div>

        {/* Heading */}
        <h2 className="font-playfair text-2xl font-semibold text-[#1e4620] mb-3">
          Oops! This page went missing
        </h2>

        {/* Description */}
        <p className="text-zinc-500 text-base leading-relaxed mb-8 max-w-md">
          Looks like this page doesn&apos;t exist or has been moved.
          Let&apos;s get you back to something delicious.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-[#1e4620] text-white font-semibold text-sm hover:bg-[#2c5e2f] transition-colors shadow-md"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full border-2 border-[#1e4620] text-[#1e4620] font-semibold text-sm hover:bg-[#1e4620] hover:text-white transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            Browse Products
          </Link>
        </div>

        {/* Help links */}
        <div className="mt-10 flex items-center gap-5 text-sm text-zinc-400">
          <Link href="/about" className="flex items-center gap-1.5 hover:text-[#f97316] transition-colors">
            <Info className="w-3.5 h-3.5" />
            About
          </Link>
          <span>·</span>
          <Link href="/contact" className="flex items-center gap-1.5 hover:text-[#f97316] transition-colors">
            <Phone className="w-3.5 h-3.5" />
            Contact
          </Link>
          <span>·</span>
          <Link href="/faqs" className="flex items-center gap-1.5 hover:text-[#f97316] transition-colors">
            <HelpCircle className="w-3.5 h-3.5" />
            FAQs
          </Link>
        </div>
      </div>
    </div>
  );
}
