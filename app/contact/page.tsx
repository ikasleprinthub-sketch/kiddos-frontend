import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import ContactLocation from "@/components/ContactLocation";

export const metadata: Metadata = {
  title: "Contact Us | Kiddos Foods",
  description:
    "Get in touch with Kiddos Foods. Reach us at our Coimbatore outlet or send us a message — we love hearing from you!",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-brand-cream dark:bg-zinc-950">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-brand-green dark:bg-zinc-900 py-20 px-4">
        {/* Decorative blobs */}
        <div
          aria-hidden
          className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-brand-gold/20 blur-3xl pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute -bottom-20 -right-12 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none"
        />

        <div className="relative mx-auto max-w-3xl text-center">
          <span className="inline-block text-xs font-semibold tracking-widest text-brand-gold uppercase mb-4">
            Contact Us
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
            Let&apos;s start a{" "}
            <span className="text-brand-gold">conversation</span>
          </h1>
          <p className="mt-4 text-base text-white/70 max-w-xl mx-auto">
            Have a question, feedback, or franchise enquiry? We&apos;re always
            happy to help — reach out and we&apos;ll get back to you shortly.
          </p>
        </div>
      </section>

      {/* Two-column section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-start">
          {/* LEFT – Form */}
          <div className="bg-white dark:bg-zinc-900/70 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm p-8 sm:p-10">
            <ContactForm />
          </div>

          {/* RIGHT – Location */}
          <div className="bg-white dark:bg-zinc-900/70 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm p-8 sm:p-10">
            <ContactLocation />
          </div>
        </div>
      </section>
    </main>
  );
}
