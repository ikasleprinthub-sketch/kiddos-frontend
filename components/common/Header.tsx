"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  LogOut,
  ShoppingBag,
  Settings,
  Heart,
  Compass,
  LayoutGrid,
  Sparkles,
} from "lucide-react";
import type { ApiCategory } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";


export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isProductsMenuOpen, setIsProductsMenuOpen] = useState(false);
  const [isMobileProductsExpanded, setIsMobileProductsExpanded] = useState(false);
  const productsHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const productsMenuRef = useRef<HTMLDivElement | null>(null);

  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [catsLoading, setCatsLoading] = useState(true);
  const [catsError, setCatsError] = useState<string | null>(null);
  const { count: cartCount } = useCart();
  const { count: wishlistCount } = useWishlist();

  const handleProductsEnter = () => {
    if (productsHoverTimeoutRef.current) {
      clearTimeout(productsHoverTimeoutRef.current);
      productsHoverTimeoutRef.current = null;
    }
    setIsProductsMenuOpen(true);
  };

  const handleProductsLeave = () => {
    if (productsHoverTimeoutRef.current) {
      clearTimeout(productsHoverTimeoutRef.current);
    }
    productsHoverTimeoutRef.current = setTimeout(() => {
      setIsProductsMenuOpen(false);
    }, 300);
  };

  // Close Products menu on outside click without requiring a full-screen DOM overlay
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        productsMenuRef.current &&
        !productsMenuRef.current.contains(event.target as Node)
      ) {
        setIsProductsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const initials = user
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2)
    : "";

  // Glassmorphism on scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile drawer is open (fixes drawer scroll glitch)
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  // Close Products dropdown on pathname change
  useEffect(() => {
    setIsProductsMenuOpen(false);
    return () => {
      if (productsHoverTimeoutRef.current) {
        clearTimeout(productsHoverTimeoutRef.current);
      }
    };
  }, [pathname]);

  // Fetch categories from API
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setCatsLoading(true);
    setCatsError(null);
    fetch("/api/categories?limit=100")
      .then((r) => r.json())
      .then((data) => {
        const list: ApiCategory[] = Array.isArray(data) ? data : (data.categories ?? []);
        const active = list.filter((c) => c.isActive);
        if (active.length === 0) {
          setCatsError("No categories available");
        } else {
          setCategories(active);
        }
      })
      .catch(() => setCatsError("Failed to load categories"))
      .finally(() => setCatsLoading(false));
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const navLinks: { name: string; href: string; download?: boolean }[] = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Franchises", href: "/franchises" },
    { name: "Contact", href: "/contact" },
  ];

  const handleCloseAll = () => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
    setIsProductsMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md shadow-md border-b border-zinc-200/30 dark:border-zinc-800/30 py-3"
          : "bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-900 py-4"
      }`}
    >
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-6 xl:px-12">
        {/*
         * Single unified flex row — works at all breakpoints.
         * Hamburger uses md:hidden so it's always in the DOM on mobile,
         * never missing regardless of viewport width.
         */}
        <div className="flex items-center justify-between gap-2 md:gap-4">

          {/* ── Left: hamburger (mobile) + logo ── */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Hamburger — ALWAYS present in markup, hidden on md+ via md:hidden */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-full bg-zinc-100/60 dark:bg-zinc-900/40 text-zinc-600 dark:text-zinc-300 hover:text-brand-green dark:hover:text-brand-gold border border-zinc-200/20 dark:border-zinc-850 transition-all duration-200 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Logo — compact on mobile, full-size on desktop */}
            <Link href="/" onClick={handleCloseAll} className="group flex-shrink-0">
              <div className="relative h-12 w-28 md:h-16 md:w-40 lg:h-12 lg:w-32 xl:h-16 xl:w-48 2xl:h-20 2xl:w-64 overflow-hidden">
                <Image
                  src="/orglogo.webp"
                  alt="Kiddos Foods Logo"
                  fill
                  sizes="(max-width: 768px) 112px, 256px"
                  className="object-contain dark:brightness-110 md:group-hover:scale-105 transition-transform duration-200"
                  priority
                />
              </div>
            </Link>

            {/* Shop by Categories Dropdown (Desktop) */}
            <div className="hidden lg:block relative group ml-2 xl:ml-6">
              <Link 
                href="/products"
                className="flex items-center gap-1.5 px-2.5 py-1 lg:py-1 xl:px-3.5 xl:py-1.5 bg-brand-green text-white dark:bg-brand-gold dark:text-brand-green rounded-full font-medium text-[10px] lg:text-[11px] xl:text-xs hover:bg-brand-green-light dark:hover:bg-brand-gold-light shadow-sm transition-all duration-200"
              >
                <LayoutGrid className="w-3 h-3 xl:w-3.5 xl:h-3.5" />
                <span>Categories</span>
                <ChevronDown className="w-3 h-3 xl:w-3.5 xl:h-3.5 transition-transform duration-200 group-hover:rotate-180" />
              </Link>
              
              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="w-[240px] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-2xl shadow-xl shadow-zinc-200/50 dark:shadow-black/50 border border-zinc-100 dark:border-zinc-800 p-2 max-h-[70vh] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                  {catsLoading ? (
                    <div className="p-4 text-center text-sm text-zinc-500">Loading...</div>
                  ) : catsError ? (
                    <div className="p-4 text-center text-sm text-red-500 dark:text-red-400">{catsError}</div>
                  ) : categories.length > 0 ? (
                    <>
                      {categories.map(cat => (
                        <Link
                          key={cat.id}
                          href={`/products?category=${cat.slug}`}
                          className="flex items-center justify-between p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-colors group/item"
                        >
                          <div className="flex flex-col flex-1 min-w-0 pr-1">
                            <span className="text-[13px] font-bold text-zinc-850 dark:text-zinc-200 group-hover/item:text-brand-green dark:group-hover/item:text-brand-gold transition-colors truncate">{cat.name}</span>
                            {cat._count?.products !== undefined && (
                              <span className="text-[10px] text-zinc-500 dark:text-zinc-400">{cat._count.products} products</span>
                            )}
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover/item:text-brand-green dark:group-hover/item:text-brand-gold group-hover/item:translate-x-0.5 transition-all opacity-0 group-hover/item:opacity-100 flex-shrink-0" />
                        </Link>
                      ))}
                      <div className="mt-1.5 pt-1.5 border-t border-zinc-100 dark:border-zinc-800">
                        <Link
                          href="/products"
                          className="flex items-center justify-between p-2 text-xs font-semibold text-brand-green dark:text-brand-gold hover:bg-brand-green/5 dark:hover:bg-brand-gold/10 rounded-xl transition-colors group/viewall"
                        >
                          <span>View All Products</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover/viewall:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </>
                  ) : (
                    <div className="p-4 text-center text-sm text-zinc-500">No categories available</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Center: desktop nav pill ── */}
          <nav className="hidden lg:flex items-center flex-1 justify-center min-w-0 px-1 xl:px-2">
            <div className="flex items-center gap-0 lg:gap-0.5 xl:gap-1 p-1 lg:p-0.5 xl:p-1.5 bg-zinc-100/80 dark:bg-zinc-900/60 border border-zinc-200/40 dark:border-zinc-800/40 rounded-full shadow-inner backdrop-blur-sm overflow-visible relative" style={{ scrollbarWidth: 'none' }}>
              {navLinks.map((link) => {
                const isActive = pathname === link.href && !link.download;
                const isProducts = link.name === "Products";

                if (isProducts) {
                  return (
                    <div
                      key={link.name}
                      ref={productsMenuRef}
                      className="relative group"
                      onMouseEnter={handleProductsEnter}
                      onMouseLeave={handleProductsLeave}
                    >
                      <Link
                        href={link.href}
                        onClick={handleCloseAll}
                        className={`relative inline-flex items-center gap-1 px-2.5 lg:px-2 xl:px-4 2xl:px-5 py-2 lg:py-1.5 xl:py-2 text-xs lg:text-[11px] xl:text-[13px] 2xl:text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap shrink-0 ${
                          isActive
                            ? "bg-brand-green text-white dark:bg-brand-gold dark:text-brand-green font-semibold shadow-sm"
                            : "text-zinc-600 hover:text-brand-green dark:text-zinc-300 dark:hover:text-brand-gold hover:bg-zinc-200/40 dark:hover:bg-zinc-800/40"
                        }`}
                        aria-expanded={isProductsMenuOpen}
                        aria-haspopup="true"
                      >
                        <span>{link.name}</span>
                        <ChevronDown
                          className={`w-3 h-3 xl:w-3.5 xl:h-3.5 transition-transform duration-200 ${
                            isProductsMenuOpen
                              ? "rotate-180 text-brand-gold dark:text-brand-green"
                              : "opacity-60 group-hover:rotate-180"
                          }`}
                        />
                      </Link>

                      {/* Dropdown Menu Container */}
                      <div
                        className={`absolute top-full -mt-1 left-1/2 -translate-x-1/2 pt-3 z-50 transition-all duration-200 origin-top ${
                          isProductsMenuOpen
                            ? "opacity-100 visible translate-y-0 scale-100 pointer-events-auto"
                            : "opacity-0 invisible -translate-y-2 scale-95 pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:scale-100 group-hover:pointer-events-auto"
                        }`}
                        onMouseEnter={handleProductsEnter}
                        onMouseLeave={handleProductsLeave}
                      >
                        {/* Invisible hover bridge to prevent hover loss */}
                        <div className="relative before:content-[''] before:absolute before:-top-4 before:left-0 before:right-0 before:h-5 before:z-10">
                          <div className="w-[460px] xl:w-[500px] max-w-[calc(100vw-2rem)] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-zinc-300/50 dark:shadow-black/70 border border-zinc-100 dark:border-zinc-800 p-4 overflow-hidden">
                            {/* Header row */}
                            <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-100 dark:border-zinc-800/80 px-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                  Product Categories
                                </span>
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-green/10 text-brand-green dark:bg-brand-gold/15 dark:text-brand-gold">
                                  100% Natural
                                </span>
                              </div>
                              <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                                {categories.length} {categories.length === 1 ? "category" : "categories"}
                              </span>
                            </div>

                            {/* Categories Grid */}
                            {catsLoading ? (
                              <div className="grid grid-cols-2 gap-2.5 py-2">
                                {[1, 2, 3, 4].map((n) => (
                                  <div key={n} className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-850 animate-pulse space-y-1.5">
                                    <div className="h-3.5 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4" />
                                    <div className="h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded w-1/2" />
                                  </div>
                                ))}
                              </div>
                            ) : catsError ? (
                              <div className="p-4 text-center text-sm text-red-500 dark:text-red-400">{catsError}</div>
                            ) : categories.length > 0 ? (
                              <div className="grid grid-cols-2 gap-2.5 max-h-[340px] overflow-y-auto pr-0.5" style={{ scrollbarWidth: "thin" }}>
                                {categories.map((cat) => (
                                  <Link
                                    key={cat.id}
                                    href={`/products?category=${cat.slug}`}
                                    onClick={() => {
                                      setIsProductsMenuOpen(false);
                                      handleCloseAll();
                                    }}
                                    className="group/item flex items-center justify-between p-3 rounded-2xl bg-zinc-50/70 hover:bg-brand-green/5 dark:bg-zinc-800/40 dark:hover:bg-zinc-800/90 border border-zinc-200/50 hover:border-brand-green/30 dark:border-zinc-800 dark:hover:border-brand-gold/40 transition-all duration-200 hover:shadow-xs hover:-translate-y-0.5"
                                  >
                                    <div className="flex flex-col flex-1 min-w-0 pr-2">
                                      <div className="flex items-center gap-2">
                                        <span className="text-[13px] font-bold text-zinc-850 dark:text-zinc-100 group-hover/item:text-brand-green dark:group-hover/item:text-brand-gold transition-colors truncate">
                                          {cat.name}
                                        </span>
                                        {cat._count?.products !== undefined && (
                                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 group-hover/item:bg-brand-green/10 group-hover/item:text-brand-green dark:group-hover/item:bg-brand-gold/15 dark:group-hover/item:text-brand-gold transition-colors flex-shrink-0">
                                            {cat._count.products}
                                          </span>
                                        )}
                                      </div>
                                      <span className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                                        {cat.description || "View products"}
                                      </span>
                                    </div>

                                    {/* Hover arrow */}
                                    <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover/item:text-brand-green dark:group-hover/item:text-brand-gold group-hover/item:translate-x-0.5 transition-all opacity-40 group-hover/item:opacity-100 flex-shrink-0" />
                                  </Link>
                                ))}
                              </div>
                            ) : (
                              <div className="p-4 text-center text-sm text-zinc-500">No categories available</div>
                            )}

                            {/* "View All Products" Footer CTA */}
                            <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                              <Link
                                href="/products"
                                onClick={() => {
                                  setIsProductsMenuOpen(false);
                                  handleCloseAll();
                                }}
                                className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-brand-green/10 via-emerald-500/5 to-brand-gold/15 dark:from-zinc-800 dark:to-zinc-800/60 border border-brand-green/20 dark:border-zinc-700/80 hover:border-brand-green dark:hover:border-brand-gold transition-all duration-200 group/all hover:shadow-xs"
                              >
                                <div>
                                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover/all:text-brand-green dark:group-hover/all:text-brand-gold transition-colors block">
                                    View All Products
                                  </span>
                                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block mt-0.5">
                                    Explore our complete 100% natural lineup
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-green text-white dark:bg-brand-gold dark:text-brand-green text-xs font-semibold shadow-xs group-hover/all:translate-x-0.5 transition-transform">
                                  <span>Browse All</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </div>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <a
                    key={link.name}
                    href={link.href}
                    download={link.download || undefined}
                    onClick={handleCloseAll}
                    className={`relative px-2.5 lg:px-2 xl:px-4 2xl:px-5 py-2 lg:py-1.5 xl:py-2 text-xs lg:text-[11px] xl:text-[13px] 2xl:text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap shrink-0 ${
                      isActive
                        ? "bg-brand-green text-white dark:bg-brand-gold dark:text-brand-green font-semibold shadow-sm"
                        : "text-zinc-600 hover:text-brand-green dark:text-zinc-300 dark:hover:text-brand-gold hover:bg-zinc-200/40 dark:hover:bg-zinc-800/40"
                    }`}
                  >
                    {link.name}
                  </a>
                );
              })}
            </div>
          </nav>

          {/* ── Right: wishlist, cart, login/profile ── */}
          <div className="flex items-center gap-1.5 md:gap-3 lg:gap-1.5 xl:gap-3 flex-shrink-0">
            {/* Wishlist */}
            <Link
              href="/wishlist"
              onClick={handleCloseAll}
              className="relative p-2 lg:p-1.5 xl:p-2.5 text-zinc-600 hover:text-red-500 dark:text-zinc-300 dark:hover:text-red-400 bg-zinc-100/60 hover:bg-red-50 dark:bg-zinc-900/40 dark:hover:bg-red-950/20 rounded-full border border-zinc-200/20 dark:border-zinc-850 transition-all duration-200 group"
              aria-label="View Wishlist"
            >
              <Heart className="h-5 w-5 transition-transform duration-200 group-hover:scale-110 xl:h-6 xl:w-6" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 xl:h-5 xl:w-5 items-center justify-center rounded-full bg-red-600 text-[9px] xl:text-[10px] font-bold text-white border border-white dark:border-zinc-950 shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              onClick={handleCloseAll}
              className="relative p-2 lg:p-1.5 xl:p-2.5 text-zinc-600 hover:text-brand-green dark:text-zinc-300 dark:hover:text-brand-gold bg-zinc-100/60 hover:bg-zinc-150 dark:bg-zinc-900/40 dark:hover:bg-zinc-900/80 rounded-full border border-zinc-200/20 dark:border-zinc-850 transition-all duration-200 group"
              aria-label="View Cart"
            >
              <ShoppingCart className="h-5 w-5 transition-transform duration-200 group-hover:scale-110 xl:h-6 xl:w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 xl:h-5 xl:w-5 items-center justify-center rounded-full bg-brand-gold text-[9px] xl:text-[10px] font-bold text-zinc-950 border border-white dark:border-zinc-950 shadow-sm animate-pulse-subtle">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile / Login — desktop only; mobile uses the drawer */}
            <div className="relative hidden lg:block">
              {isLoggedIn && user ? (
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 p-1 xl:p-1.5 pr-2 xl:pr-3 text-xs xl:text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100/80 dark:bg-zinc-900/50 rounded-full border border-zinc-200/30 dark:border-zinc-800/30 hover:shadow-md transition-all duration-200 focus:outline-none"
                >
                  <div className="w-6 h-6 xl:w-8 xl:h-8 rounded-full bg-brand-gold text-brand-green font-bold flex items-center justify-center shadow-sm text-xs xl:text-sm">
                    {initials}
                  </div>
                  <span className="hidden xl:inline-block max-w-[80px] truncate">{user.name}</span>
                  <ChevronDown className={`w-3 h-3 xl:w-4 xl:h-4 transition-transform duration-200 ${isProfileDropdownOpen ? "rotate-180" : ""}`} />
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={handleCloseAll}
                  className="flex items-center gap-1.5 xl:gap-2 px-3 py-1.5 xl:px-5 xl:py-2 text-[11px] xl:text-sm font-semibold text-white bg-brand-green hover:bg-brand-green-light dark:bg-brand-gold dark:text-brand-green dark:hover:bg-brand-gold-light rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <User className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
                  <span>Login</span>
                </Link>
              )}

              {isLoggedIn && isProfileDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsProfileDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2.5 w-56 origin-top-right rounded-2xl bg-white dark:bg-zinc-900 p-2 shadow-xl ring-1 ring-black/5 dark:ring-white/10 z-20">
                    <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800">
                      <p className="text-xs text-zinc-400 dark:text-zinc-500">Signed in as</p>
                      <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 truncate">{user.email}</p>
                    </div>
                    <div className="mt-1 space-y-0.5">
                      <Link href="/profile" onClick={handleCloseAll} className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                        <User className="w-4 h-4 text-zinc-400" /><span>My Profile</span>
                      </Link>
                      <Link href="/orders" onClick={handleCloseAll} className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                        <ShoppingBag className="w-4 h-4 text-zinc-400" /><span>My Orders</span>
                      </Link>
                      <Link href="/settings" onClick={handleCloseAll} className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                        <Settings className="w-4 h-4 text-zinc-400" /><span>Settings</span>
                      </Link>
                    </div>
                    <div className="border-t border-zinc-100 dark:border-zinc-800 mt-1 pt-1">
                      <button
                        onClick={async () => { await logout(); handleCloseAll(); }}
                        className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" /><span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>


      {/* ── Mobile navigation drawer (left slide-in) ── */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-[80px] bg-black/40 backdrop-blur-xs z-40 lg:hidden"
            onClick={handleCloseAll}
          />
          {/* Drawer */}
          <div className="fixed left-0 top-[80px] h-[calc(100svh-80px)] w-full max-w-sm bg-white dark:bg-zinc-950 border-r border-zinc-200/50 dark:border-zinc-900 z-50 flex flex-col justify-between overflow-y-auto p-4 shadow-2xl lg:hidden sm:p-5 animate-in slide-in-from-left duration-250">
            <div className="space-y-3">
              <div className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                Navigation Menu
              </div>
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href && !link.download;
                  const isProducts = link.name === "Products";

                  if (isProducts) {
                    return (
                      <div key={link.name} className="flex flex-col">
                        <div
                          className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
                            isActive
                              ? "bg-brand-green text-white dark:bg-brand-gold dark:text-brand-green font-semibold"
                              : "text-zinc-700 hover:text-brand-green hover:bg-zinc-50 dark:text-zinc-300 dark:hover:text-brand-gold dark:hover:bg-zinc-900/50"
                          }`}
                        >
                          <Link
                            href={link.href}
                            onClick={handleCloseAll}
                            className="flex-1 py-1"
                          >
                            <span>{link.name}</span>
                          </Link>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setIsMobileProductsExpanded((prev) => !prev);
                            }}
                            className={`p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors focus:outline-none ${
                              isActive ? "text-white dark:text-brand-green" : "text-zinc-500 dark:text-zinc-400"
                            }`}
                            aria-label="Toggle Products Submenu"
                          >
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-200 ${
                                isMobileProductsExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        </div>

                        {/* Collapsible Mobile Submenu */}
                        {isMobileProductsExpanded && (
                          <div className="ml-3 my-1.5 pl-3 border-l-2 border-brand-green/20 dark:border-brand-gold/30 space-y-1 animate-in slide-in-from-top-2 duration-150">
                            <Link
                              href="/products"
                              onClick={handleCloseAll}
                              className="flex items-center justify-between p-2 rounded-xl bg-brand-green/10 dark:bg-brand-gold/15 text-brand-green dark:text-brand-gold font-semibold text-xs transition-colors"
                            >
                              <span className="flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>View All Products</span>
                              </span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                            {catsLoading ? (
                              <div className="p-2 text-xs text-zinc-400">Loading categories...</div>
                            ) : catsError ? (
                              <div className="p-2 text-xs text-red-500">{catsError}</div>
                            ) : (
                              categories.map((cat) => (
                                <Link
                                  key={cat.id}
                                  href={`/products?category=${cat.slug}`}
                                  onClick={handleCloseAll}
                                  className="flex items-center justify-between p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors"
                                >
                                  <span className="font-semibold truncate">{cat.name}</span>
                                  {cat._count?.products !== undefined && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 shrink-0">
                                      {cat._count.products}
                                    </span>
                                  )}
                                </Link>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      download={link.download || undefined}
                      onClick={handleCloseAll}
                      className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-brand-green text-white dark:bg-brand-gold dark:text-brand-green font-semibold"
                          : "text-zinc-700 hover:text-brand-green hover:bg-zinc-50 dark:text-zinc-300 dark:hover:text-brand-gold dark:hover:bg-zinc-900/50"
                      }`}
                    >
                      <span>{link.name}</span>
                      <Compass className="w-4 h-4 opacity-40" />
                    </a>
                  );
                })}
              </nav>

              {/* Categories Section */}
              <div>
                <div className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                  Shop by Categories
                </div>
                <div className="max-h-[220px] space-y-1 overflow-y-auto">
                  {catsLoading ? (
                    <div className="p-4 text-center text-sm text-zinc-500">Loading...</div>
                  ) : catsError ? (
                    <div className="p-4 text-center text-sm text-red-500 dark:text-red-400">{catsError}</div>
                  ) : categories.length > 0 ? (
                    <>
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/products?category=${cat.slug}`}
                          onClick={handleCloseAll}
                          className="flex items-center justify-between rounded-xl p-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                        >
                          <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 truncate">
                            {cat.name}
                          </span>
                          {cat._count?.products !== undefined && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 shrink-0">
                              {cat._count.products} products
                            </span>
                          )}
                        </Link>
                      ))}
                      <div className="pt-1 mt-1 border-t border-zinc-100 dark:border-zinc-800">
                        <Link
                          href="/products"
                          onClick={handleCloseAll}
                          className="flex items-center justify-between p-2 rounded-xl bg-brand-green/5 dark:bg-brand-gold/10 text-brand-green dark:text-brand-gold font-semibold text-xs"
                        >
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>View All Products</span>
                          </span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </>
                  ) : (
                    <div className="p-4 text-center text-sm text-zinc-500">No categories</div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-4">
              {isLoggedIn && user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5 px-1">
                    <div className="h-9 w-9 rounded-full bg-brand-gold text-brand-green font-bold flex items-center justify-center text-base">
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-850 dark:text-zinc-200">{user.name}</p>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/profile"
                      onClick={handleCloseAll}
                      className="flex items-center justify-center gap-2 p-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl transition-colors"
                    >
                      <User className="w-4 h-4" /><span>Profile</span>
                    </Link>
                    <button
                      onClick={async () => { await logout(); handleCloseAll(); }}
                      className="flex items-center justify-center gap-2 p-2.5 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 rounded-2xl transition-colors"
                    >
                      <LogOut className="w-4 h-4" /><span>Sign Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={handleCloseAll}
                  className="flex items-center justify-center gap-2 w-full py-3.5 px-4 text-base font-semibold text-white bg-brand-green hover:bg-brand-green-light dark:bg-brand-gold dark:text-brand-green dark:hover:bg-brand-gold-light rounded-2xl shadow-md transition-all duration-200"
                >
                  <User className="w-5 h-5" /><span>Login / Sign Up</span>
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
