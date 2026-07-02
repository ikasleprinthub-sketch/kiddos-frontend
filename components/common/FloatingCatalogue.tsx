import { Download } from "lucide-react";

export default function FloatingCatalogue() {
  return (
    <a
      href="/Catalogue/KiddosFoods-Catalog.pdf"
      download
      className="fixed bottom-24 right-6 z-50 flex items-center justify-center w-14 h-14 bg-brand-green rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
      aria-label="Download Catalogue"
    >
      <Download className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
      {/* Tooltip */}
      <span className="absolute right-16 px-3 py-1.5 text-xs font-semibold text-white bg-zinc-800 dark:bg-zinc-700 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
        Download Catalogue
      </span>
    </a>
  );
}
