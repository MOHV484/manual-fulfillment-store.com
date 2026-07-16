"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/apiClient";

interface Product {
  id: string;
  title: string;
  description: string | null;
  category: string;
  price: number;
  is_available: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  gaming_charge: "شحن ألعاب",
  account_security: "تأمين حسابات",
  digital_cards: "بطاقات رقمية",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", description: "", category: "gaming_charge", price: "" });
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const data = await api.get<{ products: Product[] }>("/api/products/admin/all");
    setProducts(data.products);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function createProduct() {
    setError(null);
    try {
      await api.post("/api/products", { ...form, price: Number(form.price) });
      setForm({ title: "", description: "", category: "gaming_charge", price: "" });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر إضافة الخدمة");
    }
  }

  async function toggleAvailability(product: Product) {
    await api.patch(`/api/products/${product.id}`, { is_available: !product.is_available });
    load();
  }

  async function updatePrice(product: Product, price: number) {
    if (price === product.price) return;
    await api.patch(`/api/products/${product.id}`, { price });
    load();
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-black text-ink">الخدمات والأسعار</h1>

      <div className="mb-8 grid gap-3 rounded-2xl border border-paper-line bg-white p-5 sm:grid-cols-2">
        <input
          placeholder="اسم الخدمة"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="rounded-lg border border-paper-line px-3 py-2 text-sm"
        />
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="rounded-lg border border-paper-line px-3 py-2 text-sm"
        >
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <input
          placeholder="السعر"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="rounded-lg border border-paper-line px-3 py-2 text-sm"
        />
        <input
          placeholder="وصف مختصر (اختياري)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="rounded-lg border border-paper-line px-3 py-2 text-sm"
        />
        {error && <p className="text-sm font-bold text-danger sm:col-span-2">{error}</p>}
        <button
          onClick={createProduct}
          className="rounded-full bg-orange py-2.5 text-sm font-bold text-white hover:bg-orange-deep sm:col-span-2"
        >
          إضافة خدمة
        </button>
      </div>

      {loading ? (
        <p className="text-muted">جاري التحميل...</p>
      ) : (
        <div className="flex flex-col gap-3">
          {products.map((product) => (
            <div key={product.id} className="flex items-center justify-between rounded-2xl border border-paper-line bg-white p-4">
              <div>
                <p className="font-bold text-ink">{product.title}</p>
                <p className="text-xs text-muted">{CATEGORY_LABELS[product.category]}</p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  defaultValue={product.price}
                  onBlur={(e) => updatePrice(product, Number(e.target.value))}
                  className="w-24 rounded-lg border border-paper-line px-2 py-1.5 text-sm"
                />
                <button
                  onClick={() => toggleAvailability(product)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold ${
                    product.is_available ? "bg-teal-soft text-teal" : "bg-danger-soft text-danger"
                  }`}
                >
                  {product.is_available ? "متاحة" : "متوقفة"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
