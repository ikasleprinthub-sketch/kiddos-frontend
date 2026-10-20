// Server components only — the 127.0.0.1 origin is not reachable from browsers.

/** Backend origin for server-side fetches — the same target as the /api rewrite in next.config.ts. */
export const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:5050";

/** GET a public backend endpoint from the server, cached for `revalidate` seconds. Returns null if unreachable. */
export async function backendGet<T>(path: string, revalidate = 60): Promise<T | null> {
  try {
    const res = await fetch(`${BACKEND_URL}${path}`, {
      next: { revalidate },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
