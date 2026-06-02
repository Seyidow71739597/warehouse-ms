"use client";

import { registerUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ImageUpload"; // <--- BİZİM SÜPER BİLEŞEN
import { UserPlus, ArrowRight, Building2, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    const result = await registerUser(formData);
    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl mb-4 rotate-3 hover:rotate-0 transition-transform">
          <UserPlus className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Täze Hasap Dörediň
        </h2>
        <p className="mt-2 text-slate-500">
          Ulgama goşulmak üçin maglumatlaryňyzy dolduryň.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-10 px-8 shadow-2xl shadow-slate-200/50 sm:rounded-3xl border border-slate-100">
          
          <form action={handleSubmit} className="space-y-6">
            
            {/* PASAPORT YÜKLEME ALANI (YENİ!) */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <ImageUpload name="image" label="Pasport Suraty (Hökman Däl)" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label>Doly Adyňyz</Label>
                  <Input name="name" required placeholder="Ady we Familiýasy" className="h-11" />
                </div>
                
                <div className="space-y-2">
                  <Label>Ýaşyňyz</Label>
                  <Input name="age" type="number" placeholder="25" className="h-11" />
                </div>
            </div>

            <div className="space-y-2">
              <Label>Wezipesi (Kär)</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <Input name="jobTitle" placeholder="Mysal: Manager" className="pl-10 h-11" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Telefon Belgisi</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <Input name="phone" placeholder="+993 6X XX XX XX" className="pl-10 h-11" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Email Salgysy</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <Input name="email" type="email" required placeholder="mail@mysal.com" className="pl-10 h-11" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Açar Sözi (Parol)</Label>
              <Input name="password" type="password" required className="h-11" />
            </div>

            {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl flex items-center gap-2">
                    ⚠️ {error}
                </div>
            )}

            <Button type="submit" size="lg" className="w-full text-lg font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 mt-4 h-12">
              Hasap Döret
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-500 mb-4">Eýýäm hasabyňyz barmy?</p>
            <Link href={`/tk/login`} className="block w-full">
              <Button variant="outline" className="w-full h-12 text-base font-bold rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50">
                Giriş Sahypasyna Dön
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}