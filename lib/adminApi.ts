const BASE = "/api";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function headers(contentType = true): HeadersInit {
  const h: Record<string, string> = {};
  if (contentType) h["Content-Type"] = "application/json";
  const token = getToken();
  if (token) h["Authorization"] = `Bearer ${token}`;
  return h;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  isFormData = false
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: isFormData ? (headers(false) as HeadersInit) : headers(),
    body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || "Request failed");
  }

  return res.json();
}

export const adminApi = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body: unknown) => request<T>("POST", path, body),
  put: <T>(path: string, body: unknown) => request<T>("PUT", path, body),
  delete: <T>(path: string) => request<T>("DELETE", path),
  upload: <T>(path: string, formData: FormData) => request<T>("POST", path, formData, true),
};
