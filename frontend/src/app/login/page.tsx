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
  const [feedback, setFeedback] = useState<{ type: "error" | "success"; text: string } | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFeedback(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } },
        });
        if (error) throw error;
        setFeedback({ type: "success", text: "تم إنشاء الحساب. لو مطلوب تأكيد بالإيميل، افتح صندوق الوارد وأكّد الحساب." });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setFeedback({ type: "error", text: err instanceof Error ? err.message : "حصل خطأ غير متوقع" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-paper-dim p-6">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-sm ring-1 ring-paper-line">
        <div className="mb-6 flex rounded-full bg-paper-dim p-1 text-sm font-medium">
          <button type="button" onClick={() => setMode("login")} className={`flex-1 rounded-full py-2 transition ${mode === "login" ? "bg-white text-gold-deep shadow" : "text-muted"}`}>
            تسجيل الدخول
          </button>
          <button type="button" onClick={() => setMode("signup")} className={`flex-1 rounded-full py-2 transition ${mode === "signup" ? "bg-white text-gold-deep shadow" : "text-muted"}`}>
            حساب جديد
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === "signup" && (
            <div>
              <label className="mb-1 block text-sm text-muted">الاسم</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-paper-line px-3 py-2 text-sm focus:border-gold focus:outline-none" />
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm text-muted">البريد الإلكتروني</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} dir="ltr" className="w-full rounded-lg border border-paper-line px-3 py-2 text-sm focus:border-gold focus:outline-none" />
          </div>

          <div>
            <label className="mb-1 block text-sm text-muted">كلمة المرور</label>
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} dir="ltr" className="w-full rounded-lg border border-paper-line px-3 py-2 text-sm focus:border-gold focus:outline-none" />
          </div>

          {feedback && (
            <p className={`rounded-lg p-2 text-sm ${feedback.type === "success" ? "bg-teal-soft text-teal" : "bg-danger-soft text-danger"}`}>
              {feedback.text}
            </p>
          )}

          <button type="submit" disabled={loading} className="rounded-full bg-gold py-2.5 text-sm font-semibold text-ink transition hover:bg-gold-deep disabled:opacity-50">
            {loading ? "جاري التحميل..." : mode === "signup" ? "إنشاء الحساب" : "دخول"}
          </button>
        </form>
      </div>
    </main>
  );
}
