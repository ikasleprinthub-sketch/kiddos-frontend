"use client";

import { MapPin, Phone, Mail, Clock } from "lucide-react";

const ADDRESS = "2/298, Bharathiyar Nagar, Pannimadal, Coimbatore‑641017";
const MAPS_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.8245388948555!2d76.97440507480382!3d10.982823489197!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859bc5b4b9785%3A0x4e2e3c3c3c3c3c3c!2sBharathiyar%20Nagar%2C%20Pannimadal%2C%20Coimbatore%2C%20Tamil%20Nadu%20641017!5e0!3m2!1sen!2sin!4v1717440000000!5m2!1sen!2sin";
const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;

const INFO = [
  {
    icon: MapPin,
    label: "Address",
    value: ADDRESS,
    href: MAPS_LINK,
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 78459 45455",
    href: "tel:+917845945455",
  },
  {
    icon: Mail,
    label: "Email",
    value: "care@kiddosfoods.com",
    href: "mailto:care@kiddosfoods.com",
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Mon – Sat: 9 AM – 7 PM",
    href: undefined,
  },
];

export default function ContactLocation() {
  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div>
        <span className="inline-block text-xs font-semibold tracking-widest text-brand-gold uppercase mb-3">
          Find Us
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-zinc-800 dark:text-zinc-100 leading-tight">
          Visit our{" "}
          <span className="text-brand-green dark:text-brand-gold">outlet</span>
        </h2>
        <p className="mt-3 text-zinc-500 dark:text-zinc-400 text-base">
          Stop by and experience the freshness in person — we&apos;re right in the heart of
          Coimbatore.
        </p>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {INFO.map(({ icon: Icon, label, value, href }) => (
          <div
            key={label}
            className="flex items-start gap-3 p-4 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/80 dark:bg-zinc-900/50 hover:border-brand-green/40 dark:hover:border-brand-gold/40 transition-colors group"
          >
            <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-brand-green/10 dark:bg-brand-gold/10 flex items-center justify-center mt-0.5 group-hover:bg-brand-green/20 dark:group-hover:bg-brand-gold/20 transition-colors">
              <Icon className="w-4.5 h-4.5 text-brand-green dark:text-brand-gold" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-0.5">
                {label}
              </p>
              {href ? (
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-brand-green dark:hover:text-brand-gold transition-colors break-words"
                >
                  {value}
                </a>
              ) : (
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 break-words">
                  {value}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Google Maps Embed */}
      <div className="relative w-full rounded-3xl overflow-hidden border border-zinc-200/60 dark:border-zinc-800/60 shadow-lg">
        {/* Decorative pin badge */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border border-zinc-200/40 dark:border-zinc-800/40 shadow-sm">
          <MapPin className="w-3.5 h-3.5 text-brand-green dark:text-brand-gold" />
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Kiddos Foods
          </span>
        </div>

        <iframe
          id="contact-map-iframe"
          title="Kiddos Foods Location"
          src={MAPS_EMBED_URL}
          width="100%"
          height="320"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full"
        />

        {/* Open in Maps button overlay */}
        <a
          href={MAPS_LINK}
          target="_blank"
          rel="noopener noreferrer"
          id="contact-open-maps-btn"
          className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-brand-green text-white dark:bg-brand-gold dark:text-brand-green text-xs font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
        >
          <MapPin className="w-3.5 h-3.5" />
          Open in Maps
        </a>
      </div>
    </div>
  );
}
