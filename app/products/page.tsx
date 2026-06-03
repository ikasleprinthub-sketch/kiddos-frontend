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
  ChevronRight, 
  AlertCircle, 
  Sparkles,
  ShoppingBag
} from "lucide-react";
import { PRODUCTS, CATEGORIES, Product } from "@/components/productsData";

function ProductsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get initial filters from URL params if present
  const initialCategory = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("search") || "";
  const initialMaxPrice = searchParams.get("maxPrice") 
    ? parseInt(searchParams.get("maxPrice")!) 
    : 700;

  // State Management
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [maxPrice, setMaxPrice] = useState<number>(initialMaxPrice);
  const [sortBy, setSortBy] = useState<string>("featured");
  
  // Cart feedback state (per product id)
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);
  
  // Sync state changes with URL parameters for shareable filtering
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (searchQuery) params.set("search", searchQuery);
    if (maxPrice !== 700) params.set("maxPrice", maxPrice.toString());
    
    const queryString = params.toString();
    const targetUrl = queryString ? `/products?${queryString}` : "/products";
    router.replace(targetUrl, { scroll: false });
  }, [selectedCategory, searchQuery, maxPrice, router]);

  // Sync state with incoming URL changes (e.g. back button)
  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "all");
    setSearchQuery(searchParams.get("search") || "");
    setMaxPrice(searchParams.get("maxPrice") ? parseInt(searchParams.get("maxPrice")!) : 700);
  }, [searchParams]);

  // Helper to count products per category in real-time based on current filters (excluding category filter itself)
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: PRODUCTS.length };
    
    // Initialize other categories
    CATEGORIES.forEach(cat => {
      counts[cat.slug] = 0;
    });

    PRODUCTS.forEach(product => {
      // Check search query and price limits
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
  }, [searchQuery, maxPrice]);

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
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
  const handleAddToCart = (id: string) => {
    setAddingToCartId(id);
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
                    <span>🌾</span>
                    <span>All Products</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    selectedCategory === "all"
                      ? "bg-white/20 text-white dark:bg-brand-green/20 dark:text-brand-green"
                      : "bg-zinc-200/60 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                  }`}>
                    {PRODUCTS.length}
                  </span>
                </button>

                {/* Categories */}
                {CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat.slug;
                  const count = categoryCounts[cat.slug] || 0;
                  return (
                    <button
                      key={cat.slug}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all shrink-0 snap-start ${
                        isActive
                          ? "bg-brand-green text-white dark:bg-brand-gold dark:text-brand-green shadow-sm"
                          : "bg-zinc-50 hover:bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{cat.emoji}</span>
                        <span>{cat.label}</span>
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
                })}
              </div>
            </div>

            {/* SHOP BY PRICE */}
            <div className="bg-white dark:bg-zinc-900/60 rounded-3xl p-5 shadow-sm border border-zinc-250/20 dark:border-zinc-800/40">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Shop By Price
                </h3>
                {maxPrice !== 700 && (
                  <button
                    onClick={() => setMaxPrice(700)}
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
                    Up to ₹{maxPrice}
                  </span>
                </div>
                <input
                  type="range"
                  min="75"
                  max="700"
                  step="5"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  className="w-full accent-brand-gold dark:accent-brand-gold bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-400 font-bold px-0.5">
                  <span>₹75</span>
                  <span>₹387</span>
                  <span>₹700</span>
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
                      { label: "Clear Limit", val: 700 }
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
                      : CATEGORIES.find(c => c.slug === selectedCategory)?.label}
                  </span>
                </h2>
                <p className="text-xs text-zinc-450 dark:text-zinc-550">
                  Showing {filteredProducts.length} of {PRODUCTS.length} traditional goods
                </p>
              </div>

              {/* Active Filter Pills */}
              <div className="flex flex-wrap gap-1.5 my-1">
                {selectedCategory !== "all" && (
                  <span className="inline-flex items-center gap-1 bg-brand-green/10 text-brand-green dark:bg-brand-gold/15 dark:text-brand-gold text-[10px] font-bold py-1 px-2.5 rounded-full border border-brand-green/20 dark:border-brand-gold/20">
                    Category: {CATEGORIES.find(c => c.slug === selectedCategory)?.label}
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
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const isAdding = addingToCartId === product.id;
                  return (
                    <article
                      key={product.id}
                      className="group bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200/50 dark:border-zinc-850 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
                    >
                      {/* Product Visual Top */}
                      <div className={`relative h-44 w-full bg-gradient-to-br ${product.gradient} flex items-center justify-center transition-all duration-300 relative overflow-hidden shrink-0`}>
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 plastic-sheen opacity-60" />
                        
                        {/* Float background circle decoration */}
                        <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/10 dark:bg-black/10 blur-md group-hover:scale-125 transition-transform duration-300" />
                        
                        {/* Food Emoji Icon */}
                        <span className="text-6xl relative z-10 select-none transform transition-all duration-500 group-hover:scale-115 group-hover:rotate-6 drop-shadow-md">
                          {product.emoji}
                        </span>

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1 z-20">
                          {product.isBestSeller && (
                            <span className="bg-brand-gold text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                              Best Seller
                            </span>
                          )}
                          {product.isNew && (
                            <span className="bg-brand-green text-white dark:bg-brand-gold-light dark:text-brand-green text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                              New
                            </span>
                          )}
                        </div>

                        {/* Veg / Non-Veg Indicator */}
                        <div className="absolute top-3 right-3 z-20 shadow-sm rounded-xs overflow-hidden">
                          {product.isVeg ? (
                            <div className="veg-mark" title="Vegetarian">
                              <div className="veg-mark-dot" />
                            </div>
                          ) : (
                            <div className="w-3.5 h-3.5 border border-red-650 bg-white flex items-center justify-center p-0.5" title="Non-Vegetarian">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-650" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Product Content Bottom */}
                      <div className="p-5 flex-1 flex flex-col">
                        
                        {/* Category & Weight info */}
                        <div className="flex items-center justify-between text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">
                          <span>{product.categoryLabel}</span>
                          <span className="bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md text-[9px]">
                            {product.weightOrQty}
                          </span>
                        </div>

                        {/* Name */}
                        <h3 className="text-sm font-extrabold text-zinc-800 dark:text-zinc-100 group-hover:text-brand-green dark:group-hover:text-brand-gold transition-colors mb-1.5 line-clamp-1">
                          {product.name}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-zinc-500 dark:text-zinc-450 line-clamp-2 mb-4 leading-relaxed flex-1">
                          {product.description}
                        </p>

                        {/* Star Rating */}
                        <div className="flex items-center gap-1 mb-4">
                          <div className="flex items-center text-amber-400">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 ml-1">
                              {product.rating.toFixed(1)}
                            </span>
                          </div>
                          <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                            ({product.reviewsCount} reviews)
                          </span>
                        </div>

                        {/* Divider */}
                        <div className="w-full h-px bg-zinc-100 dark:bg-zinc-800/60 mb-4" />

                        {/* Action section (Price and Add) */}
                        <div className="flex items-center justify-between gap-2 mt-auto">
                          
                          <div className="flex flex-col">
                            {product.originalPrice && (
                              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 line-through">
                                ₹{product.originalPrice}
                              </span>
                            )}
                            <span className="text-base font-black text-zinc-800 dark:text-zinc-100">
                              ₹{product.price}
                            </span>
                          </div>

                          <button
                            onClick={() => handleAddToCart(product.id)}
                            disabled={isAdding}
                            className={`flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold tracking-wide transition-all ${
                              isAdding
                                ? "bg-emerald-600 text-white shadow-inner scale-95"
                                : "bg-brand-green hover:bg-brand-green-light text-white dark:bg-brand-gold dark:text-brand-green dark:hover:bg-brand-gold-light hover:shadow-md active:translate-y-0.5"
                            }`}
                          >
                            {isAdding ? (
                              <>
                                <Check className="w-3.5 h-3.5 stroke-[3px]" />
                                <span>Added!</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>Add to Cart</span>
                              </>
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
