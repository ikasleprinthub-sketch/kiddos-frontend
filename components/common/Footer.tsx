"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const quickLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "FAQs", href: "/faqs" },
];

export default function Footer() {
  const [fetchedCategories, setFetchedCategories] = useState<{ label: string; href: string }[]>([]);

  useEffect(() => {
    fetch("/api/categories?limit=3")
      .then(res => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then(data => {
        if (data.categories && Array.isArray(data.categories)) {
          setFetchedCategories(
            data.categories.map((c: { name: string; slug: string }) => ({
              label: c.name,
              href: `/category/${c.slug}`,
            }))
          );
        }
      })
      .catch(err => console.error("Failed to fetch footer categories", err));
  }, []);

  const categories = fetchedCategories.length > 0 ? fetchedCategories : [
    { label: "Batter", href: "/category/batter" },
    { label: "Spice Blends", href: "/category/spice-blends" },
    { label: "Chutney Book", href: "/category/chutney-book" },
  ];

  return (
    <footer className="bg-[#1e4620] text-white">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Column 1 — Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="Kiddos Foods Logo"
                width={56}
                height={56}
                className="rounded"
              />
              <div>
                <p className="text-[#f97316] font-bold text-xl leading-tight">Kiddos Foods</p>
                <p className="text-white/70 text-xs">Make healthy posterity</p>
              </div>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              Bringing Amma&apos;s love to your plate with <strong>30+ unique dosa batters</strong>.
              Pure, traditional, and irresistibly delicious. That&apos;s Kiddos Foods.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3 mt-1">
              <a
                href="#"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full border border-white/40 flex items-center justify-center hover:border-white hover:bg-white/10 transition-colors"
              >
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full border border-white/40 flex items-center justify-center hover:border-white hover:bg-white/10 transition-colors"
              >
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#1e4620" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/kiddosfoods_official/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-white/40 flex items-center justify-center hover:border-white hover:bg-white/10 transition-colors"
              >
                <svg className="w-4 h-4 fill-none stroke-white stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="white" stroke="none" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2 — Quick Links */}
          <div className="md:ml-10">
            <h3 className="font-semibold text-base mb-5">Quick Link</h3>
            <ul className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/80 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Categories */}
          <div>
            <h3 className="font-semibold text-base mb-5">Categories</h3>
            <ul className="flex flex-col gap-3">
              {categories.map((cat) => (
                <li key={cat.href}>
                  <Link
                    href={cat.href}
                    className="text-white/80 text-sm hover:text-white transition-colors"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Store Information */}
          <div>
            <h3 className="font-semibold text-base mb-5">Store Information</h3>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 mt-0.5 shrink-0 fill-none stroke-white stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="text-white/80 text-sm leading-relaxed">
                  No.380, Sreevari Gardens, KNG Pudhur Pirivu, Coimbatore 641025
                </span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-4 h-4 shrink-0 fill-none stroke-white stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <a href="tel:+917845945455" className="text-white/80 text-sm hover:text-white transition-colors">
                  +91 78459 45455
                </a>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-4 h-4 shrink-0 fill-none stroke-white stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <a href="mailto:care@kiddosfoods.com" className="text-white/80 text-sm hover:text-white transition-colors">
                  care@kiddosfoods.com
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/15" />

      {/* Bottom bar — pb accounts for iOS home indicator safe area */}
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-4 flex flex-col md:flex-row items-center justify-between gap-3"
        style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
      >
        <p className="text-white/70 text-xs text-center md:text-left">
          Copyright © {new Date().getFullYear()} Kiddos Foods | Crafted And Maintained By{" "}
          <a
            href="https://ikasle.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#f97316] hover:underline"
          >
            Ikasle Business Group
          </a>
        </p>

        {/* Payment method */}
        <div className="flex items-center">
          <Image
            src="/images/razorpay.jpg"
            alt="Razorpay"
            width={120}
            height={40}
            className="rounded object-contain h-10 w-auto"
          />
        </div>
      </div>
    </footer>
  );
}
