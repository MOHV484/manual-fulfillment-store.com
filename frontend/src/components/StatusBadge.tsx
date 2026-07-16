const CONFIG: Record<string, { label: string; className: string }> = {
  pending: { label: "قيد الانتظار", className: "bg-orange-soft text-orange" },
  processing: { label: "قيد المعالجة", className: "bg-teal-soft text-teal" },
  completed: { label: "مكتمل", className: "bg-teal-soft text-teal" },
  rejected: { label: "مرفوض", className: "bg-danger-soft text-danger" },
};

export default function StatusBadge({ status }: { status: string }) {
  const config = CONFIG[status] ?? { label: status, className: "bg-paper-dim text-muted" };
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${config.className}`}>
      {config.label}
    </span>
  );
}
