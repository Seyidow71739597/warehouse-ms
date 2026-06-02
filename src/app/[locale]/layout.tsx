import type { Metadata } from "next";
// import { Inter } from "next/font/google"; <-- 1. BUNU TAMAMEN KALDIRDIK
import "../globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ClientLayoutWrapper } from "@/components/ClientLayoutWrapper";

// const inter = Inter({ subsets: ["latin"], variable: "--font-inter" }); <-- 2. BUNU DA KALDIRDIK

export const metadata: Metadata = {
  title: "Ambar Ulgamy",
  description: "WMS - Depo Yönetim Sistemi",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  return (
    <html lang={locale} className="h-full bg-slate-50 antialiased">
      {/* 3. DÜZELTME: inter.className yerine bilgisayarın kendi fontunu (font-sans) kullandık */}
      <body className="font-sans h-full relative">
        
        {/* AKILLI ÇATI (Sidebar'ı nerede göstereceğine kendi karar verir) */}
        <ClientLayoutWrapper locale={locale}>
          {children}
        </ClientLayoutWrapper>
        
        <Toaster />
      </body>
    </html>
  );
}