"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";

export function ClientLayoutWrapper({ 
  children, 
  locale 
}: { 
  children: React.ReactNode;
  locale: string;
}) {
  const pathname = usePathname();
  
  const isAuthPage = pathname.includes("/login") || pathname.includes("/register");

  // 1. GİRİŞ SAYFALARI (Sidebar Yok)
  if (isAuthPage) {
    return (
      <main className="min-h-screen w-full bg-slate-50 relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10"></div>
        {children}
      </main>
    );
  }

  // 2. İÇERİ SAYFALAR (Sidebar Var)
  return (
    <>
      <Sidebar locale={locale} />

      {/* DÜZELTME BURADA YAPILDI:
         "md:pl-80" SİLİNDİ.
         Artık içerik sağa itilmiyor, hep tam ortada duruyor.
      */}
      <main className="min-h-screen w-full bg-slate-50 relative transition-all duration-300">
        
        {/* Arka Plan Deseni */}
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10 pointer-events-none"></div>
        
        {/* İçerik Kutusu (Üstten menü butonu için boşluk bırakıldı) */}
        <div className="pt-20 px-4 md:px-8 pb-8"> 
          {children}
        </div>
      </main>
    </>
  );
}