import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import ContactLocation from "@/components/ContactLocation";
import FAQSection from "@/components/FAQSection";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Contact Us | Kiddos Foods",
  description:
    "Get in touch with Kiddos Foods. Reach us at our Coimbatore outlet or send us a message — we love hearing from you!",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-brand-cream dark:bg-zinc-950">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-brand-green dark:bg-zinc-900 py-16 px-4">
        {/* Decorative blobs */}
        <div
          aria-hidden
          className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-brand-gold/20 blur-3xl pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute -bottom-20 -right-12 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none"
        />

        <div className="relative mx-auto max-w-7xl flex flex-col items-center text-center">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold tracking-widest text-brand-gold/80 uppercase mb-4">
            <Link href="/" className="hover:text-brand-gold transition-colors">Home</Link>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="m9 18 6-6-6-6"/></svg>
            <span className="text-white">Contact Us</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
            Contact Us
          </h1>
        </div>
      </section>

      {/* Two-column section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-10 xl:gap-12 items-start">
          {/* LEFT – Location */}
          <div className="bg-white dark:bg-zinc-900/70 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm p-8 sm:p-10">
            <ContactLocation />
          </div>

          {/* RIGHT – Form */}
          <div className="bg-[#fff9f2] dark:bg-zinc-900/70 rounded-3xl border border-brand-gold/20 dark:border-zinc-800/50 shadow-sm p-8 sm:p-10">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-[#fafafa] dark:bg-zinc-950 py-16 md:py-24 border-t border-zinc-200 dark:border-zinc-800">
        <FAQSection />
      </section>

      {/* Locations Section */}
      <section className="bg-white dark:bg-zinc-900 py-16 md:py-24 border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
          <div className="text-center mb-10 flex flex-col items-center">
            <h2 className="text-3xl font-bold text-zinc-800 dark:text-zinc-100">Our Location</h2>
            <p className="mt-4 text-[15px] font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-6 py-3 rounded-full inline-flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green dark:text-brand-gold"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              2/298, Bharathiyar Nagar, Pannimadal, Coimbatore‑641017
            </p>
          </div>
          <div className="w-full rounded-3xl overflow-hidden border border-zinc-200/60 dark:border-zinc-800/60 shadow-lg">
            <iframe
              title="Kiddos Foods Location"
              src="https://maps.google.com/maps?q=2/298,%20Bharathiyar%20Nagar,%20Pannimadal,%20Coimbatore%E2%80%91641017&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
