"use client";

import { useState } from "react";
import { 
  LayoutList, 
  LayoutGrid, 
  Package, 
  AlertTriangle,
  SearchX,
  X // Kapatma ikonu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableActions } from "@/components/TableActions";
// Dialog bileşenlerini ekledik
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"; 
import Link from "next/link";

interface ProductViewsProps {
  products: any[];
  locale: string;
}

export function ProductViews({ products, locale }: ProductViewsProps) {
  const [view, setView] = useState<"list" | "card">("list");
  
  // BÜYÜK RESİM STATE'İ
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // 🚨 EĞER SONUÇ YOKSA
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 md:p-16 flex flex-col items-center justify-center text-center mt-4 md:mt-8">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner border border-slate-100">
          <SearchX className="w-8 h-8 md:w-10 md:h-10 text-slate-300" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">Haryt Tapylmady</h2>
        <p className="text-slate-500 max-w-md mx-auto mb-6 text-base md:text-lg">
          Gözlegiňize ýa-da barkoda laýyk gelýän haryt ambarda ýok. 
          Gözleg sözüni üýtgedip gaýtadan synanyşyň ýa-da täze haryt goşuň.
        </p>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <Link href={`/${locale}/products`} className="w-full md:w-auto">
            <Button variant="outline" className="rounded-xl px-6 h-12 text-slate-600 w-full md:w-auto">
              Gözlegi Arassala
            </Button>
          </Link>
          <Link href={`/${locale}/products/new`} className="w-full md:w-auto">
            <Button className="rounded-xl px-6 h-12 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 w-full md:w-auto">
              Täze Haryt Goş
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // EĞER SONUÇ VARSA
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
          {/* MOBİL UYUM İÇİN YATAY KAYDIRMA EKLENDİ */}
          <div className="overflow-x-auto">
            <Table className="whitespace-nowrap">
                <TableHeader>
                <TableRow className="bg-slate-50">
                    <TableHead className="w-[80px]">Surat</TableHead>
                    <TableHead className="font-bold">Barkod</TableHead>
                    <TableHead className="font-bold">Haryt Ady</TableHead>
                    <TableHead className="font-bold">Stok</TableHead>
                    <TableHead className="font-bold">Birlik</TableHead>
                    <TableHead className="font-bold text-right">Amallar</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {products.map((product) => (
                    <TableRow key={product.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell>
                        {/* RESİM ALANI - TIKLANABİLİR */}
                        <div 
                            className={`w-12 h-12 rounded-lg border border-slate-100 overflow-hidden bg-slate-50 flex items-center justify-center relative ${product.image ? "cursor-pointer hover:opacity-80 hover:scale-105 transition-transform" : ""}`}
                            onClick={() => {
                                if (product.image) setSelectedImage(product.image);
                            }}
                        >
                        {product.image ? (
                            <img src={`/api/images/${product.image.split('/').pop()}`} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                            <Package className="text-slate-300 w-6 h-6" />
                        )}
                        </div>
                    </TableCell>
                    <TableCell className="font-mono text-slate-500">{product.barcode || "-"}</TableCell>
                    <TableCell className="font-medium text-slate-900">{product.name}</TableCell>
                    <TableCell>
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        product.stockQuantity <= product.minStockLevel 
                            ? "bg-red-100 text-red-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}>
                        {product.stockQuantity <= product.minStockLevel && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {product.stockQuantity}
                        </div>
                    </TableCell>
                    <TableCell className="text-slate-500">{product.unit}</TableCell>
                    <TableCell className="text-right">
                        <TableActions id={product.id} type="product" locale={locale} />
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* 2. KART GÖRÜNÜMÜ */}
      {view === "card" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="group relative bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden">
              
              {/* RESİM ALANI - TIKLANABİLİR */}
              <div 
                className={`h-48 w-full bg-slate-50 flex items-center justify-center relative overflow-hidden ${product.image ? "cursor-pointer" : ""}`}
                onClick={() => {
                    if (product.image) setSelectedImage(product.image);
                }}
              >
                {product.image ? (
                  <img src={`/api/images/${product.image.split('/').pop()}`} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                  <Package className="text-slate-200 w-16 h-16" />
                )}
                
                <div className="absolute top-4 right-4 z-10 pointer-events-none">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md ${
                      product.stockQuantity <= product.minStockLevel 
                        ? "bg-red-500/90 text-white"
                        : "bg-emerald-500/90 text-white"
                    }`}>
                      {product.stockQuantity} {product.unit}
                    </div>
                </div>
              </div>

              {/* BİLGİ ALANI */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1">{product.name}</h3>
                    <p className="text-xs font-mono text-slate-400">{product.barcode || "Barkod Ýok"}</p>
                  </div>
                  <TableActions id={product.id} type="product" locale={locale} />
                </div>
                
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <Link href={`/${locale}/transactions?q=${product.name}`} className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                      Hereketleri Gör →
                    </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- BÜYÜK RESİM GÖSTEREN POPUP (DIALOG) --- */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-transparent border-none shadow-none flex items-center justify-center">
            
            {/* GİZLİ BAŞLIK (Erişilebilirlik Hatasını Önler) */}
            <DialogTitle className="sr-only">Haryt Suraty</DialogTitle>

            {/* KAPATMA BUTONU */}
            <div className="absolute right-4 top-4 z-50">
               <Button variant="secondary" size="icon" className="rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 text-white" onClick={() => setSelectedImage(null)}>
                  <X className="w-6 h-6" />
               </Button>
            </div>

            {/* RESMİN KENDİSİ */}
            {selectedImage && (
                <img 
                    // 🚀 DEĞİŞTİRDİĞİMİZ SATIR BURASI:
                    src={`/api/images/${selectedImage.split('/').pop()}`}
                    alt="Büyük Resim" 
                    className="w-full h-auto max-h-[85vh] object-contain rounded-lg shadow-2xl bg-white"
                />
            )}
        </DialogContent>
      </Dialog>

    </div>
  );
}