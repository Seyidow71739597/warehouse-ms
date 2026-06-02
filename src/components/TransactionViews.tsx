"use client";

import { useState } from "react";
import { 
  LayoutList, 
  LayoutGrid, 
  ArrowDownCircle, 
  ArrowUpCircle,
  Calendar,
  User,
  FileText,
  Package,
  SearchX // YENİ: Bulunamadı ikonu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableActions } from "@/components/TableActions";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import Link from "next/link";

interface TransactionViewsProps {
  transactions: any[];
  locale: string;
}

export function TransactionViews({ transactions, locale }: TransactionViewsProps) {
  const [view, setView] = useState<"list" | "card">("list");

  // EĞER SONUÇ YOKSA ŞIK BİR UYARI EKRANI GÖSTER
  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-16 flex flex-col items-center justify-center text-center mt-8">
        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner border border-slate-100">
          <SearchX className="w-10 h-10 text-slate-300" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Netije Tapylmady</h2>
        <p className="text-slate-500 max-w-md mx-auto mb-6 text-lg">
          Gözlegiňize ýa-da saýlan filtriňize laýyk gelýän hereket ýok. 
          Gözleg sözüni üýtgedip ýa-da filtri aýyryp gaýtadan synanyşyň.
        </p>
        <Link href={`/${locale}/transactions`}>
          <Button variant="outline" className="rounded-xl px-6 h-12 text-slate-600">
            Filtri Arassala (Temizle)
          </Button>
        </Link>
      </div>
    );
  }

  // EĞER SONUÇ VARSA NORMAL LİSTE VEYA KARTI GÖSTER
  return (
    <div className="space-y-6">
      
      {/* GÖRÜNÜM DEĞİŞTİRME BUTONLARI */}
      <div className="flex justify-end items-center gap-2 bg-slate-100 p-1 rounded-lg w-fit ml-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setView("list")}
          className={`h-9 w-9 p-0 rounded-md transition-all ${
            view === 'list' 
              ? 'bg-white shadow-sm text-blue-600 hover:bg-white hover:text-blue-700' 
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
          }`}
        >
          <LayoutList className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setView("card")}
          className={`h-9 w-9 p-0 rounded-md transition-all ${
            view === 'card' 
              ? 'bg-white shadow-sm text-blue-600 hover:bg-white hover:text-blue-700' 
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
        </Button>
      </div>

      {/* 1. LİSTE GÖRÜNÜMÜ */}
      {view === "list" && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="w-[60px]">Surat</TableHead>
                <TableHead className="font-bold">Görnüş</TableHead>
                <TableHead className="font-bold">Haryt Ady</TableHead>
                <TableHead className="font-bold">Mukdar</TableHead>
                <TableHead className="font-bold">Kim (Hyzmatdaş)</TableHead>
                <TableHead className="font-bold">Senene</TableHead>
                <TableHead className="font-bold">Bellik</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((t) => (
                <TableRow key={t.id} className="hover:bg-slate-50 transition-colors">
                  <TableCell>
                    <div className="w-10 h-10 rounded-lg border border-slate-100 overflow-hidden bg-slate-50 flex items-center justify-center">
                      {t.product.imagePath ? (
                        <img src={t.product.imagePath} alt={t.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="text-slate-300 w-5 h-5" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {t.type === "IN" ? (
                      <div className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-md w-fit text-xs">
                        <ArrowDownCircle className="w-4 h-4" /> Giriş
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-600 font-bold bg-red-50 px-2 py-1 rounded-md w-fit text-xs">
                        <ArrowUpCircle className="w-4 h-4" /> Çykyş
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-slate-900">{t.product.name}</TableCell>
                  <TableCell className="font-mono font-bold text-lg">{t.quantity} {t.product.unit}</TableCell>
                  <TableCell className="text-slate-600">{t.partner.name}</TableCell>
                  <TableCell className="text-slate-500 text-sm font-medium">
                    {format(new Date(t.date), "dd MMM, HH:mm", { locale: tr })}
                  </TableCell>
                  <TableCell className="text-slate-400 text-sm truncate max-w-[150px]">
                    {t.notes || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <TableActions id={t.id} type="transaction" locale={locale} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* 2. KART GÖRÜNÜMÜ */}
      {view === "card" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {transactions.map((t) => (
            <div key={t.id} className="group relative bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 overflow-hidden">
              <div className="h-40 w-full bg-slate-50 relative overflow-hidden flex items-center justify-center">
                 {t.product.imagePath ? (
                    <img src={t.product.imagePath} alt={t.product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                 ) : (
                    <div className={`w-full h-full flex items-center justify-center ${t.type === 'IN' ? 'bg-emerald-50' : 'bg-red-50'}`}>
                       <Package className={`w-12 h-12 ${t.type === 'IN' ? 'text-emerald-200' : 'text-red-200'}`} />
                    </div>
                 )}
                 <div className="absolute top-3 right-3 z-10">
                    <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-bold text-xs shadow-md backdrop-blur-md ${t.type === 'IN' ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
                       {t.type === 'IN' ? <ArrowDownCircle className="w-4 h-4" /> : <ArrowUpCircle className="w-4 h-4" />}
                       {t.type === 'IN' ? 'Giriş' : 'Çykyş'}
                    </div>
                 </div>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg leading-tight line-clamp-1" title={t.product.name}>{t.product.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-2xl font-black font-mono ${t.type === 'IN' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {t.type === 'IN' ? '+' : '-'}{t.quantity}
                      </span>
                      <span className="text-slate-400 font-bold text-sm">{t.product.unit}</span>
                    </div>
                  </div>
                  <TableActions id={t.id} type="transaction" locale={locale} />
                </div>
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <User className="w-4 h-4 text-slate-400" />
                      <span className="font-medium">{t.partner.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{format(new Date(t.date), "dd MMM, HH:mm", { locale: tr })}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}