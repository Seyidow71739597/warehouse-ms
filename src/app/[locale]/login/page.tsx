"use client"; // Client Component

import { loginUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Warehouse, Clock, ArrowRight, AlertCircle, PackageCheck } from "lucide-react"; // YENİ İKONLAR
import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = "tk"; 
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    formData.append("locale", locale);
    const result = await loginUser(formData);
    
    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      {/* LOGO VE BAŞLIK ALANI */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* YENİ LOGO: MAVİ AMBAR KUTUSU */}
        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-900/20 mb-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
          <Warehouse className="w-12 h-12 text-white" />
        </div>
        
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">
          Ambar Ulgamy
        </h2>
        <p className="mt-3 text-lg text-slate-500 font-medium">
          Stok dolandyryşy üçin giriş ediň.
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-8 shadow-2xl shadow-slate-200/60 sm:rounded-3xl border border-slate-100 relative overflow-hidden">
          
          {/* ARKA PLAN SÜSÜ */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-10 -mt-10 opacity-50 pointer-events-none"></div>

          {/* YENİ KAYIT UYARISI */}
          {registered === "true" && (
            <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-4">
              <Clock className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-amber-800">Hasabyňyz Garaşylýar</h3>
                <p className="text-xs text-amber-700 mt-1">
                  Admin tassyklansoň girip bilersiňiz.
                </p>
              </div>
            </div>
          )}

          {/* HATA MESAJI */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 animate-in shake">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}

          <form action={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold ml-1">Email Adresiňiz</Label>
              <Input 
                name="email" 
                type="email" 
                placeholder="mail@mysal.com" 
                required 
                className="h-14 bg-slate-50 border-slate-200 focus:border-blue-500 text-lg rounded-xl px-4 transition-all" 
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <Label className="text-slate-700 font-bold">Açar sözi (Parol)</Label>
                <a href="#" className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">Paroly unutdyňyzmy?</a>
              </div>
              <Input 
                name="password" 
                type="password" 
                placeholder="••••••••" 
                required 
                className="h-14 bg-slate-50 border-slate-200 focus:border-blue-500 text-lg rounded-xl px-4 transition-all" 
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 text-lg font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 mt-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Ulgama Gir
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 text-center relative z-10">
            <p className="text-slate-500 mb-4 font-medium text-sm">Heniz hasabyňyz ýokmy?</p>
            <Link href={`/tk/register`} className="block w-full">
              <Button variant="outline" className="w-full h-14 text-lg font-bold rounded-xl border-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition-all">
                <PackageCheck className="w-5 h-5 mr-2" />
                Täze Hasap Döret
              </Button>
            </Link>
          </div>

        </div>
      </div>
      
      {/* ALT BİLGİ */}
      <div className="mt-8 text-center">
        <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">
           © 2024 SportÝyldyzy Ambar Ulgamy
        </p>
      </div>

    </div>
  );
}