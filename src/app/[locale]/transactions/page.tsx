import { db } from "@/lib/db";
import { TableActions } from "@/components/TableActions";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import Link from "next/link";

export default async function TransactionsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; type?: string; sort?: string }>;
}) {
  const { locale } = await params;
  const { q: query, type, sort } = await searchParams;

  const typeFilter = type === "IN" ? "IN" : type === "OUT" ? "OUT" : undefined;
  const sortOrder = sort === "asc" ? "asc" : "desc";

    // VERİTABANI SORGUSU
  const transactions = await db.transaction.findMany({
    where: {
      type: typeFilter,
      OR: query ? [
        { product: { name: { contains: query } } },
        { partner: { name: { contains: query } } }
      ] : undefined
    },
    orderBy: {
      createdAt: sortOrder 
    },
    include: {
      product: true,
      partner: true
    }
  });

  return (
    // DÜZELTME 1: Mobilde padding'i azalttık (p-4), PC'de geniş (md:p-8)
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-[1600px] mx-auto">
      
      {/* ÜST KISIM */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Hereketler (Giriş/Çykyş)</h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">Stokdaky ähli haryt hereketlerini yzarlan.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
            <Link href={`/${locale}/transactions/new`} className="w-full md:w-auto">
                <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                    <Plus className="w-4 h-4 mr-2" />
                    Täze Hereket Goş
                </Button>
            </Link>
        </div>
      </div>

      {/* FİLTRELEME ALANI */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        {/* ARAMA */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <form>
             <Input 
                name="q" 
                defaultValue={query} 
                placeholder="Haryt ýa-da Hyzmatdaş gözle..." 
                className="pl-10 h-11 bg-slate-50 border-slate-200 rounded-xl w-full" 
             />
             {type && <input type="hidden" name="type" value={type} />}
          </form>
        </div>

        {/* TİP FİLTRESİ BUTONLARI (Mobilde taşmasın diye flex-wrap) */}
        <div className="flex flex-wrap gap-2">
            <Link href={`/${locale}/transactions`} className="flex-1 md:flex-none">
                <Button variant={!type ? "default" : "outline"} className="w-full rounded-xl">Ählisi</Button>
            </Link>
            <Link href={`/${locale}/transactions?type=IN`} className="flex-1 md:flex-none">
                <Button variant={type === "IN" ? "default" : "outline"} className="w-full rounded-xl text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                    <ArrowDownLeft className="w-4 h-4 mr-2" /> Girişler
                </Button>
            </Link>
            <Link href={`/${locale}/transactions?type=OUT`} className="flex-1 md:flex-none">
                <Button variant={type === "OUT" ? "default" : "outline"} className="w-full rounded-xl text-red-600 border-red-200 hover:bg-red-50">
                    <ArrowUpRight className="w-4 h-4 mr-2" /> Çykyşlar
                </Button>
            </Link>
        </div>
      </div>

      {/* LİSTE (RESPONSIVE TABLE WRAPPER) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* DÜZELTME 2: overflow-x-auto 
            Bu div sayesinde tablo ekranın dışına taşarsa kaydırma çubuğu çıkar.
            Ekranı patlatmaz.
        */}
        <div className="overflow-x-auto">
            {/* whitespace-nowrap: Satırların alt satıra kaymasını engeller, tablo düzgün durur */}
            <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-4">Haryt</th>
                        <th className="px-6 py-4">Görnüşi</th>
                        <th className="px-6 py-4">Mukdar</th>
                        
                        {/* İSİM DEĞİŞTİ */}
                        <th className="px-6 py-4">Tabşyrylan Kişi</th>
                        
                        <th className="px-6 py-4">Sene (Wagt)</th>
                        <th className="px-6 py-4 text-right">Amallar</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {transactions.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                Hiç hili hereket tapylmady.
                            </td>
                        </tr>
                    ) : (
                        transactions.map((tx: any) => (
                            <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900">
                                    {tx.product.name}
                                </td>
                                <td className="px-6 py-4">
                                    {tx.type === "IN" ? (
                                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200">
                                            <ArrowDownLeft className="w-3 h-3 mr-1" /> Giriş
                                        </Badge>
                                    ) : (
                                        <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-200">
                                            <ArrowUpRight className="w-3 h-3 mr-1" /> Çykyş
                                        </Badge>
                                    )}
                                </td>
                                <td className={`px-6 py-4 font-bold text-lg ${tx.type === "IN" ? "text-emerald-600" : "text-red-600"}`}>
                                    {tx.type === "IN" ? "+" : "-"}{tx.quantity}
                                </td>
                                <td className="px-6 py-4 text-slate-600">
                                    {tx.partner?.name || "-"}
                                </td>
                                <td className="px-6 py-4 text-slate-500">
                                    {new Date(tx.createdAt).toLocaleDateString("tr-TR")} 
                                    <span className="text-xs ml-2 opacity-50">
                                        {new Date(tx.createdAt).toLocaleTimeString("tr-TR", {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <TableActions id={tx.id} type="transaction" locale={locale} />
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>

    </div>
  );
}