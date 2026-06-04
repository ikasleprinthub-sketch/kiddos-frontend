"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Check } from "lucide-react";
import type { ApiProduct } from "@/lib/api";
import { useCart } from "@/context/CartContext";

const FALLBACK_GRADIENTS = [
  "from-green-50 to-emerald-100",
  "from-amber-50 to-orange-100",
  "from-blue-50 to-sky-100",
  "from-rose-50 to-pink-100",
  "from-yellow-50 to-lime-100",
];

export default function FeaturedProducts() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    fetch("/api/products?featured=true&limit=20")
      .then((r) => r.json())
      .then((data) => {
        const list: ApiProduct[] = Array.isArray(data) ? data : (data.products ?? []);
        const active = list.filter((p) => p.isActive);
        // If no featured products, fall back to first 20 active products
        if (active.length === 0) {
          return fetch("/api/products?limit=20")
            .then((r) => r.json())
            .then((d) => {
              const all: ApiProduct[] = Array.isArray(d) ? d : (d.products ?? []);
              setProducts(all.filter((p) => p.isActive));
            });
        }
        setProducts(active);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = (p: ApiProduct, idx: number) => {
    setAddingId(p.id);
    const price = Number(p.salePrice ?? p.price);
    const originalPrice = p.salePrice ? Number(p.price) : undefined;
    addItem({
      id: p.id,
      name: p.name,
      price,
      originalPrice,
      image: p.images?.[0]?.url,
      emoji: "🛒",
      gradient: FALLBACK_GRADIENTS[idx % FALLBACK_GRADIENTS.length],
      weightOrQty: p.weight ? `${Number(p.weight)} ${p.unit ?? "kg"}` : (p.unit ?? ""),
      slug: p.slug,
    });
    setTimeout(() => setAddingId(null), 1500);
  };

  if (loading) {
    return (
      <section className="bg-gray-50 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="h-7 w-44 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex-1 min-w-[230px] bg-white rounded-3xl h-64 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header row */}
        <div className="mb-8 pb-4 border-b border-zinc-100">
          <h2 className="text-[#2a7a2a] font-black text-2xl tracking-tight">Best Seller</h2>
          <p className="text-xs text-zinc-500 mt-1">Our most loved, high-quality products recommended for you</p>
        </div>

        {/* Scrollable product cards row */}
        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-none sm:justify-center snap-x snap-mandatory scroll-pl-4">
          {products.map((p, idx) => {
            const price = Number(p.salePrice ?? p.price);
            const originalPrice = p.salePrice ? Number(p.price) : null;
            const discount = originalPrice
              ? Math.round(((originalPrice - price) / originalPrice) * 100)
              : null;
            const image = p.images?.[0]?.url;
            const isAdding = addingId === p.id;
            const weightLabel = p.weight
              ? `${Number(p.weight)} ${p.unit ?? "kg"}`
              : p.unit ?? null;

            return (
              <div
                key={p.id}
                className="bg-white rounded-3xl shadow-sm border border-zinc-100/80 p-5 flex flex-col min-w-[200px] w-[200px] sm:min-w-[230px] sm:w-[230px] shrink-0 snap-start hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                {/* Image area */}
                <div className="relative mb-4 overflow-hidden rounded-2xl bg-zinc-50 border border-zinc-100/50">
                  <Link href={`/products/${p.slug}`}>
                    <div className="w-full h-40 flex items-center justify-center overflow-hidden transition-transform duration-500 group-hover:scale-105">
                      {image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={image}
                          alt={p.name}
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-zinc-50 to-zinc-100 text-5xl font-black text-zinc-200 select-none">
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </Link>
                  {discount && discount > 0 && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                      -{discount}% OFF
                    </span>
                  )}
                </div>

                {/* Category badge */}
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 w-fit mb-2">
                  {p.category.name}
                </span>

                {/* Product name */}
                <Link href={`/products/${p.slug}`}>
                  <h3 className="text-sm font-bold text-zinc-800 line-clamp-2 leading-snug mb-1 hover:text-[#2a7a2a] transition-colors">
                    {p.name}
                  </h3>
                </Link>

                {/* Weight / unit */}
                {weightLabel ? (
                  <p className="text-xs text-zinc-400 mb-4">Pack: {weightLabel}</p>
                ) : (
                  <div className="h-4 mb-4" />
                )}

                {/* Price + cart button */}
                <div className="mt-auto flex items-center justify-between gap-2 pt-2 border-t border-zinc-100">
                  <div className="flex flex-col leading-tight">
                    <span className="text-base font-extrabold text-[#2a7a2a]">
                      ₹{price.toFixed(2)}
                    </span>
                    {originalPrice && (
                      <span className="text-[11px] text-zinc-400 line-through">
                        ₹{originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleAddToCart(p, idx)}
                    disabled={isAdding}
                    aria-label="Add to cart"
                    className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isAdding
                        ? "bg-[#2a7a2a] text-white scale-95"
                        : "bg-[#2a7a2a]/10 text-[#2a7a2a] hover:bg-[#2a7a2a] hover:text-white active:scale-95"
                    }`}
                  >
                    {isAdding ? (
                      <Check className="w-4 h-4 stroke-[2.5px]" />
                    ) : (
                      <ShoppingCart className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
