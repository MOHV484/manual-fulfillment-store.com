"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/authContext";

const NAV = [
  { href: "/admin/orders", label: "طلبات الشحن", roles: ["moderator", "super_admin"] },
  { href: "/admin/products", label: "الخدمات والأسعار", roles: ["super_admin"] },
  { href: "/admin/moderators", label: "المشرفون", roles: ["super_admin"] },
  { href: "/admin/analytics", label: "الأداء", roles: ["super_admin"] },
  { href: "/admin/audit-logs", label: "سجل التدقيق", roles: ["super_admin"] },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile, loading, isAdmin } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace("/login");
    }
  }, [loading, isAdmin, router]);

  if (loading || !profile) {
    return <div className="flex min-h-[60vh] items-center justify-center text-muted">جاري التحميل...</div>;
  }

  if (!isAdmin) return null;

  return (
    <div className="mx-auto flex max-w-6xl gap-6 px-5 py-8">
      <aside className="w-56 shrink-0">
        <div className="mb-4 rounded-2xl bg-ink px-4 py-3 text-paper">
          <p className="text-xs text-muted-dark">مسجّل دخول كـ</p>
          <p className="font-bold">{profile.name}</p>
          <p className="text-xs font-bold text-orange">{profile.role === "super_admin" ? "مدير عام" : "مشرف"}</p>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV.filter((item) => item.roles.includes(profile.role)).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                pathname?.startsWith(item.href) ? "bg-orange text-paper" : "text-ink hover:bg-paper-dim"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
