"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Heart, Maximize2, Star, Check } from "lucide-react";
import type { ApiProduct } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { PRODUCTS as FALLBACK_PRODUCTS, type Product as LocalProduct } from "@/components/productsData";

type TabType = "best-seller" | "popular-batters" | "spices-oils";

const TAB_META = {
  "best-seller": {
    label: "Best Seller",
    title: "Best Sellers",
    subtitle: "Our most loved, high-quality products recommended for you",
  },
  "popular-batters": {
    label: "Popular Batters",
    title: "Popular Batters",
    subtitle: "Freshly stone-ground, naturally fermented batters",
  },
  "spices-oils": {
    label: "Spices & Oils",
    title: "Spices & Oils",
    subtitle: "Aromatic home-style spice mixes and wood-pressed pure oils",
  },
};

const FALLBACK_GRADIENTS = [
  "from-green-50 to-emerald-100",
  "from-amber-50 to-orange-100",
  "from-blue-50 to-sky-100",
  "from-rose-50 to-pink-100",
  "from-yellow-50 to-lime-100",
];

export default function ProductShowcase() {
  const [activeTab, setActiveTab] = useState<TabType>("best-seller");
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);

  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Load products for the active tab
  useEffect(() => {
    setLoading(true);
    let url = "";
    if (activeTab === "best-seller") {
      url = "/api/products?featured=true&limit=8";
    } else if (activeTab === "popular-batters") {
      url = "/api/products?popularBatter=true&limit=8";
    } else {
      url = "/api/products?spiceOil=true&limit=8";
    }

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const list: ApiProduct[] = Array.isArray(data) ? data : (data.products ?? []);
        const active = list.filter((p) => p.isActive);

        // Fallback if the database has no products for this criteria
        if (active.length === 0) {
          const localFiltered = getLocalFallbackProducts(activeTab);
          setProducts(localFiltered);
        } else {
          setProducts(active);
        }
      })
      .catch(() => {
        // Fallback on error
        setProducts(getLocalFallbackProducts(activeTab));
      })
      .finally(() => setLoading(false));
  }, [activeTab]);

  // Helper to map activeTab to components/productsData list
  const getLocalFallbackProducts = (tab: TabType): ApiProduct[] => {
    let list: LocalProduct[] = [];
    if (tab === "best-seller") {
      list = FALLBACK_PRODUCTS.filter((p) => p.isBestSeller).slice(0, 8);
    } else if (tab === "popular-batters") {
      list = FALLBACK_PRODUCTS.filter((p) => p.category === "batter").slice(0, 8);
    } else {
      list = FALLBACK_PRODUCTS.filter((p) => p.category === "spice-blends" || p.category === "oils").slice(0, 8);
    }

    // Convert local schema to ApiProduct schema
    return list.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: p.description,
      price: p.price,
      salePrice: p.originalPrice ? p.price : null,
      // If originalPrice is set, swap price/salePrice to match discount model
      stock: p.stock ?? 10,
      sku: `SKU-${p.id}`,
      categoryId: p.category,
      isActive: true,
      isFeatured: p.isBestSeller ?? false,
      weight: parseFloat(p.weightOrQty) || 1.0,
      unit: p.weightOrQty.replace(/[0-9.\s]/g, "") || "kg",
      tags: p.tags,
      createdAt: new Date().toISOString(),
      category: {
        id: p.category,
        name: p.categoryLabel,
        slug: p.category,
      },
      images: p.image ? [{ id: `${p.id}-img`, url: p.image, isPrimary: true }] : [],
    })) as unknown as ApiProduct[];
  };

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

  const toggleWishlist = (p: ApiProduct) => {
    const pId = p.id;
    // Map to LocalProduct structure for WishlistProvider compatibility
    const localProd = {
      id: p.id,
      name: p.name,
      category: p.category?.slug || "batter",
      categoryLabel: p.category?.name || "Batter",
      description: p.description || "",
      price: Number(p.price),
      originalPrice: p.salePrice ? Number(p.price) : undefined,
      rating: 4.8,
      reviewsCount: 120,
      emoji: "🫙",
      image: p.images?.[0]?.url,
      gradient: "from-amber-100 to-orange-200",
      isVeg: true,
      weightOrQty: p.weight ? `${Number(p.weight)} ${p.unit ?? "kg"}` : "",
      tags: p.tags,
      slug: p.slug,
    };

    if (isInWishlist(pId)) {
      removeFromWishlist(pId);
    } else {
      addToWishlist(localProd);
    }
  };

  return (
    <section className="bg-zinc-50/20 py-16 px-4 sm:px-6 lg:px-8 border-t border-zinc-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Title row (Centered) */}
        <div className="flex flex-col items-center text-center gap-2 mb-10">
          <span className="text-[#f97316] text-xs font-bold uppercase tracking-wider block">
            Our Products
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight leading-tight">
            Our <span className="text-[#ca8a04]">{TAB_META[activeTab].title}</span> Products
          </h2>
          <p className="text-xs text-zinc-500 mt-1 font-medium">
            {TAB_META[activeTab].subtitle}
          </p>
        </div>

        {/* Tabs pills (Centered) */}
        <div className="flex items-center justify-center gap-3 overflow-x-auto pb-4 mb-8 scrollbar-none w-full">
          {(Object.keys(TAB_META) as TabType[]).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-5 text-sm font-semibold rounded-full whitespace-nowrap cursor-pointer transition-all duration-200 ${
                  isActive
                    ? "bg-[#1e4620] text-white shadow-md"
                    : "bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-400 hover:text-zinc-800"
                }`}
              >
                {TAB_META[tab].label}
              </button>
            );
          })}
        </div>

        {/* Products Showcase Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white border border-zinc-100 rounded-[24px] p-5 h-[360px] animate-pulse">
                <div className="bg-zinc-100 rounded-[20px] aspect-square w-full mb-4 animate-pulse" />
                <div className="h-4 bg-zinc-100 rounded w-2/3 mb-2" />
                <div className="h-5 bg-zinc-100 rounded w-full mb-4" />
                <div className="h-6 bg-zinc-100 rounded w-1/2 mt-auto" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((p, idx) => {
              const finalPrice = p.salePrice ? Number(p.salePrice) : Number(p.price);
              const crossedPrice = p.salePrice ? Number(p.price) : null;

              const discount = crossedPrice
                ? Math.round(((crossedPrice - finalPrice) / crossedPrice) * 100)
                : null;

              const image = p.images?.[0]?.url;
              const isAddedToWishlist = isInWishlist(p.id);
              const isAdding = addingId === p.id;
              
              const mockRating = (4.7 + (idx % 4) * 0.1).toFixed(1);

              return (
                <div
                  key={p.id}
                  className="relative bg-white dark:bg-zinc-900 rounded-[24px] border border-zinc-100 dark:border-zinc-800/80 p-5 shadow-[0_4px_25px_rgba(0,0,0,0.015)] dark:shadow-[0_4px_25px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_12px_35px_rgba(0,0,0,0.5)] hover:-translate-y-1.5 transition-all duration-300 group flex flex-col"
                >
                  {/* Image container */}
                  <div className="relative overflow-hidden rounded-[20px] bg-zinc-50 dark:bg-zinc-850 aspect-square flex items-center justify-center mb-5 border border-zinc-100/50 dark:border-zinc-800/50">
                    <Link href={`/products/${p.slug}`} className="w-full h-full flex items-center justify-center">
                      {image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={image}
                          alt={p.name}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-zinc-50 to-zinc-100 text-5xl font-black text-zinc-200 select-none">
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </Link>

                    {/* Discount badge */}
                    {discount && discount > 0 && (
                      <span className="absolute top-4 left-4 bg-[#1e4620] text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow-sm">
                        {discount}% off
                      </span>
                    )}

                    {/* Floating Actions on Hover */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-350">
                      {/* Wishlist */}
                      <button
                        onClick={() => toggleWishlist(p)}
                        className={`w-8.5 h-8.5 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center shadow-md cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200 ${
                          isAddedToWishlist
                            ? "text-red-500 fill-red-500"
                            : "text-zinc-650 hover:text-red-500 dark:text-zinc-300"
                        }`}
                        aria-label={isAddedToWishlist ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        <Heart className="w-4 h-4" />
                      </button>

                      {/* Zoom link */}
                      <Link
                        href={`/products/${p.slug}`}
                        className="w-8.5 h-8.5 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center shadow-md text-zinc-650 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200"
                        aria-label="View Details"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </Link>

                      {/* Add to Cart */}
                      <button
                        onClick={() => handleAddToCart(p, idx)}
                        disabled={isAdding}
                        className={`w-8.5 h-8.5 rounded-full flex items-center justify-center shadow-md cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200 ${
                          isAdding
                            ? "bg-[#1e4620] text-white"
                            : "bg-white dark:bg-zinc-800 text-zinc-650 dark:text-zinc-300 hover:text-emerald-700"
                        }`}
                        aria-label="Add to cart"
                      >
                        {isAdding ? (
                          <Check className="w-4 h-4 stroke-[2.5px]" />
                        ) : (
                          <ShoppingBag className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Rating / Category Row */}
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                      {p.category?.name || "Batter"}
                    </span>
                    <div className="flex items-center gap-1 text-zinc-800 dark:text-zinc-200 font-bold">
                      <Star className="w-3.5 h-3.5 fill-[#fbbf24] text-[#fbbf24]" />
                      {mockRating}
                    </div>
                  </div>

                  {/* Title */}
                  <Link href={`/products/${p.slug}`}>
                    <h3 className="text-base font-bold text-zinc-850 dark:text-zinc-100 hover:text-[#2a7a2a] transition-colors leading-tight line-clamp-1">
                      {p.name}
                    </h3>
                  </Link>

                  {/* Weight label */}
                  {p.weight && (
                    <span className="text-[11px] text-zinc-400 mt-1 block font-medium">
                      Pack: {Number(p.weight)} {p.unit ?? "kg"}
                    </span>
                  )}

                  {/* Prices row */}
                  <div className="mt-auto flex items-center gap-2.5 pt-4 border-t border-zinc-100/60 dark:border-zinc-800/60">
                    <span className="text-lg font-extrabold text-[#1e4620] dark:text-[#f97316]">
                      ₹{finalPrice.toFixed(2)}
                    </span>
                    {crossedPrice && (
                      <span className="text-sm text-zinc-400 dark:text-zinc-500 line-through">
                        ₹{crossedPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View All centered at bottom */}
        <div className="flex justify-center mt-12">
          <Link
            href="/products"
            className="bg-[#1e4620] hover:bg-[#2a7a2a] text-white text-xs sm:text-sm font-bold py-3 px-8 rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
