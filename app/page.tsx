import HeroSection from "@/components/HeroSection";
import HotCategories from "@/components/HotCategories";
import AboutSection from "@/components/AboutSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import PopularBatters from "@/components/PopularBatters";
import SpicesOils from "@/components/SpicesOils";

export default function Home() {
  return (
    <div className="w-full flex flex-col min-h-screen">
      <HeroSection />
      <HotCategories />
      <AboutSection />
      <FeaturedProducts />
      <PopularBatters />
      <SpicesOils />
    </div>
  );
}

// import Image from "next/image";

// export default function Home() {
//   return (
//     /*
//      * Fixed full-screen overlay — sits above header/footer (z-[9999])
//      * so the site shows ONLY this maintenance page to visitors.
//      */
//     <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-[#1e4620]">

//       {/* ── Background decorative circles ── */}
//       <div className="pointer-events-none absolute inset-0 overflow-hidden">
//         <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/[0.03]" />
//         <div className="absolute -bottom-48 -left-48 w-[32rem] h-[32rem] rounded-full bg-white/[0.03]" />
//         <div className="absolute top-1/3 -left-16 w-48 h-48 rounded-full bg-[#f97316]/[0.06]" />
//         <div className="absolute bottom-1/4 -right-16 w-64 h-64 rounded-full bg-[#f97316]/[0.04]" />
//         {/* Subtle diagonal stripe */}
//         <div className="absolute inset-0 opacity-[0.015]"
//           style={{
//             backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
//             backgroundSize: "24px 24px",
//           }}
//         />
//       </div>

//       {/* ── Main card ── */}
//       <div className="relative z-10 flex flex-col items-center text-center px-6 py-10 w-full max-w-md">

//         {/* Logo */}
//         <div className="mb-6">
//           <Image
//             src="/logo.svg"
//             alt="Kiddos Foods Logo"
//             width={110}
//             height={110}
//             priority
//             className="drop-shadow-xl brightness-110"
//           />
//         </div>

//         {/* Animated gear icon */}
//         <div className="relative mb-8">
//           {/* Pulsing outer ring */}
//           <div className="absolute inset-0 rounded-full border-2 border-[#f97316]/30 animate-ping" />
//           {/* Inner circle */}
//           <div className="relative w-24 h-24 rounded-full bg-[#f97316]/[0.12] border border-[#f97316]/20 flex items-center justify-center">
//             <svg
//               className="w-11 h-11 text-[#f97316] animate-spin"
//               style={{ animationDuration: "9s" }}
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="1.5"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <circle cx="12" cy="12" r="3" />
//               <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
//             </svg>
//           </div>
//         </div>

//         {/* Headline */}
//         <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-3">
//           We&rsquo;re Under
//           <br />
//           <span className="text-[#f97316]">Maintenance</span>
//         </h1>

//         {/* Sub-headline */}
//         <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-8 max-w-xs">
//           We&rsquo;re spicing things up! Our team is cooking something
//           amazing. We&rsquo;ll be back shortly with a fresh experience.
//         </p>

//         {/* Contact pills */}
//         <div className="flex flex-col sm:flex-row gap-3 mb-6 w-full">
//           <a
//             href="tel:+917845945455"
//             className="flex items-center justify-center gap-2 flex-1 px-4 py-3 rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 text-white text-sm font-medium transition-colors"
//           >
//             <svg className="w-4 h-4 shrink-0 fill-none stroke-[#f97316] stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
//               <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
//             </svg>
//             +91 78459 45455
//           </a>
//           <a
//             href="mailto:care@kiddosfoods.com"
//             className="flex items-center justify-center gap-2 flex-1 px-4 py-3 rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 text-white text-sm font-medium transition-colors"
//           >
//             <svg className="w-4 h-4 shrink-0 fill-none stroke-[#f97316] stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
//               <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
//               <polyline points="22,6 12,13 2,6" />
//             </svg>
//             care@kiddosfoods.com
//           </a>
//         </div>

//         {/* WhatsApp CTA */}
//         <a
//           href="https://wa.me/917845945455"
//           target="_blank"
//           rel="noopener noreferrer"
//           className="inline-flex items-center gap-3 px-8 py-3.5 bg-[#f97316] hover:bg-[#fb923c] text-white font-bold text-base rounded-full shadow-lg shadow-[#f97316]/20 transition-all hover:scale-105 active:scale-95 mb-8"
//         >
//           <svg className="w-5 h-5 fill-white shrink-0" viewBox="0 0 24 24">
//             <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
//           </svg>
//           Chat on WhatsApp
//         </a>

//         {/* Social icons */}
//         <div className="flex items-center gap-3 mb-8">
//           {/* Facebook */}
//           <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
//             className="w-10 h-10 rounded-full bg-white/[0.08] hover:bg-white/[0.16] border border-white/10 flex items-center justify-center transition-colors">
//             <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
//               <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
//             </svg>
//           </a>
//           {/* YouTube */}
//           <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube"
//             className="w-10 h-10 rounded-full bg-white/[0.08] hover:bg-white/[0.16] border border-white/10 flex items-center justify-center transition-colors">
//             <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
//               <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
//               <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#1e4620" />
//             </svg>
//           </a>
//           {/* Instagram */}
//           <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
//             className="w-10 h-10 rounded-full bg-white/[0.08] hover:bg-white/[0.16] border border-white/10 flex items-center justify-center transition-colors">
//             <svg className="w-4 h-4 fill-none stroke-white stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
//               <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
//               <circle cx="12" cy="12" r="4" />
//               <circle cx="17.5" cy="6.5" r="0.5" fill="white" stroke="none" />
//             </svg>
//           </a>
//         </div>

//         {/* Copyright */}
//         <p className="text-white/25 text-xs">
//           © 2026 Kiddos Foods · All rights reserved
//         </p>
//       </div>
//     </div>
//   );
// }
