"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";

export default function LoginPage() {
  const router = useRouter();
  const { signInWithPassword, signUp } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
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
        await signUp({ name, phone, email, password });
        setFeedback({
          type: "success",
          text: "تم إنشاء الحساب. إذا كان مطلوبًا تأكيد عبر البريد الإلكتروني، افتح صندوق الوارد وأكّد الحساب.",
        });
      } else {
        await signInWithPassword(email, password);
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setFeedback({ type: "error", text: err instanceof Error ? err.message : "حدث خطأ غير متوقع" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-paper-dim p-6">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-sm ring-1 ring-paper-line">
        <div className="mb-6 flex rounded-full bg-paper-dim p-1 text-sm font-bold">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 rounded-full py-2 transition ${mode === "login" ? "bg-white text-orange shadow" : "text-muted"}`}
          >
            تسجيل الدخول
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`flex-1 rounded-full py-2 transition ${mode === "signup" ? "bg-white text-orange shadow" : "text-muted"}`}
          >
            حساب جديد
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === "signup" && (
            <>
              <div>
                <label className="mb-1 block text-sm text-muted">الاسم</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-paper-line px-3 py-2 text-sm focus:border-orange focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-muted">رقم الهاتف</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  dir="ltr"
                  className="w-full rounded-lg border border-paper-line px-3 py-2 text-sm focus:border-orange focus:outline-none"
                />
              </div>
            </>
          )}

          <div>
            <label className="mb-1 block text-sm text-muted">البريد الإلكتروني</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              dir="ltr"
              className="w-full rounded-lg border border-paper-line px-3 py-2 text-sm focus:border-orange focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-muted">كلمة المرور</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              dir="ltr"
              className="w-full rounded-lg border border-paper-line px-3 py-2 text-sm focus:border-orange focus:outline-none"
            />
          </div>

          {feedback && (
            <p className={`rounded-lg p-2 text-sm ${feedback.type === "success" ? "bg-teal-soft text-teal" : "bg-danger-soft text-danger"}`}>
              {feedback.text}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-orange py-2.5 text-sm font-bold text-paper transition hover:bg-orange-deep disabled:opacity-50"
          >
            {loading ? "جاري التحميل..." : mode === "signup" ? "إنشاء الحساب" : "دخول"}
          </button>
        </form>
      </div>
    </main>
  );
}
