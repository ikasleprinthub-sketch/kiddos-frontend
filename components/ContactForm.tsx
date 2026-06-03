"use client";

import { useState } from "react";
import { Send, User, Mail, MessageSquare, FileText, CheckCircle } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate network request
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    setSubmitted(true);
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
            setFormData({ name: "", email: "", subject: "", message: "" });
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
        <span className="inline-block text-xs font-semibold tracking-widest text-brand-gold uppercase mb-3">
          Get in Touch
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-zinc-800 dark:text-zinc-100 leading-tight">
          We&apos;d love to{" "}
          <span className="text-brand-green dark:text-brand-gold">hear from you</span>
        </h2>
        <p className="mt-3 text-zinc-500 dark:text-zinc-400 text-base">
          Fill in the form and our team will respond within one business day.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Name */}
        <div className="group">
          <label
            htmlFor="contact-name"
            className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5"
          >
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-brand-green dark:group-focus-within:text-brand-gold transition-colors" />
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="Your full name"
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-green/40 dark:focus:ring-brand-gold/40 focus:border-brand-green dark:focus:border-brand-gold transition-all duration-200 text-sm"
            />
          </div>
        </div>

        {/* Email */}
        <div className="group">
          <label
            htmlFor="contact-email"
            className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5"
          >
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-brand-green dark:group-focus-within:text-brand-gold transition-colors" />
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-green/40 dark:focus:ring-brand-gold/40 focus:border-brand-green dark:focus:border-brand-gold transition-all duration-200 text-sm"
            />
          </div>
        </div>

        {/* Subject */}
        <div className="group">
          <label
            htmlFor="contact-subject"
            className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5"
          >
            Subject
          </label>
          <div className="relative">
            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-brand-green dark:group-focus-within:text-brand-gold transition-colors" />
            <select
              id="contact-subject"
              name="subject"
              required
              value={formData.subject}
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand-green/40 dark:focus:ring-brand-gold/40 focus:border-brand-green dark:focus:border-brand-gold transition-all duration-200 text-sm appearance-none cursor-pointer"
            >
              <option value="" disabled>
                Select a topic…
              </option>
              <option value="General Inquiry">General Inquiry</option>
              <option value="Franchise">Franchise Opportunity</option>
              <option value="Order Issue">Order Issue</option>
              <option value="Feedback">Feedback</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Message */}
        <div className="group">
          <label
            htmlFor="contact-message"
            className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5"
          >
            Message
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-zinc-400 group-focus-within:text-brand-green dark:group-focus-within:text-brand-gold transition-colors" />
            <textarea
              id="contact-message"
              name="message"
              required
              rows={5}
              placeholder="Tell us how we can help…"
              value={formData.message}
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-green/40 dark:focus:ring-brand-gold/40 focus:border-brand-green dark:focus:border-brand-gold transition-all duration-200 text-sm resize-none"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          id="contact-submit-btn"
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-brand-green text-white dark:bg-brand-gold dark:text-brand-green font-semibold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:translate-y-0"
        >
          {loading ? (
            <>
              <svg
                className="w-4 h-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
              Sending…
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Send Message
            </>
          )}
        </button>
      </form>
    </div>
  );
}
