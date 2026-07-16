"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/apiClient";
import StatusBadge from "@/components/StatusBadge";
import DocumentInspectorModal from "@/components/admin/DocumentInspectorModal";

interface OrderDetail {
  id: string;
  status: string;
  player_id: string | null;
  account_details: string | null;
  rejection_reason: string | null;
  created_at: string;
  products: { title: string; category: string; price: number } | null;
  users: { name: string; phone: string } | null;
}

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    // The single-order GET endpoint doesn't exist for staff — reuse the
    // queue endpoint (unfiltered) and find this order by id.
    const data = await api.get<{ orders: OrderDetail[] }>(`/api/orders?status=`);
    const found = data.orders.find((o) => o.id === id) ?? null;
    setOrder(found);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadReceipt() {
    const data = await api.get<{ url: string }>(`/api/orders/${id}/receipt-url`);
    setReceiptUrl(data.url);
    setInspectorOpen(true);
  }

  async function complete() {
    setBusy(true);
    setError(null);
    try {
      await api.post(`/api/orders/${id}/complete`);
      router.push("/admin/orders");
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر تأكيد الطلب");
    } finally {
      setBusy(false);
    }
  }

  async function reject() {
    if (!rejectReason.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await api.post(`/api/orders/${id}/reject`, { reason: rejectReason });
      router.push("/admin/orders");
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر رفض الطلب");
    } finally {
      setBusy(false);
    }
  }

  if (!order) return <p className="text-muted">جاري التحميل...</p>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-xl font-black text-ink">{order.products?.title}</h1>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid gap-4 rounded-2xl border border-paper-line bg-white p-6 sm:grid-cols-2">
        <div>
          <p className="text-xs text-muted">العميل</p>
          <p className="font-bold text-ink">{order.users?.name}</p>
          <p className="text-sm text-muted" dir="ltr">
            {order.users?.phone}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted">السعر</p>
          <p className="font-bold text-ink">{order.products?.price} ج.م</p>
        </div>
        {order.player_id && (
          <div>
            <p className="text-xs text-muted">معرّف اللاعب</p>
            <p className="font-bold text-ink" dir="ltr">
              {order.player_id}
            </p>
          </div>
        )}
        {order.account_details && (
          <div className="sm:col-span-2">
            <p className="text-xs text-muted">تفاصيل الحساب</p>
            <p className="font-bold text-ink">{order.account_details}</p>
          </div>
        )}
        {order.rejection_reason && (
          <div className="rounded-lg bg-danger-soft p-3 sm:col-span-2">
            <p className="text-xs font-bold text-danger">سبب الرفض</p>
            <p className="text-sm text-danger">{order.rejection_reason}</p>
          </div>
        )}
      </div>

      <button
        onClick={loadReceipt}
        className="mt-4 rounded-full border border-paper-line px-5 py-2.5 text-sm font-bold text-ink transition hover:border-orange hover:text-orange"
      >
        فحص إيصال الدفع
      </button>

      {error && <p className="mt-4 rounded-lg bg-danger-soft p-3 text-sm font-bold text-danger">{error}</p>}

      {order.status === "processing" && (
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={complete}
            disabled={busy}
            className="rounded-full bg-teal px-6 py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            تأكيد واكتمال
          </button>
          <button
            onClick={() => setShowRejectForm((v) => !v)}
            className="rounded-full bg-danger px-6 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
          >
            رفض الطلب
          </button>
        </div>
      )}

      {showRejectForm && (
        <div className="mt-4 flex gap-3">
          <input
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="سبب الرفض (مثال: الإيصال غير واضح)"
            className="flex-1 rounded-lg border border-paper-line px-3 py-2 text-sm focus:border-orange focus:outline-none"
          />
          <button
            onClick={reject}
            disabled={busy}
            className="rounded-full bg-danger px-5 py-2 text-sm font-bold text-white disabled:opacity-50"
          >
            تأكيد الرفض
          </button>
        </div>
      )}

      {receiptUrl && (
        <DocumentInspectorModal imageUrl={receiptUrl} open={inspectorOpen} onClose={() => setInspectorOpen(false)} />
      )}
    </div>
  );
}
