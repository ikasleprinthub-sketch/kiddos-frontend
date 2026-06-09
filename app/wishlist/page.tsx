"use client";

import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2, ArrowLeft } from "lucide-react";

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addItem } = useCart();

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((product) => (
              <article
                key={product.id}
                className="group bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200/60 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
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

                  {product.originalPrice && (
                    <span className="absolute top-3 left-3 z-10 bg-red-500 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow">
                      Sale
                    </span>
                  )}

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      removeFromWishlist(product.id);
                    }}
                    className="absolute top-3 right-3 z-10 p-2 bg-white/90 dark:bg-zinc-800/90 text-zinc-400 hover:text-red-500 hover:bg-white rounded-full backdrop-blur-sm shadow-sm transition-all"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </Link>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <span className="text-[10px] font-bold text-brand-green dark:text-brand-gold uppercase tracking-widest mb-1.5">
                    {product.categoryLabel}
                  </span>
                  <Link href={`/products/${product.slug || product.id}`}>
                    <h3 className="text-base font-black text-zinc-800 dark:text-zinc-100 group-hover:text-brand-green dark:group-hover:text-brand-gold transition-colors line-clamp-1 mb-2">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-end gap-2 mb-4 mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <span className="text-xl font-black text-brand-green dark:text-brand-gold">
                      ₹{product.price}
                    </span>
                    {product.originalPrice && (
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
                    className="w-full py-3 bg-brand-green hover:bg-brand-green-light dark:bg-brand-gold dark:hover:bg-brand-gold-light text-white dark:text-brand-green rounded-xl font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Move to Cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
