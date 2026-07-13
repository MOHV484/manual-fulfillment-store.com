import Link from "next/link";

const steps = [
  { n: "01", title: "اختار الخدمة وابعت بياناتك", body: "شحن لعبة، تأمين حساب، أو بطاقة رقمية — حدد اللي محتاجه واكتب تفاصيل طلبك." },
  { n: "02", title: "ارفع إيصال الدفع", body: "صوّر إيصال التحويل أو الدفع وارفعه مع الطلب." },
  { n: "03", title: "فريقنا يراجع ويسلّم", body: "إنسان حقيقي بيتأكد من الإيصال ويأكد الطلب، وتوصلك الخدمة." },
];

const categories = [
  {
    title: "شحن ألعاب",
    body: "شحن مباشر لأشهر الألعاب والمنصات.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <rect x="2" y="8" width="20" height="10" rx="5" />
        <path d="M7 11v4M5 13h4" />
        <circle cx="16" cy="12" r="1" fill="currentColor" stroke="none" />
        <circle cx="18.5" cy="14.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    title: "تأمين حسابات",
    body: "حماية وتأمين حسابات الألعاب والمنصات الرقمية.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "بطاقات رقمية",
    body: "بطاقات هدايا وشحن رصيد لمتاجر ومنصات متعددة.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
        <path d="M2.5 10h19" />
        <path d="M6 15h4" />
      </svg>
    ),
  },
];

export default function HomePage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-ink text-paper">
        <div className="mx-auto grid max-w-5xl gap-10 px-5 py-20 sm:py-28 lg:grid-cols-[1.3fr_.7fr] lg:items-center">
          <div>
            <p className="mb-4 font-mono text-xs tracking-widest text-gold">
              منصّة شحن وتأمين رقمي
            </p>
            <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              شحن، تأمين، وبطاقات رقمية —
              <br />
              يراجعها إنسان قبل ما توصلك
            </h1>
            <p className="mt-5 max-w-md text-muted-dark">
              مفيش عمليات بتتنفذ لوحدها من غير رقابة. كل طلب بيتأكد يدويًا
              بواسطة فريقنا قبل ما يوصلك، عشان تطمن على فلوسك وحسابك.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink transition hover:bg-gold-deep">
                تصفح الخدمات
              </Link>
              <Link href="/login" className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-paper transition hover:border-gold hover:text-gold">
                أنشئ حسابك
              </Link>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="flex h-40 w-40 -rotate-6 flex-col items-center justify-center gap-1 rounded-full border-2 border-dashed border-gold/70 text-center">
              <span className="font-mono text-[11px] tracking-widest text-gold">توثيق يدوي</span>
              <span className="font-display text-2xl font-bold text-paper">١٠٠٪</span>
              <span className="font-mono text-[11px] tracking-widest text-gold">لكل طلب</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16">
        <h2 className="mb-10 font-display text-2xl font-bold text-ink">إزاي بتشتغل المنصة</h2>
        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map((step) => (
            <div key={step.n}>
              <span className="font-mono text-sm text-gold-deep">{step.n}</span>
              <h3 className="mt-2 font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-paper-line bg-paper-dim">
        <div className="mx-auto max-w-3xl px-5 py-14 text-center">
          <h2 className="font-display text-2xl font-bold text-ink">ليه المراجعة يدوية؟</h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted">
            الأنظمة الآلية بتفشل وقت الزحمة وبتقبل عمليات مزوّرة أحيانًا.
            إحنا بنراجع كل إيصال بعين إنسان حقيقي — يعني أمان أكتر، ولو الرد
            ياخد وقت أطول شوية.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16">
        <h2 className="mb-8 font-display text-2xl font-bold text-ink">الخدمات</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {categories.map((cat) => (
            <Link key={cat.title} href="/products" className="group rounded-2xl border border-paper-line bg-white p-5 transition hover:border-gold">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gold-soft text-gold-deep">
                {cat.icon}
              </div>
              <h3 className="font-semibold text-ink group-hover:text-gold-deep">{cat.title}</h3>
              <p className="mt-1 text-sm text-muted">{cat.body}</p>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-paper-line py-8 text-center text-xs text-muted">
        © منصة الشحن اليدوي والتحقق المالي
      </footer>
    </main>
  );
}
