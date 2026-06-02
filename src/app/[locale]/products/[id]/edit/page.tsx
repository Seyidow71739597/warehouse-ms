import { db } from "@/lib/db";
import { updateProduct } from "@/actions/product";
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
import { Save, X } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
// 🚀 DÜZELTME 1: ImageUpload bileşenini içeri aktarıyoruz
import { ImageUpload } from "@/components/ImageUpload";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;

  // 1. MEVCUT ÜRÜNÜ ÇEK
  const product = await db.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  async function handleUpdate(formData: FormData) {
    "use server";
    await updateProduct(id, formData);
  }

  return (
    <div className="max-w-3xl mx-auto p-8 pb-20">
      
      {/* BAŞLIK */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Harydy Düzet</h1>
          <p className="text-slate-500 mt-1">
            "{product.name}" maglumatlaryny üýtgetmek.
          </p>
        </div>
        <Link href={`/${locale}/products`}>
          <Button variant="outline" className="rounded-xl border-slate-200 hover:bg-slate-100 text-slate-600">
            <X className="w-4 h-4 mr-2" />
            Ýatyr
          </Button>
        </Link>
      </div>

      <form action={handleUpdate} className="space-y-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        
        {/* 🚀 DÜZELTME 2: RESİM ALANI TAMAMEN DEĞİŞTİ */}
        <div className="flex items-start gap-6 pb-6 border-b border-slate-100">
            {/* Mevcut Resim (Varsa) API üzerinden çekiliyor */}
            {product.image && (
                <div className="flex flex-col items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">Häzirki</span>
                    <img 
                        src={product.image.replace('/uploads/', '/api/images/')} 
                        alt="Current" 
                        className="w-24 h-24 rounded-lg object-cover border-2 border-slate-200" 
                    />
                </div>
            )}
            
            {/* Yeni Resim Yükleme Alanı (ImageUpload Bileşeni) */}
            <div className="flex-1">
                <ImageUpload name="image" label="Suraty Çalyş (Opsional)" />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Haryt Ady <span className="text-red-500">*</span></Label>
            <Input name="name" defaultValue={product.name || ""} required className="h-12 bg-slate-50" />
          </div>

          <div className="space-y-2">
            <Label>Barkod <span className="text-red-500">*</span></Label>
            <Input name="barcode" defaultValue={product.barcode || ""} required className="h-12 bg-slate-50 font-mono" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label>Başlangyç Stok</Label>
            <Input name="stockQuantity" type="number" defaultValue={product.stockQuantity || 0} className="h-12 bg-slate-50" />
            <p className="text-[10px] text-amber-600">* Stok üýtgedilse Hereketler taryhy bilen gabat gelmezligi mümkin.</p>
          </div>

          <div className="space-y-2">
            <Label>Kritik Stok (Duýduryş)</Label>
            <Input name="minStockLevel" type="number" defaultValue={product.minStockLevel || 0} className="h-12 bg-slate-50" />
          </div>

          <div className="space-y-2">
            <Label>Ölçeg Birligi</Label>
            <Select name="unit" defaultValue={product.unit || "PIECE"}>
              <SelectTrigger className="h-12 bg-slate-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PIECE">Sany (Adet)</SelectItem>
                <SelectItem value="KG">Kilogram (kg)</SelectItem>
                <SelectItem value="METER">Metr (m)</SelectItem>
                <SelectItem value="BOX">Gutu (Kutu)</SelectItem>
                <SelectItem value="LITER">Litr (Lt)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Düşündiriş</Label>
          <Textarea 
            name="description" 
            defaultValue={product.description || ""} 
            className="min-h-[120px] bg-slate-50 resize-none" 
          />
        </div>

        <div className="pt-4 flex justify-end gap-4 border-t border-slate-100">
          <Link href={`/${locale}/products`}>
            <Button variant="ghost" type="button">Ýatyr</Button>
          </Link>
          <Button type="submit" size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 shadow-lg shadow-blue-200">
            <Save className="w-5 h-5 mr-2" />
            Üýtgetmeleri Sakla
          </Button>
        </div>

      </form>
    </div>
  );
}