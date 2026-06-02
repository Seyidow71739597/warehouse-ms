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
import { ProductViews } from "@/components/ProductViews";

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ query?: string; sort?: string }>;
}) {
  const { locale } = await params;
  
  // URL'den gelen filtreleri al
  const { query, sort } = await searchParams;

  // Sıralama Mantığı
  let orderBy: any = { createdAt: "desc" }; // Varsayılan: En yeni
  
  if (sort === "asc") orderBy = { createdAt: "asc" }; // En eski
  if (sort === "stock_desc") orderBy = { stockQuantity: "desc" }; // En çok stok
  if (sort === "stock_asc") orderBy = { stockQuantity: "asc" }; // En az stok (Bitenler)

  // VERİTABANI SORGUSU (Akıllı Arama ve Sıralama)
  const products = await db.product.findMany({
    where: query ? {
      OR: [
        { name: { contains: query } },
        { barcode: { contains: query } }
      ]
    } : undefined,
    orderBy, // Seçilen sıralamaya göre getir
  });

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto pb-20">
      
      {/* BAŞLIK */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Harytlar (Stok)
          </h1>
          <p className="text-slate-500 mt-1 text-lg">
            Ambardaky ähli harytlaryň sanawy, stok ýagdaýy we suratlary.
          </p>
        </div>
        <Link href={`/${locale}/products/new`}>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20 rounded-xl">
            <Plus className="w-5 h-5 mr-2" />
            Täze Haryt Goş
          </Button>
        </Link>
      </div>

      {/* AKILLI FİLTRELEME ÇUBUĞU */}
      <form className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col xl:flex-row gap-4">
        
        {/* 1. Kelime/Barkod Arama */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
          <Input 
            name="query"
            defaultValue={query}
            placeholder="Haryt ady ýa-da barkod gözle..." 
            className="pl-11 h-12 text-base bg-slate-50 border-slate-200 focus:bg-white rounded-xl transition-colors" 
          />
        </div>

        {/* 2. Gelişmiş Sıralama (Tarih ve Stok) */}
        <div className="w-full xl:w-[280px]">
          <Select name="sort" defaultValue={sort || "desc"}>
            <SelectTrigger className="h-12 bg-slate-50 border-slate-200 rounded-xl font-medium">
              <SelectValue placeholder="Tertiple" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Iň täzeler öňde (Täze Goşulanlar)</SelectItem>
              <SelectItem value="asc">Iň köneler öňde (Köneler)</SelectItem>
              <SelectItem value="stock_desc" className="text-emerald-600 font-bold">Köp stoklylar öňde (Iň Köp)</SelectItem>
              <SelectItem value="stock_asc" className="text-red-600 font-bold">Az stoklylar öňde (Gutoranlar)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 3. Filtrele Butonu */}
        <Button type="submit" size="lg" className="h-12 px-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-white whitespace-nowrap">
          <Filter className="w-4 h-4 mr-2" />
          Filtrle
        </Button>
        
      </form>

      {/* AKILLI GÖRÜNÜM (Kart/Liste ve Boş Durum) */}
      <ProductViews products={products} locale={locale} />
      
    </div>
  );
}