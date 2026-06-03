"use client";

import { useState } from "react";
import { Check, Send } from "lucide-react";

type FormState = {
  name: string;
  email: string;
  mobile: string;
  alternate: string;
  preferredLocation: string;
  hearAboutUs: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  profession: string;
  aboutBusiness: string;
  package: string;
  readyToStart: string;
  message: string;
};

const EMPTY: FormState = {
  name: "",
  email: "",
  mobile: "",
  alternate: "",
  preferredLocation: "",
  hearAboutUs: "",
  country: "India",
  state: "",
  city: "",
  zipcode: "",
  profession: "",
  aboutBusiness: "",
  package: "",
  readyToStart: "",
  message: "",
};

const inputCls =
  "w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-zinc-800 text-sm text-gray-700 dark:text-zinc-200 placeholder-gray-400 dark:placeholder-zinc-500 border border-transparent focus:outline-none focus:border-gray-300 dark:focus:border-zinc-600 focus:bg-white dark:focus:bg-zinc-700 transition";

const selectCls =
  "w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-zinc-800 text-sm text-gray-500 dark:text-zinc-400 border border-transparent focus:outline-none focus:border-gray-300 dark:focus:border-zinc-600 focus:bg-white dark:focus:bg-zinc-700 transition appearance-none cursor-pointer";

export default function FranchiseForm() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  }

  return (
    <section
      id="inquiry-form"
      className="bg-gray-50 dark:bg-zinc-950 py-16 px-4 scroll-mt-24"
    >
      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold">
          <span className="text-gray-900 dark:text-zinc-100">Start Your </span>
          <span className="text-[#f05252]">Franchise Journey</span>
        </h2>
        <p className="text-gray-400 dark:text-zinc-500 text-sm mt-2">
          Fill out the form below, and our team will get in touch with you
          shortly to guide you through the next steps.
        </p>
      </div>

      {/* Form card */}
      <div className="max-w-5xl mx-auto bg-white dark:bg-zinc-900 rounded-2xl p-8 sm:p-10 shadow-sm">

        {isSubmitted ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-emerald-500 stroke-[3px]" />
            </div>
            <h3 className="text-xl font-black text-gray-800 dark:text-zinc-100 mb-2">
              Request Submitted!
            </h3>
            <p className="text-sm text-gray-500 dark:text-zinc-400 max-w-sm mx-auto mb-6 leading-relaxed">
              Thank you for your interest in Kiddos Foods franchise. Our team
              will reach out to <strong>{form.mobile}</strong> shortly.
            </p>
            <button
              onClick={() => { setForm(EMPTY); setIsSubmitted(false); }}
              className="px-6 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 text-sm font-semibold text-gray-600 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
            >
              Submit Another Request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Row 1: Name | Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input name="name" type="text" required value={form.name} onChange={handleChange} placeholder="Name" className={inputCls} />
              <input name="email" type="email" required value={form.email} onChange={handleChange} placeholder="Email Id" className={inputCls} />
            </div>

            {/* Row 2: Mobile | Alternate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input name="mobile" type="tel" required value={form.mobile} onChange={handleChange} placeholder="Mobile Number" className={inputCls} />
              <input name="alternate" type="tel" value={form.alternate} onChange={handleChange} placeholder="Alternate Number" className={inputCls} />
            </div>

            {/* Row 3: Preferred Location | How did you hear */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input name="preferredLocation" type="text" required value={form.preferredLocation} onChange={handleChange} placeholder="Preferred Location" className={inputCls} />
              <input name="hearAboutUs" type="text" value={form.hearAboutUs} onChange={handleChange} placeholder="How did you hear about us?" className={inputCls} />
            </div>

            {/* Row 4: Country | State | City */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input name="country" type="text" value={form.country} onChange={handleChange} placeholder="Country" className={inputCls} />
              <input name="state" type="text" required value={form.state} onChange={handleChange} placeholder="State" className={inputCls} />
              <input name="city" type="text" required value={form.city} onChange={handleChange} placeholder="City" className={inputCls} />
            </div>

            {/* Row 5: Zipcode | Profession | About business */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input name="zipcode" type="text" value={form.zipcode} onChange={handleChange} placeholder="Zipcode" className={inputCls} />
              <input name="profession" type="text" value={form.profession} onChange={handleChange} placeholder="Profession" className={inputCls} />
              <input name="aboutBusiness" type="text" value={form.aboutBusiness} onChange={handleChange} placeholder="About your business" className={inputCls} />
            </div>

            {/* Row 6: Select Package | Ready To Start */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <select name="package" required value={form.package} onChange={handleChange} className={selectCls}>
                  <option value="" disabled>Select Package</option>
                  <option value="kiosk">Kiosk Model</option>
                  <option value="express">Express Outlet</option>
                  <option value="full">Full Store</option>
                  <option value="master">Master Franchise</option>
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
              <div className="relative">
                <select name="readyToStart" required value={form.readyToStart} onChange={handleChange} className={selectCls}>
                  <option value="" disabled>Ready To Start</option>
                  <option value="immediately">Immediately</option>
                  <option value="1-3-months">Within 1–3 Months</option>
                  <option value="3-6-months">Within 3–6 Months</option>
                  <option value="6-plus-months">6+ Months</option>
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Row 7: Message */}
            <textarea
              name="message"
              rows={5}
              value={form.message}
              onChange={handleChange}
              placeholder="Message"
              className={`${inputCls} resize-y`}
            />

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 rounded-lg bg-[#f05252] hover:bg-[#e53e3e] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    Submit Request
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </form>
        )}
      </div>
    </section>
  );
}
