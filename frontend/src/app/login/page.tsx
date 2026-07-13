"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } },
        });
        if (error) throw error;
        setErrorMsg(
          "تم إنشاء الحساب. لو مطلوب تأكيد بالإيميل، افتح صندوق الوارد وأكّد الحساب."
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "حصل خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <div className="mb-6 flex rounded-lg bg-gray-100 p-1 text-sm font-medium">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 rounded-md py-2 transition ${
              mode === "login" ? "bg-white shadow text-brand-700" : "text-gray-500"
            }`}
          >
            تسجيل الدخول
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`flex-1 rounded-md py-2 transition ${
              mode === "signup" ? "bg-white shadow text-brand-700" : "text-gray-500"
            }`}
          >
            حساب جديد
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === "signup" && (
            <div>
              <label className="mb-1 block text-sm text-gray-600">الاسم</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm text-gray-600">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              dir="ltr"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-600">
              كلمة المرور
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              dir="ltr"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>

          {errorMsg && (
            <p className="rounded-md bg-red-50 p-2 text-sm text-red-600">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50"
          >
            {loading
              ? "جاري التحميل..."
              : mode === "signup"
              ? "إنشاء الحساب"
              : "دخول"}
          </button>
        </form>
      </div>
    </main>
  );
}
