import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/authContext";
import Navbar from "@/components/Navbar";

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
      <body className="bg-gray-50 text-gray-900 antialiased">
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
