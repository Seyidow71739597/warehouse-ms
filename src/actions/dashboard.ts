"use server";

import { db } from "@/lib/db";

// 1. KARTLAR İÇİN VERİLER (Burası Aynen Kaldı)
export async function getDashboardStats() {
  
  // A. TOPLAM ÜRÜN ÇEŞİDİ
  const totalProducts = await db.product.count();

  // B. TOPLAM STOK ADEDİ (Mevcut tüm stokların toplamı)
  const stockResult = await db.product.aggregate({
    _sum: {
      stockQuantity: true
    }
  });
  const totalStockItems = stockResult._sum.stockQuantity || 0;

  // C. KRİTİK STOK (Azalanlar)
  const lowStockCount = await db.product.count({
    where: {
      stockQuantity: {
        lte: 10 
      }
    }
  });

  // D. TOPLAM PARTNER SAYISI
  const totalPartners = await db.partner.count();

  // E. SON 5 İŞLEM (Tablo İçin)
  const recentTransactions = await db.transaction.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      product: { select: { name: true, image: true } },
      partner: { select: { name: true } }
    }
  });

  return {
    totalProducts,
    totalStockItems,
    lowStockCount,
    totalPartners,
    recentTransactions
  };
}

// 2. GRAFİK VERİSİ (GÜNCELLENDİ 🚀)
// Artık 'unit' parametresi alıyor
export async function getChartData(
  range: "7d" | "1m" | "6m" | "1y", 
  unit: string = "ALL" // Varsayılan: Hepsi
) {
  const now = new Date();
  let startDate = new Date();

  // Tarih Aralığı Ayarı
  if (range === "7d") startDate.setDate(now.getDate() - 7);
  if (range === "1m") startDate.setMonth(now.getMonth() - 1);
  if (range === "6m") startDate.setMonth(now.getMonth() - 6);
  if (range === "1y") startDate.setFullYear(now.getFullYear() - 1);

  // WHERE Sorgusunu Hazırla
  const whereClause: any = {
    createdAt: { gte: startDate },
  };

  // Eğer belirli bir birim seçildiyse (KG, Metre vs.), sadece o ürünleri getir
  if (unit !== "ALL") {
    whereClause.product = {
      unit: unit // PIECE, KG, METER, LITER, BOX
    };
  }

  // Veritabanından Çek
  const transactions = await db.transaction.findMany({
    where: whereClause,
    orderBy: { createdAt: "asc" },
    include: {
        product: true // Birim kontrolü için
    }
  });

  // Veriyi Grupla
  const isMonthly = range === "6m" || range === "1y";
  const groupedData: Record<string, { name: string; Giris: number; Cikis: number }> = {};

  transactions.forEach((tx) => {
    const date = new Date(tx.createdAt);
    let key = "";
    
    // Tarih Formatı (Ay mı Gün mü?)
    if (isMonthly) {
      key = date.toLocaleDateString("tk-TM", { month: "long" }); 
    } else {
      key = date.toLocaleDateString("tk-TM", { day: "2-digit", month: "2-digit" });
    }

    // Anahtarı Oluştur
    if (!groupedData[key]) {
      groupedData[key] = { name: key, Giris: 0, Cikis: 0 };
    }

    // MANTIK:
    // "ALL" seçiliyse -> İşlem Sayısını say (1, 1, 1...) çünkü Metre ile Litre toplanmaz.
    // "Birim" seçiliyse -> Miktarı topla (10kg + 5kg = 15kg).
    const amountToAdd = unit === "ALL" ? 1 : tx.quantity;

    if (tx.type === "IN") {
      groupedData[key].Giris += amountToAdd;
    } else {
      groupedData[key].Cikis += amountToAdd;
    }
  });

  return Object.values(groupedData);
}