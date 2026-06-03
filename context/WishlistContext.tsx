"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { Product } from "@/components/productsData";

interface WishlistContextType {
  items: Product[];
  count: number;
  addToWishlist: (item: Product) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);
const STORAGE_KEY = "kiddos_wishlist";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch { /* ignore parse errors */ }
  }, []);

  // Persist to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch { /* ignore quota errors */ }
  }, [items]);

  const addToWishlist = useCallback((item: Product) => {
    setItems((prev) => prev.find((i) => i.id === item.id) ? prev : [...prev, item]);
  }, []);

  const removeFromWishlist = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const isInWishlist = useCallback((id: string) => {
    return items.some((i) => i.id === id);
  }, [items]);

  const clearWishlist = useCallback(() => {
    setItems([]);
  }, []);

  return (
    <WishlistContext.Provider value={{ items, count: items.length, addToWishlist, removeFromWishlist, isInWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
