"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
  ShoppingBag,
  Settings,
  Heart,
  Compass,
  LayoutGrid,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { CATEGORIES } from "@/components/productsData";

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { count: cartCount } = useCart();
  const { count: wishlistCount } = useWishlist();

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

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Franchises", href: "/franchises" },
    { name: "About", href: "/about" },
    { name: "Download Catalogue", href: "/catalogue.pdf", download: true },
    { name: "Contact", href: "/contact" },
  ];

  const handleCloseAll = () => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
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
              <div className="relative h-12 w-28 md:h-16 md:w-48 xl:h-20 xl:w-64 overflow-hidden">
                <Image
                  src="/orglogo.svg"
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
                className="flex items-center gap-2 px-4 py-2 xl:px-5 xl:py-2.5 bg-brand-green text-white dark:bg-brand-gold dark:text-brand-green rounded-full font-semibold text-xs xl:text-sm hover:bg-brand-green-light dark:hover:bg-brand-gold-light shadow-sm transition-all duration-200"
              >
                <LayoutGrid className="w-4 h-4 xl:w-5 xl:h-5" />
                <span>Shop by Categories</span>
                <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
              </Link>
              
              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="w-[300px] bg-white dark:bg-zinc-900 rounded-2xl shadow-xl shadow-zinc-200/50 dark:shadow-black/50 border border-zinc-100 dark:border-zinc-800 p-2 max-h-[70vh] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                  {CATEGORIES.map(cat => (
                    <Link
                      key={cat.slug}
                      href={`/products?category=${cat.slug}`}
                      className="flex items-center gap-3 p-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-colors group/item"
                    >
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-lg shadow-sm group-hover/item:scale-110 transition-transform`}>
                        {cat.emoji}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{cat.label}</span>
                        <span className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1">{cat.description}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Center: desktop nav pill ── */}
          <nav className="hidden lg:flex items-center flex-1 justify-center min-w-0 px-2">
            <div className="flex items-center gap-0.5 lg:gap-0.5 xl:gap-1.5 p-1 lg:p-0.5 xl:p-2 bg-zinc-100/80 dark:bg-zinc-900/60 border border-zinc-200/40 dark:border-zinc-800/40 rounded-full shadow-inner backdrop-blur-sm overflow-x-auto max-w-full" style={{ scrollbarWidth: 'none' }}>
              {navLinks.map((link) => {
                const isActive = pathname === link.href && !link.download;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    download={link.download || undefined}
                    onClick={handleCloseAll}
                    className={`relative px-2.5 lg:px-2.5 xl:px-6 py-2 lg:py-1.5 xl:py-3 text-xs lg:text-[11px] xl:text-sm 2xl:text-base font-medium rounded-full transition-all duration-200 whitespace-nowrap shrink-0 ${
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
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            {/* Wishlist */}
            <Link
              href="/wishlist"
              onClick={handleCloseAll}
              className="relative p-2 md:p-2.5 text-zinc-600 hover:text-red-500 dark:text-zinc-300 dark:hover:text-red-400 bg-zinc-100/60 hover:bg-red-50 dark:bg-zinc-900/40 dark:hover:bg-red-950/20 rounded-full border border-zinc-200/20 dark:border-zinc-850 transition-all duration-200 group"
              aria-label="View Wishlist"
            >
              <Heart className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 md:h-5 md:w-5 items-center justify-center rounded-full bg-red-500 text-[9px] md:text-[10px] font-bold text-white border border-white dark:border-zinc-950 shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              onClick={handleCloseAll}
              className="relative p-2 md:p-2.5 text-zinc-600 hover:text-brand-green dark:text-zinc-300 dark:hover:text-brand-gold bg-zinc-100/60 hover:bg-zinc-150 dark:bg-zinc-900/40 dark:hover:bg-zinc-900/80 rounded-full border border-zinc-200/20 dark:border-zinc-850 transition-all duration-200 group"
              aria-label="View Cart"
            >
              <ShoppingCart className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 md:h-5 md:w-5 items-center justify-center rounded-full bg-brand-gold text-[9px] md:text-[10px] font-bold text-brand-green border border-white dark:border-zinc-950 shadow-sm animate-pulse-subtle">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile / Login — desktop only; mobile uses the drawer */}
            <div className="relative hidden lg:block">
              {isLoggedIn && user ? (
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100/80 dark:bg-zinc-900/50 rounded-full border border-zinc-200/30 dark:border-zinc-800/30 hover:shadow-md transition-all duration-200 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-gold text-brand-green font-bold flex items-center justify-center shadow-sm text-sm">
                    {initials}
                  </div>
                  <span className="hidden xl:inline-block max-w-[80px] truncate">{user.name}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isProfileDropdownOpen ? "rotate-180" : ""}`} />
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={handleCloseAll}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-brand-green hover:bg-brand-green-light dark:bg-brand-gold dark:text-brand-green dark:hover:bg-brand-gold-light rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <User className="w-4 h-4" />
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
          <div className="fixed left-0 top-[80px] h-[calc(100svh-80px)] w-full max-w-sm bg-white dark:bg-zinc-950 border-r border-zinc-200/50 dark:border-zinc-900 z-50 p-6 flex flex-col justify-between shadow-2xl lg:hidden overflow-y-auto animate-in slide-in-from-left duration-250">
            <div className="space-y-6">
              <div className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                Navigation Menu
              </div>
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href && !link.download;
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      download={link.download || undefined}
                      onClick={handleCloseAll}
                      className={`flex items-center justify-between px-4 py-3 rounded-2xl text-base font-medium transition-all duration-200 ${
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
            </div>

            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-6 mt-6">
              {isLoggedIn && user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-full bg-brand-gold text-brand-green font-bold flex items-center justify-center text-base">
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
                      className="flex items-center justify-center gap-2 p-3 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl transition-colors"
                    >
                      <User className="w-4 h-4" /><span>Profile</span>
                    </Link>
                    <button
                      onClick={async () => { await logout(); handleCloseAll(); }}
                      className="flex items-center justify-center gap-2 p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 rounded-2xl transition-colors"
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
