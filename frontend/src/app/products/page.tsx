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
      <p className="mb-2 font-mono text-xs tracking-widest text-gold-deep">كل الخدمات</p>
      <h1 className="mb-8 font-display text-2xl font-bold text-ink">الخدمات المتاحة</h1>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-paper-line bg-paper-dim p-10 text-center">
          <p className="text-muted">مفيش خدمات متاحة دلوقتي، تابعنا قريب.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {products.map((product) => (
            <div key={product.id} className="rounded-2xl border border-paper-line bg-white p-5">
              <span className="mb-3 inline-block rounded-full bg-gold-soft px-3 py-1 font-mono text-[11px] text-gold-deep">
                {categoryLabels[product.category]}
              </span>
              <h2 className="font-semibold text-ink">{product.title}</h2>
              {product.description && (
                <p className="mt-1 line-clamp-2 text-sm text-muted">{product.description}</p>
              )}
              <p className="mt-4 font-mono text-lg font-semibold text-gold-deep">{product.price} ج.م</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
