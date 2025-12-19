import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import { Providers } from "@/lib/providers";
import "./globals.css";

const tajawal = Tajawal({
  weight: ['300', '400', '500', '700', '800'],
  subsets: ["arabic", "latin"],
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  title: "نظام الدروس الخصوصية",
  description: "نظام إدارة الدروس الخصوصية",
  keywords: ["تعليم", "دروس خصوصية", "إدارة الطلاب"],
  authors: [{ name: "MWM Solutions" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${tajawal.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
