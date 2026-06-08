const steps = [
  {
    label: "Enquiry",
    desc: "Submit your details",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9" stroke="#2a7a2a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="10" y="6" width="24" height="30" rx="3" />
        <line x1="15" y1="14" x2="28" y2="14" />
        <line x1="15" y1="19" x2="28" y2="19" />
        <line x1="15" y1="24" x2="22" y2="24" />
        <circle cx="33" cy="33" r="7" />
        <line x1="38.5" y1="38.5" x2="42" y2="42" />
      </svg>
    ),
  },
  {
    label: "Discussion",
    desc: "We connect with you",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9" stroke="#2a7a2a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="16" r="6" />
        <path d="M6 38c0-7 6-11 12-11s12 4 12 11" />
        <path d="M30 14c2 0 6 1.5 6 6" />
        <path d="M36 38c0-5-3-8.5-6-10" />
        <path d="M28 28l4 2 4-5" stroke="#2a7a2a" strokeWidth="2.2" />
      </svg>
    ),
  },
  {
    label: "Agreement",
    desc: "Sign the agreement",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9" stroke="#2a7a2a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="10" y="6" width="24" height="32" rx="3" />
        <line x1="15" y1="14" x2="28" y2="14" />
        <line x1="15" y1="20" x2="28" y2="20" />
        <line x1="15" y1="26" x2="22" y2="26" />
        <path d="M22 32 l4-4 8-8 3 3-8 8-4 4-4 1z" strokeWidth="1.8" />
        <line x1="30" y1="22" x2="33" y2="25" />
      </svg>
    ),
  },
  {
    label: "Training",
    desc: "Product & business training",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9" stroke="#2a7a2a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="24" cy="13" r="5" />
        <path d="M12 42v-6c0-5 5-8 12-8s12 3 12 8v6" />
        <path d="M8 20l16-8 16 8-16 6z" strokeWidth="1.8" />
        <line x1="8" y1="20" x2="8" y2="30" />
        <circle cx="8" cy="32" r="2" fill="#2a7a2a" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Launch",
    desc: "Start your business",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9" stroke="#2a7a2a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 6c0 0 10 4 14 16H10C14 10 24 6 24 6z" />
        <line x1="24" y1="6" x2="24" y2="30" />
        <ellipse cx="24" cy="36" rx="8" ry="4" />
        <path d="M10 22c-3 2-5 5-5 8l5-2" />
        <path d="M38 22c3 2 5 5 5 8l-5-2" />
      </svg>
    ),
  },
];

export default function FranchiseProcess() {
  return (
    <section className="bg-white py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-[#1a2e1a] font-black text-2xl sm:text-3xl tracking-tight">
            Franchise Process
          </h2>
          <p className="text-zinc-400 text-sm mt-2">Simple steps to start your business with us</p>
        </div>

        {/* Steps row */}
        <div className="flex items-start justify-center gap-0 flex-wrap sm:flex-nowrap">
          {steps.map((step, idx) => (
            <div key={step.label} className="flex items-start">
              {/* Step card */}
              <div className="flex flex-col items-center text-center w-28 sm:w-32">
                {/* Circle icon */}
                <div className="w-20 h-20 rounded-full border-2 border-[#2a7a2a]/30 bg-[#f0fdf4] flex items-center justify-center shadow-sm">
                  {step.icon}
                </div>
                {/* Label */}
                <p className="mt-3 text-sm font-bold text-[#1a2e1a]">{step.label}</p>
                {/* Description */}
                <p className="text-[11px] text-zinc-400 mt-0.5 leading-tight px-1">{step.desc}</p>
              </div>

              {/* Arrow between steps */}
              {idx < steps.length - 1 && (
                <div className="flex items-center mt-9 mx-1 sm:mx-2 shrink-0 text-[#2a7a2a]/50">
                  <svg width="28" height="16" viewBox="0 0 28 16" fill="none">
                    <path d="M2 8h22M18 3l6 5-6 5" stroke="#2a7a2a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
