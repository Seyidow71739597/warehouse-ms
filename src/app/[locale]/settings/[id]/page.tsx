import { db } from "@/lib/db";
import { updateUser } from "@/actions/admin";
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
import { Save, X, UserCog, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;

  // KULLANICIYI BUL
  const user = await db.user.findUnique({
    where: { id },
  });

  if (!user) {
    return <div>Ulanyjy tapylmady.</div>;
  }

  // GÜNCELLEME İŞLEMİ
  async function handleUpdate(formData: FormData) {
    "use server";
    await updateUser(id, formData);
    redirect(`/${locale}/settings`);
  }

  return (
    <div className="max-w-2xl mx-auto p-8 pb-20">
      
      {/* BAŞLIK */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <UserCog className="w-8 h-8 text-blue-600" />
            Ulanyjyny Düzelt
          </h1>
          <p className="text-slate-500 mt-1">
            {user.name} atly ulanyjynyň maglumatlaryny üýtgediň.
          </p>
        </div>
        <Link href={`/${locale}/settings`}>
          <Button variant="outline" className="rounded-xl border-slate-200 hover:bg-slate-100 text-slate-600">
            <X className="w-4 h-4 mr-2" />
            Ýatyr
          </Button>
        </Link>
      </div>

      <form action={handleUpdate} className="space-y-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        
        {/* PASAPORT RESMİ GÖSTERİMİ (Değiştirilemez, sadece bilgi) */}
        <div className="flex justify-center mb-6">
            <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-slate-100 shadow-lg">
                {user.passportImage ? (
                    <img src={user.passportImage} alt="Passport" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 font-bold">Resim Yok</div>
                )}
            </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Doly Ady</Label>
            <Input name="name" defaultValue={user.name} required className="h-12 bg-slate-50" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <Label>Telefon</Label>
                <Input name="phone" defaultValue={user.phone || ""} className="h-12 bg-slate-50" />
             </div>
             <div className="space-y-2">
                <Label>Wezipesi (Kär)</Label>
                <Input name="jobTitle" defaultValue={user.jobTitle || ""} className="h-12 bg-slate-50" />
             </div>
          </div>

          <div className="space-y-2">
            <Label>Email (Üýtgedip bolmaýar)</Label>
            <Input disabled defaultValue={user.email} className="h-12 bg-slate-100 text-slate-500 cursor-not-allowed" />
          </div>

          {/* YETKİ SEÇİMİ (ROL) */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 mt-4 space-y-3">
            <div className="flex items-center gap-2 text-amber-800 font-bold">
                <ShieldAlert className="w-5 h-5" />
                Ulgam Yetkisi (Role)
            </div>
            <Select name="role" defaultValue={user.role}>
              <SelectTrigger className="h-12 bg-white border-amber-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">Ulanyjy (Standart)</SelectItem>
                <SelectItem value="ADMIN" className="text-red-600 font-bold">Admin (Dolyygtyýarly)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-amber-700">
                Üns beriň: Admin yetkisi berlen kişi ulgamdaky ähli zady (Pozmak, Tassyklamak) edip biler.
            </p>
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
          <Link href={`/${locale}/settings`}>
            <Button variant="ghost" type="button">Ýatyr</Button>
          </Link>
          <Button type="submit" size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 shadow-lg shadow-blue-200">
            <Save className="w-5 h-5 mr-2" />
            Ýatda Sakla
          </Button>
        </div>

      </form>
    </div>
  );
}