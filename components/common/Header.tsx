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
  Compass
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { count: cartCount } = useCart();

  const initials = user
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "";

  // Handle scroll detection for glassmorphism effect transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Franchises", href: "/franchises" },
    { name: "About", href: "/about" },
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
      <div className="mx-auto max-w-full px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link href="/" onClick={handleCloseAll} className="flex items-center gap-2 group">
              <div className="relative h-20 w-64 flex items-center justify-start overflow-hidden">
                <Image
                  src="/logo.svg"
                  alt="Kiddos Foods Logo"
                  fill
                  sizes="(max-width: 768px) 200px, 256px"
                  className="object-contain dark:brightness-110 group-hover:scale-105 transition-transform duration-200"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Middle Navbar - Card / Pill Styled Menu */}
          <nav className="hidden md:flex items-center">
            <div className="flex items-center gap-1 p-1 bg-zinc-100/80 dark:bg-zinc-900/60 border border-zinc-200/40 dark:border-zinc-800/40 rounded-full shadow-inner backdrop-blur-sm">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={handleCloseAll}
                    className={`relative px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                      isActive
                        ? "bg-brand-green text-white dark:bg-brand-gold dark:text-brand-green font-semibold shadow-sm"
                        : "text-zinc-600 hover:text-brand-green dark:text-zinc-300 dark:hover:text-brand-gold hover:bg-zinc-200/40 dark:hover:bg-zinc-800/40"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Right Section - Cart & Profile/Login */}
          <div className="flex items-center gap-3">
            
            {/* Cart Button */}
            <Link
              href="/cart"
              onClick={handleCloseAll}
              className="relative p-2.5 text-zinc-600 hover:text-brand-green dark:text-zinc-300 dark:hover:text-brand-gold bg-zinc-100/60 hover:bg-zinc-150 dark:bg-zinc-900/40 dark:hover:bg-zinc-900/80 rounded-full border border-zinc-200/20 dark:border-zinc-850 transition-all duration-200 group"
              aria-label="View Cart"
            >
              <ShoppingCart className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-gold text-[10px] font-bold text-brand-green border border-white dark:border-zinc-950 shadow-sm animate-pulse-subtle">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile / Login Section */}
            <div className="relative">
              {isLoggedIn && user ? (
                // Logged In Dropdown Trigger
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100/80 dark:bg-zinc-900/50 rounded-full border border-zinc-200/30 dark:border-zinc-800/30 hover:shadow-md transition-all duration-200 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-gold text-brand-green font-bold flex items-center justify-center shadow-sm text-sm">
                    {initials}
                  </div>
                  <span className="hidden lg:inline-block max-w-[80px] truncate">{user.name}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isProfileDropdownOpen ? "rotate-180" : ""}`} />
                </button>
              ) : (
                // Login Buttons
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    onClick={handleCloseAll}
                    className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-brand-green hover:bg-brand-green-light dark:bg-brand-gold dark:text-brand-green dark:hover:bg-brand-gold-light rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <User className="w-4 h-4" />
                    <span>Login</span>
                  </Link>
                </div>
              )}

              {/* Profile Dropdown Menu */}
              {isLoggedIn && isProfileDropdownOpen && (
                <>
                  {/* Backdrop overlay to close dropdown */}
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsProfileDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2.5 w-56 origin-top-right rounded-2xl bg-white dark:bg-zinc-900 p-2 shadow-xl ring-1 ring-black/5 dark:ring-white/10 z-20 focus:outline-none transition-all duration-200">
                    <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800">
                      <p className="text-xs text-zinc-400 dark:text-zinc-500">Signed in as</p>
                      <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 truncate">{user.email}</p>
                    </div>
                    <div className="mt-1 space-y-0.5">
                      <Link
                        href="/profile"
                        onClick={handleCloseAll}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                      >
                        <User className="w-4.5 h-4.5 text-zinc-400" />
                        <span>My Profile</span>
                      </Link>
                      <Link
                        href="/orders"
                        onClick={handleCloseAll}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                      >
                        <ShoppingBag className="w-4.5 h-4.5 text-zinc-400" />
                        <span>My Orders</span>
                      </Link>
                      <Link
                        href="/settings"
                        onClick={handleCloseAll}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                      >
                        <Settings className="w-4.5 h-4.5 text-zinc-400" />
                        <span>Settings</span>
                      </Link>
                    </div>
                    <div className="border-t border-zinc-100 dark:border-zinc-800 mt-1 pt-1">
                      <button
                        onClick={async () => {
                          await logout();
                          handleCloseAll();
                        }}
                        className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors text-left"
                      >
                        <LogOut className="w-4.5 h-4.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 text-zinc-600 hover:text-brand-green dark:text-zinc-300 dark:hover:text-brand-gold bg-zinc-100/60 hover:bg-zinc-150 dark:bg-zinc-900/40 dark:hover:bg-zinc-900/80 rounded-full border border-zinc-200/20 dark:border-zinc-850 md:hidden transition-all duration-200 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Drawer Backdrop */}
          <div 
            className="fixed inset-0 top-[77px] bg-black/40 backdrop-blur-xs z-40 md:hidden"
            onClick={handleCloseAll}
          />
          {/* Drawer Menu */}
          <div className="fixed inset-y-0 right-0 top-[77px] w-full max-w-sm bg-white dark:bg-zinc-950 border-l border-zinc-200/50 dark:border-zinc-900 z-50 p-6 flex flex-col justify-between shadow-2xl md:hidden animate-in slide-in-from-right duration-250">
            <div className="space-y-6">
              <div className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                Navigation Menu
              </div>
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={handleCloseAll}
                      className={`flex items-center justify-between px-4 py-3 rounded-2xl text-base font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-brand-green text-white dark:bg-brand-gold dark:text-brand-green font-semibold"
                          : "text-zinc-700 hover:text-brand-green hover:bg-zinc-50 dark:text-zinc-300 dark:hover:text-brand-gold dark:hover:bg-zinc-900/50"
                      }`}
                    >
                      <span>{link.name}</span>
                      <Compass className="w-4 h-4 opacity-40" />
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-6 mt-auto">
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
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={async () => {
                        await logout();
                        handleCloseAll();
                      }}
                      className="flex items-center justify-center gap-2 p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 rounded-2xl transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <Link
                    href="/login"
                    onClick={handleCloseAll}
                    className="flex items-center justify-center gap-2 w-full py-3.5 px-4 text-base font-semibold text-white bg-brand-green hover:bg-brand-green-light dark:bg-brand-gold dark:text-brand-green dark:hover:bg-brand-gold-light rounded-2xl shadow-md transition-all duration-200"
                  >
                    <User className="w-5 h-5" />
                    <span>Login / Sign Up</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
