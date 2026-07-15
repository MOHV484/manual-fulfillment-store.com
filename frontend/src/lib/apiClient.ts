import { supabase } from "./supabaseClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiErrorBody {
  error?: { message?: string };
}

async function authHeader(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const isFormData = init.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(await authHeader()),
    ...((init.headers as Record<string, string>) ?? {}),
  };

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });

  const contentType = res.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json") ? await res.json() : null;

  if (!res.ok) {
    const message = (body as ApiErrorBody | null)?.error?.message ?? "حدث خطأ غير متوقع في الاتصال بالخادم";
    throw new Error(message);
  }

  return body as T;
}

// Small typed wrapper around fetch that always attaches the current
// Supabase access token as a Bearer header, and unwraps our backend's
// `{ error: { message } }` shape into a plain thrown Error.
export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, data?: unknown) =>
    request<T>(path, {
      method: "POST",
      body: data instanceof FormData ? data : JSON.stringify(data ?? {}),
    }),
  patch: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(data ?? {}) }),
};
