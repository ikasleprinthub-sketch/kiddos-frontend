"use client";

import { useState } from "react";
import { Download, FileText, X } from "lucide-react";

const resources = [
  {
    icon: (
      <svg className="w-8 h-8 text-[#f05252]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.363 8.68c-.086 0-.17.007-.251.023-.74.15-1.716.858-2.453 2.025l-.105.166-.214.368-.13.226c-1.127.653-2.617 1.637-3.238 2.502-.676.942-.716 1.761-.137 2.18.35.253.864.296 1.488.125 1.135-.312 2.656-1.745 3.978-3.486l.22-.29c.773-.393 1.576-.732 2.378-.992.932-.303 1.733-.518 2.373-.645.748.91 1.603 1.63 2.32 1.956.402.183.82.26 1.206.223.518-.05.81-.322.868-.813.064-.539-.333-1.189-1.258-2.036-.575-.526-1.428-.971-2.455-1.28l-.348-.103c-.22-.686-.42-1.448-.592-2.22-.446-2.008-.66-3.755-.494-4.52.12-.555.058-.946-.201-1.198-.242-.236-.615-.316-1.047-.226-.531.111-.849.537-.927 1.233-.122 1.096.3 3.012.986 5.093l.115.344c-.218.472-.442.946-.665 1.42-.51 1.082-.99 2.09-1.4 2.87zm.797-5.06c.038-.344.153-.487.26-.51.036-.008.082-.008.136.03.048.034.12.18.067.525-.098.64-.326 2.05-.694 3.73l-.048-.15c-.47-1.455-.83-2.738.279-3.625zm-6.273 13.914c.241-.453.977-1.17 2.115-1.854-.698 1.026-1.485 1.764-2.115 1.854zm10.741-6.195c.57.172 1.077.41 1.439.696-.06.026-.145.034-.236.027-.336-.027-.8-.444-1.203-.723zm-5.495 2.138c.32-.593.714-1.393 1.094-2.26.155.679.336 1.347.529 1.956a16.892 16.892 0 0 1-1.623.304z" />
      </svg>
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
