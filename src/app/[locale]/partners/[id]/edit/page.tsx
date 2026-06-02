import { db } from "@/lib/db";
import { updatePartner } from "@/actions/partner";
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
import { notFound } from "next/navigation";

export default async function EditPartnerPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;

  // 1. MEVCUT VERİYİ ÇEK
  const partner = await db.partner.findUnique({
    where: { id },
  });

  if (!partner) {
    notFound();
  }

  // --- SORUN ÇÖZÜCÜ ARA FONKSİYON ---
  // .bind yerine bu yöntemi kullanıyoruz, TypeScript hata vermiyor.
  async function handleUpdate(formData: FormData) {
    "use server";
    await updatePartner(id, formData);
  }

  return (
    <div className="max-w-3xl mx-auto p-8 pb-20">
      
      {/* BAŞLIK */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Hyzmatdaşy Düzet</h1>
          <p className="text-slate-500 mt-1">
            "{partner.name}" maglumatlaryny üýtgetmek.
          </p>
        </div>
        <Link href={`/${locale}/partners`}>
          <Button variant="outline" className="rounded-xl border-slate-200 hover:bg-slate-100 text-slate-600">
            <X className="w-4 h-4 mr-2" />
            Ýatyr
          </Button>
        </Link>
      </div>

      <form action={handleUpdate} className="space-y-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        
        {/* RESİM GÖSTERME VE GÜNCELLEME */}
        <div className="flex items-start gap-6 pb-6 border-b border-slate-100">
            {/* Mevcut Resim (Varsa) */}
            {partner.image && (
                <div className="flex flex-col items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">Häzirki Surat</span>
                    <img 
                        src={partner.image} 
                        alt="Current" 
                        className="w-24 h-24 rounded-full object-cover border-2 border-slate-200" 
                    />
                </div>
            )}
            
            {/* Yeni Resim Yükleme Alanı */}
            <div className="flex-1">
                <ImageUpload name="image" label="Suraty Çalyş" />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Firma / Şahsy Ady <span className="text-red-500">*</span></Label>
            <Input 
                name="name" 
                defaultValue={partner.name} 
                required 
                className="h-12 bg-slate-50" 
            />
          </div>

          <div className="space-y-2">
            <Label>Jogapkär Kişi</Label>
            <Input 
                name="contactPerson" 
                defaultValue={partner.contactPerson || ""} 
                className="h-12 bg-slate-50" 
            />
          </div>

          <div className="space-y-2">
            <Label>Görnüşi</Label>
            <Select name="type" defaultValue={partner.type}>
              <SelectTrigger className="h-12 bg-slate-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CUSTOMER">Müşderi (Alyjy)</SelectItem>
                <SelectItem value="SUPPLIER">Üpjünçi (Satyjy)</SelectItem>
                <SelectItem value="EMPLOYEE">İşgär</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Telefon</Label>
            <Input 
                name="phone" 
                defaultValue={partner.phone || ""} 
                className="h-12 bg-slate-50" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Email</Label>
          <Input 
            name="email" 
            type="email" 
            defaultValue={partner.email || ""} 
            className="h-12 bg-slate-50" 
          />
        </div>

        <div className="space-y-2">
          <Label>Adres</Label>
          <Textarea 
            name="address" 
            defaultValue={partner.address || ""} 
            className="bg-slate-50 min-h-[100px] resize-none" 
          />
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
          <Link href={`/${locale}/partners`}>
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