"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";

export default function Navbar() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="sticky top-0 z-20 border-b border-paper-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center">
          <span className="rounded-xl bg-orange px-3 py-1.5 font-display text-lg font-black text-paper">
            رايزي
          </span>
        </Link>

        <div className="flex items-center gap-6 text-sm">
          <Link href="/products" className="font-medium text-muted transition hover:text-orange">
            الخدمات
          </Link>

          {loading ? null : user ? (
            <>
              <Link href="/orders" className="font-medium text-muted transition hover:text-orange">
                طلباتي
              </Link>
              <button
                onClick={handleSignOut}
                className="rounded-full border border-paper-line px-4 py-1.5 font-medium text-ink transition hover:border-orange hover:text-orange"
              >
                خروج
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-orange px-4 py-1.5 font-bold text-paper transition hover:bg-orange-deep"
            >
              دخول
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
