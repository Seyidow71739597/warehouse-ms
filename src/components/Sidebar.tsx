"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { logoutUser } from "@/actions/auth";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  ArrowRightLeft,
  Users,
  Settings,
  LogOut,
  Box,
  Menu, 
  X,     
  Globe,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  locale: string;
}

export function Sidebar({ locale }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false); 

  // MENÜ LİNKLERİ
  const routes = [
    {
      label: "Dolandyryş Paneli",
      icon: LayoutDashboard,
      href: `/${locale}`,
      active: pathname === `/${locale}`,
    },
    {
      label: "Harytlar (Stok)",
      icon: Package,
      href: `/${locale}/products`,
      active: pathname.includes("/products"),
    },
    {
      label: "Hereketler (Giriş/Çykyş)",
      icon: ArrowRightLeft,
      href: `/${locale}/transactions`,
      active: pathname.includes("/transactions"),
    },
    {
      label: "Hyzmatdaşlar",
      icon: Users,
      href: `/${locale}/partners`,
      active: pathname.includes("/partners"),
    },
    {
      label: "Hasabatlar (Raporlar)",
      icon: BarChart3,
      href: `/${locale}/reports`,
      active: pathname.includes("/reports"),
    },
    {
      label: "Sazlamalar (Admin)",
      icon: Settings,
      href: `/${locale}/settings`,
      active: pathname.includes("/settings"),
    },
  ];

  return (
    <>
      {/* 1. MENÜ AÇMA BUTONU 
          - z-[100] yaptık: En üstte dursun, tıklanabilsin.
          - md:hidden SİLDİK: Artık Bilgisayarda da buton görünsün (İstersen kapatabil diye)
      */}
      <div className={`fixed top-4 left-4 z-[100] transition-all duration-300 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <Button
          onClick={() => setIsOpen(true)}
          size="icon"
          className="bg-white/90 backdrop-blur-md shadow-lg border border-slate-200 text-slate-800 hover:bg-white hover:scale-110 transition-all h-12 w-12 rounded-2xl"
        >
          <Menu className="w-6 h-6" />
        </Button>
      </div>

      {/* 2. KARARTMA PERDESİ (Overlay) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[90] transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 3. SIDEBAR PANELİ */}
      <div 
        className={cn(
          "fixed top-0 left-0 h-full w-80 z-[100] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]", 
          "bg-white/80 backdrop-blur-2xl border-r border-white/50 shadow-2xl",
          // BURASI ÖNEMLİ: 
          // isOpen ? "translate-x-0" : "-translate-x-full"
          // Artık bilgisayarda da (md) kapalı durabilir, butona basınca açılır.
          isOpen ? "translate-x-0" : "-translate-x-full" 
        )}
      >
        {/* KAPATMA BUTONU */}
        <Button
          onClick={() => setIsOpen(false)}
          variant="ghost"
          size="icon"
          className="absolute top-6 right-6 text-slate-500 hover:bg-red-100 hover:text-red-600 rounded-xl"
        >
          <X className="w-6 h-6" />
        </Button>

        {/* LOGO */}
        <div className="flex items-center gap-3 p-8 mb-6">
          <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/30">
            <Box className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">
              Ammar Ulgamy
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">SANLY GALA H.K</p>
          </div>
        </div>

        {/* MENÜ LİNKLERİ */}
        <div className="px-4 space-y-2 overflow-y-auto max-h-[calc(100vh-250px)]">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={() => setIsOpen(false)} 
              className={cn(
                "flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all group",
                route.active
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-600/30" 
                  : "text-slate-600 hover:bg-white/50 hover:text-blue-700" 
              )}
            >
              <route.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", route.active ? "text-white" : "text-slate-400 group-hover:text-blue-600")} />
              {route.label}
            </Link>
          ))}
        </div>

        {/* ALT KISIM */}
        <div className="absolute bottom-0 left-0 w-full p-6 border-t border-white/30 space-y-3 bg-white/10">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/40 border border-white/50 text-slate-600 cursor-pointer hover:bg-white/60 transition-colors">
            <Globe className="w-5 h-5" />
            <span className="text-sm font-medium">Dil: Türkmençe</span>
          </div>
          <form action={logoutUser}>
            <button type="submit" className="flex items-center gap-3 w-full p-3 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors font-medium">
              <LogOut className="w-5 h-5" />
              <span>Ulgamdan Çyk</span>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}