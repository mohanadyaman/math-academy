import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext"; // الإضافة الجديدة

const cairo = Cairo({ subsets: ["arabic"] });

export const metadata: Metadata = {
  title: "منصة مهند التعليمية",
  description: "أفضل منصة لتعلم الرياضيات",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cairo.className}>
        <AuthProvider> {/* غلفنا الموقع هنا */}
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}