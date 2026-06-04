"use client";

import { MapPin, Phone, Mail, Clock } from "lucide-react";

const ADDRESS = "2/298, Bharathiyar Nagar, Pannimadai, Coimbatore-641017";
const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;

const INFO = [
  {
    icon: Phone,
    label: "Phone Number",
    value: "+91 78459 45455",
    href: "tel:+917845945455",
  },
  {
    icon: Mail,
    label: "Email Address",
    value: "care@kiddosfoods.com",
    href: "mailto:care@kiddosfoods.com",
  },
  {
    icon: Clock,
    label: "Opening Hour",
    value: "Mon to Sat: 9 AM to 7 PM",
    href: undefined,
  },
  {
    icon: MapPin,
    label: "Our Location",
    value: ADDRESS,
    href: MAPS_LINK,
  },
];

export default function ContactLocation() {
  return (
    <div className="w-full flex flex-col">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-3">
          Contact Information
        </h2>
        <p className="text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
          Feel free to contact us anytime and we will respond as quickly as possible.
        </p>
      </div>

      {/* Info list */}
      <div className="flex flex-col">
        {INFO.map(({ icon: Icon, label, value, href }, idx) => (
          <div
            key={label}
            className={`flex items-start gap-4 py-5 ${idx !== INFO.length - 1 ? 'border-b border-zinc-100 dark:border-zinc-800' : ''}`}
          >
            <div className="flex-shrink-0 mt-0.5">
              <Icon className="w-6 h-6 text-brand-gold" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-[15px] font-semibold text-zinc-800 dark:text-zinc-200">
                {label}
              </p>
              {href ? (
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="text-[13px] font-medium text-zinc-500 dark:text-zinc-400 hover:text-brand-green dark:hover:text-brand-gold transition-colors break-words"
                >
                  {value}
                </a>
              ) : (
                <p className="text-[13px] font-medium text-zinc-500 dark:text-zinc-400 break-words">
                  {value}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
