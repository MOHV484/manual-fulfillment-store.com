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
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-2xl font-bold text-brand-700">الخدمات المتاحة</h1>

      {products.length === 0 ? (
        <p className="rounded-lg bg-white p-6 text-center text-gray-500 ring-1 ring-gray-200">
          لا توجد خدمات متاحة حاليًا.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200"
            >
              <span className="mb-2 inline-block rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
                {categoryLabels[product.category]}
              </span>
              <h2 className="mb-1 font-semibold text-gray-900">
                {product.title}
              </h2>
              {product.description && (
                <p className="mb-3 line-clamp-2 text-sm text-gray-500">
                  {product.description}
                </p>
              )}
              <p className="font-bold text-brand-700">{product.price} ج.م</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
