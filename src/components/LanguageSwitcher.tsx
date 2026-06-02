"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";

export function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLanguageChange = (newLocale: string) => {
    // Mevcut URL'i parçala: /tk/products -> ['', 'tk', 'products']
    const segments = pathname.split("/");
    
    // Dil kısmını (2. parça) değiştir
    segments[1] = newLocale;
    
    // Yeni URL'i oluştur ve git
    const newUrl = segments.join("/");
    router.push(newUrl);
  };

  return (
    <Select defaultValue={currentLocale} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-full bg-slate-800 border-slate-700 text-slate-300">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4" />
          <SelectValue placeholder="Dil Seç" />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-slate-800 border-slate-700 text-slate-300">
        <SelectItem value="tk">Türkmençe</SelectItem>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="ru">Русский</SelectItem>
      </SelectContent>
    </Select>
  );
}