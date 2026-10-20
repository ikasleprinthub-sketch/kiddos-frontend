"use client";

import React, { createContext, useContext, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useUserScopedList } from "@/lib/useUserScopedList";

export interface CartItem {
  id: string; // Unique cart item ID (productId + variantId)
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  originalPrice?: number;
  image?: string;
  emoji: string;
  gradient: string;
  weightOrQty: string;
  quantity: number;
  slug: string;
}

interface CartContextType {
  items: CartItem[];
  count: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  // Add the item and go straight to checkout (guests log in first)
  buyNow: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  // true once the current user's cart (incl. items added before login) has loaded
  ready: boolean;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Merge a guest cart into the user's cart on login (sum quantities of the same item)
function mergeCarts(own: CartItem[], guest: CartItem[]): CartItem[] {
  const merged = [...own];
  for (const g of guest) {
    const i = merged.findIndex((m) => m.id === g.id);
    if (i >= 0) merged[i] = { ...merged[i], quantity: merged[i].quantity + g.quantity };
    else merged.push(g);
  }
  return merged;
}

// Items a guest tried to add; applied to the cart after they log in
const PENDING_KEY = "kiddos_pending_cart";
const PENDING_TTL_MS = 30 * 60 * 1000;

function readPending(): CartItem[] {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!parsed || Date.now() - parsed.at > PENDING_TTL_MS || !Array.isArray(parsed.items)) return [];
    return parsed.items;
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  // Cart is stored per logged-in user (see useUserScopedList)
  const [items, setItems, loaded] = useUserScopedList<CartItem>("kiddos_cart", mergeCarts);

  const [syncedUserId, setSyncedUserId] = useState<string | null>(null);

  // After login, add whatever the guest tried to add before being sent to login
  useEffect(() => {
    if (!user || !loaded) return;
    const pending = readPending();
    try { localStorage.removeItem(PENDING_KEY); } catch { /* ignore */ }
    if (pending.length) setItems((prev) => mergeCarts(prev, pending));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from external storage
    setSyncedUserId(user.id);
  }, [user, loaded, setItems]);

  const ready = !loading && loaded && (!user || syncedUserId === user.id);

  // Returns false when the user is a guest and was sent to login instead
  const add = useCallback((newItem: Omit<CartItem, "quantity">, quantity: number, afterLogin?: string) => {
    // Guests must log in first: remember the item and send them to login
    if (!user) {
      if (loading) return false;
      const pending = mergeCarts(readPending(), [{ ...newItem, quantity }]);
      try { localStorage.setItem(PENDING_KEY, JSON.stringify({ at: Date.now(), items: pending })); } catch { /* ignore */ }
      const back = afterLogin ?? window.location.pathname + window.location.search;
      router.push(`/login?redirect=${encodeURIComponent(back)}`);
      return false;
    }
    setItems((prev) => {
      const existing = prev.find((i) => i.id === newItem.id);
      if (existing) {
        return prev.map((i) =>
          i.id === newItem.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { ...newItem, quantity }];
    });
    return true;
  }, [user, loading, router, setItems]);

  const addItem = useCallback((newItem: Omit<CartItem, "quantity">, quantity = 1) => {
    add(newItem, quantity);
  }, [add]);

  const buyNow = useCallback((newItem: Omit<CartItem, "quantity">, quantity = 1) => {
    if (add(newItem, quantity, "/checkout")) router.push("/checkout");
  }, [add, router]);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, delta: number) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i;
        const newQty = i.quantity + delta;
        return newQty > 0 ? { ...i, quantity: newQty } : i;
      })
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const count = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, count, addItem, buyNow, ready, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
