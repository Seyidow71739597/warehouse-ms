import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Link from "next/link";
import { PartnerForm } from "@/components/PartnerForm"; // Yeni Formu Çağır

export default async function NewPartnerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // 1. SADECE ONAYLANMIŞ KULLANICILARI ÇEK
  const approvedUsers = await db.user.findMany({
    where: { status: "APPROVED" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      jobTitle: true,
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-3xl mx-auto p-8 pb-20">
      
      {/* BAŞLIK */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Täze Hyzmatdaş</h1>
          <p className="text-slate-500 mt-1">
            Täze müşderi, üpjünçi ýa-da işgär goşuň.
          </p>
        </div>
        <Link href={`/${locale}/partners`}>
          <Button variant="outline" className="rounded-xl border-slate-200 hover:bg-slate-100 text-slate-600">
            <X className="w-4 h-4 mr-2" />
            Ýatyr
          </Button>
        </Link>
      </div>

      {/* FORM BİLEŞENİNE KULLANICILARI GÖNDER */}
      <PartnerForm existingUsers={approvedUsers} />
      
    </div>
  );
}