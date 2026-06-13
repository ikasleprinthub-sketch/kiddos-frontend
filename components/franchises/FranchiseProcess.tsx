"use client";

import { ClipboardList, Users, FileCheck, GraduationCap, Rocket } from "lucide-react";

const steps = [
  {
    label: "Enquiry",
    desc: "Submit your details",
    icon: <ClipboardList className="w-9 h-9 stroke-[#2a7a2a]" />,
  },
  {
    label: "Discussion",
    desc: "We connect with you",
    icon: <Users className="w-9 h-9  stroke-[#2a7a2a]" />,
  },
  {
    label: "Agreement",
    desc: "Sign the agreement",
    icon: <FileCheck className="w-9 h-9 stroke-[#2a7a2a]" />,
  },
  {
    label: "Training",
    desc: "Product & business training",
    icon: <GraduationCap className="w-9 h-9 stroke-[#2a7a2a]" />,
  },
  {
    label: "Launch",
    desc: "Start your business",
    icon: <Rocket className="w-9 h-9 stroke-[#2a7a2a]" />,
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
              <div className="flex flex-col items-center text-center w-28 sm:w-32 group cursor-pointer transition-all duration-300">
                {/* Circle icon */}
                <div className="w-20 h-20 rounded-full border-2 border-[#2a7a2a]/30 bg-[#f0fdf4] flex items-center justify-center shadow-sm group-hover:border-[#2a7a2a] group-hover:bg-[#dcfce7] group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                  <div className="group-hover:scale-125 transition-transform duration-300">
                    {step.icon}
                  </div>
                </div>
                {/* Label */}
                <p className="mt-3 text-sm font-bold text-[#1a2e1a] group-hover:text-[#1e4620] transition-colors duration-300">{step.label}</p>
                {/* Description */}
                <p className="text-[11px] text-zinc-400 mt-0.5 leading-tight px-1 group-hover:text-zinc-600 transition-colors duration-300">{step.desc}</p>
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
