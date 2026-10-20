"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

function read<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * A localStorage-backed list that belongs to the logged-in user.
 * - Logged in: stored under `${baseKey}:${userId}`; logged out: under `baseKey` (guest).
 * - Switching user / logging out swaps the in-memory list, so one user's data is never shown to another.
 * - On login, the guest list is merged into the user's list and removed (keeps the guest -> checkout flow).
 */
export function useUserScopedList<T>(baseKey: string, merge: (own: T[], guest: T[]) => T[]) {
  const { user, loading } = useAuth();
  const userId = user?.id ?? null;
  const key = userId ? `${baseKey}:${userId}` : baseKey;

  const [items, setItems] = useState<T[]>([]);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);

  // Load the list for the current identity once auth is resolved
  useEffect(() => {
    if (loading) return;
    let next = read<T>(key);
    if (userId) {
      const guest = read<T>(baseKey);
      if (guest.length) next = merge(next, guest);
      try { localStorage.removeItem(baseKey); } catch { /* ignore */ }
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from external storage
    setItems(next);
    setLoadedKey(key);
  }, [key, loading, userId, baseKey, merge]);

  // Persist only once the list for this exact identity has been loaded
  useEffect(() => {
    if (loadedKey !== key) return;
    try { localStorage.setItem(key, JSON.stringify(items)); } catch { /* ignore quota errors */ }
  }, [items, loadedKey, key]);

  // true once the list for the current identity has been loaded from storage
  const loaded = loadedKey === key;

  return [items, setItems, loaded] as const;
}
