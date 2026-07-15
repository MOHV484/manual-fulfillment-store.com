import Link from "next/link";

const steps = [
  { n: "01", title: "اختر الخدمة وأرسل بياناتك", body: "شحن لعبة، تأمين حساب، أو بطاقة رقمية — حدد ما تحتاجه واكتب تفاصيل طلبك." },
  { n: "02", title: "ارفع إيصال الدفع", body: "التقط صورة لإيصال التحويل أو الدفع وأرفقه مع الطلب." },
  { n: "03", title: "فريقنا يراجع ويُسلّم", body: "يتحقق شخص حقيقي من الإيصال ويؤكد الطلب، لتصلك الخدمة." },
];

const categories = [
  {
    title: "شحن ألعاب",
    body: "شحن مباشر لأشهر الألعاب والمنصات.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
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
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "بطاقات رقمية",
    body: "بطاقات هدايا وشحن رصيد لمتاجر ومنصات متعددة.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
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
            <span className="mb-5 inline-block rounded-full border border-ink-line bg-ink-soft px-4 py-1.5 font-display text-xs font-bold text-orange">
              شحن فوري وتوثيق يدوي لكل عملية
            </span>
            <h1 className="font-display text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
              ارفع مستوى تجربتك مع
              <br />
              <span className="text-orange">رايزي</span>
            </h1>
            <p className="mt-5 max-w-md text-muted-dark">
              لا عمليات تُنفَّذ دون رقابة. كل طلب يُراجَع يدويًا من فريقنا قبل
              التسليم، لتطمئن على أموالك وحسابك.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="rounded-full bg-orange px-6 py-3 text-sm font-bold text-paper transition hover:bg-orange-deep">
                تصفح الخدمات
              </Link>
              <Link href="/login" className="rounded-full border border-white/20 px-6 py-3 text-sm font-bold text-paper transition hover:border-orange hover:text-orange">
                أنشئ حسابك
              </Link>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="flex h-40 w-40 -rotate-6 flex-col items-center justify-center gap-1 rounded-full border-2 border-dashed border-orange/70 text-center">
              <span className="font-display text-xs font-bold tracking-wide text-orange">توثيق يدوي</span>
              <span className="font-display text-3xl font-black text-paper">١٠٠٪</span>
              <span className="font-display text-xs font-bold tracking-wide text-orange">لكل طلب</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16">
        <h2 className="mb-10 font-display text-2xl font-black text-ink">كيف تعمل المنصة</h2>
        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map((step) => (
            <div key={step.n}>
              <span className="font-display text-sm font-black text-orange">{step.n}</span>
              <h3 className="mt-2 font-bold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-paper-line bg-paper-dim">
        <div className="mx-auto max-w-3xl px-5 py-14 text-center">
          <h2 className="font-display text-2xl font-black text-ink">لماذا المراجعة اليدوية؟</h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted">
            الأنظمة الآلية قد تفشل وقت الازدحام وتقبل أحيانًا عمليات مزوّرة.
            نحن نراجع كل إيصال بعين إنسان حقيقي — لأمان أكبر، حتى لو استغرق
            الرد وقتًا أطول قليلًا.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16">
        <h2 className="mb-8 font-display text-2xl font-black text-ink">الخدمات</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {categories.map((cat) => (
            <Link key={cat.title} href="/products" className="group rounded-2xl border border-paper-line bg-white p-5 transition hover:border-orange hover:shadow-md">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-orange-soft text-orange">
                {cat.icon}
              </div>
              <h3 className="font-bold text-ink group-hover:text-orange">{cat.title}</h3>
              <p className="mt-1 text-sm text-muted">{cat.body}</p>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-paper-line bg-ink py-10 text-center">
        <span className="mb-3 inline-block rounded-lg bg-orange px-2.5 py-1 font-display text-sm font-black text-paper">
          رايزي
        </span>
        <p className="text-xs text-muted-dark">منصة الشحن اليدوي والتحقق المالي</p>
      </footer>
    </main>
  );
}
