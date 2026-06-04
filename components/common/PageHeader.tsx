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
    <section className="relative overflow-hidden bg-gradient-to-r from-brand-green to-[#2a5e2f] dark:from-zinc-950 dark:to-brand-green py-16 px-4 md:px-8 text-center text-white">
      {/* Background Patterns */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-brand-gold/15 blur-2xl animate-pulse-subtle" />
      <div className="absolute -bottom-10 -right-10 w-64 h-64 rounded-full bg-brand-gold/15 blur-3xl" />
      
      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6 text-white">
          {title}
        </h1>
        
        {/* Breadcrumb Pill */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 text-sm font-medium">
          <Link href="/" className="flex items-center gap-1.5 text-white/80 hover:text-brand-gold transition-colors">
            <Home className="w-4 h-4 text-brand-gold" />
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-white/40" />
          <span className="text-white">{displayBreadcrumb}</span>
        </div>
      </div>
    </section>
  );
}
