import { db } from "@/lib/db";
import { ReportsFilter } from "@/components/ReportsFilter";
import { 
  BarChart3, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Package,
  User as UserIcon 
} from "lucide-react";
import { format } from "date-fns";

export default async function ReportsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ 
    startDate?: string; 
    endDate?: string; 
    type?: string; 
    userId?: string;
    partnerId?: string; // <--- YENİ EKLENDİ
  }>;
}) {
  const { locale } = await params;
  const { startDate, endDate, type, userId, partnerId } = await searchParams; // <--- YENİ EKLENDİ

  // 1. KULLANICI LİSTESİNİ ÇEK
  const users = await db.user.findMany({
    where: { status: "APPROVED" },
    orderBy: { name: "asc" },
    select: { id: true, name: true }
  });

  // 2. PARTNER LİSTESİNİ ÇEK (YENİ EKLENDİ)
  const partners = await db.partner.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, type: true } // Type: Müşteri mi Tedarikçi mi?
  });

  // 3. WHERE SORGUSU
  const whereClause: any = {};

  if (startDate) {
    whereClause.createdAt = { gte: new Date(startDate) };
  }
  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    whereClause.createdAt = { ...(whereClause.createdAt || {}), lte: end };
  }
  if (type && type !== "ALL") {
    whereClause.type = type;
  }
  
  // İşlemi Yapan (Admin/Personel) Filtresi
  if (userId && userId !== "ALL") {
    whereClause.userId = userId;
  }

  // --- YENİ EKLENEN FİLTRE: PARTNER ---
  if (partnerId && partnerId !== "ALL") {
    whereClause.partnerId = partnerId;
  }

  // 4. VERİLERİ ÇEK
  const transactions = await db.transaction.findMany({
    where: whereClause,
    include: {
      product: true,
      partner: true,
      user: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // 5. İSTATİSTİKLERİ HESAPLA
  let countIn = 0;      
  let countOut = 0;     
  let totalInQty = 0;   
  let totalOutQty = 0;  

  transactions.forEach((t: any) => {
    if (t.type === "IN") {
        countIn++;              
        totalInQty += t.quantity; 
    }
    if (t.type === "OUT") {
        countOut++;             
        totalOutQty += t.quantity; 
    }
  });

  const netChange = totalInQty - totalOutQty; 

  return (
    <div className="p-4 md:p-8 pb-20 max-w-[1600px] mx-auto space-y-6 md:space-y-8">
      
      {/* BAŞLIK */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
          <BarChart3 className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
          Hasabatlar we Analiz
        </h1>
        <p className="text-slate-500 text-sm md:text-lg">
          Taryh aralygyna, jogapkär şahsa we hyzmatdaşa görä seljeriň.
        </p>
      </div>

      {/* FİLTRELEME BİLEŞENİ (Partners prop'u eklendi) */}
      <ReportsFilter users={users} partners={partners} />

      {/* ÖZET KARTLAR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        
        {/* GİRİŞ KARTI */}
        <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm flex flex-col justify-between relative overflow-hidden group min-h-[160px]">
          <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          
          <div className="flex items-center gap-4 z-10">
            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
              <ArrowDownCircle className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Giriş Işleri</p>
              <h3 className="text-3xl font-black text-emerald-900 mt-1">{countIn} <span className="text-lg font-medium text-slate-400">Sany</span></h3>
            </div>
          </div>

          <div className="mt-4 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100">
                <span className="text-xs font-bold text-emerald-700 uppercase">Jemi Haryt:</span>
                <span className="text-sm font-black text-emerald-900">+{totalInQty}</span>
            </div>
          </div>
        </div>

        {/* ÇIKIŞ KARTI */}
        <div className="bg-white p-6 rounded-3xl border border-red-100 shadow-sm flex flex-col justify-between relative overflow-hidden group min-h-[160px]">
          <div className="absolute right-0 top-0 w-24 h-24 bg-red-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          
          <div className="flex items-center gap-4 z-10">
            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 shadow-sm">
              <ArrowUpCircle className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Çykyş Işleri</p>
              <h3 className="text-3xl font-black text-red-900 mt-1">{countOut} <span className="text-lg font-medium text-slate-400">Sany</span></h3>
            </div>
          </div>

          <div className="mt-4 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 border border-red-100">
                <span className="text-xs font-bold text-red-700 uppercase">Jemi Haryt:</span>
                <span className="text-sm font-black text-red-900">-{totalOutQty}</span>
            </div>
          </div>
        </div>

        {/* NET STOK DEĞİŞİMİ */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden min-h-[160px]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600">
                <Package className="w-7 h-7" />
            </div>
            <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Net Stok Üýtgeşme</p>
                <h3 className={`text-3xl font-black mt-1 ${netChange >= 0 ? "text-slate-900" : "text-amber-600"}`}>
                {netChange > 0 ? "+" : ""}{netChange}
                </h3>
            </div>
          </div>
          
          <div className="mt-4">
             <p className="text-xs text-slate-400">Giriş we Çykyş arasyndaky mukdar tapawudy.</p>
          </div>
        </div>

      </div>

      {/* DETAYLI TABLO */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                 <th className="px-6 py-4">Sene</th>
                 <th className="px-6 py-4">Haryt</th>
                 <th className="px-6 py-4">Görnüş</th>
                 <th className="px-6 py-4">Tabşyrylan Kişi</th>
                 <th className="px-6 py-4">Amaly Ýerine Ýetiren</th>
                 <th className="px-6 py-4 text-right">Mukdar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((t: any) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3 text-slate-600 font-mono">
                    {format(new Date(t.createdAt), "dd.MM.yyyy HH:mm")}
                  </td>
                  <td className="px-6 py-3 font-medium text-slate-900">
                    {t.product.name}
                  </td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      t.type === "IN" 
                        ? "bg-emerald-100 text-emerald-700" 
                        : "bg-red-100 text-red-700"
                    }`}>
                      {t.type === "IN" ? "⬇️ Giriş" : "⬆️ Çykyş"}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-slate-600">
                    {t.partner ? t.partner.name : "-"}
                  </td>
                  <td className="px-6 py-3 text-slate-700">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                          <UserIcon className="w-3 h-3 text-slate-400" />
                      </div>
                      <span className="font-medium">{t.user?.name || "Bilinmeýän"}</span>
                    </div>
                  </td>
                  <td className={`px-6 py-3 text-right font-bold text-lg ${
                    t.type === "IN" ? "text-emerald-600" : "text-red-600"
                  }`}>
                    {t.type === "IN" ? "+" : "-"}{t.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}