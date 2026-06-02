import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Link from "next/link";
import { TransactionForm } from "@/components/TransactionForm"; 
import { verifySession } from "@/lib/session"; // <--- BU EKLENDİ

export default async function NewTransactionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // 1. OTURUM AÇAN KİŞİYİ BUL (YENİ KISIM)
  const session = await verifySession();
  const currentUser = await db.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true } // Sadece gerekenleri al
  });

  // Eğer kullanıcı bulunamazsa (İmkansız ama tedbir)
  if (!currentUser) return null;

  // 2. DİĞER VERİLERİ ÇEK
  const products = await db.product.findMany({
    orderBy: { name: "asc" },
  });

  const partners = await db.partner.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 pb-40">
      
      {/* BAŞLIK */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Täze Hereket</h1>
          <p className="text-slate-500 mt-2 text-sm md:text-lg">
            Stok giriş ýa-da çykyş (Giriş/Çykyş)
          </p>
        </div>
        <Link href={`/${locale}/transactions`}>
          <Button variant="outline" className="h-12 px-6 rounded-2xl border-slate-200 hover:bg-slate-100 text-slate-600 font-medium">
            <X className="w-5 h-5 mr-2" /> Ýatyr
          </Button>
        </Link>
      </div>

      {/* FORM BİLEŞENİ (currentUser verisini gönderiyoruz!) */}
      <TransactionForm 
          products={products} 
          partners={partners} 
          currentUser={currentUser} // <--- BURASI EKLENDİ
      />
      
    </div>
  );
}