"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface PageHeaderProps {
  title: string;
  breadcrumbText?: string; // If different from title
}

export default function PageHeader({ title, breadcrumbText }: PageHeaderProps) {
  const displayBreadcrumb = breadcrumbText || title;

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-brand-green to-[#2a5e2f] px-4 py-8 text-center text-white dark:from-zinc-950 dark:to-brand-green sm:py-10 md:px-8 md:py-16">
      {/* Background Patterns */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-brand-gold/15 blur-2xl animate-pulse-subtle" />
      <div className="absolute -bottom-10 -right-10 w-64 h-64 rounded-full bg-brand-gold/15 blur-3xl" />
      
      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
        <h1 className="mb-3 text-3xl font-black tracking-tight text-white sm:mb-4 sm:text-4xl md:mb-6 md:text-5xl">
          {title}
        </h1>
        
        {/* Breadcrumb Pill */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium backdrop-blur-sm sm:gap-2 sm:px-4 sm:py-2 sm:text-sm">
          <Link href="/" className="flex items-center gap-1.5 text-white/80 hover:text-brand-gold transition-colors">
            <Home className="h-3.5 w-3.5 text-brand-gold sm:h-4 sm:w-4" />
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-white/40" />
          <span className="text-white">{displayBreadcrumb}</span>
        </div>
      </div>
    </section>
  );
}
