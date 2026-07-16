"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/apiClient";

interface Summary {
  completedToday: number;
  rejectedToday: number;
  totalToday: number;
  moderators: { id: string; name: string; ordersHandled: number; avgHandlingMinutes: number }[];
}

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    api.get<Summary>("/api/analytics/summary").then(setSummary);
  }, []);

  if (!summary) return <p className="text-muted">جاري التحميل...</p>;

  const cards = [
    { label: "إجمالي طلبات اليوم", value: summary.totalToday },
    { label: "مكتملة اليوم", value: summary.completedToday },
    { label: "مرفوضة اليوم", value: summary.rejectedToday },
  ];

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-black text-ink">الأداء التشغيلي</h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-paper-line bg-white p-5">
            <p className="text-xs text-muted">{card.label}</p>
            <p className="mt-2 font-display text-3xl font-black text-orange">{card.value}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-3 font-bold text-ink">أداء المشرفين اليوم</h2>
      <div className="overflow-hidden rounded-2xl border border-paper-line bg-white">
        <table className="w-full text-sm">
          <thead className="bg-paper-dim text-right text-xs text-muted">
            <tr>
              <th className="p-3">المشرف</th>
              <th className="p-3">طلبات مُعالجة</th>
              <th className="p-3">متوسط زمن المعالجة</th>
            </tr>
          </thead>
          <tbody>
            {summary.moderators.map((mod) => (
              <tr key={mod.id} className="border-t border-paper-line">
                <td className="p-3 font-bold text-ink">{mod.name}</td>
                <td className="p-3 text-muted">{mod.ordersHandled}</td>
                <td className="p-3 text-muted">{mod.avgHandlingMinutes} دقيقة</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
