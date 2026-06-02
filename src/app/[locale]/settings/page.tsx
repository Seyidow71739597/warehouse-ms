import { db } from "@/lib/db";
import { approveUser, rejectUser } from "@/actions/admin";
import { updateProfile } from "@/actions/settings"; // Profil güncelleme action'ı
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// UI Bileşenleri
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TableActions } from "@/components/TableActions";
import { ImageUpload } from "@/components/ImageUpload";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Check, X, User, Briefcase, Phone, Mail, Clock, Save, Shield } from "lucide-react";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // 1. GİRİŞ YAPAN KULLANICIYI BUL (Profil Sekmesi İçin)
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;
  const payload = await decrypt(sessionToken);

  if (!payload?.userId) redirect("/tk/login");

  const currentUser = await db.user.findUnique({
    where: { id: payload.userId as string },
  });

  if (!currentUser) redirect("/tk/login");

  // 2. ADMİN İSE DİĞER KULLANICILARI GETİR (Admin Sekmesi İçin)
  const isAdmin = currentUser.role === "ADMIN";
  let pendingUsers: any[] = [];
  let activeUsers: any[] = [];

  if (isAdmin) {
    pendingUsers = await db.user.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
    });

    activeUsers = await db.user.findMany({
      where: { status: "APPROVED" },
      orderBy: { name: "asc" },
    });
  }

  // Profil Güncelleme Wrapper
  async function handleProfileUpdate(formData: FormData) {
    "use server";
    await updateProfile(currentUser!.id, formData);
  }

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto pb-20">
      
      {/* BAŞLIK */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900">Sazlamalar</h1>
        <p className="text-slate-500">
          Hoş geldiňiz, <span className="font-bold text-slate-700">{currentUser.name}</span>.
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2 mb-8">
          <TabsTrigger value="profile">Profilim</TabsTrigger>
          {isAdmin && <TabsTrigger value="admin">Admin Paneli</TabsTrigger>}
        </TabsList>

        {/* --- SEKME 1: PROFİLİM (Herkes Görür) --- */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profil Kartı */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center">
                <div className="w-32 h-32 mx-auto bg-slate-100 rounded-full border-4 border-white shadow-lg overflow-hidden mb-4 flex items-center justify-center">
                  {currentUser.image ? (
                    <img src={currentUser.image} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-slate-300" />
                  )}
                </div>
                <h2 className="text-xl font-bold text-slate-900">{currentUser.name}</h2>
                <Badge variant="secondary" className="mt-2">{currentUser.role}</Badge>
              </div>
            </div>

            {/* Profil Formu */}
            <div className="lg:col-span-2">
              <form action={handleProfileUpdate} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Maglumatlary Üýtget</h3>
                  
                  <ImageUpload name="image" label="Profil Suratyny Çalyş" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Doly Adyňyz</Label>
                      <Input name="name" defaultValue={currentUser.name} className="h-12 bg-slate-50" />
                    </div>
                    <div className="space-y-2">
                      <Label>Wezipesi</Label>
                      <Input name="jobTitle" defaultValue={currentUser.jobTitle || ""} placeholder="Meselem: Manager" className="h-12 bg-slate-50" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input name="email" defaultValue={currentUser.email} className="h-12 bg-slate-50" />
                    </div>
                    <div className="space-y-2">
                      <Label>Telefon</Label>
                      <Input name="phone" defaultValue={currentUser.phone || ""} placeholder="+993..." className="h-12 bg-slate-50" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" size="lg" className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-8">
                    <Save className="w-5 h-5 mr-2" /> Ýatda Sakla
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </TabsContent>


        {/* --- SEKME 2: ADMIN PANELİ (Sadece Admin Görür) --- */}
        {isAdmin && (
          <TabsContent value="admin" className="space-y-10">
            
            {/* ONAY BEKLEYENLER */}
            <section>
              <h2 className="text-xl font-bold text-amber-600 flex items-center gap-2 mb-4 border-b border-amber-100 pb-2">
                <Clock className="w-5 h-5" /> Tassyklama Garaşýanlar ({pendingUsers.length})
              </h2>

              {pendingUsers.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500">
                  Häzirki wagtda täze ýüz tutma ýok.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {pendingUsers.map((user) => (
                    <Card key={user.id} className="overflow-hidden border-amber-200 shadow-lg shadow-amber-100/50">
                      <div className="h-48 bg-slate-100 relative">
                        {user.passportImage ? (
                          <img src={user.passportImage} alt="Passport" className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-slate-400">Surat Ýok</div>
                        )}
                        <Badge className="absolute top-2 right-2 bg-amber-500">Garaşýar</Badge>
                      </div>

                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl">{user.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4" /> {user.jobTitle || "Wezipe ýok"}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="space-y-2 text-sm text-slate-600">
                        <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> {user.phone || "-"}</div>
                        <div className="flex items-center gap-2 truncate"><Mail className="w-4 h-4" /> {user.email}</div>
                      </CardContent>

                      <CardFooter className="flex gap-2 pt-2 bg-slate-50/50">
                        <form action={async () => { "use server"; await rejectUser(user.id); }} className="w-full">
                          <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                            <X className="w-4 h-4 mr-2" /> Red Et
                          </Button>
                        </form>
                        <form action={async () => { "use server"; await approveUser(user.id); }} className="w-full">
                          <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                            <Check className="w-4 h-4 mr-2" /> Tassykla
                          </Button>
                        </form>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            {/* AKTİF KULLANICILAR */}
            <section className="pt-8 border-t border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" /> Aktif Ulanyjylar ({activeUsers.length})
              </h2>
              
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                          <tr>
                              <th className="px-6 py-3">Ady</th>
                              <th className="px-6 py-3">Wezipesi</th>
                              <th className="px-6 py-3">Telefon</th>
                              <th className="px-6 py-3">Status</th>
                              <th className="px-6 py-3 text-right">Amallar</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                          {activeUsers.map((u) => (
                              <tr key={u.id} className="hover:bg-slate-50">
                                  <td className="px-6 py-3 font-medium text-slate-900">{u.name}</td>
                                  <td className="px-6 py-3 text-slate-600">{u.jobTitle}</td>
                                  <td className="px-6 py-3 text-slate-600">{u.phone}</td>
                                  <td className="px-6 py-3">
                                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Aktif</Badge>
                                  </td>
                                  <td className="px-6 py-3 text-right">
                                      <TableActions id={u.id} type="user" locale={locale} />
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
            </section>

          </TabsContent>
        )}

      </Tabs>
    </div>
  );
}