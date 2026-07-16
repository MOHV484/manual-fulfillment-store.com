"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/apiClient";
import StatusBadge from "@/components/StatusBadge";

interface MyOrder {
  id: string;
  status: string;
  rejection_reason: string | null;
  created_at: string;
  products: { title: string; price: number } | null;
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<MyOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ orders: MyOrder[] }>("/api/orders/my").then((data) => {
      setOrders(data.orders);
      setLoading(false);
    });
  }, []);

  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="mb-8 font-display text-2xl font-black text-ink">طلباتي</h1>

      {loading ? (
        <p className="text-muted">جاري التحميل...</p>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-paper-line bg-paper-dim p-10 text-center text-muted">
          لسه ما عندك طلبات. تصفح الخدمات وابدأ أول طلب.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-paper-line bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="font-bold text-ink">{order.products?.title}</p>
                <StatusBadge status={order.status} />
              </div>
              <p className="mt-1 text-sm text-muted" dir="ltr">
                {new Date(order.created_at).toLocaleString("ar-EG")}
              </p>
              {order.rejection_reason && (
                <p className="mt-3 rounded-lg bg-danger-soft p-3 text-sm text-danger">
                  سبب الرفض: {order.rejection_reason}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
