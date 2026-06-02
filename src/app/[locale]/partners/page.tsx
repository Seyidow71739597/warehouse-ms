import { db } from "@/lib/db";
import { Plus, Search, Filter } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PartnerViews } from "@/components/PartnerViews";

export default async function PartnersPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ query?: string; sort?: string }>;
}) {
  const { locale } = await params;
  
  // URL'den gelen filtreleri al
  const { query, sort } = await searchParams;

  // Sıralama (asc: Eski, desc: Yeni)
  const sortOrder = sort === "asc" ? "asc" : "desc";

  // VERİTABANI SORGUSU (Akıllı Arama)
  const partners = await db.partner.findMany({
    where: query ? {
      OR: [
        { name: { contains: query } },
        { contactPerson: { contains: query } },
        { phone: { contains: query } },
      ]
    } : undefined,
    orderBy: { createdAt: sortOrder }, // Yeniye/Eskiye göre sırala
    include: {
      _count: {
        select: { transactions: true } // Kaç işlem yapmış?
      }
    }
  });

  return (
    // DÜZELTME 1: Padding mobilde p-4, PC'de p-8
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-[1600px] mx-auto pb-20">
      
      {/* BAŞLIK */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Hyzmatdaşlar
          </h1>
          <p className="text-slate-500 mt-1 text-sm md:text-lg">
            Müşderiler, üpjünçiler we işgärler kartotekasy.
          </p>
        </div>
        
        {/* DÜZELTME 2: Link ve Buton Mobilde Tam Genişlik (w-full) */}
        <Link href={`/${locale}/partners/new`} className="w-full md:w-auto">
          <Button size="lg" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20 rounded-xl">
            <Plus className="w-5 h-5 mr-2" />
            Täze Kişi Goş
          </Button>
        </Link>
      </div>

      {/* AKILLI FİLTRELEME ÇUBUĞU */}
      {/* DÜZELTME 3: flex-col (mobil) -> md:flex-row (masaüstü) */}
      <form className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        
        {/* 1. Kelime Arama */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
          <Input 
            name="query"
            defaultValue={query}
            placeholder="Firma, şahsyýet ýa-da telefon..." 
            className="pl-11 h-12 text-base bg-slate-50 border-slate-200 focus:bg-white rounded-xl transition-colors w-full" 
          />
        </div>

        {/* 2. Tarih Sıralaması */}
        {/* Mobilde tam genişlik, PC'de sabit genişlik */}
        <div className="w-full md:w-[220px]">
          <Select name="sort" defaultValue={sort || "desc"}>
            <SelectTrigger className="h-12 bg-slate-50 border-slate-200 rounded-xl font-medium w-full">
              <SelectValue placeholder="Sene tertibi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Iň täzeler öňde (Täze)</SelectItem>
              <SelectItem value="asc">Iň köneler öňde (Köne)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 3. Filtrele Butonu */}
        <Button type="submit" size="lg" className="h-12 px-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-white whitespace-nowrap w-full md:w-auto">
          <Filter className="w-4 h-4 mr-2" />
          Filtrle
        </Button>
        
      </form>

      {/* AKILLI GÖRÜNÜM (Kart/Liste ve Boş Durum) */}
      <PartnerViews partners={partners} locale={locale} />
      
    </div>
  );
}