"use client";

import React, { createContext, useContext, useCallback } from "react";
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
  addItem: (item: Omit<CartItem, "quantity">) => void;
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

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Cart is stored per logged-in user (see useUserScopedList)
  const [items, setItems] = useUserScopedList<CartItem>("kiddos_cart", mergeCarts);

  const addItem = useCallback((newItem: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === newItem.id);
      if (existing) {
        return prev.map((i) =>
          i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
  }, []);

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
    <CartContext.Provider value={{ items, count, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
