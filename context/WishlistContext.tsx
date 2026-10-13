"use client";

import React, { createContext, useContext, useCallback } from "react";
import { useUserScopedList } from "@/lib/useUserScopedList";
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

// Merge a guest wishlist into the user's wishlist on login (no duplicates)
function mergeWishlists(own: Product[], guest: Product[]): Product[] {
  return [...own, ...guest.filter((g) => !own.some((o) => String(o.id) === String(g.id)))];
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  // Wishlist is stored per logged-in user (see useUserScopedList)
  const [items, setItems] = useUserScopedList<Product>(STORAGE_KEY, mergeWishlists);

  const addToWishlist = useCallback((item: Product) => {
    setItems((prev) => prev.find((i) => String(i.id) === String(item.id)) ? prev : [...prev, item]);
  }, [setItems]);

  const removeFromWishlist = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => String(i.id) !== String(id)));
  }, [setItems]);

  const isInWishlist = useCallback((id: string) => {
    return items.some((i) => String(i.id) === String(id));
  }, [items]);

  const clearWishlist = useCallback(() => {
    setItems([]);
  }, [setItems]);

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
