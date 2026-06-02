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
import { Save, X } from "lucide-react";
import Link from "next/link";
import { ImageUpload } from "@/components/ImageUpload";

export default async function NewProductPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Server Action Bağlantısı
  async function handleCreate(formData: FormData) {
    "use server";
    await createProduct(formData);
  }

  return (
    <div className="max-w-2xl mx-auto p-8 pb-20">
      
      {/* BAŞLIK (ESKİSİ GİBİ) */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Täze Haryt Goş</h1>
          <p className="text-slate-500 mt-1">
            Ambar üçin täze stok kartyny giriziň.
          </p>
        </div>
        <Link href={`/${locale}/products`}>
          <Button variant="outline" className="rounded-xl border-slate-200 hover:bg-slate-100 text-slate-600">
            <X className="w-4 h-4 mr-2" />
            Ýatyr
          </Button>
        </Link>
      </div>

      {/* FORM KARTI (TEK SÜTUN - SADELİK) */}
      <form action={handleCreate} className="space-y-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        
        {/* RESİM YÜKLEME (En üstte dursun ama sade) */}
        <div className="space-y-2">
            <Label>Haryt Suraty</Label>
            <ImageUpload name="image" label="Surat Ýükle" />
        </div>

        {/* HARYT ADI */}
        <div className="space-y-2">
          <Label>Haryt Ady <span className="text-red-500">*</span></Label>
          <Input 
            name="name" 
            required 
            className="h-12 bg-slate-50 border-slate-200"
            // Placeholder kaldırdık
          />
        </div>

        {/* BARKOD (ARTIK ZORUNLU DEĞİL) */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Barkod</Label>
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Opsional</span>
          </div>
          <Input 
            name="barcode" 
            className="h-12 bg-slate-50 border-slate-200 font-mono"
            // Placeholder kaldırdık
          />
          <p className="text-xs text-slate-400">Boş goýulsa, barkodsyz dowam ediler.</p>
        </div>

        {/* MİKTAR ve BİRİM (YAN YANA) */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Başlangyç Stok</Label>
            <Input name="stockQuantity" type="number" defaultValue="0" min="0" className="h-12 bg-slate-50 border-slate-200" />
          </div>

          <div className="space-y-2">
            <Label>Ölçeg Birligi</Label>
            <Select name="unit" defaultValue="PIECE">
              <SelectTrigger className="h-12 bg-slate-50 border-slate-200">
                <SelectValue placeholder="Birlik Saýla" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PIECE">Sany (Şt)</SelectItem>
                <SelectItem value="KG">Kilogram (kg)</SelectItem>
                <SelectItem value="METER">Metr (m)</SelectItem>
                <SelectItem value="BOX">Guty (Gap)</SelectItem>
                <SelectItem value="LITER">Litr (Lt)</SelectItem>
                <SelectItem value="SET">Komplekt (Set)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* KRİTİK STOK SEVİYESİ */}
        <div className="space-y-2">
          <Label>Kritik Stok (Duýduryş)</Label>
          <Input name="minStockLevel" type="number" defaultValue="5" min="0" className="h-12 bg-slate-50 border-slate-200" />
          <p className="text-xs text-slate-400">Stok bu sanyň aşagyna düşende duýduryş beriler.</p>
        </div>

        {/* AÇIKLAMA */}
        <div className="space-y-2">
          <Label>Düşündiriş (Bellik)</Label>
          <Textarea 
            name="description" 
            className="min-h-[100px] bg-slate-50 border-slate-200 resize-none" 
          />
        </div>

        {/* BUTONLAR */}
        <div className="pt-4 flex justify-end border-t border-slate-100">
          <Button type="submit" size="lg" className="w-full md:w-auto h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 font-bold">
            <Save className="w-5 h-5 mr-2" />
            Harydy Döret
          </Button>
        </div>

      </form>
    </div>
  );
}