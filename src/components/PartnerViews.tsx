"use client";

import { useState } from "react";
import { 
  LayoutList, 
  LayoutGrid, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Building2,
  SearchX,
  X // Kapatma ikonu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableActions } from "@/components/TableActions";
// DÜZELTME 1: DialogTitle EKLENDİ 👇
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"; 
import Link from "next/link";

interface PartnerViewsProps {
  partners: any[];
  locale: string;
}

export function PartnerViews({ partners, locale }: PartnerViewsProps) {
  const [view, setView] = useState<"list" | "card">("list");
  
  // BÜYÜK RESİM STATE'İ
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Resim Yükleme Hatası Kontrolü
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  // 🚨 EĞER SONUÇ YOKSA
  if (partners.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 md:p-16 flex flex-col items-center justify-center text-center mt-4 md:mt-8">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner border border-slate-100">
          <SearchX className="w-8 h-8 md:w-10 md:h-10 text-slate-300" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">Hyzmatdaş Tapylmady</h2>
        <p className="text-slate-500 max-w-md mx-auto mb-6 text-base md:text-lg">
          Gözlegiňize laýyk gelýän firma ýa-da şahsyýet tapylmady. 
          Gözleg sözüni üýtgedip gaýtadan synanyşyň ýa-da täze kişi goşuň.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <Link href={`/${locale}/partners`} className="w-full md:w-auto">
            <Button variant="outline" className="rounded-xl px-6 h-12 text-slate-600 w-full md:w-auto">
              Gözlegi Arassala
            </Button>
          </Link>
          <Link href={`/${locale}/partners/new`} className="w-full md:w-auto">
            <Button className="rounded-xl px-6 h-12 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 w-full md:w-auto">
              Täze Kişi Goş
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
          className={`h-9 w-9 p-0 rounded-md transition-all ${view === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <LayoutList className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setView("card")}
          className={`h-9 w-9 p-0 rounded-md transition-all ${view === 'card' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <LayoutGrid className="w-5 h-5" />
        </Button>
      </div>

      {/* 1. LİSTE GÖRÜNÜMÜ (TABLE) */}
      {view === "list" && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="whitespace-nowrap">
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="w-[60px]">Surat</TableHead>
                  <TableHead className="font-bold">Firma / Ady</TableHead>
                  <TableHead className="font-bold">Jogapkär</TableHead>
                  <TableHead className="font-bold">Telefon</TableHead>
                  <TableHead className="font-bold">Email</TableHead>
                  <TableHead className="font-bold text-center">Hereket</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partners.map((partner) => {
                  const imageSrc = partner.passportImage || partner.image;
                  const hasError = imageErrors[partner.id];

                  return (
                    <TableRow key={partner.id} className="hover:bg-slate-50 transition-colors">
                      <TableCell>
                        <div 
                            className={`w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 relative ${imageSrc && !hasError ? "cursor-pointer hover:opacity-80 hover:scale-105 transition-transform" : ""}`}
                            onClick={() => {
                                if (imageSrc && !hasError) setSelectedImage(imageSrc);
                            }}
                        >
                          {imageSrc && !hasError ? (
                            <img 
                              src={`/api/images/${imageSrc.split('/').pop()}`} 
                              alt={partner.name} 
                              className="w-full h-full object-cover"
                              onError={() => handleImageError(partner.id)} 
                            />  
                          ) : (
                            <User className="text-slate-400 w-5 h-5" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-slate-900">{partner.name}</TableCell>
                      <TableCell className="text-slate-600">{partner.contactPerson || "-"}</TableCell>
                      <TableCell>{partner.phone || "-"}</TableCell>
                      <TableCell>{partner.email || "-"}</TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                          {partner._count.transactions}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <TableActions id={partner.id} type="partner" locale={locale} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* 2. KART GÖRÜNÜMÜ */}
      {view === "card" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((partner) => {
             const imageSrc = partner.passportImage || partner.image;
             const hasError = imageErrors[partner.id];

             return (
              <div key={partner.id} className="group bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 overflow-hidden relative">
                
                <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600 absolute top-0 left-0 right-0"></div>

                <div className="absolute top-2 right-2 z-10 bg-white/20 backdrop-blur-md rounded-full">
                  <TableActions id={partner.id} type="partner" locale={locale} />
                </div>

                <div className="pt-12 px-6 pb-6 relative">
                  <div className="w-24 h-24 mx-auto rounded-2xl bg-white p-1 shadow-lg transform group-hover:rotate-3 transition-transform duration-500">
                    <div 
                        className={`w-full h-full rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden relative ${imageSrc && !hasError ? "cursor-pointer" : ""}`}
                        onClick={() => {
                            if (imageSrc && !hasError) setSelectedImage(imageSrc);
                        }}
                    >
                      {imageSrc && !hasError ? (
                        <img 
                          src={`/api/images/${imageSrc.split('/').pop()}`} 
                          alt={partner.name} 
                          className="w-full h-full object-cover"
                          onError={() => handleImageError(partner.id)}
                        />
                      ) : (
                        <Building2 className="text-slate-300 w-10 h-10" />
                      )}
                    </div>
                  </div>

                  <div className="text-center mt-4 space-y-1">
                    <h3 className="text-xl font-bold text-slate-900">{partner.name}</h3>
                    <p className="text-sm text-slate-500 flex items-center justify-center gap-1">
                      <User className="w-3 h-3" />
                      {partner.contactPerson || "Bilinmiyor"}
                    </p>
                  </div>

                  <div className="mt-6 bg-slate-50 rounded-2xl p-4 space-y-3 text-sm">
                    <div className="flex items-center gap-3 text-slate-600">
                      <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600">
                        <Phone className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{partner.phone || "Telefon Yok"}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-slate-600">
                      <div className="p-2 bg-white rounded-lg shadow-sm text-violet-600">
                        <Mail className="w-4 h-4" />
                      </div>
                      <span className="truncate">{partner.email || "Email Yok"}</span>
                    </div>

                    {partner.address && (
                      <div className="flex items-center gap-3 text-slate-600">
                        <div className="p-2 bg-white rounded-lg shadow-sm text-emerald-600">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <span className="truncate">{partner.address}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex justify-between items-center pt-4 border-t border-slate-100">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Jemi Hereket</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-bold text-sm">
                      {partner._count.transactions}
                    </span>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- BÜYÜK RESİM GÖSTEREN POPUP (DIALOG) --- */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-transparent border-none shadow-none flex items-center justify-center">
            
            {/* DÜZELTME 2: DialogTitle EKLENDİ (Gizli Başlık) */}
            <DialogTitle className="sr-only">Surat Görüntüleme</DialogTitle>

            {/* KAPATMA BUTONU (SAĞ ÜST) */}
            <div className="absolute right-4 top-4 z-50">
               <Button variant="secondary" size="icon" className="rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 text-white" onClick={() => setSelectedImage(null)}>
                  <X className="w-6 h-6" />
               </Button>
            </div>

            {/* RESMİN KENDİSİ */}
            {selectedImage && (
                <img 
                    src={`/api/images/${selectedImage.split('/').pop()}`} 
                    alt="Büyük Resim" 
                    className="w-full h-auto max-h-[85vh] object-contain rounded-lg shadow-2xl"
                />
            )}
        </DialogContent>
      </Dialog>

    </div>
  );
}