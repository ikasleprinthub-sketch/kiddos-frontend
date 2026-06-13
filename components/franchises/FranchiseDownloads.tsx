"use client";

import { useState } from "react";
import { Download, FileText, X } from "lucide-react";
import { FaRegFilePdf } from "react-icons/fa";


const resources = [
  {
    icon: (
      <FaRegFilePdf className="w-8 h-8 text-[#f05252]" />
    ),
    iconBg: "bg-red-50 dark:bg-red-950/30",
    tag: "PDF Brochure",
    tagColor: "text-[#f05252] bg-red-50 dark:bg-red-950/30",
    title: "Explore Franchise Brochure",
    desc: "Learn about our brand values, market potential, investment slabs, store layouts, and full support systems.",
    resourceType: "BROCHURE" as const,
    btnLabel: "Download Brochure",
    btnStyle: "bg-[#f05252] hover:bg-[#e53e3e] text-white cursor-pointer",
  },
  {
    icon: <FileText className="w-8 h-8 text-[#4285F4]" />,
    iconBg: "bg-blue-50 dark:bg-blue-950/30",
    tag: "Application Form",
    tagColor: "text-[#4285F4] bg-blue-50 dark:bg-blue-950/30",
    title: "Franchise Application Form",
    desc: "Prefer offline? Download the official form, fill the required details, and send it back to our franchise team.",
    resourceType: "APPLICATION_FORM" as const,
    btnLabel: "Download Form",
    btnStyle: "bg-[#1e4620] hover:bg-[#2c5e2f] text-white cursor-pointer",
  },
];

export default function FranchiseDownloads() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState<"FORM" | "OTP">("FORM");
  const [formData, setFormData] = useState({ name: "", email: "", mobile: "" });
  const [otp, setOtp] = useState("");
  const [selectedResource, setSelectedResource] = useState<"BROCHURE" | "APPLICATION_FORM">("BROCHURE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleOpenModal = (resource: "BROCHURE" | "APPLICATION_FORM") => {
    setSelectedResource(resource);
    setFormData({ name: "", email: "", mobile: "" });
    setOtp("");
    setError("");
    setMessage("");
    setStep("FORM");
    setIsModalOpen(true);
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.mobile.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/franchise/request-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          resource: selectedResource,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to send OTP.");
      }

      setMessage(data.message || "OTP has been sent to your email.");
      setStep("OTP");
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/franchise/verify-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otp,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Verification failed.");
      }

      // Close modal
      setIsModalOpen(false);

      // Trigger download programmatically
      const link = document.createElement("a");
      link.href = data.downloadUrl;
      link.download = selectedResource === "BROCHURE" ? "Kiddos-Franchise-Brochure.pdf" : "Kiddos-Franchise-Application.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="downloads" className="relative bg-gradient-to-br from-[#1e4620] to-[#113113] dark:from-[#061410] dark:to-[#030907] py-24 pb-28 overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-20">

        {/* Heading */}
        <div className="text-center mb-12">
          <p className="text-[#f97316] text-xs font-bold tracking-widest uppercase mb-3">
            Resources
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
            Franchise Resources &amp; Downloads
          </h2>
          <p className="text-white/50 text-sm mt-3 max-w-md mx-auto">
            Get all the details about our business model, requirements, and
            application in one place.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {resources.map((r) => (
            <div
              key={r.title}
              className="bg-white dark:bg-zinc-900 rounded-3xl p-8 flex flex-col items-center text-center shadow-xl hover:shadow-2xl transition-shadow"
            >
              {/* Tag */}
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full mb-5 ${r.tagColor}`}>
                {r.tag}
              </span>

              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl ${r.iconBg} flex items-center justify-center mb-5`}>
                {r.icon}
              </div>

              <h3 className="text-lg font-extrabold text-gray-800 dark:text-zinc-100 mb-2">
                {r.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed mb-8 max-w-xs">
                {r.desc}
              </p>

              <button
                onClick={() => handleOpenModal(r.resourceType)}
                className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5 transition-all ${r.btnStyle}`}
              >
                <Download className="w-4 h-4" />
                {r.btnLabel}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Verification Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative overflow-hidden transition-all">
            
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Content */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                {selectedResource === "BROCHURE" ? "Download Franchise Brochure" : "Download Application Form"}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
                {step === "FORM"
                  ? "Please fill out your details to receive a download link."
                  : "We have sent a verification code to your email."}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-650 text-sm rounded-xl text-center">
                {error}
              </div>
            )}

            {message && step === "OTP" && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl text-center">
                {message}
              </div>
            )}

            {step === "FORM" ? (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-650 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e4620] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-650 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e4620] dark:text-white"
                  />
                </div>

              <div>
  <label className="block text-xs font-bold text-zinc-650 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
    Mobile Number
  </label>
  <input
    type="tel"
    required
    pattern="[0-9]{10}"
    maxLength={10}
    placeholder="Enter 10-digit mobile number"
    value={formData.mobile}
    onChange={(e) =>
      setFormData({
        ...formData,
        mobile: e.target.value.replace(/\D/g, "").slice(0, 10),
      })
    }
    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e4620] dark:text-white"
  />
</div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#1e4620] hover:bg-[#2c5e2f] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {loading ? "Sending OTP..." : "Request OTP"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-655 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                    Enter OTP Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-bold tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-[#1e4620] dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#1e4620] hover:bg-[#2c5e2f] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {loading ? "Verifying..." : "Verify & Download"}
                </button>

                <button
                  type="button"
                  onClick={() => setStep("FORM")}
                  className="w-full py-2 text-xs text-zinc-450 hover:text-zinc-600 dark:hover:text-zinc-350 transition-colors font-semibold"
                >
                  Back to Form
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
