"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/apiClient";

interface AuditLog {
  id: string;
  action_type: string;
  previous_value: string | null;
  new_value: string | null;
  created_at: string;
  users: { name: string; email: string } | null;
}

const ACTION_LABELS: Record<string, string> = {
  order_approve: "اعتماد طلب",
  order_reject: "رفض طلب",
  order_claim: "حجز طلب",
  balance_modify: "تعديل رصيد",
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ logs: AuditLog[] }>("/api/audit-logs").then((data) => {
      setLogs(data.logs);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-black text-ink">سجل التدقيق</h1>
      {loading ? (
        <p className="text-muted">جاري التحميل...</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-paper-line bg-white">
          <table className="w-full text-sm">
            <thead className="bg-paper-dim text-right text-xs text-muted">
              <tr>
                <th className="p-3">الإجراء</th>
                <th className="p-3">المشرف</th>
                <th className="p-3">من</th>
                <th className="p-3">إلى</th>
                <th className="p-3">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-t border-paper-line">
                  <td className="p-3 font-bold text-ink">{ACTION_LABELS[log.action_type] ?? log.action_type}</td>
                  <td className="p-3 text-muted">{log.users?.name ?? "—"}</td>
                  <td className="p-3 text-muted">{log.previous_value ?? "—"}</td>
                  <td className="p-3 text-muted">{log.new_value ?? "—"}</td>
                  <td className="p-3 text-muted" dir="ltr">
                    {new Date(log.created_at).toLocaleString("ar-EG")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
