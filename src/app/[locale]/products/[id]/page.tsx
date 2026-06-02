import { db } from "@/lib/db";
import { updateProduct } from "@/actions/product-update"; // Action dosyanın adı buysa kalsın
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
// import { toast } from "sonner"; // Server component'te toast çalışmaz, client side için useFormState gerekir ama şimdilik kapalı kalsın.
import { redirect } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;

  // 1. Düzenlenecek ürünü veritabanından çek
  const product = await db.product.findUnique({
    where: { id },
  });

  // Eğer ürün yoksa listeye geri at
  if (!product) {
    redirect(`/${locale}/products`);
  }

  // Server Action Tetikleyici
  async function action(formData: FormData) {
    "use server";
    const result = await updateProduct(id, formData);
    if (result?.error) {
      console.log("Hata:", result.error); 
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Harydy Düzelt</h1>
          <p className="text-slate-500">
            "{product.name}" maglumatlaryny üýtgetmek.
          </p>
        </div>
        <Link href={`/${locale}/products`}>
          <Button variant="outline" className="rounded-xl">
            <X className="w-4 h-4 mr-2" />
            Ýatyr (İptal)
          </Button>
        </Link>
      </div>

      <form action={action} className="space-y-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* İSİM */}
          <div className="space-y-2">
            <Label>Haryt Ady <span className="text-red-500">*</span></Label>
            {/* DÜZELTME: || "" eklendi */}
            <Input name="name" defaultValue={product.name || ""} required className="bg-slate-50" />
          </div>

          {/* BARKOD */}
          <div className="space-y-2">
            <Label>Barkod <span className="text-red-500">*</span></Label>
            {/* DÜZELTME: || "" eklendi */}
            <Input name="barcode" defaultValue={product.barcode || ""} required className="bg-slate-50 font-mono" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* BİRİM */}
          <div className="space-y-2">
            <Label>Ölçeg Birligi</Label>
            {/* DÜZELTME: || "PIECE" eklendi (Varsayılan değer) */}
            <Select name="unit" defaultValue={product.unit || "PIECE"}>
              <SelectTrigger className="bg-slate-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PIECE">Sany (Şt)</SelectItem>
                <SelectItem value="KG">Kilogram (kg)</SelectItem>
                <SelectItem value="METER">Metr (m)</SelectItem>
                <SelectItem value="BOX">Guty (Gap)</SelectItem>
                <SelectItem value="LITER">Litr (Lt)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* MİNİMUM STOK */}
          <div className="space-y-2">
            <Label>Kritik Stok Aralygy</Label>
            {/* DÜZELTME: || 0 eklendi */}
            <Input 
              name="minStockLevel" 
              type="number" 
              defaultValue={product.minStockLevel || 0} 
              className="bg-slate-50" 
            />
          </div>
        </div>

        {/* AÇIKLAMA */}
        <div className="space-y-2">
          <Label>Düşündiriş (Opsional)</Label>
          <Textarea 
            name="description" 
            defaultValue={product.description || ""} 
            className="bg-slate-50 resize-none h-32" 
          />
        </div>

        {/* BUTONLAR */}
        <div className="pt-4 flex justify-end gap-3">
          <Link href={`/${locale}/products`}>
            <Button variant="ghost" type="button">Ýatyr</Button>
          </Link>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white min-w-[150px]">
            <Save className="w-4 h-4 mr-2" />
            Ýatda Sakla
          </Button>
        </div>

      </form>
    </div>
  );
}