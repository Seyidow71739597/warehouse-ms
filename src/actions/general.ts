"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// 1. ÜRÜN SİLME
export async function deleteProduct(id: string) {
  try {
    await db.product.delete({ where: { id } });
    revalidatePath("/tk/products"); // Listeyi yenile
    return { success: true };
  } catch (error) {
    return { error: "Haryt silinip bilinmedi. (Belki hereketleri bardyr?)" };
  }
}

// 2. KİŞİ SİLME
export async function deletePartner(id: string) {
  try {
    // Önce bu kişinin işlemi var mı kontrol et
    const transactionCount = await db.transaction.count({
      where: { partnerId: id }
    });

    if (transactionCount > 0) {
      return { error: `Bu kişiniň ${transactionCount} sany hereketi bar. Ilki hereketleri pozmaly!` };
    }

    await db.partner.delete({ where: { id } });
    revalidatePath("/tk/partners");
    return { success: true };
  } catch (error) {
    return { error: "Kişi silinip bilinmedi. (Sistem hatası)" };
  }
}

// 3. HAREKET SİLME (Ekstra)
export async function deleteTransaction(id: string) {
  try {
    // Önce işlemi bul
    const transaction = await db.transaction.findUnique({ where: { id } });
    if (!transaction) return { error: "İşlem bulunamadı." };

    // Stoğu tersine çevir (Giriş silinirse stok düşmeli, Çıkış silinirse artmalı)
    if (transaction.type === "IN") {
      await db.product.update({
        where: { id: transaction.productId },
        data: { stockQuantity: { decrement: transaction.quantity } },
      });
    } else {
      await db.product.update({
        where: { id: transaction.productId },
        data: { stockQuantity: { increment: transaction.quantity } },
      });
    }

    // Sonra kaydı sil
    await db.transaction.delete({ where: { id } });
    
    revalidatePath("/tk/transactions");
    revalidatePath("/tk/products");
    return { success: true };
  } catch (error) {
    return { error: "Hereket silinip bilinmedi." };
  }
}