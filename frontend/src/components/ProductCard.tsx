"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import OrderModal from "./OrderModal";

interface Product {
  id: string;
  title: string;
  description: string | null;
  category: "gaming_charge" | "account_security" | "digital_cards";
  price: number;
}

const CATEGORY_LABELS: Record<Product["category"], string> = {
  gaming_charge: "شحن ألعاب",
  account_security: "تأمين حسابات",
  digital_cards: "بطاقات رقمية",
};

export default function ProductCard({ product }: { product: Product }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function handleOrderClick() {
    if (!user) {
      router.push("/login");
      return;
    }
    setOpen(true);
  }

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-paper-line bg-white p-5">
      <div>
        <span className="mb-3 inline-block rounded-full bg-orange-soft px-3 py-1 text-xs font-bold text-orange">
          {CATEGORY_LABELS[product.category]}
        </span>
        <h2 className="font-bold text-ink">{product.title}</h2>
        {product.description && <p className="mt-1 line-clamp-2 text-sm text-muted">{product.description}</p>}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p className="font-display text-lg font-black text-orange">{product.price} ج.م</p>
        <button
          onClick={handleOrderClick}
          disabled={loading}
          className="rounded-full bg-ink px-4 py-2 text-sm font-bold text-paper transition hover:bg-orange disabled:opacity-50"
        >
          اطلب الآن
        </button>
      </div>

      {open && <OrderModal product={product} onClose={() => setOpen(false)} />}
    </div>
  );
}
