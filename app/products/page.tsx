"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  Search, 
  ChevronDown, 
  Check, 
  X, 
  Filter, 
  SlidersHorizontal, 
  ArrowLeft, 
  ArrowRight, 
  Heart, 
  Eye, 
  ShoppingCart, 
  ShoppingBag, 
  AlertCircle, 
  ChevronRight,
  Home, 
  ArrowUpDown, 
  Sparkles, 
  RefreshCcw 
} from "lucide-react";
import { PRODUCTS, Product } from "@/components/productsData";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { ApiCategory, ApiProduct } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import Link from "next/link";
import { CategoryIcon } from "@/components/CategoryIcon";


const CATEGORY_GRADIENTS: Record<string, string> = {
  batters: "from-amber-100 to-orange-200", batter: "from-amber-100 to-orange-200",
  "spice-blends": "from-red-100 to-rose-200", "organic-spices": "from-red-100 to-rose-200", spices: "from-red-100 to-rose-200",
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
const FALLBACK_GRADIENTS = ["from-amber-100 to-orange-200","from-red-100 to-rose-200","from-green-100 to-emerald-200","from-yellow-100 to-lime-200"];

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
    emoji: "",
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
  // Get initial filters from URL params if present
  const initialCategory = searchParams.get("category");
  const initialCategories = initialCategory ? initialCategory.split(',') : [];
  const initialSearch = searchParams.get("search") || "";
  const DEFAULT_MAX_PRICE = 1000000;
  const initialMaxPrice = searchParams.get("maxPrice")
    ? parseInt(searchParams.get("maxPrice")!)
    : DEFAULT_MAX_PRICE;
  const initialMinPrice = searchParams.get("minPrice") ? parseInt(searchParams.get("minPrice")!) : 0;
  const initialPage = searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1;

  // State Management
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategories);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [minPrice, setMinPrice] = useState<number>(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState<number>(initialMaxPrice);
  const [sortBy, setSortBy] = useState<string>("default");

  const [promotions, setPromotions] = useState({
    newArrivals: false,
    bestSellers: false,
    onSale: false
  });

  const [availability, setAvailability] = useState({
    inStock: false,
    outOfStock: false
  });

  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const itemsPerPage = 9;

  // Live categories from backend
  const [apiCategories, setApiCategories] = useState<ApiCategory[]>([]);
  const [catsLoading, setCatsLoading] = useState(true);

  // Live products from backend
  const [apiProducts, setApiProducts] = useState<Product[]>([]);
  const [prodsLoading, setProdsLoading] = useState(true);

  // Quick View Modal
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isMobileSortOpen, setIsMobileSortOpen] = useState(false);

  const activeFilterCount = selectedCategories.length
    + (minPrice > 0 ? 1 : 0)
    + (maxPrice !== DEFAULT_MAX_PRICE ? 1 : 0)
    + Object.values(promotions).filter(Boolean).length
    + Object.values(availability).filter(Boolean).length;

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
  // Sync state changes with URL parameters for shareable filtering
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategories.length > 0) params.set("category", selectedCategories.join(","));
    if (searchQuery) params.set("search", searchQuery);
    if (minPrice > 0) params.set("minPrice", minPrice.toString());
    if (maxPrice !== DEFAULT_MAX_PRICE) params.set("maxPrice", maxPrice.toString());
    if (currentPage > 1) params.set("page", currentPage.toString());
    
    const queryString = params.toString();
    const targetUrl = queryString ? `/products?${queryString}` : "/products";
    router.replace(targetUrl, { scroll: false });
  }, [selectedCategories, searchQuery, minPrice, maxPrice, currentPage, router]);

  // Sync state with incoming URL changes (e.g. back button)
  useEffect(() => {
    const cats = searchParams.get("category");
    const newCats = cats ? cats.split(",") : [];
    setSelectedCategories(prev => {
      if (prev.join(",") === newCats.join(",")) return prev;
      return newCats;
    });
    setSearchQuery(searchParams.get("search") || "");
    setMinPrice(searchParams.get("minPrice") ? parseInt(searchParams.get("minPrice")!) : 0);
    setMaxPrice(searchParams.get("maxPrice") ? parseInt(searchParams.get("maxPrice")!) : DEFAULT_MAX_PRICE);
    setCurrentPage(searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1);
  }, [searchParams]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, searchQuery, minPrice, maxPrice, sortBy, promotions, availability]);

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
  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      // Category Filter
      let matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      
      // Hide chutney books when viewing all products (no specific category or search)
      if (selectedCategories.length === 0 && !searchQuery && ["chutney-book", "chutney-books"].includes(product.category)) {
        matchesCategory = false;
      }
      
      // Search Filter
      const matchesSearch = searchQuery
        ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;
        
      // Price Filter
      const matchesPrice = product.price >= minPrice && product.price <= maxPrice;

      // Promotions Filter
      const matchesNewArrivals = !promotions.newArrivals || product.isNew;
      const matchesBestSellers = !promotions.bestSellers || product.isBestSeller;
      const matchesOnSale = !promotions.onSale || (product.originalPrice != null && product.price < product.originalPrice);
      
      // Availability Filter
      const productInStock = (product.stock ?? 1) > 0;
      const matchesAvailability = (!availability.inStock && !availability.outOfStock) || 
                                  (availability.inStock && productInStock) || 
                                  (availability.outOfStock && !productInStock);

      return matchesCategory && matchesSearch && matchesPrice && matchesNewArrivals && matchesBestSellers && matchesOnSale && matchesAvailability;
    }).sort((a, b) => {
      if (sortBy === "price-low-high") return a.price - b.price;
      if (sortBy === "price-high-low") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0; // default sorting
    });
  }, [selectedCategories, searchQuery, minPrice, maxPrice, sortBy, promotions, availability, allProducts]);

  // Handle Add to Cart animation triggers
  const handleAddToCart = (product: Product) => {
    setAddingToCartId(product.id);
    addItem({
      id: product.id,
      productId: product.id,
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
    setSelectedCategories([]);
    setSearchQuery("");
    setMinPrice(0);
    setMaxPrice(DEFAULT_MAX_PRICE);
    setSortBy("default");
    setPromotions({ newArrivals: false, bestSellers: false, onSale: false });
    setAvailability({ inStock: false, outOfStock: false });
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
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6 text-white">
            Our Products
          </h1>
          
          {/* Breadcrumb Pill */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 text-sm font-medium">
            <Link href="/" className="flex items-center gap-1.5 text-white/80 hover:text-brand-gold transition-colors">
              <Home className="w-4 h-4 text-brand-gold" />
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/40" />
            <span className="text-white">Our Products</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── LEFT COLUMN: SIDEBAR FILTERS ── */}
          <aside className="hidden lg:block lg:w-[260px] shrink-0 space-y-8 pr-4">
            <h2 className="text-[17px] font-bold text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-zinc-800 pb-4">
              Filter Options
            </h2>
            
            {/* By Categories */}
            <div className="space-y-4">
              <h3 className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100">
                By Categories
              </h3>
              <div className="space-y-3.5">
                {catsLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-4 rounded bg-zinc-100 dark:bg-zinc-800 animate-pulse w-3/4" />
                  ))
                ) : (
                  apiCategories.map((cat) => {
                    const isChecked = selectedCategories.includes(cat.slug);
                    return (
                      <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors ${
                          isChecked 
                            ? 'bg-brand-green border-brand-green dark:bg-brand-gold dark:border-brand-gold text-white dark:text-brand-green' 
                            : 'bg-white border-zinc-300 dark:bg-zinc-900 dark:border-zinc-700 group-hover:border-brand-green dark:group-hover:border-brand-gold'
                        }`}>
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCategories([...selectedCategories, cat.slug]);
                            } else {
                              setSelectedCategories(selectedCategories.filter(c => c !== cat.slug));
                            }
                          }}
                        />
                        <span className={`text-sm ${isChecked ? 'text-zinc-900 dark:text-white' : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'}`}>
                          {cat.name}
                        </span>
                      </label>
                    );
                  })
                )}
              </div>
            </div>

            {/* Price Filter — dual range slider */}
            <div className="space-y-4 pt-2 border-t border-zinc-100 dark:border-zinc-800/50">
              <h3 className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100">Price</h3>
              <div className="space-y-4">
                <div className="text-[13px] text-zinc-500 dark:text-zinc-400 font-medium tracking-wide">
                  ₹{minPrice} to ₹{maxPrice === DEFAULT_MAX_PRICE ? `${maxSliderValue}+` : maxPrice}
                </div>

                {/* Dual-range track */}
                <div className="relative h-5 flex items-center">
                  {/* Background track */}
                  <div className="absolute w-full h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                  {/* Active range highlight */}
                  <div
                    className="absolute h-1.5 rounded-full bg-brand-green dark:bg-brand-gold"
                    style={{
                      left: `${(minPrice / maxSliderValue) * 100}%`,
                      right: `${100 - (Math.min(maxPrice === DEFAULT_MAX_PRICE ? maxSliderValue : maxPrice, maxSliderValue) / maxSliderValue) * 100}%`,
                    }}
                  />

                  {/* Min thumb knob */}
                  <div
                    className="absolute w-4 h-4 rounded-full bg-brand-green dark:bg-brand-gold border-2 border-white dark:border-zinc-900 shadow-md pointer-events-none z-10"
                    style={{ left: `calc(${(minPrice / maxSliderValue) * 100}% - 8px)` }}
                  />
                  {/* Max thumb knob */}
                  <div
                    className="absolute w-4 h-4 rounded-full bg-brand-green dark:bg-brand-gold border-2 border-white dark:border-zinc-900 shadow-md pointer-events-none z-10"
                    style={{
                      left: `calc(${(Math.min(maxPrice === DEFAULT_MAX_PRICE ? maxSliderValue : maxPrice, maxSliderValue) / maxSliderValue) * 100}% - 8px)`,
                    }}
                  />

                  {/* Min range input (transparent, on top) */}
                  <input
                    type="range"
                    min={0}
                    max={maxSliderValue}
                    step={5}
                    value={minPrice}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      const effectiveMax = maxPrice === DEFAULT_MAX_PRICE ? maxSliderValue : maxPrice;
                      if (val < effectiveMax - 5) setMinPrice(val);
                    }}
                    className="absolute w-full h-full opacity-0 cursor-pointer"
                    style={{ zIndex: minPrice > maxSliderValue * 0.8 ? 5 : 3 }}
                  />
                  {/* Max range input (transparent, on top) */}
                  <input
                    type="range"
                    min={0}
                    max={maxSliderValue}
                    step={5}
                    value={maxPrice === DEFAULT_MAX_PRICE ? maxSliderValue : maxPrice}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val > minPrice + 5) {
                        setMaxPrice(val >= maxSliderValue ? DEFAULT_MAX_PRICE : val);
                      }
                    }}
                    className="absolute w-full h-full opacity-0 cursor-pointer"
                    style={{ zIndex: 4 }}
                  />
                </div>
              </div>
            </div>

            {/* By Promotions */}
            <div className="space-y-4 pt-2 border-t border-zinc-100 dark:border-zinc-800/50">
              <h3 className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100">
                By Promotions
              </h3>
              <div className="space-y-3.5">
                {[
                  { id: 'newArrivals', label: 'New Arrivals' },
                  { id: 'bestSellers', label: 'Best Sellers' },
                  { id: 'onSale', label: 'On Sale' }
                ].map((promo) => {
                  const isChecked = promotions[promo.id as keyof typeof promotions];
                  return (
                    <label key={promo.id} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors ${
                        isChecked 
                          ? 'bg-brand-green border-brand-green dark:bg-brand-gold dark:border-brand-gold text-white dark:text-brand-green' 
                          : 'bg-white border-zinc-300 dark:bg-zinc-900 dark:border-zinc-700 group-hover:border-brand-green dark:group-hover:border-brand-gold'
                      }`}>
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isChecked}
                        onChange={(e) => setPromotions({ ...promotions, [promo.id]: e.target.checked })}
                      />
                      <span className={`text-sm ${isChecked ? 'text-zinc-900 dark:text-white' : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'}`}>
                        {promo.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Availability */}
            <div className="space-y-4 pt-2 border-t border-zinc-100 dark:border-zinc-800/50">
              <h3 className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100">
                Availability
              </h3>
              <div className="space-y-3.5">
                {[
                  { id: 'inStock', label: 'In Stock' },
                  { id: 'outOfStock', label: 'Out of Stocks' }
                ].map((avail) => {
                  const isChecked = availability[avail.id as keyof typeof availability];
                  return (
                    <label key={avail.id} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors ${
                        isChecked 
                          ? 'bg-brand-green border-brand-green dark:bg-brand-gold dark:border-brand-gold text-white dark:text-brand-green' 
                          : 'bg-white border-zinc-300 dark:bg-zinc-900 dark:border-zinc-700 group-hover:border-brand-green dark:group-hover:border-brand-gold'
                      }`}>
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isChecked}
                        onChange={(e) => setAvailability({ ...availability, [avail.id]: e.target.checked })}
                      />
                      <span className={`text-sm ${isChecked ? 'text-zinc-900 dark:text-white' : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'}`}>
                        {avail.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* ── RIGHT COLUMN: PRODUCTS LIST ── */}
          <main className="flex-1">

            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products…"
                className="w-full pl-11 pr-10 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-green dark:focus:ring-brand-gold shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* MOBILE FILTER & SORT BUTTONS */}
            <div className="lg:hidden flex gap-2 mb-4">
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filter</span>
                {activeFilterCount > 0 && (
                  <span className="ml-1 bg-brand-green text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsMobileSortOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <ArrowUpDown className="w-4 h-4" />
                <span>Sort</span>
              </button>
            </div>

            {/* GRID CONTROLS / SORTING */}
            <div className="flex flex-col mb-8 space-y-4">

              {/* Top Row: Showing Results & Sort */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-[13px] font-medium text-zinc-500 dark:text-zinc-400">
                  {prodsLoading
                    ? "Loading results..."
                    : `Showing ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, filteredProducts.length)} of ${filteredProducts.length} results`}
                </p>

                <div className="flex items-center gap-2 shrink-0">
                  <label htmlFor="sort-select" className="text-[13px] font-medium text-zinc-500 dark:text-zinc-400">
                    Sort by :
                  </label>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent border-none py-1.5 pl-2 pr-6 text-[13px] font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-0 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2371717a%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[right_4px_center] bg-no-repeat"
                  >
                    <option value="default">Default Sorting</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
              </div>

              {/* Active Filters Row */}
              {(selectedCategories.length > 0 || maxPrice !== DEFAULT_MAX_PRICE || minPrice > 0 || promotions.newArrivals || promotions.bestSellers || promotions.onSale || availability.inStock || availability.outOfStock) && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[13px] font-medium text-zinc-500 dark:text-zinc-400 mr-2">Active Filter</span>
                  
                  {maxPrice !== DEFAULT_MAX_PRICE && (
                    <span className="inline-flex items-center gap-1 bg-[#2C4A3B] text-white text-[12px] font-medium py-1 px-3 rounded-full">
                      Price: ₹{minPrice.toFixed(2)} - ₹{maxPrice.toFixed(2)}
                      <button onClick={() => setMaxPrice(DEFAULT_MAX_PRICE)} className="hover:text-zinc-300 ml-1"><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {promotions.bestSellers && (
                    <span className="inline-flex items-center gap-1 bg-[#2C4A3B] text-white text-[12px] font-medium py-1 px-3 rounded-full">
                      Best Seller
                      <button onClick={() => setPromotions({ ...promotions, bestSellers: false })} className="hover:text-zinc-300 ml-1"><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {promotions.newArrivals && (
                    <span className="inline-flex items-center gap-1 bg-[#2C4A3B] text-white text-[12px] font-medium py-1 px-3 rounded-full">
                      New Arrival
                      <button onClick={() => setPromotions({ ...promotions, newArrivals: false })} className="hover:text-zinc-300 ml-1"><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {promotions.onSale && (
                    <span className="inline-flex items-center gap-1 bg-[#2C4A3B] text-white text-[12px] font-medium py-1 px-3 rounded-full">
                      On Sale
                      <button onClick={() => setPromotions({ ...promotions, onSale: false })} className="hover:text-zinc-300 ml-1"><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {availability.inStock && (
                    <span className="inline-flex items-center gap-1 bg-[#2C4A3B] text-white text-[12px] font-medium py-1 px-3 rounded-full">
                      In Stock
                      <button onClick={() => setAvailability({ ...availability, inStock: false })} className="hover:text-zinc-300 ml-1"><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {availability.outOfStock && (
                    <span className="inline-flex items-center gap-1 bg-[#2C4A3B] text-white text-[12px] font-medium py-1 px-3 rounded-full">
                      Out of Stock
                      <button onClick={() => setAvailability({ ...availability, outOfStock: false })} className="hover:text-zinc-300 ml-1"><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {selectedCategories.map(cat => (
                    <span key={cat} className="inline-flex items-center gap-1 bg-[#2C4A3B] text-white text-[12px] font-medium py-1 px-3 rounded-full">
                      {apiCategories.find(c => c.slug === cat)?.name || cat}
                      <button onClick={() => setSelectedCategories(selectedCategories.filter(c => c !== cat))} className="hover:text-zinc-300 ml-1"><X className="w-3 h-3" /></button>
                    </span>
                  ))}

                  <button 
                    onClick={() => {
                      setSelectedCategories([]);
                      setMaxPrice(DEFAULT_MAX_PRICE);
                      setMinPrice(0);
                      setPromotions({ newArrivals: false, bestSellers: false, onSale: false });
                      setAvailability({ inStock: false, outOfStock: false });
                    }}
                    className="text-[12px] font-semibold text-brand-gold hover:underline ml-2"
                  >
                    Clear All
                  </button>
                </div>
              )}
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
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
                  {filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((product) => {
                    const isAdding = addingToCartId === product.id;
                    const hasHoverImg = !!product.image2;
                    const isOutOfStock = (product.stock ?? 1) <= 0;
                    const isRecipe = ["chutney-book", "chutney-books"].includes(product.category);
                    
                    return (
                      <div key={product.id} className="relative">
                        {/* Bestseller ribbon — on card corner, clipped to card's border-radius */}
                        {product.isBestSeller && (
                          <div className="absolute top-0 left-0 w-[90px] h-[90px] overflow-hidden rounded-tl-[20px] z-30 pointer-events-none select-none">
                            <div
                              className="absolute top-[19px] left-[-27px] w-[112px] text-center bg-[#f97316] text-white text-[9px] font-black uppercase tracking-wider py-[5px] -rotate-45"
                              style={{
                                clipPath: 'polygon(9px 0%, calc(100% - 9px) 0%, 100% 50%, calc(100% - 9px) 100%, 9px 100%, 0% 50%)',
                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.28))',
                              }}
                            >
                              Best Seller
                            </div>
                          </div>
                        )}
                        <article
                          className="group bg-white dark:bg-zinc-900 rounded-[20px] overflow-hidden border border-zinc-200/50 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col p-4"
                        >
                        {/* ── IMAGE AREA ── */}
                        <div className="relative block overflow-hidden shrink-0 rounded-2xl bg-zinc-100 dark:bg-zinc-800" style={{ aspectRatio: "4/5" }}>

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
                                  <CategoryIcon slug={product.category} className="w-16 h-16 text-zinc-600/50" />
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

                          {/* Discount badge — bottom right of image */}
                          {!isRecipe && product.originalPrice && product.originalPrice > product.price && (
                            <span className="absolute bottom-3 right-3 z-20 pointer-events-none bg-[#2C4A3B] text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm">
                              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                            </span>
                          )}

                          {/* Top Left Badges */}
                          <div className="absolute top-3 left-3 flex flex-col gap-2 z-20 pointer-events-none">
                            {isRecipe && (
                              <span className="bg-emerald-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm w-fit">
                                Free Recipe
                              </span>
                            )}
                            {product.isNew && (
                              <span className="bg-blue-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm w-fit">
                                New
                              </span>
                            )}
                          </div>

                          {/* Top Right Buttons (Wishlist & Quick View) */}
                          <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                toggleWishlist(product);
                              }}
                              className="w-8 h-8 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center shadow-md text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                              title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                            >
                              <Heart className="w-4 h-4" fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                setQuickViewProduct(product);
                              }}
                              className="w-8 h-8 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center shadow-md text-zinc-400 hover:text-brand-green dark:hover:text-brand-gold transition-colors opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 delay-75"
                              title="Quick View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {!isRecipe && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (!isOutOfStock) handleAddToCart(product);
                                }}
                                disabled={isOutOfStock || isAdding}
                                className={`w-8 h-8 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center shadow-md transition-colors opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 delay-100 ${isOutOfStock ? "text-zinc-300 dark:text-zinc-600 cursor-not-allowed" : isAdding ? "text-brand-green" : "text-zinc-400 hover:text-brand-green dark:hover:text-brand-gold"}`}
                                title={isOutOfStock ? "Out of Stock" : "Add to Cart"}
                              >
                                {isAdding ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                              </button>
                            )}
                        </div>
                        </div>

                        {/* ── CONTENT ── */}
                        <div className="pt-4 flex-1 flex flex-col">
                          
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[12px] font-medium text-zinc-400 dark:text-zinc-500">
                              {product.categoryLabel}
                            </span>
                          </div>

                          <Link href={`/products/${product.slug || product.id}`}>
                            <h3 className="text-[15px] font-bold text-zinc-800 dark:text-zinc-100 group-hover:text-brand-green dark:group-hover:text-brand-gold transition-colors line-clamp-1">
                              {product.name}
                            </h3>
                          </Link>

                          {isRecipe ? (
                            <div className="mt-2">
                              <span className="text-[13px] font-semibold text-emerald-600 dark:text-emerald-400">
                                📖 View Recipe →
                              </span>
                            </div>
                          ) : (
                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-[15px] font-bold text-[#b49852]">
                                ₹{product.price.toFixed(2)}
                              </span>
                              {product.originalPrice && (
                                <span className="text-[13px] font-medium text-zinc-400 line-through">
                                  ₹{product.originalPrice.toFixed(2)}
                                </span>
                              )}
                            </div>
                          )}

                        </div>
                        </article>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination Controls */}
                {filteredProducts.length > itemsPerPage && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <Stack spacing={2} alignItems="center">
                      <Typography sx={{ color: 'text.secondary', fontWeight: 500 }}>
                        Page: {currentPage}
                      </Typography>
                      <Pagination 
                        count={Math.ceil(filteredProducts.length / itemsPerPage)} 
                        page={currentPage} 
                        onChange={(event, value) => {
                          setCurrentPage(value);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }} 
                        color="primary"
                        shape="rounded"
                        size="large"
                      />
                    </Stack>
                  </div>
                )}
              </>
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
                  onClick={() => {
                    setSelectedCategories([]);
                    setMaxPrice(DEFAULT_MAX_PRICE);
                    setMinPrice(0);
                    setPromotions({ newArrivals: false, bestSellers: false, onSale: false });
                    setAvailability({ inStock: false, outOfStock: false });
                  }}
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
                    <CategoryIcon slug={quickViewProduct.category} className="w-24 h-24 text-zinc-600/50" />
                  </div>
                )}
                {quickViewProduct.isBestSeller && (
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
              </div>
              <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col overflow-y-auto">
                <span className="text-xs font-bold text-brand-green dark:text-brand-gold uppercase tracking-widest mb-2">
                  {quickViewProduct.categoryLabel}
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-zinc-100 mb-2">
                  {quickViewProduct.name}
                </h2>

                
                {["chutney-book", "chutney-books"].includes(quickViewProduct.category) ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 mb-6">
                    <CategoryIcon slug={quickViewProduct.category} className="w-6 h-6 text-emerald-600" />
                    <div>
                      <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Free Recipe</p>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-500">Not for sale. View and enjoy for free</p>
                    </div>
                  </div>
                ) : (
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
                )}

                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mb-8 flex-1">
                  {quickViewProduct.description || "A delicious and wholesome traditional product crafted with care, preserving the authentic flavors."}
                </p>

                <div className="flex flex-col gap-3 mt-auto">
                  {["chutney-book", "chutney-books"].includes(quickViewProduct.category) ? (
                    <Link
                      href={`/products/${quickViewProduct.slug || quickViewProduct.id}`}
                      onClick={() => setQuickViewProduct(null)}
                      className="w-full py-4 rounded-2xl font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-green-light dark:bg-brand-gold dark:hover:bg-brand-gold-light text-white dark:text-brand-green"
                    >
                      <span>📖</span> View Recipe
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        if (!((quickViewProduct.stock ?? 1) <= 0)) {
                          handleAddToCart(quickViewProduct);
                          setQuickViewProduct(null);
                        }
                      }}
                      disabled={(quickViewProduct.stock ?? 1) <= 0}
                      className={`w-full py-4 rounded-2xl font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                        (quickViewProduct.stock ?? 1) <= 0
                          ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed"
                          : "bg-brand-green hover:bg-brand-green-light dark:bg-brand-gold dark:hover:bg-brand-gold-light text-white dark:text-brand-green"
                      }`}
                    >
                      <ShoppingBag className="w-5 h-5" />
                      {(quickViewProduct.stock ?? 1) <= 0 ? "Out of Stock" : "Add to Cart"}
                    </button>
                  )}
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

      {/* ── MOBILE FILTER MODAL ── */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-zinc-900 lg:hidden animate-in slide-in-from-bottom-full duration-300">
          <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-100">Filters</h2>
            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-6">
            {/* Search Box */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products…"
                className="w-full pl-11 pr-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm"
              />
            </div>

            {/* Price Filter */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Price</h3>
              <div className="text-xs text-zinc-500">₹{minPrice} to ₹{maxPrice === DEFAULT_MAX_PRICE ? `${maxSliderValue}+` : maxPrice}</div>
              <div className="relative h-5 flex items-center">
                <div className="absolute w-full h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                <div
                  className="absolute h-1.5 rounded-full bg-brand-green dark:bg-brand-gold"
                  style={{
                    left: `${(minPrice / maxSliderValue) * 100}%`,
                    right: `${100 - (Math.min(maxPrice === DEFAULT_MAX_PRICE ? maxSliderValue : maxPrice, maxSliderValue) / maxSliderValue) * 100}%`,
                  }}
                />
                <input
                  type="range"
                  min={0}
                  max={maxSliderValue}
                  step={5}
                  value={minPrice}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    const effectiveMax = maxPrice === DEFAULT_MAX_PRICE ? maxSliderValue : maxPrice;
                    if (val < effectiveMax - 5) setMinPrice(val);
                  }}
                  className="absolute w-full h-5 opacity-0 cursor-pointer z-20"
                />
                <input
                  type="range"
                  min={0}
                  max={maxSliderValue}
                  step={5}
                  value={maxPrice === DEFAULT_MAX_PRICE ? maxSliderValue : maxPrice}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val > minPrice + 5) setMaxPrice(val === maxSliderValue ? DEFAULT_MAX_PRICE : val);
                  }}
                  className="absolute w-full h-5 opacity-0 cursor-pointer z-20"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Categories</h3>
              <div className="space-y-2">
                {apiCategories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.slug)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategories([...selectedCategories, cat.slug]);
                        } else {
                          setSelectedCategories(selectedCategories.filter(c => c !== cat.slug));
                        }
                      }}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Promotions */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Promotions</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={promotions.newArrivals}
                    onChange={(e) => setPromotions({ ...promotions, newArrivals: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm">New Arrivals</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={promotions.bestSellers}
                    onChange={(e) => setPromotions({ ...promotions, bestSellers: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm">Best Sellers</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={promotions.onSale}
                    onChange={(e) => setPromotions({ ...promotions, onSale: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm">On Sale</span>
                </label>
              </div>
            </div>

            {/* Availability */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Availability</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={availability.inStock}
                    onChange={(e) => setAvailability({ ...availability, inStock: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm">In Stock</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={availability.outOfStock}
                    onChange={(e) => setAvailability({ ...availability, outOfStock: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm">Out of Stock</span>
                </label>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex gap-4">
            <button
              onClick={handleClearFilters}
              className="flex-1 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-lg font-bold"
            >
              Clear
            </button>
            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="flex-1 py-3 bg-brand-green dark:bg-brand-gold text-white dark:text-brand-green rounded-lg font-bold"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* ── MOBILE SORT MODAL ── */}
      {isMobileSortOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileSortOpen(false)} />
          <div className="relative bg-white dark:bg-zinc-900 rounded-t-3xl p-6 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100">Sort by</h2>
              <button
                onClick={() => setIsMobileSortOpen(false)}
                className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {[
                { id: "default", label: "Default Sorting" },
                { id: "price-low-high", label: "Price: Low to High" },
                { id: "price-high-low", label: "Price: High to Low" },
                { id: "rating", label: "Top Rated" },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setSortBy(option.id);
                    setIsMobileSortOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-4 rounded-xl font-bold transition-colors ${
                    sortBy === option.id
                      ? "bg-brand-green/10 dark:bg-brand-gold/10 text-brand-green dark:text-brand-gold"
                      : "text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  {option.label}
                  {sortBy === option.id && <Check className="w-5 h-5" />}
                </button>
              ))}
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
