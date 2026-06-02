"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Save, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Package, 
  ArrowRight,
  Search, 
  X,
  UserCheck,
  Check
} from "lucide-react";
import { createTransaction } from "@/actions/transaction";

interface TransactionFormProps {
  products: any[];
  partners: any[];
  currentUser: { id: string; name: string; email: string };
}

export function TransactionForm({ products, partners, currentUser }: TransactionFormProps) {
  const [type, setType] = useState<"IN" | "OUT">("IN");
  
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(""); 
  const [quantity, setQuantity] = useState<number>(0);

  const [showProductSearch, setShowProductSearch] = useState(false); 
  const [productSearchQuery, setProductSearchQuery] = useState("");  
  const [showPartnerSearch, setShowPartnerSearch] = useState(false);
  const [partnerSearchQuery, setPartnerSearchQuery] = useState("");

  const filteredProducts = products.filter((p) => {
    if (!productSearchQuery) return false; 
    const query = productSearchQuery.toLowerCase();
    return p.name.toLowerCase().includes(query) || (p.barcode && p.barcode.includes(query));
  });

  const filteredPartners = partners.filter((p) => {
    if (!partnerSearchQuery) return false; 
    const query = partnerSearchQuery.toLowerCase();
    return p.name.toLowerCase().includes(query) || (p.contactPerson && p.contactPerson.toLowerCase().includes(query));
  });

  const activeProduct = products.find((p) => p.id === selectedProductId);
  
  const currentStock = activeProduct?.stockQuantity || 0;
  const finalStock = type === "IN" ? currentStock + quantity : currentStock - quantity;

  async function handleSubmit(formData: FormData) {
    await createTransaction(formData);
  }

  return (
    <form action={handleSubmit} className="space-y-6 md:space-y-8 relative">
      
      {/* 🚨 DÜZELTME BURADA: TEK VE GERÇEK TYPE INPUTU */}
      {/* Artık kartların içinde değil, burada tek bir tane var. State neyse onu gönderir. */}
      <input type="hidden" name="type" value={type} />

      {/* 1. GÖRSEL TİP SEÇİMİ */}
      <div className="grid grid-cols-2 gap-4 md:gap-6">
        <div 
          onClick={() => setType("IN")}
          className={`cursor-pointer relative p-4 md:p-6 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center text-center gap-2 md:gap-3 ${
            type === "IN" 
              ? "border-emerald-500 bg-emerald-50/50 shadow-xl shadow-emerald-100 scale-[1.02]" 
              : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50"
          }`}
        >
          <div className={`p-3 md:p-4 rounded-full ${type === "IN" ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>
            <ArrowDownCircle className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <div>
            <h3 className={`font-bold text-base md:text-lg ${type === "IN" ? "text-emerald-900" : "text-slate-500"}`}>Giriş (Alış)</h3>
            <p className="text-xs text-slate-400 mt-1">Stok artar (+)</p>
          </div>
          {/* ESKİ HATALI INPUT BURADAYDI, SİLİNDİ */}
        </div>

        <div 
          onClick={() => setType("OUT")}
          className={`cursor-pointer relative p-4 md:p-6 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center text-center gap-2 md:gap-3 ${
            type === "OUT" 
              ? "border-red-500 bg-red-50/50 shadow-xl shadow-red-100 scale-[1.02]" 
              : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50"
          }`}
        >
          <div className={`p-3 md:p-4 rounded-full ${type === "OUT" ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-400"}`}>
            <ArrowUpCircle className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <div>
            <h3 className={`font-bold text-base md:text-lg ${type === "OUT" ? "text-red-900" : "text-slate-500"}`}>Çykyş (Satyş)</h3>
            <p className="text-xs text-slate-400 mt-1">Stok azalır (-)</p>
          </div>
           {/* ESKİ HATALI INPUT BURADAYDI, SİLİNDİ */}
        </div>
      </div>

      <div className="bg-white p-4 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 md:space-y-8">
        
        {/* 2. CANLI HARYT ARAMA */}
        <div className="space-y-4 relative z-20">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">Haryt Saýla <span className="text-red-500">*</span></Label>
            
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setShowProductSearch(!showProductSearch);
                setProductSearchQuery(""); 
              }}
              className={`text-slate-500 hover:text-blue-600 hover:bg-blue-50 ${showProductSearch ? "bg-blue-50 text-blue-600" : ""}`}
            >
              {showProductSearch ? <X className="w-4 h-4 mr-2" /> : <Search className="w-4 h-4 mr-2" />}
              {showProductSearch ? "Gözlegi Ýap" : "Haryt Gözle"}
            </Button>
          </div>

          {showProductSearch && (
            <div className="relative animate-in fade-in zoom-in-95 duration-200">
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
              <Input 
                autoFocus
                placeholder="Haryt ady ýa-da barkod ýazyň..." 
                value={productSearchQuery}
                onChange={(e) => setProductSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-white border-blue-400 ring-4 ring-blue-50 focus:border-blue-600 rounded-xl shadow-lg relative z-30"
              />
              {productSearchQuery.length > 0 && (
                 <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto z-40 divide-y divide-slate-50">
                    {filteredProducts.length === 0 ? (
                        <div className="p-4 text-center text-slate-500 text-sm">Tapylmady.</div>
                    ) : (
                        filteredProducts.map((p) => (
                            <div 
                                key={p.id}
                                onClick={() => {
                                    setSelectedProductId(p.id);
                                    setShowProductSearch(false);
                                    setProductSearchQuery("");
                                }}
                                className="p-3 hover:bg-blue-50 cursor-pointer flex items-center gap-3 transition-colors"
                            >
                                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                                    {p.image ? (
                                        <img src={`/api/images/${p.image.split('/').pop()}`} alt={p.name} className="w-full h-full object-cover rounded-lg" />
                                    ) : (
                                        <Package className="w-5 h-5 text-slate-400" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 text-sm">{p.name}</p>
                                    <p className="text-xs text-slate-500 font-mono">{p.barcode || "Barkod Ýok"}</p>
                                </div>
                            </div>
                        ))
                    )}
                 </div>
              )}
            </div>
          )}

          <div className={showProductSearch ? "opacity-50 pointer-events-none" : ""}>
             <Select name="productId" required value={selectedProductId} onValueChange={(val) => setSelectedProductId(val)}>
                <SelectTrigger className="h-12 md:h-14 bg-slate-50 text-base md:text-lg truncate">
                <SelectValue placeholder="Listeden haryt saýla..." />
                </SelectTrigger>
                <SelectContent>
                {products.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name} {p.barcode ? `(${p.barcode})` : ""}</SelectItem>
                ))}
                </SelectContent>
            </Select>
          </div>

          {activeProduct && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start gap-4 animate-in fade-in slide-in-from-top-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 bg-green-100 rounded-bl-xl text-green-700">
                  <Check className="w-4 h-4" />
              </div>
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 mx-auto sm:mx-0">
                {activeProduct.image ? (
                   <img src={`/api/images/${activeProduct.image.split('/').pop()}`} alt={activeProduct.name} className="w-full h-full object-cover" />
                ) : (
                   <Package className="w-8 h-8 text-slate-300" />
                )}
              </div>
              <div className="flex-1 w-full text-center sm:text-left">
                <h4 className="font-bold text-slate-900">{activeProduct.name}</h4>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2 text-xs md:text-sm">
                  <div className="bg-white px-2 py-1 md:px-3 rounded-lg border border-slate-200 text-slate-500">
                    Barkod: <span className="font-mono font-bold text-slate-700">{activeProduct.barcode || "-"}</span>
                  </div>
                </div>
              </div>
              <div className="w-full sm:w-auto text-center sm:text-right border-t sm:border-t-0 border-slate-200 pt-3 sm:pt-0 mt-2 sm:mt-0">
                <p className="text-xs text-slate-400 mb-1">Häzirki Stok</p>
                <div className={`text-2xl font-black ${
                  activeProduct.stockQuantity <= activeProduct.minStockLevel ? "text-red-600" : "text-slate-700"
                }`}>
                  {activeProduct.stockQuantity}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. MİKTAR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-end relative z-10">
          <div className="space-y-2">
            <Label className="text-base font-semibold">Mukdar (Sany) <span className="text-red-500">*</span></Label>
            <Input 
              name="quantity" 
              type="number" 
              min="1" 
              required 
              placeholder="0" 
              className="h-12 md:h-14 text-xl font-bold bg-slate-50"
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>
          {activeProduct && (
            <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Netije</p>
                <div className="flex items-center gap-3 text-lg font-medium mt-1">
                  <span className="text-slate-400">{currentStock}</span>
                  <span>{type === "IN" ? "+" : "-"}</span>
                  <span className="text-white">{quantity || 0}</span>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </div>
              </div>
              <div className={`text-3xl font-black ${finalStock < 0 ? "text-red-400" : "text-emerald-400"}`}>
                {finalStock}
              </div>
            </div>
          )}
        </div>

        {/* 4. CANLI KİŞİ ARAMA */}
        <div className="space-y-4 pt-4 border-t border-slate-100 relative z-20">
          <div className="flex items-center justify-between">
             <Label className="text-base font-semibold">Kime Tabşyrmaly (Ýa-da Kimden) <span className="text-slate-400 font-normal text-sm ml-2">(Müşderi/Işgär)</span></Label>
             <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setShowPartnerSearch(!showPartnerSearch);
                setPartnerSearchQuery(""); 
              }}
              className={`text-slate-500 hover:text-blue-600 hover:bg-blue-50 ${showPartnerSearch ? "bg-blue-50 text-blue-600" : ""}`}
            >
              {showPartnerSearch ? <X className="w-4 h-4 mr-2" /> : <Search className="w-4 h-4 mr-2" />}
              {showPartnerSearch ? "Gözlegi Ýap" : "Kişi Gözle"}
            </Button>
          </div>

          {showPartnerSearch && (
            <div className="relative animate-in fade-in zoom-in-95 duration-200">
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
              <Input 
                placeholder="Adyny ýazyň (Google gözleg)..." 
                value={partnerSearchQuery}
                onChange={(e) => setPartnerSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-white border-blue-400 ring-4 ring-blue-50 focus:border-blue-600 rounded-xl shadow-lg relative z-30"
              />
               {partnerSearchQuery.length > 0 && (
                 <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto z-40 divide-y divide-slate-50">
                    {filteredPartners.length === 0 ? (
                        <div className="p-4 text-center text-slate-500 text-sm">Tapylmady.</div>
                    ) : (
                        filteredPartners.map((p) => (
                            <div 
                                key={p.id}
                                onClick={() => {
                                    setSelectedPartnerId(p.id);
                                    setShowPartnerSearch(false);
                                    setPartnerSearchQuery("");
                                }}
                                className="p-3 hover:bg-blue-50 cursor-pointer flex items-center justify-between transition-colors"
                            >
                                <span className="font-bold text-slate-900 text-sm">{p.name}</span>
                                <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">
                                    {p.type === 'CUSTOMER' ? 'Müşderi' : 'Üpjünçi'}
                                </span>
                            </div>
                        ))
                    )}
                 </div>
              )}
            </div>
          )}

          <div className={showPartnerSearch ? "opacity-50 pointer-events-none" : ""}>
            <Select name="partnerId" value={selectedPartnerId} onValueChange={(val) => setSelectedPartnerId(val)}>
                <SelectTrigger className="h-12 md:h-14 bg-slate-50">
                <SelectValue placeholder="Listeden saýla..." />
                </SelectTrigger>
                <SelectContent>
                {partners.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                        {p.name} ({p.type === 'CUSTOMER' ? 'Müşderi' : 'Üpjünçi'})
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>
          </div>
        </div>

        {/* 5. JOGAPKÄR */}
        <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-3 border border-slate-100">
           <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200 text-blue-600 shrink-0">
              <UserCheck className="w-5 h-5" />
           </div>
           <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-400 uppercase">Amaly Ýerine Ýetiren (Jogapkär)</p>
              <p className="text-sm font-bold text-slate-900 truncate">
                  {currentUser.name} <span className="text-slate-500 font-normal">({currentUser.email})</span>
              </p>
           </div>
        </div>

      </div>

      <div className="pt-4 flex justify-end">
        <Button 
          type="submit" 
          size="lg" 
          className={`w-full md:w-auto h-14 px-10 rounded-2xl text-lg font-bold shadow-xl transition-all hover:scale-105 active:scale-95 ${
            type === "IN" 
              ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200" 
              : "bg-red-600 hover:bg-red-700 shadow-red-200"
          }`}
        >
          <Save className="w-6 h-6 mr-2" />
          {type === "IN" ? "Girişi Tassykla" : "Çykyşy Tassykla"}
        </Button>
      </div>

    </form>
  );
}