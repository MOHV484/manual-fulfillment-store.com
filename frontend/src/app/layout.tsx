import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "المتجر | Manual Fulfillment Store",
  description: "منصة إدارة الشحن اليدوي والتحقق المالي",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}
