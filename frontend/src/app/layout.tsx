import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/authContext";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "RAIZEY STORE | ​منصة الشحن الآمنة لخدمات الألعاب الرقمية",
  description: "منصة شحن وتأمين رقمي، تُراجَع كل عملية فيها يدويًا قبل التسليم.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-paper text-ink antialiased">
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
