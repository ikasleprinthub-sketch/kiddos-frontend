"use client";

import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/components/productsData";
import type { ApiProduct } from "@/lib/api";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Pagination from "@mui/material/Pagination";
import { Heart, ShoppingBag, Trash2, ArrowLeft } from "lucide-react";

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addItem } = useCart();
  const [currentProducts, setCurrentProducts] = useState<Map<string, ApiProduct>>(new Map());

  useEffect(() => {
    let cancelled = false;

    async function refreshWishlistProducts() {
      try {
        const firstResponse = await fetch("/api/products?limit=200");
        if (!firstResponse.ok) throw new Error("Unable to refresh wishlist products");

        const firstPage = await firstResponse.json();
        let products: ApiProduct[] = Array.isArray(firstPage) ? firstPage : (firstPage.products ?? []);
        const totalPages: number = Array.isArray(firstPage) ? 1 : (firstPage.pages ?? 1);

        for (let pageNumber = 2; pageNumber <= totalPages; pageNumber++) {
          const response = await fetch(`/api/products?limit=200&page=${pageNumber}`);
          if (!response.ok) throw new Error("Unable to refresh wishlist products");
          const pageData = await response.json();
          products = products.concat(pageData.products ?? []);
        }

        if (!cancelled) {
          setCurrentProducts(new Map(products.map((product) => [String(product.id), product])));
        }
      } catch {
        // Keep the saved wishlist snapshot when live product data is unavailable.
      }
    }

    refreshWishlistProducts();
    return () => { cancelled = true; };
  }, []);

  const currentItems = useMemo(() => items.map((item): Product => {
    const current = currentProducts.get(String(item.id));
    if (!current) return item;

    const mrp = Number(current.price);
    const salePrice = current.salePrice == null ? null : Number(current.salePrice);
    const hasSale = salePrice != null && salePrice < mrp;

    return {
      ...item,
      price: hasSale ? salePrice : mrp,
      originalPrice: hasSale ? mrp : undefined,
    };
  }), [items, currentProducts]);

  const itemsPerPage = 25;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(currentItems.length / itemsPerPage));
  const safePage = Math.min(page, totalPages); // removing items can shrink the last page
  const pageItems = currentItems.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);

  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#061410] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-950/40 text-red-500 flex items-center justify-center rounded-2xl shadow-sm">
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">My Wishlist</h1>
              <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                {items.length} {items.length === 1 ? "item" : "items"} saved
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/products"
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
            {items.length > 0 && (
              <button
                onClick={clearWishlist}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-900/50 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-24 h-24 bg-red-50 dark:bg-red-950/20 text-red-200 dark:text-red-900/50 rounded-full flex items-center justify-center mb-6">
              <Heart className="w-12 h-12" />
            </div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mb-8">
              Save your favorite traditional foods and snacks here so you can easily find them later and add them to your cart.
            </p>
            <Link
              href="/products"
              className="px-8 py-3 bg-brand-green text-white dark:bg-brand-gold dark:text-brand-green font-bold rounded-xl shadow-md hover:-translate-y-0.5 transition-all"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {pageItems.map((product) => (
              <article
                key={product.id}
                className="group bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200/60 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col min-w-0"
              >
                {/* Image Area */}
                <Link href={`/products/${product.slug || product.id}`} className="relative block overflow-hidden shrink-0" style={{ aspectRatio: "4/3" }}>
                  {product.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.image}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient} flex items-center justify-center`}>
                      <span className="text-6xl select-none group-hover:scale-110 transition-transform duration-500">
                        {product.emoji}
                      </span>
                    </div>
                  )}

                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 bg-red-500 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                    </span>
                  )}

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      removeFromWishlist(product.id);
                    }}
                    className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 p-2 bg-white/90 dark:bg-zinc-800/90 text-zinc-400 hover:text-red-500 hover:bg-white rounded-full backdrop-blur-sm shadow-sm transition-all"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </Link>

                {/* Content */}
                <div className="p-3 sm:p-5 flex-1 flex flex-col">
                  <span className="text-[10px] font-bold text-brand-green dark:text-brand-gold uppercase tracking-widest mb-1.5">
                    {product.categoryLabel}
                  </span>
                  <Link href={`/products/${product.slug || product.id}`}>
                    <h3 className="text-sm sm:text-base font-black text-zinc-800 dark:text-zinc-100 group-hover:text-brand-green dark:group-hover:text-brand-gold transition-colors line-clamp-1 mb-2">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex flex-wrap items-end gap-x-2 mb-4 mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <span className="text-lg sm:text-xl font-black text-brand-green dark:text-brand-gold">
                      ₹{product.price}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm font-bold text-zinc-400 dark:text-zinc-500 line-through mb-0.5">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      addItem({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        originalPrice: product.originalPrice,
                        image: product.image,
                        emoji: product.emoji,
                        gradient: product.gradient,
                        weightOrQty: product.weightOrQty,
                        slug: product.slug || product.id,
                        productId: ""
                      });
                      removeFromWishlist(product.id);
                    }}
                    className="w-full py-2.5 sm:py-3 bg-brand-green hover:bg-brand-green-light dark:bg-brand-gold dark:hover:bg-brand-gold-light text-white dark:text-brand-green rounded-xl font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Move to Cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {items.length > itemsPerPage && (
          <div className="flex justify-center mt-10">
            <Pagination
              count={totalPages}
              page={safePage}
              onChange={(_, value) => {
                setPage(value);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              shape="rounded"
              size="large"
              sx={{
                "& .Mui-selected": {
                  backgroundColor: "#2C4A3B !important",
                  color: "#ffffff !important",
                  "&:hover": { backgroundColor: "#1f352a !important" },
                },
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
