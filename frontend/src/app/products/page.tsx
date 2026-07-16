import ProductCard from "@/components/ProductCard";

interface Product {
  id: string;
  title: string;
  description: string | null;
  category: "gaming_charge" | "account_security" | "digital_cards";
  price: number;
  is_available: boolean;
}

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
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
