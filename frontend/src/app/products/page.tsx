interface Product {
  id: string;
  title: string;
  description: string | null;
  category: "gaming_charge" | "account_security" | "digital_cards";
  price: number;
  is_available: boolean;
}

const categoryLabels: Record<Product["category"], string> = {
  gaming_charge: "شحن ألعاب",
  account_security: "تأمين حسابات",
  digital_cards: "بطاقات رقمية",
};

async function getProducts(): Promise<Product[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const res = await fetch(`${apiUrl}/api/products`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.products ?? [];
  } catch {
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <p className="mb-2 font-display text-xs font-bold tracking-wide text-orange">كل الخدمات</p>
      <h1 className="mb-8 font-display text-2xl font-black text-ink">الخدمات المتاحة</h1>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-paper-line bg-paper-dim p-10 text-center">
          <p className="text-muted">لا توجد خدمات متاحة حاليًا، تابعونا قريبًا.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {products.map((product) => (
            <div key={product.id} className="rounded-2xl border border-paper-line bg-white p-5">
              <span className="mb-3 inline-block rounded-full bg-orange-soft px-3 py-1 text-xs font-bold text-orange">
                {categoryLabels[product.category]}
              </span>
              <h2 className="font-bold text-ink">{product.title}</h2>
              {product.description && (
                <p className="mt-1 line-clamp-2 text-sm text-muted">{product.description}</p>
              )}
              <p className="mt-4 font-display text-lg font-black text-orange">{product.price} ج.م</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
