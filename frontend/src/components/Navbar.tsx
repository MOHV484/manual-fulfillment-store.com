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
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-3xl items-center justify-between p-4">
        <Link href="/" className="font-bold text-brand-700">
          المتجر
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link href="/products" className="text-gray-600 hover:text-brand-700">
            الخدمات
          </Link>

          {loading ? null : user ? (
            <>
              <Link href="/orders" className="text-gray-600 hover:text-brand-700">
                طلباتي
              </Link>
              <button
                onClick={handleSignOut}
                className="rounded-lg bg-gray-100 px-3 py-1.5 text-gray-700 hover:bg-gray-200"
              >
                خروج
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-brand-600 px-3 py-1.5 text-white hover:bg-brand-700"
            >
              دخول
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
