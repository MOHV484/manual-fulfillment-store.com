"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/apiClient";

interface Product {
  id: string;
  title: string;
  category: "gaming_charge" | "account_security" | "digital_cards";
}

export default function OrderModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const router = useRouter();
  const [playerId, setPlayerId] = useState("");
  const [accountDetails, setAccountDetails] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const needsPlayerId = product.category === "gaming_charge";
  const needsAccountDetails = product.category === "account_security";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("لازم ترفع صورة إيصال الدفع");
      return;
    }
    setBusy(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("receipt", file);
      const uploadRes = await api.post<{ receipt_path: string }>("/api/uploads/receipt", formData);

      await api.post("/api/orders", {
        product_id: product.id,
        player_id: needsPlayerId ? playerId : null,
        account_details: needsAccountDetails ? accountDetails : null,
        receipt_path: uploadRes.receipt_path,
      });

      setDone(true);
      setTimeout(() => {
        onClose();
        router.push("/orders");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر إرسال الطلب");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-6" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-1 font-display text-lg font-black text-ink">{product.title}</h2>
        <p className="mb-5 text-sm text-muted">أرسل بياناتك وإيصال الدفع، وفريقنا يراجع الطلب يدويًا.</p>

        {done ? (
          <p className="rounded-lg bg-teal-soft p-4 text-center font-bold text-teal">
            تم إرسال طلبك بنجاح. تابع حالته من صفحة &quot;طلباتي&quot;.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {needsPlayerId && (
              <div>
                <label className="mb-1 block text-sm text-muted">معرّف اللاعب (Player ID)</label>
                <input
                  required
                  value={playerId}
                  onChange={(e) => setPlayerId(e.target.value)}
                  dir="ltr"
                  className="w-full rounded-lg border border-paper-line px-3 py-2 text-sm focus:border-orange focus:outline-none"
                />
              </div>
            )}
            {needsAccountDetails && (
              <div>
                <label className="mb-1 block text-sm text-muted">تفاصيل الحساب المطلوب تأمينه</label>
                <textarea
                  required
                  value={accountDetails}
                  onChange={(e) => setAccountDetails(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-paper-line px-3 py-2 text-sm focus:border-orange focus:outline-none"
                />
              </div>
            )}
            <div>
              <label className="mb-1 block text-sm text-muted">صورة إيصال الدفع (JPG أو PNG)</label>
              <input
                required
                type="file"
                accept="image/png,image/jpeg"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="w-full text-sm"
              />
            </div>

            {error && <p className="rounded-lg bg-danger-soft p-2 text-sm text-danger">{error}</p>}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-full border border-paper-line py-2.5 text-sm font-bold text-ink"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={busy}
                className="flex-1 rounded-full bg-orange py-2.5 text-sm font-bold text-paper transition hover:bg-orange-deep disabled:opacity-50"
              >
                {busy ? "جاري الإرسال..." : "إرسال الطلب"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
