"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/apiClient";

export default function WalletPage() {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    api.get<{ wallet: { balance: number } }>("/api/wallets/me").then((data) => {
      setBalance(data.wallet.balance);
    });
  }, []);

  return (
    <main className="mx-auto max-w-md px-5 py-16 text-center">
      <p className="mb-2 text-sm text-muted">محفظتك الرقمية</p>
      <p className="font-display text-5xl font-black text-orange">
        {balance === null ? "..." : `${balance} ج.م`}
      </p>
      <p className="mt-4 text-sm text-muted">
        يُستخدم هذا الرصيد لاحقًا في تسوية المرتجعات وتعويضات الطلبات المرفوضة.
      </p>
    </main>
  );
}
