"use client";

import { Download, FileText } from "lucide-react";

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
    href: "/Brochures/explorefranchise.pdf",
    fileName: "Kiddos-Franchise-Brochure.pdf",
    btnLabel: "Download Brochure",
    btnStyle: "bg-[#f05252] hover:bg-[#e53e3e] text-white",
  },
  {
    icon: <FileText className="w-8 h-8 text-[#4285F4]" />,
    iconBg: "bg-blue-50 dark:bg-blue-950/30",
    tag: "Application Form",
    tagColor: "text-[#4285F4] bg-blue-50 dark:bg-blue-950/30",
    title: "Franchise Application Form",
    desc: "Prefer offline? Download the official form, fill the required details, and send it back to our franchise team.",
    href: "/Franchiseform/franchise-form.pdf",
    fileName: "Kiddos-Franchise-Application.pdf",
    btnLabel: "Download Form",
    btnStyle: "bg-[#1e4620] hover:bg-[#2c5e2f] text-white",
  },
];

export default function FranchiseDownloads() {
  return (
    <section id="downloads" className="relative bg-gradient-to-br from-[#1e4620] to-[#113113] dark:from-[#061410] dark:to-[#030907] py-24 pb-28 overflow-hidden">
      
      {/* Top Wave Separator flowing from white into green
      <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none pointer-events-none z-10 transform rotate-180">
        <svg className="relative block w-full h-[35px] text-white dark:text-zinc-900 fill-current" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,1,321.39,56.44Z"></path>
        </svg>
      </div> */}

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

              <a
                href={r.href}
                download={r.fileName}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5 transition-all ${r.btnStyle}`}
              >
                <Download className="w-4 h-4" />
                {r.btnLabel}
              </a>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom Wave Separator flowing from green into off-white
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none pointer-events-none z-10">
        <svg className="relative block w-full h-[35px] text-[#faf8f5] dark:text-[#061410] fill-current" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,1,321.39,56.44Z"></path>
        </svg>
      </div> */}
    </section>
  );
}
