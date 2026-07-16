"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/apiClient";

interface Moderator {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
}

export default function AdminModeratorsPage() {
  const [moderators, setModerators] = useState<Moderator[]>([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    const data = await api.get<{ moderators: Moderator[] }>("/api/admin/moderators");
    setModerators(data.moderators);
  }

  useEffect(() => {
    load();
  }, []);

  async function createModerator() {
    setBusy(true);
    setError(null);
    try {
      await api.post("/api/admin/moderators", form);
      setForm({ name: "", email: "", phone: "", password: "" });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر إنشاء الحساب");
    } finally {
      setBusy(false);
    }
  }

  async function toggleStatus(mod: Moderator) {
    if (mod.role === "super_admin") return;
    await api.patch(`/api/admin/moderators/${mod.id}/status`, {
      status: mod.status === "active" ? "suspended" : "active",
    });
    load();
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-black text-ink">حسابات المشرفين</h1>

      <div className="mb-8 grid gap-3 rounded-2xl border border-paper-line bg-white p-5 sm:grid-cols-2">
        <input
          placeholder="الاسم"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="rounded-lg border border-paper-line px-3 py-2 text-sm"
        />
        <input
          placeholder="رقم الهاتف"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          dir="ltr"
          className="rounded-lg border border-paper-line px-3 py-2 text-sm"
        />
        <input
          placeholder="البريد الإلكتروني"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          dir="ltr"
          className="rounded-lg border border-paper-line px-3 py-2 text-sm"
        />
        <input
          placeholder="كلمة المرور المبدئية"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          dir="ltr"
          className="rounded-lg border border-paper-line px-3 py-2 text-sm"
        />
        {error && <p className="text-sm font-bold text-danger sm:col-span-2">{error}</p>}
        <button
          onClick={createModerator}
          disabled={busy}
          className="rounded-full bg-orange py-2.5 text-sm font-bold text-white hover:bg-orange-deep disabled:opacity-50 sm:col-span-2"
        >
          إنشاء حساب مشرف
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {moderators.map((mod) => (
          <div key={mod.id} className="flex items-center justify-between rounded-2xl border border-paper-line bg-white p-4">
            <div>
              <p className="font-bold text-ink">{mod.name}</p>
              <p className="text-xs text-muted" dir="ltr">
                {mod.email} · {mod.phone}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-paper-dim px-3 py-1 text-xs font-bold text-muted">
                {mod.role === "super_admin" ? "مدير عام" : "مشرف"}
              </span>
              {mod.role !== "super_admin" && (
                <button
                  onClick={() => toggleStatus(mod)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold ${
                    mod.status === "active" ? "bg-teal-soft text-teal" : "bg-danger-soft text-danger"
                  }`}
                >
                  {mod.status === "active" ? "نشط" : "معطّل"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
