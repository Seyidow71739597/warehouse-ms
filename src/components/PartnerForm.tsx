"use client";

import { useState } from "react";
import { createPartner } from "@/actions/partner"; // Server Action'ı buraya çektik
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
import { Save, UserCheck, RefreshCw } from "lucide-react";
import { ImageUpload } from "@/components/ImageUpload";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Kullanıcı tipi (Veritabanından gelen veri yapısı)
type User = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  jobTitle: string | null;
};

export function PartnerForm({ existingUsers }: { existingUsers: User[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form Verileri (State ile kontrol ediyoruz ki değiştirebilelim)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    contactPerson: "",
    address: "",
    type: "CUSTOMER",
  });

  // KULLANICI SEÇİLİNCE ÇALIŞAN FONKSİYON
  const handleUserSelect = (userId: string) => {
    const user = existingUsers.find((u) => u.id === userId);
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name,          // Adı -> Firma Adı yerine geçer
        email: user.email,        // Email
        phone: user.phone || "",  // Telefon
        contactPerson: user.name, // Kontak Kişi de kendisi olur
      }));
      toast.success("Bilgiler otomatik dolduryldy! 🚀");
    }
  };

  // FORM GÖNDERME
  const handleSubmit = async (data: FormData) => {
    setLoading(true);
    // State'teki verileri FormData'ya eklemiyoruz, çünkü inputlar zaten "name" özelliğine sahip.
    // Ancak Select gibi bileşenler bazen sorun çıkarabilir, o yüzden Server Action standart çalışır.
    await createPartner(data);
    setLoading(false);
    // Yönlendirme Server Action içinde yapılabilir ama burada da toast gösterebiliriz.
  };

  return (
    <div className="space-y-8">
      
      {/* --- SİHİRLİ KUTU: OTOMATİK DOLDURMA --- */}
      {existingUsers.length > 0 && (
        <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-2xl">
          <div className="flex items-center gap-2 mb-4 text-blue-800 font-bold">
            <UserCheck className="w-5 h-5" />
            <h3>Sistemden Ýatdaky Kişini Saýla (Opsional)</h3>
          </div>
          <div className="flex gap-4">
            <Select onValueChange={handleUserSelect}>
              <SelectTrigger className="bg-white h-12 border-blue-200">
                <SelectValue placeholder="Makullanan ulanyjyny saýlaň...." />
              </SelectTrigger>
              <SelectContent>
                {existingUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} ({user.jobTitle || "Ulanyjy"})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={() => setFormData({ name: "", email: "", phone: "", contactPerson: "", address: "", type: "CUSTOMER" })}
              title="Temizle"
              className="h-12 w-12 p-0 rounded-xl border-blue-200 text-blue-600 hover:bg-blue-100"
            >
              <RefreshCw className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-blue-600/70 mt-2">
            * Aşakdaky meýdanlar saýlanyňyzda awtomatiki usulda ýerleşer. Isleseňiz olary üýtgedip bilersiňiz..
          </p>
        </div>
      )}

      {/* --- FORM BAŞLANGICI --- */}
      <form action={handleSubmit} className="space-y-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        
        <ImageUpload name="image" label="Firma Logosy / Profil Suraty" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Firma / Şahsy Ady <span className="text-red-500">*</span></Label>
            <Input 
              name="name" 
              placeholder="Msl üçn: 'Täze Aý' Market" 
              required 
              className="h-12 bg-slate-50"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label>Jogapkär Kişi</Label>
            <Input 
              name="contactPerson" 
              placeholder="Meselem: Myrat Aga" 
              className="h-12 bg-slate-50"
              value={formData.contactPerson}
              onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label>Görnüşi</Label>
            <Select name="type" defaultValue="CUSTOMER">
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
              placeholder="+993..." 
              className="h-12 bg-slate-50"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Email</Label>
          <Input 
            name="email" 
            type="email" 
            placeholder="mail@example.com" 
            className="h-12 bg-slate-50"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <Label>Adres</Label>
          <Textarea 
            name="address" 
            placeholder="Doly salgysy..." 
            className="bg-slate-50 min-h-[100px] resize-none"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
          />
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
          <Button 
            type="submit" 
            size="lg" 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 shadow-lg shadow-blue-200"
          >
            <Save className="w-5 h-5 mr-2" />
            {loading ? "Ýüklenýär..." : "Ýatda Sakla"}
          </Button>
        </div>

      </form>
    </div>
  );
}