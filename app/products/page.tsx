"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  Search, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Star, 
  Check, 
  X, 
  AlertCircle, 
  Sparkles,
  ShoppingBag,
  Eye,
  RefreshCcw,
  Heart,
  ShoppingCart
} from "lucide-react";
import { PRODUCTS, Product } from "@/components/productsData";
import type { ApiCategory, ApiProduct } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import Link from "next/link";

// Map API product → local Product UI shape
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
  "spice-blends": "from-red-100 to-rose-200", "organic-spices": "from-red-100 to-rose-200", spices: "from-red-100 to-rose-200",
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
const FALLBACK_GRADIENTS = ["from-amber-100 to-orange-200","from-red-100 to-rose-200","from-green-100 to-emerald-200","from-yellow-100 to-lime-200"];
const FALLBACK_EMOJIS = ["🫙","🌶️","🌿","🫒","🥒","📖","🌾","🍚","🧈","🍯","🥜","✨"];

function apiProductToProduct(p: ApiProduct, idx: number): Product {
  const slug = p.category?.slug ?? "";
  const hasSale = p.salePrice != null && Number(p.salePrice) < Number(p.price);
  const price = hasSale ? Number(p.salePrice) : Number(p.price);
  const originalPrice = hasSale ? Number(p.price) : undefined;
  const weight = p.weight ? `${Number(p.weight)} ${p.unit ?? "kg"}` : (p.unit ?? "");
  return {
    id: p.id,
    name: p.name,
    category: slug,
    categoryLabel: p.category?.name ?? "",
    description: p.description ?? "",
    price,
    originalPrice,
    rating: 4.5,
    reviewsCount: 0,
    emoji: CATEGORY_EMOJIS[slug] ?? FALLBACK_EMOJIS[idx % FALLBACK_EMOJIS.length],
    image: p.images?.find((i) => i.isPrimary)?.url ?? p.images?.[0]?.url,
    image2: p.images && p.images.length > 1
      ? (p.images.find((i) => !i.isPrimary)?.url ?? p.images[1]?.url)
      : undefined,
    gradient: CATEGORY_GRADIENTS[slug] ?? FALLBACK_GRADIENTS[idx % FALLBACK_GRADIENTS.length],
    isBestSeller: p.isFeatured,
    isNew: false,
    isVeg: true,
    weightOrQty: weight,
    tags: p.tags ?? [],
    slug: p.slug,
    stock: p.stock,
  };
}




function ProductsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get initial filters from URL params if present
  const initialCategory = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("search") || "";
  const DEFAULT_MAX_PRICE = 1000000;
  const initialMaxPrice = searchParams.get("maxPrice") 
    ? parseInt(searchParams.get("maxPrice")!) 
    : DEFAULT_MAX_PRICE;

  // State Management
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [maxPrice, setMaxPrice] = useState<number>(initialMaxPrice);
  const [sortBy, setSortBy] = useState<string>("featured");
  
  // Live categories from backend
  const [apiCategories, setApiCategories] = useState<ApiCategory[]>([]);
  const [catsLoading, setCatsLoading] = useState(true);

  // Live products from backend
  const [apiProducts, setApiProducts] = useState<Product[]>([]);
  const [prodsLoading, setProdsLoading] = useState(true);

  // Quick View Modal
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const { addItem } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  useEffect(() => {
    fetch("/api/categories?limit=100")
      .then((r) => r.json())
      .then((data) => {
        const list: ApiCategory[] = Array.isArray(data) ? data : (data.categories ?? []);
        setApiCategories(list.filter((c) => c.isActive));
      })
      .catch(() => setApiCategories([]))
      .finally(() => setCatsLoading(false));
  }, []);

  useEffect(() => {
    fetch("/api/products?limit=200")
      .then((r) => r.json())
      .then((data) => {
        const list: ApiProduct[] = Array.isArray(data) ? data : (data.products ?? []);
        setApiProducts(list.map((p, i) => apiProductToProduct(p, i)));
      })
      .catch(() => setApiProducts([]))
      .finally(() => setProdsLoading(false));
  }, []);

  // Cart feedback state (per product id)
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);
  
  // Sync state changes with URL parameters for shareable filtering
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (searchQuery) params.set("search", searchQuery);
    if (maxPrice !== DEFAULT_MAX_PRICE) params.set("maxPrice", maxPrice.toString());
    
    const queryString = params.toString();
    const targetUrl = queryString ? `/products?${queryString}` : "/products";
    router.replace(targetUrl, { scroll: false });
  }, [selectedCategory, searchQuery, maxPrice, router]);

  // Sync state with incoming URL changes (e.g. back button)
  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "all");
    setSearchQuery(searchParams.get("search") || "");
    setMaxPrice(searchParams.get("maxPrice") ? parseInt(searchParams.get("maxPrice")!) : DEFAULT_MAX_PRICE);
  }, [searchParams]);

  // Use API products when available, otherwise fall back to static
  const allProducts = useMemo(
    () => (apiProducts.length > 0 ? apiProducts : prodsLoading ? [] : PRODUCTS),
    [apiProducts, prodsLoading]
  );

  const maxSliderValue = useMemo(() => {
    if (allProducts.length === 0) return 1000;
    const max = Math.max(...allProducts.map(p => p.price));
    return max > 1000 ? Math.ceil(max / 100) * 100 : 1000;
  }, [allProducts]);

  // Count products per category (excluding the category filter itself)
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: 0 };
    apiCategories.forEach(cat => { counts[cat.slug] = 0; });

    allProducts.forEach(product => {
      const matchesSearch = searchQuery
        ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;
      const matchesPrice = product.price <= maxPrice;
      if (matchesSearch && matchesPrice) {
        counts[product.category] = (counts[product.category] || 0) + 1;
        counts["all"] = (counts["all"] || 0) + 1;
      }
    });

    return counts;
  }, [searchQuery, maxPrice, apiCategories, allProducts]);

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      // Category Filter
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      
      // Search Filter
      const matchesSearch = searchQuery
        ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;
        
      // Price Filter
      const matchesPrice = product.price <= maxPrice;

      return matchesCategory && matchesSearch && matchesPrice;
    }).sort((a, b) => {
      if (sortBy === "price-low-high") {
        return a.price - b.price;
      }
      if (sortBy === "price-high-low") {
        return b.price - a.price;
      }
      if (sortBy === "rating") {
        return b.rating - a.rating;
      }
      // "featured": best sellers first, then new items, then by reviews count
      const scoreA = (a.isBestSeller ? 3 : 0) + (a.isNew ? 1 : 0) + (a.rating / 5) * 2;
      const scoreB = (b.isBestSeller ? 3 : 0) + (b.isNew ? 1 : 0) + (b.rating / 5) * 2;
      return scoreB - scoreA;
    });
  }, [selectedCategory, searchQuery, maxPrice, sortBy]);

  // Handle Add to Cart animation triggers
  const handleAddToCart = (product: Product) => {
    setAddingToCartId(product.id);
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
    });
    // Simulate API request / cart update delay
    setTimeout(() => {
      setAddingToCartId(null);
    }, 1500);
  };

  const handleClearFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setMaxPrice(700);
    setSortBy("featured");
  };

  return (
    <div className="w-full bg-[#faf8f5] dark:bg-[#061410] min-h-screen pb-20">
      
      {/* ── HERO BANNER ── */}
      <section className="relative overflow-hidden bg-gradient-to-r from-brand-green to-[#2a5e2f] dark:from-zinc-950 dark:to-brand-green py-16 px-4 md:px-8 text-center text-white">
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-brand-gold/15 blur-2xl animate-pulse-subtle" />
        <div className="absolute -bottom-10 -right-10 w-64 h-64 rounded-full bg-brand-gold/15 blur-3xl" />
        
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          <div className="flex items-center gap-2 bg-brand-gold/20 text-brand-gold-light px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border border-brand-gold/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Traditional & Preservative-Free</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-white">
            Kiddos <span className="text-brand-gold">Pantry</span>
          </h1>
          <p className="text-white/80 max-w-xl text-sm md:text-base font-medium leading-relaxed">
            Delivering wholesome, pure, and Amma-approved snacks, cold-pressed oils, slow-ground batters, and traditional ingredients to your doorstep.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── LEFT COLUMN: SIDEBAR FILTERS ── */}
          <aside className="w-full lg:w-[280px] shrink-0 space-y-6">
            
            {/* SEARCH BOX */}
            <div className="bg-white dark:bg-zinc-900/60 rounded-3xl p-5 shadow-sm border border-zinc-250/20 dark:border-zinc-800/40">
              <label htmlFor="search-input" className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-2.5">
                Search Products
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400" />
                <input
                  id="search-input"
                  type="text"
                  placeholder="Try 'Ragi', 'Oil', 'Podi'..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand-green/30 dark:focus:ring-brand-gold/30 focus:border-brand-green dark:focus:border-brand-gold transition-all"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                    aria-label="Clear Search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* SHOP BY CATEGORY */}
            <div className="bg-white dark:bg-zinc-900/60 rounded-3xl p-5 shadow-sm border border-zinc-250/20 dark:border-zinc-800/40">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Shop By Category
                </h3>
                {selectedCategory !== "all" && (
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className="text-[11px] font-semibold text-brand-green dark:text-brand-gold hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>

              <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-none snap-x">
                {/* 'All' option */}
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all shrink-0 snap-start ${
                    selectedCategory === "all"
                      ? "bg-brand-green text-white dark:bg-brand-gold dark:text-brand-green shadow-sm"
                      : "bg-zinc-50 hover:bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>All Products</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    selectedCategory === "all"
                      ? "bg-white/20 text-white dark:bg-brand-green/20 dark:text-brand-green"
                      : "bg-zinc-200/60 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                  }`}>
                    {allProducts.length}
                  </span>
                </button>

                {/* Categories from backend */}
                {catsLoading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-10 rounded-2xl bg-zinc-100 dark:bg-zinc-800 animate-pulse shrink-0" />
                    ))
                  : apiCategories.map((cat, idx) => {
                      const isActive = selectedCategory === cat.slug;
                      const count = categoryCounts[cat.slug] || 0;
                      const emoji = CATEGORY_EMOJIS[cat.slug] ?? FALLBACK_EMOJIS[idx % FALLBACK_EMOJIS.length];
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.slug)}
                          className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all shrink-0 snap-start ${
                            isActive
                              ? "bg-brand-green text-white dark:bg-brand-gold dark:text-brand-green shadow-sm"
                              : "bg-zinc-50 hover:bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-300"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {cat.image && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={cat.image} alt={cat.name} className="w-5 h-5 rounded-full object-cover" />
                            )}
                            <span>{cat.name}</span>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            isActive
                              ? "bg-white/20 text-white dark:bg-brand-green/20 dark:text-brand-green"
                              : "bg-zinc-200/60 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                          }`}>
                            {count}
                          </span>
                        </button>
                      );
                    })
                }
              </div>
            </div>

            {/* SHOP BY PRICE */}
            <div className="bg-white dark:bg-zinc-900/60 rounded-3xl p-5 shadow-sm border border-zinc-250/20 dark:border-zinc-800/40">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Shop By Price
                </h3>
                {maxPrice !== DEFAULT_MAX_PRICE && (
                  <button
                    onClick={() => setMaxPrice(DEFAULT_MAX_PRICE)}
                    className="text-[11px] font-semibold text-brand-green dark:text-brand-gold hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Price Slider */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-400 dark:text-zinc-500">Price Limit:</span>
                  <span className="text-sm font-bold text-brand-green dark:text-brand-gold bg-brand-green/5 dark:bg-brand-gold/5 px-2.5 py-1 rounded-lg">
                    {maxPrice === DEFAULT_MAX_PRICE ? "No Limit" : `Up to ₹${maxPrice}`}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={maxSliderValue}
                  step="5"
                  value={maxPrice > maxSliderValue ? maxSliderValue : maxPrice}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setMaxPrice(val >= maxSliderValue ? DEFAULT_MAX_PRICE : val);
                  }}
                  className="w-full accent-brand-gold dark:accent-brand-gold bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-400 font-bold px-0.5">
                  <span>₹0</span>
                  <span>₹{Math.floor(maxSliderValue / 2)}</span>
                  <span>₹{maxSliderValue}+</span>
                </div>

                {/* Quick Presets */}
                <div className="border-t border-zinc-100 dark:border-zinc-800/60 pt-3.5 mt-3 space-y-2">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                    Quick Budget Filters
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { label: "Under ₹150", val: 150 },
                      { label: "Under ₹250", val: 250 },
                      { label: "Under ₹400", val: 400 },
                      { label: "Clear Limit", val: DEFAULT_MAX_PRICE }
                    ].map((btn) => (
                      <button
                        key={btn.label}
                        onClick={() => setMaxPrice(btn.val)}
                        className={`text-xs font-semibold py-1.5 px-2.5 rounded-xl border text-center transition-all ${
                          maxPrice === btn.val
                            ? "bg-brand-green/10 text-brand-green border-brand-green/30 dark:bg-brand-gold/10 dark:text-brand-gold dark:border-brand-gold/30"
                            : "bg-transparent text-zinc-650 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900 border-zinc-200 dark:border-zinc-850"
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* CLEAR ALL FILTERS */}
            {(selectedCategory !== "all" || searchQuery || maxPrice !== 700 || sortBy !== "featured") && (
              <button
                onClick={handleClearFilters}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-zinc-200/50 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold tracking-wide uppercase transition-all shadow-sm"
              >
                <X className="w-4 h-4" />
                <span>Reset All Filters</span>
              </button>
            )}

          </aside>

          {/* ── RIGHT COLUMN: PRODUCTS LIST ── */}
          <main className="flex-1">
            
            {/* GRID CONTROLS / SORTING */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-zinc-900/60 rounded-3xl p-5 shadow-sm border border-zinc-250/20 dark:border-zinc-800/40 mb-6">
              
              <div className="space-y-1">
                <h2 className="text-zinc-850 dark:text-zinc-100 font-extrabold text-base md:text-lg flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-brand-green dark:text-brand-gold" />
                  <span>
                    {selectedCategory === "all" 
                      ? "All Products" 
                      : apiCategories.find(c => c.slug === selectedCategory)?.name}
                  </span>
                </h2>
                <p className="text-xs text-zinc-450 dark:text-zinc-550">
                  {prodsLoading
                    ? "Loading products…"
                    : `Showing ${filteredProducts.length} of ${allProducts.length} traditional goods`}
                </p>
              </div>

              {/* Active Filter Pills */}
              <div className="flex flex-wrap gap-1.5 my-1">
                {selectedCategory !== "all" && (
                  <span className="inline-flex items-center gap-1 bg-brand-green/10 text-brand-green dark:bg-brand-gold/15 dark:text-brand-gold text-[10px] font-bold py-1 px-2.5 rounded-full border border-brand-green/20 dark:border-brand-gold/20">
                    Category: {apiCategories.find(c => c.slug === selectedCategory)?.name}
                    <button onClick={() => setSelectedCategory("all")}><X className="w-2.5 h-2.5" /></button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 bg-brand-green/10 text-brand-green dark:bg-brand-gold/15 dark:text-brand-gold text-[10px] font-bold py-1 px-2.5 rounded-full border border-brand-green/20 dark:border-brand-gold/20">
                    Search: &quot;{searchQuery}&quot;
                    <button onClick={() => setSearchQuery("")}><X className="w-2.5 h-2.5" /></button>
                  </span>
                )}
                {maxPrice !== 700 && (
                  <span className="inline-flex items-center gap-1 bg-brand-green/10 text-brand-green dark:bg-brand-gold/15 dark:text-brand-gold text-[10px] font-bold py-1 px-2.5 rounded-full border border-brand-green/20 dark:border-brand-gold/20">
                    Under ₹{maxPrice}
                    <button onClick={() => setMaxPrice(700)}><X className="w-2.5 h-2.5" /></button>
                  </span>
                )}
              </div>

              {/* Sorting Selection */}
              <div className="flex items-center gap-2 shrink-0">
                <ArrowUpDown className="w-4 h-4 text-zinc-400" />
                <label htmlFor="sort-select" className="sr-only">Sort by</label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-brand-green dark:focus:ring-brand-gold"
                >
                  <option value="featured">Sort by: Featured</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>

            </div>

            {/* PRODUCT GRID */}
            {prodsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200/60 dark:border-zinc-800 animate-pulse">
                    <div className="w-full bg-zinc-200 dark:bg-zinc-800" style={{ aspectRatio: "4/3" }} />
                    <div className="p-4 space-y-3">
                      <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
                      <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-700 rounded" />
                      <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded" />
                      <div className="h-3 w-5/6 bg-zinc-100 dark:bg-zinc-800 rounded" />
                      <div className="flex justify-between items-center pt-1">
                        <div className="h-5 w-14 bg-zinc-200 dark:bg-zinc-700 rounded" />
                        <div className="h-8 w-16 bg-zinc-200 dark:bg-zinc-700 rounded-xl" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map((product) => {
                  const isAdding = addingToCartId === product.id;
                  const hasHoverImg = !!product.image2;
                  const isOutOfStock = product.stock !== undefined && product.stock <= 0;
                  
                  return (
                    <article
                      key={product.id}
                      className="group bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200/60 dark:border-zinc-800 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col"
                    >
                      {/* ── IMAGE AREA ── */}
                      <div className="relative block overflow-hidden shrink-0" style={{ aspectRatio: "4/3" }}>

                        <Link href={`/products/${product.slug || product.id}`} className="absolute inset-0 z-0">
                          {/* Primary image */}
                          {product.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={product.image}
                              alt={product.name}
                              className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${hasHoverImg ? "group-hover:opacity-0 group-hover:scale-105" : "group-hover:scale-105"}`}
                            />
                          ) : (
                            <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient} flex items-center justify-center`}>
                              <span className="text-6xl select-none group-hover:scale-110 transition-transform duration-500">
                                {product.emoji}
                              </span>
                            </div>
                          )}

                          {/* Hover / second image */}
                          {hasHoverImg && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={product.image2}
                              alt={`${product.name} – view 2`}
                              className="absolute inset-0 w-full h-full object-cover opacity-0 scale-105 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500"
                            />
                          )}
                        </Link>

                        {/* Out of Stock Overlay */}
                        {isOutOfStock && (
                          <div className="absolute inset-0 bg-white/60 dark:bg-black/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
                            <span className="bg-zinc-900 text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg">
                              Out of Stock
                            </span>
                          </div>
                        )}

                        {/* Gradient overlay at bottom */}
                        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent z-10 pointer-events-none" />

                        {/* Hover Action Buttons */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white dark:bg-zinc-800 px-4 py-2.5 rounded-2xl shadow-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-30">
                          <button 
                            className="text-zinc-600 dark:text-zinc-400 hover:text-brand-green dark:hover:text-brand-gold transition-colors"
                            title="Quick View"
                            onClick={(e) => {
                              e.preventDefault();
                              setQuickViewProduct(product);
                            }}
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-700" />
                          <button 
                            className={`${isOutOfStock ? "text-zinc-300 dark:text-zinc-600 cursor-not-allowed" : "text-zinc-600 dark:text-zinc-400 hover:text-brand-green dark:hover:text-brand-gold"} transition-colors`}
                            title={isOutOfStock ? "Out of Stock" : "Add to Cart"}
                            onClick={(e) => {
                              e.preventDefault();
                              if (!isOutOfStock) handleAddToCart(product);
                            }}
                            disabled={isOutOfStock}
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </button>
                          <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-700" />
                          <button 
                            className={`${isInWishlist(product.id) ? "text-red-500 dark:text-red-400" : "text-zinc-600 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400"} transition-colors`}
                            title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                            onClick={(e) => {
                              e.preventDefault();
                              toggleWishlist(product);
                            }}
                          >
                            <Heart className="w-5 h-5" fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                          </button>
                        </div>

                        {/* Badges – top left */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1 z-20 pointer-events-none">
                          {product.isBestSeller && (
                            <span className="bg-brand-gold text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow">
                              Best Seller
                            </span>
                          )}
                          {product.isNew && (
                            <span className="bg-brand-green text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow">
                              New
                            </span>
                          )}
                          {product.originalPrice && (
                            <span className="bg-red-500 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow">
                              Sale
                            </span>
                          )}
                        </div>

                        {/* Veg mark – top right */}
                        <div className="absolute top-3 right-3 z-20 pointer-events-none">
                          {product.isVeg ? (
                            <div className="veg-mark shadow" title="Vegetarian">
                              <div className="veg-mark-dot" />
                            </div>
                          ) : (
                            <div className="w-3.5 h-3.5 border border-red-600 bg-white rounded-sm flex items-center justify-center" title="Non-Vegetarian">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                            </div>
                          )}
                        </div>

                        {/* Weight pill – bottom right */}
                        {product.weightOrQty && (
                          <span className="absolute bottom-3 right-3 z-20 bg-black/50 text-white text-[9px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm pointer-events-none">
                            {product.weightOrQty}
                          </span>
                        )}
                      </div>

                      {/* ── CONTENT ── */}
                      <div className="p-4 flex-1 flex flex-col gap-2">

                        {/* Category */}
                        <span className="text-[10px] font-bold text-brand-green dark:text-brand-gold uppercase tracking-widest">
                          {product.categoryLabel}
                        </span>

                        {/* Name */}
                        <Link href={`/products/${product.slug || product.id}`}>
                          <h3 className="text-sm font-extrabold text-zinc-800 dark:text-zinc-100 group-hover:text-brand-green dark:group-hover:text-brand-gold transition-colors line-clamp-1 leading-snug">
                            {product.name}
                          </h3>
                        </Link>

                        {/* Description */}
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed flex-1">
                          {product.description}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center gap-1.5">
                          <div className="flex">
                            {[1,2,3,4,5].map((s) => (
                              <Star key={s} className={`w-3 h-3 ${s <= Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "fill-zinc-200 text-zinc-200 dark:fill-zinc-700 dark:text-zinc-700"}`} />
                            ))}
                          </div>
                          <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500">
                            {product.rating.toFixed(1)}
                            {product.reviewsCount > 0 && ` (${product.reviewsCount})`}
                          </span>
                        </div>

                        {/* Price + CTA */}
                        <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-100 dark:border-zinc-800 mt-1">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-base font-black text-zinc-900 dark:text-zinc-100">₹{product.price}</span>
                            {product.originalPrice && (
                              <span className="text-[11px] text-zinc-400 line-through">₹{product.originalPrice}</span>
                            )}
                          </div>

                          <button
                            onClick={() => { if (!isOutOfStock) handleAddToCart(product); }}
                            disabled={isAdding || isOutOfStock}
                            className={`flex items-center gap-1.5 py-2 px-3.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 ${
                              isOutOfStock
                                ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed"
                                : isAdding
                                  ? "bg-emerald-600 text-white scale-95"
                                  : "bg-brand-green hover:bg-brand-green-light text-white dark:bg-brand-gold dark:text-brand-green dark:hover:bg-brand-gold-light hover:shadow-md"
                            }`}
                          >
                            {isOutOfStock ? (
                              <span>Out of Stock</span>
                            ) : isAdding ? (
                              <><Check className="w-3.5 h-3.5 stroke-[3px]" /><span>Added!</span></>
                            ) : (
                              <><ShoppingBag className="w-3.5 h-3.5" /><span>Add</span></>
                            )}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              // EMPTY STATE
              <div className="bg-white dark:bg-zinc-900/60 rounded-3xl p-12 text-center border border-zinc-200/50 dark:border-zinc-850 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center text-amber-500 mb-4">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-extrabold text-zinc-800 dark:text-zinc-100 mb-2">
                  No Traditional Foods Match Your Filters
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-450 max-w-sm mb-6 leading-relaxed">
                  Try searching for a different keyword, clearing your price range, or switching to another category.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="flex items-center gap-2 py-2.5 px-6 rounded-2xl bg-brand-green text-white hover:bg-brand-green-light dark:bg-brand-gold dark:text-brand-green dark:hover:bg-brand-gold-light text-xs font-bold tracking-wide uppercase transition-all shadow-md"
                >
                  <span>Show All Products</span>
                </button>
              </div>
            )}

          </main>

        </div>
      </div>
      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setQuickViewProduct(null)} />
          <div className="relative bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-700 rounded-full backdrop-blur-sm transition-colors text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col md:flex-row h-full max-h-[80vh]">
              <div className="w-full md:w-1/2 relative bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center min-h-[300px]">
                {quickViewProduct.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={quickViewProduct.image} alt={quickViewProduct.name} className="w-full h-full object-cover" />
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${quickViewProduct.gradient} flex items-center justify-center`}>
                    <span className="text-8xl">{quickViewProduct.emoji}</span>
                  </div>
                )}
                {quickViewProduct.isBestSeller && (
                  <span className="absolute top-4 left-4 bg-brand-gold text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow">
                    Best Seller
                  </span>
                )}
              </div>
              <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col overflow-y-auto">
                <span className="text-xs font-bold text-brand-green dark:text-brand-gold uppercase tracking-widest mb-2">
                  {quickViewProduct.categoryLabel}
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-zinc-100 mb-2">
                  {quickViewProduct.name}
                </h2>
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <div className="flex items-center text-brand-gold">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current opacity-50" />
                  </div>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">4.5 Rating</span>
                </div>
                
                <div className="flex items-end gap-3 mb-6">
                  <span className="text-3xl font-black text-brand-green dark:text-brand-gold">
                    ₹{quickViewProduct.price}
                  </span>
                  {quickViewProduct.originalPrice && (
                    <span className="text-lg font-bold text-zinc-400 dark:text-zinc-500 line-through mb-1">
                      ₹{quickViewProduct.originalPrice}
                    </span>
                  )}
                </div>

                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mb-8 flex-1">
                  {quickViewProduct.description || "A delicious and wholesome traditional product crafted with care, preserving the authentic flavors."}
                </p>

                <div className="flex flex-col gap-3 mt-auto">
                  <button
                    onClick={() => {
                      if (!(quickViewProduct.stock !== undefined && quickViewProduct.stock <= 0)) {
                        handleAddToCart(quickViewProduct);
                        setQuickViewProduct(null);
                      }
                    }}
                    disabled={quickViewProduct.stock !== undefined && quickViewProduct.stock <= 0}
                    className={`w-full py-4 rounded-2xl font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                      quickViewProduct.stock !== undefined && quickViewProduct.stock <= 0
                        ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed"
                        : "bg-brand-green hover:bg-brand-green-light dark:bg-brand-gold dark:hover:bg-brand-gold-light text-white dark:text-brand-green"
                    }`}
                  >
                    <ShoppingBag className="w-5 h-5" />
                    {quickViewProduct.stock !== undefined && quickViewProduct.stock <= 0 ? "Out of Stock" : "Add to Cart"}
                  </button>
                  <button
                    onClick={() => toggleWishlist(quickViewProduct)}
                    className="w-full py-4 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-2xl font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                  >
                    <Heart className="w-5 h-5" fill={isInWishlist(quickViewProduct.id) ? "currentColor" : "none"} />
                    {isInWishlist(quickViewProduct.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center min-h-[80vh] bg-[#faf8f5] dark:bg-[#061410]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-zinc-200 border-t-brand-green dark:border-t-brand-gold rounded-full animate-spin" />
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Loading Pantry...</p>
          </div>
        </div>
      }
    >
      <ProductsPageContent />
    </Suspense>
  );
}
