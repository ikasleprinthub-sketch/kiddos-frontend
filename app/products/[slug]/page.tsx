"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ShoppingBag,
  Check,
  Star,
  Shield,
  Truck,
  RefreshCcw,
  Package,
  Tag,
  Minus,
  Plus,
} from "lucide-react";
import type { ApiProduct } from "@/lib/api";
import { useCart } from "@/context/CartContext";

const CATEGORY_EMOJIS: Record<string, string> = {
  batters: "🫙", batter: "🫙",
  "spice-blends": "🌶️", "organic-spices": "🌶️", spices: "🌶️",
  "raw-spices": "🌿",
  oils: "🫒",
  pickles: "🥒",
  "chutney-book": "📖",
  millets: "🌾",
  rice: "🍚",
  ghee: "🧈",
  honey: "🍯",
  "healthy-snacks": "🥜", snacks: "🥜",
  masala: "✨",
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  batters: "from-amber-100 to-orange-200", batter: "from-amber-100 to-orange-200",
  "spice-blends": "from-red-100 to-rose-200", "organic-spices": "from-red-100 to-rose-200",
  "raw-spices": "from-green-100 to-emerald-200",
  oils: "from-yellow-100 to-lime-200",
  pickles: "from-teal-100 to-green-200",
  "chutney-book": "from-orange-100 to-amber-200",
  millets: "from-yellow-50 to-yellow-200",
  rice: "from-sky-100 to-blue-200",
  ghee: "from-amber-50 to-yellow-200",
  honey: "from-orange-100 to-yellow-300",
  "healthy-snacks": "from-stone-100 to-amber-200", snacks: "from-stone-100 to-amber-200",
  masala: "from-purple-100 to-pink-200",
};

const FALLBACK_EMOJIS = ["🫙", "🌶️", "🌿", "🫒", "🥒", "📖", "🌾", "🍚", "🧈", "🍯", "🥜", "✨"];
const FALLBACK_GRADIENTS = ["from-amber-100 to-orange-200", "from-red-100 to-rose-200", "from-green-100 to-emerald-200", "from-yellow-100 to-lime-200"];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { addItem } = useCart();

  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/products/${slug}`)
      .then((r) => {
        if (r.status === 404) { setNotFound(true); return null; }
        return r.json();
      })
      .then((data) => {
        if (data) setProduct(data.product ?? data);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    const catSlug = product.category?.slug ?? "";
    const emoji = CATEGORY_EMOJIS[catSlug] ?? FALLBACK_EMOJIS[0];
    const gradient = CATEGORY_GRADIENTS[catSlug] ?? FALLBACK_GRADIENTS[0];
    const price = Number(product.salePrice ?? product.price);
    const originalPrice = product.salePrice ? Number(product.price) : undefined;
    const primaryImage = product.images?.find((i) => i.isPrimary)?.url ?? product.images?.[0]?.url;
    const weight = product.weight ? `${Number(product.weight)} ${product.unit ?? "kg"}` : (product.unit ?? "");

    for (let i = 0; i < qty; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price,
        originalPrice,
        image: primaryImage,
        emoji,
        gradient,
        weightOrQty: weight,
        slug: product.slug,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] dark:bg-[#061410] py-10 px-4">
        <div className="max-w-5xl mx-auto animate-pulse space-y-8">
          <div className="h-6 w-40 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="aspect-square rounded-3xl bg-zinc-200 dark:bg-zinc-800" />
            <div className="space-y-5 pt-4">
              <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
              <div className="h-8 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
              <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-800 rounded" />
              <div className="h-4 w-5/6 bg-zinc-100 dark:bg-zinc-800 rounded" />
              <div className="h-12 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
              <div className="h-14 w-full bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen bg-[#faf8f5] dark:bg-[#061410] flex flex-col items-center justify-center gap-5 px-4">
        <span className="text-6xl">🍽️</span>
        <h1 className="text-2xl font-black text-zinc-800 dark:text-zinc-100">Product Not Found</h1>
        <p className="text-zinc-500 text-sm">This item may have been removed or the link is incorrect.</p>
        <Link href="/products" className="mt-2 px-6 py-3 rounded-2xl bg-brand-green text-white dark:bg-brand-gold dark:text-brand-green text-sm font-bold shadow-md hover:opacity-90 transition-opacity">
          Back to Products
        </Link>
      </div>
    );
  }

  const catSlug = product.category?.slug ?? "";
  const emoji = CATEGORY_EMOJIS[catSlug] ?? FALLBACK_EMOJIS[0];
  const gradient = CATEGORY_GRADIENTS[catSlug] ?? FALLBACK_GRADIENTS[0];
  const price = Number(product.salePrice ?? product.price);
  const originalPrice = product.salePrice ? Number(product.price) : undefined;
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const primaryImage = product.images?.find((i) => i.isPrimary)?.url ?? product.images?.[0]?.url;
  const weight = product.weight ? `${Number(product.weight)} ${product.unit ?? "kg"}` : product.unit ?? "";

  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#061410] py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-zinc-400 dark:text-zinc-500 mb-8">
          <button onClick={() => router.back()} className="flex items-center gap-1.5 hover:text-brand-green dark:hover:text-brand-gold transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
          <span>/</span>
          <Link href="/products" className="hover:text-brand-green dark:hover:text-brand-gold transition-colors">Products</Link>
          <span>/</span>
          <span className="text-zinc-600 dark:text-zinc-300 truncate max-w-[160px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

          {/* ── LEFT: Product Visual ── */}
          <div className="sticky top-24">
            <div className={`relative aspect-square rounded-3xl bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden shadow-lg border border-white/30`}>
              {/* Sheen overlay */}
              <div className="absolute inset-0 plastic-sheen opacity-50" />

              {primaryImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={primaryImage}
                  alt={product.name}
                  className="w-3/4 h-3/4 object-contain relative z-10 drop-shadow-xl"
                />
              ) : (
                <span className="text-[120px] select-none relative z-10 drop-shadow-lg animate-float-slow">
                  {emoji}
                </span>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
                {product.isFeatured && (
                  <span className="bg-brand-gold text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow">
                    Best Seller
                  </span>
                )}
                {discount > 0 && (
                  <span className="bg-brand-green text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow">
                    {discount}% OFF
                  </span>
                )}
              </div>

              {/* Image thumbnails row */}
              {product.images && product.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                  {product.images.slice(0, 5).map((img, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={i}
                      src={img.url}
                      alt={`View ${i + 1}`}
                      className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow cursor-pointer hover:scale-110 transition-transform"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: Product Details ── */}
          <div className="space-y-6">

            {/* Category badge */}
            <Link
              href={`/products?category=${catSlug}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-green/10 dark:bg-brand-gold/10 text-brand-green dark:text-brand-gold text-[11px] font-bold uppercase tracking-widest hover:bg-brand-green/20 dark:hover:bg-brand-gold/20 transition-colors"
            >
              <Tag className="w-3 h-3" />
              {product.category?.name}
            </Link>

            {/* Name */}
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-800 dark:text-zinc-100 leading-tight">
              {product.name}
            </h1>

            {/* Rating row (static display) */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5 text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`w-4 h-4 ${s <= 4 ? "fill-amber-400" : "fill-zinc-200 dark:fill-zinc-700"}`} />
                ))}
              </div>
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">4.5 · Verified Reviews</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-zinc-800 dark:text-zinc-100">
                ₹{price}
              </span>
              {originalPrice && (
                <>
                  <span className="text-base text-zinc-400 dark:text-zinc-500 line-through font-medium">
                    ₹{originalPrice}
                  </span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    Save ₹{originalPrice - price}
                  </span>
                </>
              )}
            </div>

            {/* Weight / SKU */}
            {(weight || product.sku) && (
              <div className="flex flex-wrap gap-3">
                {weight && (
                  <span className="inline-flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-3 py-1.5 rounded-xl text-xs font-semibold">
                    <Package className="w-3.5 h-3.5" />
                    {weight}
                  </span>
                )}
                {product.sku && (
                  <span className="inline-flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-3 py-1.5 rounded-xl text-xs font-semibold">
                    SKU: {product.sku}
                  </span>
                )}
              </div>
            )}

            {/* Description */}
            {product.description && (
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800 pt-5">
                {product.description}
              </p>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-brand-cream dark:bg-zinc-800/60 text-brand-green dark:text-brand-gold text-[11px] font-semibold rounded-full border border-brand-green/20 dark:border-brand-gold/20"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-3 pt-2">
              {/* Qty control */}
              <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl border border-zinc-200/40 dark:border-zinc-700/40">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-white dark:hover:bg-zinc-700 transition-all"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold text-zinc-800 dark:text-zinc-100 text-sm">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-white dark:hover:bg-zinc-700 transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to cart */}
              <button
                id="product-add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={!product.isActive || product.stock === 0}
                className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-bold text-sm tracking-wide transition-all duration-200 shadow-md ${
                  added
                    ? "bg-emerald-600 text-white scale-95"
                    : product.stock === 0
                    ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
                    : "bg-brand-green hover:bg-brand-green-light text-white dark:bg-brand-gold dark:text-brand-green dark:hover:bg-brand-gold-light hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3px]" />
                    <span>Added to Cart!</span>
                  </>
                ) : product.stock === 0 ? (
                  <span>Out of Stock</span>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add {qty > 1 ? `${qty}x` : ""} to Cart</span>
                  </>
                )}
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              {[
                { icon: Shield, label: "100% Safe", sub: "Quality assured" },
                { icon: Truck, label: "Fast Delivery", sub: "2–4 business days" },
                { icon: RefreshCcw, label: "Easy Returns", sub: "7-day returns" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center text-center gap-1 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
                  <Icon className="w-5 h-5 text-brand-green dark:text-brand-gold" />
                  <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">{label}</span>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500">{sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
