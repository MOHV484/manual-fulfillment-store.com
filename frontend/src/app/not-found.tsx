import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white px-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-8xl font-black text-yellow-400">404</h1>
        <h2 className="text-2xl font-bold">الصفحة غير موجودة</h2>
        <p className="text-gray-400">
          الصفحة اللي بتدور عليها مش موجودة أو اتنقلت لمكان تاني.
        </p>
        <Link
          href="/"
          className="inline-block bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-bold px-6 py-3 rounded-xl transition-colors"
        >
          الرجوع للرئيسية
        </Link>
      </div>
    </div>
  );
}
