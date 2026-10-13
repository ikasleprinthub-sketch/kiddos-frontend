import { Download } from "lucide-react";

export default function FloatingCatalogue() {
  return (
    <a
      href="/Catalogue/KiddosFoods-Catalog.pdf"
      download
      className="group fixed bottom-[4.5rem] right-4 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-brand-green shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl sm:bottom-20 sm:right-5 sm:h-12 sm:w-12"
      aria-label="Download Catalogue"
    >
      <Download className="h-5 w-5 text-white transition-transform duration-300 group-hover:scale-110" />
      {/* Tooltip */}
      <span className="pointer-events-none absolute right-14 whitespace-nowrap rounded bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-md transition-opacity duration-300 group-hover:opacity-100 dark:bg-zinc-700">
        Download Catalogue
      </span>
    </a>
  );
}
