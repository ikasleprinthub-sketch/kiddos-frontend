/** Public (non-admin) API helper — no auth token required */

const BASE = "/api";

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
    next: { revalidate: 60 }, // ISR: revalidate every 60s when used in server components
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || "Request failed");
  }

  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>("GET", path),
};

/** Represents a category returned from the public /api/categories endpoint */
export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  isActive: boolean;
  sortOrder: number;
}

/** Represents a product returned from the public /api/products endpoint */
export interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: string | number;
  salePrice: string | number | null;
  stock: number;
  sku: string | null;
  isFeatured: boolean;
  isActive: boolean;
  weight: string | number | null;
  unit: string | null;
  tags: string[];
  createdAt: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  images: { id: string; url: string; isPrimary: boolean }[];
  /** Extended detail fields (present on single-product fetch) */
  ingredients?: string | null;
  healthBenefits?: string | null;
  usageInstructions?: string | null;
  nutrientFacts?: Record<string, string | number> | null;
  shelfLife?: string | null;
  storageInstructions?: string | null;
}

export interface ApiBanner {
  id: string;
  title: string;
  subtitle: string | null;
  image: string;
  link: string | null;
  isActive: boolean;
  sortOrder: number;
}
