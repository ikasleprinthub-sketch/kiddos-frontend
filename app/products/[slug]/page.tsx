"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ShoppingBag,
  Check,
  Shield,
  Truck,
  RefreshCcw,
  Package,
  Tag,
  Minus,
  Plus,
  ChevronDown,
  Share2,
  Heart,
} from "lucide-react";
import type { ApiProduct } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

const CATEGORY_EMOJIS: Record<string, string> = {
  batters: "🫙", batter: "🫙",
  "spice-blends": "🌶️", "organic-spices": "🌶️", spices: "🌶️",
  "raw-spices": "🌿",
  oils: "🫒",
  pickles: "🥒",
  "chutney-book": "📖", "chutney-books": "📖",
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
  "chutney-book": "from-orange-100 to-amber-200", "chutney-books": "from-orange-100 to-amber-200",
  millets: "from-yellow-50 to-yellow-200",
  rice: "from-sky-100 to-blue-200",
  ghee: "from-amber-50 to-yellow-200",
  honey: "from-orange-100 to-yellow-300",
  "healthy-snacks": "from-stone-100 to-amber-200", snacks: "from-stone-100 to-amber-200",
  masala: "from-purple-100 to-pink-200",
};

const FALLBACK_EMOJIS = ["🫙", "🌶️", "🌿", "🫒", "🥒", "📖", "🌾", "🍚", "🧈", "🍯", "🥜", "✨"];
const FALLBACK_GRADIENTS = ["from-amber-100 to-orange-200", "from-red-100 to-rose-200", "from-green-100 to-emerald-200", "from-yellow-100 to-lime-200"];

function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-zinc-200 dark:border-zinc-700 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-sm font-bold text-zinc-800 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors text-left"
      >
        <span>{title}</span>
        <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-zinc-100 dark:border-zinc-700 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [chutneyBooks, setChutneyBooks] = useState<ApiProduct[]>([]);
  const [recommendedBatters, setRecommendedBatters] = useState<ApiProduct[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<ApiProduct[]>([]);
  const [activeVariantId, setActiveVariantId] = useState<string | null>(null);

  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      setActiveVariantId(product.variants[0].id);
    }
  }, [product]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/products/${slug}`)
      .then((r) => {
        if (r.status === 404) { setNotFound(true); return null; }
        return r.json();
      })
      .then((data) => {
        if (data) {
          const p: ApiProduct = data.product ?? data;
          setProduct(p);
          const primary = p.images?.find((i) => i.isPrimary)?.url ?? p.images?.[0]?.url ?? null;
          setActiveImage(primary);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  // Fetch chutney books when viewing a batter product
  useEffect(() => {
    if (!product) return;
    const catSlug = product.category?.slug ?? "";
    if (!["batter", "batters"].includes(catSlug)) return;
    fetch("/api/products?category=chutney-book&limit=10")
      .then((r) => r.json())
      .then((data) => {
        const list: ApiProduct[] = Array.isArray(data) ? data : (data.products ?? []);
        setChutneyBooks(list);
      })
      .catch(() => {/* ignore */});
  }, [product]);

  // Fetch batters when viewing a chutney product
  useEffect(() => {
    if (!product) return;
    const catSlug = product.category?.slug ?? "";
    if (!["chutney-book", "chutney-books"].includes(catSlug)) return;
    fetch("/api/products?category=batter&limit=10")
      .then((r) => r.json())
      .then((data) => {
        const list: ApiProduct[] = Array.isArray(data) ? data : (data.products ?? []);
        setRecommendedBatters(list);
      })
      .catch(() => {/* ignore */});
  }, [product]);

  // Fetch related products from the same category
  useEffect(() => {
    if (!product) return;
    const catSlug = product.category?.slug ?? "";
    if (!catSlug) return;
    fetch(`/api/products?category=${catSlug}&limit=10`)
      .then((r) => r.json())
      .then((data) => {
        const list: ApiProduct[] = Array.isArray(data) ? data : (data.products ?? []);
        setRelatedProducts(list.filter((p) => p.id !== product.id));
      })
      .catch(() => {/* ignore */});
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    const catSlug = product.category?.slug ?? "";
    const emoji = CATEGORY_EMOJIS[catSlug] ?? FALLBACK_EMOJIS[0];
    const gradient = CATEGORY_GRADIENTS[catSlug] ?? FALLBACK_GRADIENTS[0];
    const hasSale = product.salePrice != null && Number(product.salePrice) < Number(product.price);
    const price = hasSale ? Number(product.salePrice) : Number(product.price);
    const originalPrice = hasSale ? Number(product.price) : undefined;
    const weight = product.weight ? `${Number(product.weight)} ${product.unit ?? "kg"}` : (product.unit ?? "");

    const activeVariant = product.variants?.find((v) => v.id === activeVariantId) || null;
    
    const finalPrice = activeVariant ? (activeVariant.salePrice ? Number(activeVariant.salePrice) : Number(activeVariant.price)) : price;
    const finalOriginalPrice = activeVariant ? (activeVariant.salePrice ? Number(activeVariant.price) : undefined) : originalPrice;
    const finalWeight = activeVariant ? (activeVariant.weight ? `${Number(activeVariant.weight)} ${activeVariant.unit ?? "kg"}` : (activeVariant.unit ?? "")) : weight;

    for (let i = 0; i < qty; i++) {
      addItem({
        id: activeVariant?.id || product.id,
        productId: product.id,
        variantId: activeVariant?.id || undefined,
        name: product.name,
        price: finalPrice,
        originalPrice: finalOriginalPrice,
        image: activeImage ?? undefined,
        emoji,
        gradient,
        weightOrQty: finalWeight,
        slug: product.slug,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleShare = (platform: "whatsapp" | "facebook" | "instagram") => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out ${product?.name} on Kiddos Foods!`);
    const links: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      instagram: `https://www.instagram.com/`,
    };
    window.open(links[platform], "_blank", "noopener");
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
  const isRecipe = ["chutney-book", "chutney-books"].includes(catSlug);
  const emoji = CATEGORY_EMOJIS[catSlug] ?? FALLBACK_EMOJIS[0];
  const gradient = CATEGORY_GRADIENTS[catSlug] ?? FALLBACK_GRADIENTS[0];
  const hasSale = product.salePrice != null && Number(product.salePrice) < Number(product.price);
  const price = hasSale ? Number(product.salePrice) : Number(product.price);
  const originalPrice = hasSale ? Number(product.price) : undefined;
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const weight = product.weight ? `${Number(product.weight)} ${product.unit ?? "kg"}` : product.unit ?? "";

  const activeVariant = product.variants?.find((v) => v.id === activeVariantId) || null;
  const displayPrice = activeVariant ? (activeVariant.salePrice ? Number(activeVariant.salePrice) : Number(activeVariant.price)) : price;
  const displayOriginalPrice = activeVariant ? (activeVariant.salePrice ? Number(activeVariant.price) : undefined) : originalPrice;
  const displayDiscount = displayOriginalPrice ? Math.round(((displayOriginalPrice - displayPrice) / displayOriginalPrice) * 100) : 0;
  const displayWeight = activeVariant ? (activeVariant.weight ? `${Number(activeVariant.weight)} ${activeVariant.unit ?? "kg"}` : (activeVariant.unit ?? "")) : weight;
  const currentStock = activeVariant ? activeVariant.stock : product.stock;
  const isActiveState = activeVariant ? activeVariant.isActive : product.isActive;

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
          <div className="sticky top-24 space-y-3">
            <div className={`relative ${isRecipe ? "aspect-[3/4]" : "aspect-square"} rounded-3xl bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden shadow-lg border border-white/30`}>
              <div className="absolute inset-0 plastic-sheen opacity-50" />
              {activeImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-[92%] h-[92%] object-contain relative z-10 drop-shadow-xl rounded-2xl"
                />
              ) : (
                <span className="text-[120px] select-none relative z-10 drop-shadow-lg animate-float-slow">
                  {emoji}
                </span>
              )}

              {/* Bestseller ribbon — diagonal corner with folded ends */}
              {product.isFeatured && (
                <div
                  className="absolute top-[22px] left-[-34px] w-[130px] text-center bg-[#f97316] text-white text-[10px] font-black uppercase tracking-wider py-2 -rotate-45 z-20 pointer-events-none select-none"
                  style={{
                    clipPath: 'polygon(10px 0%, calc(100% - 10px) 0%, 100% 50%, calc(100% - 10px) 100%, 10px 100%, 0% 50%)',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.30))',
                  }}
                >
                  Best Seller
                </div>
              )}

              {/* Discount badge — bottom right */}
              {displayDiscount > 0 && (
                <div className="absolute bottom-4 right-4 z-20">
                  <span className="bg-brand-green text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow">
                    {displayDiscount}% OFF
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail row */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {product.images.slice(0, 6).map((img, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={img.url}
                    alt={`View ${i + 1}`}
                    onClick={() => setActiveImage(img.url)}
                    className={`w-14 h-14 rounded-xl object-cover border-2 cursor-pointer hover:scale-105 transition-all ${
                      activeImage === img.url
                        ? "border-brand-green dark:border-brand-gold shadow-md"
                        : "border-zinc-200 dark:border-zinc-700"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Product Details ── */}
          <div className="space-y-5">

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



            {/* Price — hidden for recipe pages */}
            {!isRecipe && (
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-zinc-800 dark:text-zinc-100">₹{displayPrice}</span>
                {displayOriginalPrice && (
                  <>
                    <span className="text-base text-zinc-400 dark:text-zinc-500 line-through font-medium">₹{displayOriginalPrice}</span>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      ({displayDiscount}% off, save ₹{displayOriginalPrice - displayPrice})
                    </span>
                  </>
                )}
              </div>
            )}

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="py-2">
                <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2">Select Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => {
                    const vWeight = v.weight ? `${Number(v.weight)} ${v.unit ?? "kg"}` : v.unit ?? "";
                    const isSelected = activeVariantId === v.id;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setActiveVariantId(v.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${
                          isSelected
                            ? "bg-brand-green border-brand-green text-white dark:bg-brand-gold dark:border-brand-gold dark:text-brand-green"
                            : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-brand-green dark:bg-zinc-800/50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-brand-gold"
                        }`}
                      >
                        {vWeight}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Free Recipe badge — shown only for chutney-book */}
            {isRecipe && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                <span className="text-xl">📖</span>
                <div>
                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Free Recipe</p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-500">Not for sale. View and enjoy for free</p>
                </div>
              </div>
            )}

            {/* Net Weight chip — hidden for recipe pages */}
            {!isRecipe && displayWeight && (
              <div>
                <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2">Net Weight</p>
                <span className="inline-flex items-center gap-1.5 bg-brand-green text-white dark:bg-brand-gold dark:text-brand-green px-4 py-2 rounded-xl text-sm font-bold shadow-sm">
                  <Package className="w-3.5 h-3.5" />
                  {displayWeight}
                </span>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800/60 text-brand-green dark:text-brand-gold text-[11px] font-semibold rounded-full border border-brand-green/20 dark:border-brand-gold/20"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Quantity + Add to Cart — hidden for recipe pages */}
            {!isRecipe && <div className="flex items-center gap-3 pt-1 flex-wrap">
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

              <button
                id="product-add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={!isActiveState || currentStock === 0}
                className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-bold text-sm tracking-wide transition-all duration-200 shadow-md ${
                  added
                    ? "bg-emerald-600 text-white scale-95"
                    : currentStock === 0
                    ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
                    : "bg-brand-green hover:bg-brand-green-light text-white dark:bg-brand-gold dark:text-brand-green dark:hover:bg-brand-gold-light hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                }`}
              >
                {added ? (
                  <><Check className="w-4 h-4 stroke-[3px]" /><span>Added to Cart!</span></>
                ) : currentStock === 0 ? (
                  <span>Out of Stock</span>
                ) : (
                  <><ShoppingBag className="w-4 h-4" /><span>Add {qty > 1 ? `${qty}×` : ""} to Cart</span></>
                )}
              </button>

              {/* Wishlist toggle */}
              <button
                onClick={() => {
                  if (isInWishlist(product.id)) {
                    removeFromWishlist(product.id);
                  } else {
                    addToWishlist({
                      id: product.id,
                      name: product.name,
                      category: catSlug,
                      categoryLabel: product.category?.name ?? "",
                      description: product.description ?? "",
                      price: displayPrice,
                      originalPrice: displayOriginalPrice,
                      rating: 0,
                      reviewsCount: 0,
                      emoji,
                      image: activeImage ?? undefined,
                      gradient,
                      isVeg: true,
                      weightOrQty: displayWeight,
                      tags: product.tags ?? [],
                      slug: product.slug,
                      stock: currentStock,
                    });
                  }
                }}
                title={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all duration-200 shrink-0 ${
                  isInWishlist(product.id)
                    ? "bg-red-50 border-red-300 dark:bg-red-950/30 dark:border-red-700"
                    : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:border-red-300 dark:hover:border-red-700"
                }`}
              >
                <Heart
                  className={`w-5 h-5 transition-all duration-200 ${
                    isInWishlist(product.id)
                      ? "fill-red-500 text-red-500 scale-110"
                      : "text-zinc-400 dark:text-zinc-500"
                  }`}
                />
              </button>
            </div>}

            {/* Share On */}
            <div className="flex items-center gap-3 pt-1 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                <Share2 className="w-3.5 h-3.5" />
                <span>Share On</span>
              </div>
              {/* WhatsApp */}
              <button
                onClick={() => handleShare("whatsapp")}
                className="p-2 rounded-xl bg-green-50 dark:bg-green-950/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                title="Share on WhatsApp"
              >
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </button>
              {/* Facebook */}
              <button
                onClick={() => handleShare("facebook")}
                className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                title="Share on Facebook"
              >
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              {/* Instagram */}
              <button
                onClick={() => handleShare("instagram")}
                className="p-2 rounded-xl bg-pink-50 dark:bg-pink-950/20 hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors"
                title="Share on Instagram"
              >
                <svg className="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </button>
            </div>

            {/* Trust badges — hidden for recipe pages */}
            {!isRecipe && (
              <div className="grid grid-cols-3 gap-3 border-t border-zinc-100 dark:border-zinc-800 pt-4">
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
            )}

            {/* ── Accordion Sections ── */}
            <div className="space-y-3 pt-2">

              {product.ingredients && (
                <Accordion title="Ingredients">
                  <p className="pt-3 whitespace-pre-line">{product.ingredients}</p>
                </Accordion>
              )}

              {product.healthBenefits && (
                <Accordion title="Health Benefits">
                  <p className="pt-3 whitespace-pre-line">{product.healthBenefits}</p>
                </Accordion>
              )}

              {product.usageInstructions && (
                <Accordion title="Usage Instructions">
                  <p className="pt-3 whitespace-pre-line">{product.usageInstructions}</p>
                </Accordion>
              )}

              {product.shelfLife && (
                <Accordion title="Shelf Life & Storage">
                  <p className="pt-3">
                    {product.shelfLife}
                    {product.storageInstructions && <><br /><br />{product.storageInstructions}</>}
                  </p>
                </Accordion>
              )}

              {product.nutrientFacts && Object.keys(product.nutrientFacts).length > 0 && (
                <Accordion title="Nutrient Facts">
                  <div className="pt-3">
                    <NutrientTable facts={product.nutrientFacts} />
                  </div>
                </Accordion>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* ── Related Products ── */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-zinc-800 dark:text-zinc-100 relative inline-block">
              Related Products
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-brand-green dark:bg-brand-gold rounded-full" />
            </h2>
            <Link
              href={`/products?category=${catSlug}`}
              className="text-xs font-semibold text-brand-green dark:text-brand-gold hover:underline"
            >
              View All →
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {relatedProducts.map((rp) => {
              const rpCatSlug = rp.category?.slug ?? "";
              const rpEmoji = CATEGORY_EMOJIS[rpCatSlug] ?? FALLBACK_EMOJIS[0];
              const rpGradient = CATEGORY_GRADIENTS[rpCatSlug] ?? FALLBACK_GRADIENTS[0];
              const rpImg = rp.images?.find((i) => i.isPrimary)?.url ?? rp.images?.[0]?.url;
              const rpHasSale = rp.salePrice != null && Number(rp.salePrice) < Number(rp.price);
              const rpPrice = rpHasSale ? Number(rp.salePrice) : Number(rp.price);
              const rpOriginal = rpHasSale ? Number(rp.price) : undefined;
              return (
                <Link
                  key={rp.id}
                  href={`/products/${rp.slug}`}
                  className="flex-none w-44 snap-start bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col group"
                >
                  {/* Image */}
                  <div className={`w-full aspect-square bg-gradient-to-br ${rpGradient} flex items-center justify-center overflow-hidden`}>
                    {rpImg ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={rpImg} alt={rp.name} className="w-[85%] h-[85%] object-contain group-hover:scale-105 transition-transform duration-200 rounded-xl shadow-sm" />
                    ) : (
                      <span className="text-5xl select-none">{rpEmoji}</span>
                    )}
                  </div>
                  {/* Info */}
                  <div className="p-3 flex flex-col gap-1 flex-1">
                    <p className="text-xs font-bold text-zinc-800 dark:text-zinc-100 leading-snug line-clamp-2 group-hover:text-brand-green dark:group-hover:text-brand-gold transition-colors">
                      {rp.name}
                    </p>
                    <div className="mt-auto pt-1 flex items-baseline gap-1.5">
                      <span className="text-sm font-black text-brand-green dark:text-brand-gold">₹{rpPrice}</span>
                      {rpOriginal && (
                        <span className="text-[11px] text-zinc-400 line-through">₹{rpOriginal}</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Recommended Batters (chutney products only) ── */}
      {recommendedBatters.length > 0 && (
        <section className="mt-16 max-w-5xl mx-auto">
          <h2 className="text-xl font-black text-zinc-800 dark:text-zinc-100 mb-6 relative inline-block">
            Recommended Batters
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-brand-green dark:bg-brand-gold rounded-full" />
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {recommendedBatters.map((batter) => {
              const rpCatSlug = batter.category?.slug ?? "";
              const rpEmoji = CATEGORY_EMOJIS[rpCatSlug] ?? FALLBACK_EMOJIS[0];
              const rpGradient = CATEGORY_GRADIENTS[rpCatSlug] ?? FALLBACK_GRADIENTS[0];
              const rpImg = batter.images?.find((i) => i.isPrimary)?.url ?? batter.images?.[0]?.url;
              const rpHasSale = batter.salePrice != null && Number(batter.salePrice) < Number(batter.price);
              const rpPrice = rpHasSale ? Number(batter.salePrice) : Number(batter.price);
              const rpOriginal = rpHasSale ? Number(batter.price) : undefined;
              return (
                <Link
                  key={batter.id}
                  href={`/products/${batter.slug}`}
                  className="flex-none w-44 snap-start bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col group"
                >
                  {/* Image */}
                  <div className={`w-full aspect-square bg-gradient-to-br ${rpGradient} flex items-center justify-center overflow-hidden`}>
                    {rpImg ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={rpImg} alt={batter.name} className="w-3/4 h-3/4 object-contain group-hover:scale-105 transition-transform duration-200" />
                    ) : (
                      <span className="text-5xl select-none">{rpEmoji}</span>
                    )}
                  </div>
                  {/* Info */}
                  <div className="p-3 flex flex-col gap-1 flex-1">
                    <p className="text-xs font-bold text-zinc-800 dark:text-zinc-100 leading-snug line-clamp-2 group-hover:text-brand-green dark:group-hover:text-brand-gold transition-colors">
                      {batter.name}
                    </p>
                    <div className="mt-auto pt-1 flex items-baseline gap-1.5">
                      <span className="text-sm font-black text-brand-green dark:text-brand-gold">₹{rpPrice}</span>
                      {rpOriginal && (
                        <span className="text-[11px] text-zinc-400 line-through">₹{rpOriginal}</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Recommended Chutney Book (batter products only) ── */}
      {chutneyBooks.length > 0 && (
        <section className="mt-16 max-w-5xl mx-auto">
          <h2 className="text-xl font-black text-zinc-800 dark:text-zinc-100 mb-6 relative inline-block">
            Recommended Chutney Book
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-brand-green dark:bg-brand-gold rounded-full" />
          </h2>
          <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {chutneyBooks.map((book) => {
              const img = book.images?.find((i) => i.isPrimary)?.url ?? book.images?.[0]?.url;
              return (
                <div
                  key={book.id}
                  className="flex-none w-52 snap-start bg-white dark:bg-zinc-900 rounded-2xl shadow-md border border-zinc-100 dark:border-zinc-800 overflow-hidden flex flex-col"
                >
                  {/* Cover image */}
                  <div className="w-full aspect-[4/3] bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                    {img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={img}
                        alt={book.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">📖</div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3 flex flex-col flex-1 gap-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                      Kiddos Foods
                    </p>
                    <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100 leading-snug line-clamp-2">
                      {book.name}
                    </p>
                    <div className="mt-auto pt-2">
                      <Link
                        href={`/products/${book.slug}`}
                        className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-brand-green dark:bg-brand-gold text-white dark:text-brand-green text-xs font-bold hover:opacity-90 transition-opacity"
                      >
                        View Recipes
                        <span className="text-base leading-none">›</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

function NutrientTable({ facts }: { facts: Record<string, string | number> }) {
  const DAILY_VALUES: Record<string, number> = {
    "Total Fat": 78, "Saturated Fat": 20, "Trans Fat": 0, "Cholesterol": 300,
    "Sodium": 2300, "Total Carbohydrate": 275, "Dietary Fibre": 28,
    "Total Sugars": 50, "Protein": 50, "Vitamin D": 20, "Calcium": 1300,
    "Iron": 18, "Potassium": 4700,
  };

  const calories = facts["Calories"] ?? facts["calories"];
  const amountPer = facts["amountPer"] ?? facts["AmountPer"] ?? "100 g";
  const rows = Object.entries(facts).filter(
    ([k]) => !["Calories", "calories", "amountPer", "AmountPer"].includes(k)
  );

  return (
    <div className="border border-zinc-300 dark:border-zinc-600 rounded-xl overflow-hidden text-sm">
      {/* Header */}
      <div className="bg-zinc-800 dark:bg-zinc-700 text-white px-4 py-3">
        <p className="font-semibold">Amount per {amountPer}</p>
        {calories !== undefined && (
          <p className="text-lg font-bold mt-0.5">Calories {calories}</p>
        )}
      </div>

      {/* Column header */}
      <div className="flex justify-end px-4 py-2 border-b border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/40">
        <span>% Daily value*</span>
      </div>

      {/* Rows */}
      {rows.map(([nutrient, value]) => {
        const dv = DAILY_VALUES[nutrient];
        const pct = dv && dv > 0 ? Math.round((Number(value) / dv) * 100) : null;
        return (
          <div key={nutrient} className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800 last:border-0 bg-white dark:bg-zinc-900">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">{nutrient} <span className="font-normal">{value}</span></span>
            <span className="font-bold text-zinc-600 dark:text-zinc-400">{pct !== null ? `${pct}%` : "—"}</span>
          </div>
        );
      })}

      <p className="px-4 py-2 text-[10px] text-zinc-400 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-800/30">
        * Percent Daily Values are based on a 2,000 calorie diet.
      </p>
    </div>
  );
}
