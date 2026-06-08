"use client";

import { useState } from "react";
import { ArrowUpRight, CheckCircle, Sparkles } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    let value = e.target.value;
    if (e.target.type === "tel") {
      value = value.replace(/\D/g, "").slice(0, 10);
    }
    setFormData((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact-inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || `Server error (${res.status})`);
      }
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[420px] gap-5 text-center px-6 py-12">
        <div className="w-20 h-20 rounded-full bg-brand-green/10 dark:bg-brand-gold/10 flex items-center justify-center animate-pulse-subtle">
          <CheckCircle className="w-10 h-10 text-brand-green dark:text-brand-gold" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">
            Message Sent!
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-sm">
            Thanks for reaching out,{" "}
            <span className="font-semibold text-brand-green dark:text-brand-gold">
              {formData.name}
            </span>
            . We&apos;ll get back to you within 24 hours.
          </p>
        </div>
        <button
          onClick={() => {
            setSubmitted(false);
            setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
          }}
          className="mt-2 px-6 py-2.5 text-sm font-semibold rounded-full bg-brand-green text-white dark:bg-brand-gold dark:text-brand-green hover:opacity-90 transition-opacity"
        >
          Send Another
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-zinc-100 shadow-sm mb-4">
          <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
          <span className="text-[11px] font-bold tracking-wide text-zinc-600">
            Get In Touch
          </span>
        </div>
        
        <h2 className="text-3xl font-bold text-zinc-800 dark:text-zinc-100 leading-tight mb-3">
          We&apos;d Love to Hear From you
        </h2>
        <p className="text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
          Fill in the form and our team will respond within one business day. We are always ready to assist you with professional solutions and reliable support.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {/* Grid for short inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            type="text"
            required
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3.5 rounded-xl border border-zinc-200/80 bg-[#f9f1e7]/50 text-zinc-800 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold transition-colors text-[13px]"
          />

          <input
            name="email"
            type="email"
            required
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3.5 rounded-xl border border-zinc-200/80 bg-[#f9f1e7]/50 text-zinc-800 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold transition-colors text-[13px]"
          />

          <input
            name="phone"
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            maxLength={10}
            inputMode="numeric"
            pattern="[0-9]{10}"
            className="w-full px-4 py-3.5 rounded-xl border border-zinc-200/80 bg-[#f9f1e7]/50 text-zinc-800 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold transition-colors text-[13px]"
          />

          <select
            name="subject"
            required
            value={formData.subject}
            onChange={handleChange}
            className={`w-full px-4 py-3.5 rounded-xl border border-zinc-200/80 bg-[#f9f1e7]/50 focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold transition-colors text-[13px] appearance-none cursor-pointer ${
              formData.subject ? "text-zinc-800" : "text-zinc-500"
            }`}
          >
            <option value="" disabled>
              Service You're Interested
            </option>
            <option value="General Inquiry">General Inquiry</option>
            <option value="Franchise">Franchise Opportunity</option>
            <option value="Order Issue">Order Issue</option>
            <option value="Feedback">Feedback</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Message */}
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Message"
          value={formData.message}
          onChange={handleChange}
          className="w-full px-4 py-3.5 rounded-xl border border-zinc-200/80 bg-[#f9f1e7]/50 text-zinc-800 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold transition-colors text-[13px] resize-none"
        />

        {/* Error */}
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        {/* Submit */}
        <div className="mt-2">
          <button
            type="submit"
            disabled={loading}
            className="group relative inline-flex items-center gap-4 py-2.5 pl-6 pr-2 rounded-full bg-[#f88636] hover:bg-[#e77525] text-white font-bold text-[13px] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <span className="py-1 pr-4">Sending...</span>
            ) : (
              <>
                <span>Send Message</span>
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#f88636] group-hover:scale-105 transition-transform">
                  <ArrowUpRight className="w-4 h-4 stroke-[3]" />
                </div>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
