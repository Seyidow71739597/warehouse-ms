import { db } from "@/lib/db";
import { format } from "date-fns";
import { MapPin, Phone, User, Calendar } from "lucide-react";
import Link from "next/link";
import { PrintButton } from "@/components/PrintButton"; // <--- YENİ BUTONUMUZ

export default async function TransactionPrintPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;

  // 1. İŞLEM DETAYLARINI ÇEK
  const transaction = await db.transaction.findUnique({
    where: { id },
    include: {
      product: true,
      partner: true,
      user: true, 
    },
  });

  if (!transaction) {
    return <div className="p-8 text-center text-red-500">Resminama tapylmady.</div>;
  }

  // 2. KİMDEN / KİME MANTIĞI
  const isIncoming = transaction.type === "IN"; 
  
  // ŞİRKET BİLGİLERİ
  const myCompany = {
    name: "WYZWOZ", 
    contact: transaction.user?.name || "Admin", 
    phone: "+993 6X XX XX XX",
    address: "Ashgabat, Türkmenistan",
    email: transaction.user?.email || "info@wyzwoz.com"
  };

  // PARTNER BİLGİLERİ
  const partnerInfo = transaction.partner ? {
    name: transaction.partner.name,
    contact: transaction.partner.contactPerson || "Bilinmiyor",
    phone: transaction.partner.phone || "Telefon Yok",
    address: transaction.partner.address || "Adres Yok",
    type: transaction.partner.type === "CUSTOMER" ? "Müşderi" : "Üpjünçi"
  } : {
    name: "Bilinmeýän Hyzmatdaş",
    contact: "-",
    phone: "-",
    address: "-",
    type: "-"
  };

  const sender = isIncoming ? partnerInfo : myCompany;
  const receiver = isIncoming ? myCompany : partnerInfo;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex flex-col items-center">
      
      {/* YAZDIR VE GERİ DÖN BUTONLARI (Yazıcıda Görünmez - print:hidden) */}
      <div className="w-full max-w-[800px] mb-6 flex justify-between items-center print:hidden">
        <Link href={`/${locale}/transactions`} className="text-slate-500 hover:text-slate-900 font-medium flex items-center gap-2">
          &larr; Yza Dön
        </Link>
        
        {/* ARTIK HATA VERMEZ, ÇÜNKÜ AYRI BİLEŞEN YAPTIK 👇 */}
        <PrintButton />
      </div>

      {/* --- FİŞİN KENDİSİ (A4 / A5 UYUMLU) --- */}
      <div className="bg-white w-full max-w-[800px] shadow-2xl print:shadow-none p-8 md:p-12 rounded-xl print:w-full print:max-w-none text-slate-900 border border-slate-200 print:border-none">
        
        {/* 1. BAŞLIK VE LOGO */}
        <div className="flex justify-between items-start border-b border-slate-200 pb-8 mb-8">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-blue-900">WYZWOZ</h1>
            <p className="text-slate-500 font-medium mt-1">WMS Stok Ulgamy</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-slate-900">RESMINAMA</h2>
            <p className="text-slate-500 font-mono text-sm mt-1">№ {transaction.id.slice(0, 8).toUpperCase()}</p>
            <div className="flex items-center justify-end gap-2 text-slate-500 mt-2 text-sm">
                <Calendar className="w-4 h-4" />
                {format(new Date(transaction.createdAt), "dd.MM.yyyy HH:mm")}
            </div>
          </div>
        </div>

        {/* 2. KİMDEN / KİME KUTULARI */}
        <div className="grid grid-cols-2 gap-12 mb-12">
            
            {/* GÖNDEREN (KİMDEN) */}
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Kimden (Tabşyran)</p>
                <h3 className="text-lg font-bold text-slate-900">{sender.name}</h3>
                
                <div className="mt-3 space-y-1 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-900">{sender.contact}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span>{sender.phone}</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                        <span>{sender.address}</span>
                    </div>
                </div>
            </div>

            {/* ALICI (KİME) */}
            <div className="text-right">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Kime (Kabul Eden)</p>
                <h3 className="text-lg font-bold text-slate-900">{receiver.name}</h3>
                
                <div className="mt-3 space-y-1 text-sm text-slate-600 flex flex-col items-end">
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900">{receiver.contact}</span>
                        <User className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="flex items-center gap-2">
                        <span>{receiver.phone}</span>
                        <Phone className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="flex items-start gap-2 justify-end">
                        <span>{receiver.address}</span>
                        <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                    </div>
                </div>
            </div>

        </div>

        {/* 3. İŞLEM TÜRÜ ROZETİ */}
        <div className="mb-6 flex justify-center">
             <span className={`px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wide border-2 ${
                 isIncoming 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                    : "bg-red-50 text-red-700 border-red-100"
             }`}>
                 {isIncoming ? "⬇️ Stok Giriş (Satyn Alyş)" : "⬆️ Stok Çykyş (Satyş)"}
             </span>
        </div>

        {/* 4. HARYT TABLOSU */}
        <div className="mb-12">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b-2 border-slate-100">
                        <th className="py-3 text-sm font-bold text-slate-500 uppercase">Haryt Ady</th>
                        <th className="py-3 text-sm font-bold text-slate-500 uppercase">Barkod</th>
                        <th className="py-3 text-sm font-bold text-slate-500 uppercase text-right">Mukdar</th>
                        <th className="py-3 text-sm font-bold text-slate-500 uppercase text-right">Birlik</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-b border-slate-100">
                        <td className="py-4 font-bold text-slate-900 text-lg">
                            {transaction.product.name}
                        </td>
                        <td className="py-4 font-mono text-slate-600">
                            {transaction.product.barcode || "-"}
                        </td>
                        <td className="py-4 font-bold text-slate-900 text-lg text-right">
                            {transaction.quantity}
                        </td>
                        <td className="py-4 text-slate-600 text-right">
                            {transaction.product.unit}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        {/* 5. AÇIKLAMA VE NOTLAR */}
        <div className="bg-slate-50 p-4 rounded-xl mb-12 border border-slate-100">
            <p className="text-sm text-slate-500 italic">
                Bu resminama haryt hereketini tassyklaýar. Harytlar ýokarda görkezilen mukdarda we hilde tabşyryldy/kabul edildi.
            </p>
        </div>

        {/* 6. İMZA ALANLARI */}
        <div className="grid grid-cols-2 gap-12 mt-20">
            <div className="text-center">
                <div className="h-20 border-b border-slate-300 mb-2"></div>
                <p className="font-bold text-slate-900">Tabşyran (Goly)</p>
                <p className="text-sm text-slate-500">{sender.name}</p>
            </div>
            <div className="text-center">
                <div className="h-20 border-b border-slate-300 mb-2"></div>
                <p className="font-bold text-slate-900">Kabul Eden (Goly)</p>
                <p className="text-sm text-slate-500">{receiver.name}</p>
            </div>
        </div>

        {/* 7. ALT BİLGİ */}
        <div className="mt-16 text-center text-xs text-slate-400 border-t border-slate-100 pt-6">
            <p>Bu resminama <strong>WYZWOZ WMS Stok Ulgamy</strong> tarapyndan {format(new Date(), "dd.MM.yyyy HH:mm")} senesinde döredildi.</p>
        </div>

      </div>
    </div>
  );
}