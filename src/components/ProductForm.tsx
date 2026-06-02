"use client";

import { createProduct } from "@/actions/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save } from "lucide-react";
import { toast } from "sonner";

export function ProductForm() {
  async function clientAction(formData: FormData) {
    const result = await createProduct(formData);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Ürün başarıyla kaydedildi!");
    }
  }

  return (
    <form action={clientAction} className="space-y-8 bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
      
      {/* 1. Temel Bilgiler */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">
          Temel Bilgiler
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="barcode">Barkod (Zorunlu)</Label>
            <Input id="barcode" name="barcode" placeholder="Meselem: 869000123456" required className="font-mono bg-slate-50" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Ürün Adı (Zorunlu)</Label>
            <Input id="name" name="name" placeholder="Meselem: Toyota Fren Balatası" required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Açıklama / Notlar</Label>
          <Textarea id="description" name="description" placeholder="Ürün hakkında teknik detaylar..." className="resize-none" />
        </div>
      </div>

      {/* 2. Stok ve Birim */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">
          Stok & Birim
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="stockQuantity">Başlangıç Stoğu</Label>
            <Input id="stockQuantity" name="stockQuantity" type="number" defaultValue="0" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minStockLevel">Kritik Stok Uyarı Seviyesi</Label>
            <Input id="minStockLevel" name="minStockLevel" type="number" defaultValue="10" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unit">Birim</Label>
            <Select name="unit" defaultValue="PIECE">
              <SelectTrigger>
                <SelectValue placeholder="Birim Seç" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PIECE">Sany (Piece)</SelectItem>
                <SelectItem value="KG">Kilogram (KG)</SelectItem>
                <SelectItem value="BOX">Guty (Box)</SelectItem>
                <SelectItem value="METER">Metre (Meter)</SelectItem>
                <SelectItem value="LITER">Litre (Liter)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* FİYAT BÖLÜMÜ SİLİNDİ */}

      <div className="pt-4 flex justify-end">
        <Button type="submit" size="lg" className="bg-blue-600 hover:bg-blue-700 min-w-[200px]">
          <Save className="w-5 h-5 mr-2" />
          Ürünü Kaydet
        </Button>
      </div>
    </form>
  );
}