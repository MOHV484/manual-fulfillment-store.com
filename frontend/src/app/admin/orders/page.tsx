"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/apiClient";
import { useAuth } from "@/lib/authContext";
import { useNewPendingOrderAlert } from "@/lib/useOrdersRealtime";
import StatusBadge from "@/components/StatusBadge";

interface OrderRow {
  id: string;
  player_id: string | null;
  status: string;
  created_at: string;
  products: { title: string; price: number } | null;
  users: { name: string; phone: string } | null;
}

const TABS = [
  { value: "pending", label: "قيد الانتظار" },
  { value: "processing", label: "قيد المعالجة" },
  { value: "completed", label: "مكتملة" },
  { value: "rejected", label: "مرفوضة" },
];

export default function AdminOrdersPage() {
  const { profile } = useAuth();
  const [tab, setTab] = useState("pending");
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [flash, setFlash] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);

  const load = useCallback(async (status: string) => {
    setLoading(true);
    try {
      const data = await api.get<{ orders: OrderRow[] }>(`/api/orders?status=${status}`);
      setOrders(data.orders);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(tab);
  }, [tab, load]);

  useNewPendingOrderAlert(() => {
    setFlash(true);
    if (tab === "pending") load("pending");
    setTimeout(() => setFlash(false), 4000);
  });

  async function claim(orderId: string) {
    setClaimError(null);
    try {
      await api.post(`/api/orders/${orderId}/claim`);
      load(tab);
    } catch (err) {
      setClaimError(err instanceof Error ? err.message : "تعذر حجز الطلب");
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-black text-ink">طلبات الشحن</h1>
        {flash && (
          <span className="animate-pulse rounded-full bg-danger px-4 py-1.5 text-sm font-bold text-white">
            طلب جديد وصل الآن
          </span>
        )}
      </div>

      <div className="mb-6 flex gap-2 rounded-full bg-paper-dim p-1 text-sm font-bold">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`flex-1 rounded-full py-2 transition ${tab === t.value ? "bg-white text-orange shadow" : "text-muted"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {claimError && (
        <p className="mb-4 rounded-lg bg-danger-soft p-3 text-sm font-bold text-danger">{claimError}</p>
      )}

      {loading ? (
        <p className="text-muted">جاري التحميل...</p>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-paper-line bg-paper-dim p-10 text-center text-muted">
          لا توجد طلبات في هذا القسم حاليًا
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between rounded-2xl border border-paper-line bg-white p-4">
              <div>
                <p className="font-bold text-ink">{order.products?.title ?? "خدمة"}</p>
                <p className="text-sm text-muted">
                  {order.users?.name} · {order.users?.phone}
                  {order.player_id ? ` · ID: ${order.player_id}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={order.status} />
                {order.status === "pending" && profile && (
                  <button
                    onClick={() => claim(order.id)}
                    className="rounded-full bg-orange px-4 py-2 text-sm font-bold text-paper transition hover:bg-orange-deep"
                  >
                    بدء المعالجة
                  </button>
                )}
                {order.status === "processing" && (
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="rounded-full border border-paper-line px-4 py-2 text-sm font-bold text-ink transition hover:border-orange hover:text-orange"
                  >
                    فتح الطلب
                  </Link>
                )}
                {(order.status === "completed" || order.status === "rejected") && (
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-sm font-bold text-muted underline-offset-2 hover:text-orange hover:underline"
                  >
                    التفاصيل
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
