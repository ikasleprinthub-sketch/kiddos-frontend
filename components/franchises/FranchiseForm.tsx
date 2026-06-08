"use client";

import { useState } from "react";
import { Check, Send, Upload, X } from "lucide-react";

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
  pincode: string;
  profession: string;
  aboutBusiness: string;
  package: string;
  readyToStart: string;
  message: string;
  image: string;
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
  pincode: "",
  profession: "",
  aboutBusiness: "",
  package: "",
  readyToStart: "",
  message: "",
  image: "",
};

const inputCls =
  "w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-zinc-800 text-sm text-gray-700 dark:text-zinc-200 placeholder-gray-400 dark:placeholder-zinc-500 border border-transparent focus:outline-none focus:border-gray-300 dark:focus:border-zinc-600 focus:bg-white dark:focus:bg-zinc-700 transition";

const selectCls =
  "w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-zinc-800 text-sm text-gray-500 dark:text-zinc-400 border border-transparent focus:outline-none focus:border-gray-300 dark:focus:border-zinc-600 focus:bg-white dark:focus:bg-zinc-700 transition appearance-none cursor-pointer";

export default function FranchiseForm() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    let value = e.target.value;
    if (e.target.type === "tel") {
      value = value.replace(/\D/g, "").slice(0, 10);
    }
    setForm((prev) => ({ ...prev, [e.target.name]: value }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "franchises");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || `Upload failed (${res.status})`);
      }

      const data = await res.json();
      setForm((prev) => ({ ...prev, image: data.url }));
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      // Map pincode to zipcode for backend compatibility
      const payload = {
        ...form,
        zipcode: form.pincode,
      };

      const res = await fetch("/api/franchise-inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || `Server error (${res.status})`);
      }
      setIsSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      id="inquiry-form"
      className="bg-[#faf8f5] dark:bg-[#081814]/40 py-20 px-4 scroll-mt-24 border-t border-zinc-150/40 dark:border-zinc-900"
    >
      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold">
          <span className="text-gray-900 dark:text-zinc-100">Start Your </span>
          <span className="text-[#1e4620] dark:text-[#ca8a04]">Franchise Journey</span>
        </h2>
        <p className="text-gray-450 dark:text-zinc-400 text-sm mt-2">
          Fill out the form below, and our team will get in touch with you
          shortly to guide you through the next steps.
        </p>
      </div>

      {/* Form card */}
      <div className="max-w-5xl mx-auto bg-white dark:bg-zinc-900 rounded-[32px] p-8 sm:p-10 border border-zinc-150/50 dark:border-zinc-800/80 shadow-[0_12px_40px_rgba(0,0,0,0.02)]">

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
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Row 1: Name | Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input name="name" type="text" required value={form.name} onChange={handleChange} placeholder="Name" className={inputCls} />
              <input name="email" type="email" required value={form.email} onChange={handleChange} placeholder="Email Id" className={inputCls} />
            </div>

            {/* Row 2: Mobile | Alternate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input name="mobile" type="tel" required value={form.mobile} onChange={handleChange} placeholder="Mobile Number" maxLength={10} inputMode="numeric" pattern="[0-9]{10}" className={inputCls} />
              <input name="alternate" type="tel" value={form.alternate} onChange={handleChange} placeholder="Alternate Number" maxLength={10} inputMode="numeric" pattern="[0-9]{10}" className={inputCls} />
            </div>

            {/* Row 3: Preferred Location | How did you hear */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input name="preferredLocation" type="text" required value={form.preferredLocation} onChange={handleChange} placeholder="Preferred Location" className={inputCls} />
              <input name="hearAboutUs" type="text" value={form.hearAboutUs} onChange={handleChange} placeholder="How did you hear about us?" className={inputCls} />
            </div>

            {/* Row 4: Country | State | City */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input name="country" type="text" value={form.country} onChange={handleChange} placeholder="Country" className={inputCls} />
              <input name="state" type="text" required value={form.state} onChange={(e) => { const v = e.target.value.replace(/[^a-zA-Z\s]/g, ""); setForm((prev) => ({ ...prev, state: v })); }} placeholder="State" className={inputCls} />
              <input name="city" type="text" required value={form.city} onChange={(e) => { const v = e.target.value.replace(/[^a-zA-Z\s]/g, ""); setForm((prev) => ({ ...prev, city: v })); }} placeholder="City" className={inputCls} />
            </div>

            {/* Row 5: Pincode | Profession | About business */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input name="pincode" type="text" inputMode="numeric" maxLength={6} value={form.pincode} onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 6); setForm((prev) => ({ ...prev, pincode: v })); }} placeholder="Pin Code" className={inputCls} />
              <input name="profession" type="text" value={form.profession} onChange={(e) => { const v = e.target.value.replace(/[^a-zA-Z\s]/g, ""); setForm((prev) => ({ ...prev, profession: v })); }} placeholder="Profession" className={inputCls} />
              <input name="aboutBusiness" type="text" value={form.aboutBusiness} onChange={handleChange} placeholder="About your business" className={inputCls} />
            </div>

            {/* Row 6: Select Package | Ready To Start */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <select name="package" required value={form.package} onChange={handleChange} className={selectCls}>
                  <option value="" disabled>Select Package</option>
                  <option value="standard">Standard Package</option>
                  <option value="premium">Premium Package</option>
                  <option value="express">Express Outlet</option>
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
                  <option value="1-3-months">Within 1 to 3 Months</option>
                  <option value="3-6-months">Within 3 to 6 Months</option>
                  <option value="6-plus-months">6+ Months</option>
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Row 7: Storefront Image Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-600 dark:text-zinc-400">
                Storefront / Preferred Location Photos (Optional)
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 px-6 py-4 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-base font-bold text-zinc-750 dark:text-zinc-200 cursor-pointer border border-dashed border-gray-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-550 transition-all select-none">
                  <Upload className="w-4 h-4 text-zinc-500" />
                  {uploading ? "Uploading..." : form.image ? "Change Photo" : "Upload Photo"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>

                {form.image && (
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-850 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={form.image}
                      alt="Storefront photo preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, image: "" }))}
                      className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <X className="w-4 h-4 stroke-[2.5px]" />
                    </button>
                  </div>
                )}
              </div>
              {uploadError && (
                <p className="text-xs text-red-500 font-medium mt-1">
                  {uploadError}
                </p>
              )}
            </div>

            {/* Row 8: Message */}
            <textarea
              name="message"
              rows={6}
              value={form.message}
              onChange={handleChange}
              placeholder="Message"
              className={`${inputCls} resize-y`}
            />

            {/* Error */}
            {error && (
              <p className="text-sm text-red-650 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-lg px-4 py-3">
                {error}
              </p>
            )}

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 rounded-lg bg-[#1e4620] hover:bg-[#134e15] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
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
