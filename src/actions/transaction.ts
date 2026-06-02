"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { decrypt } from "@/lib/session"; // <--- BUNU EKLE
import { cookies } from "next/headers";

// 1. HEREKET DÖRETMEK (EKLEME)
export async function createTransaction(formData: FormData) {
  
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;
  const payload = await decrypt(sessionToken);
  const userId = payload?.userId as string | undefined;
  
  const productId = formData.get("productId") as string;
  const type = formData.get("type") as "IN" | "OUT";
  const quantity = parseInt(formData.get("quantity") as string);
  const partnerId = formData.get("partnerId") as string;

  if (!productId || !quantity || quantity <= 0) {
    return { error: "Maglumatlar ýalňyş!" };
  }

  try {
    // A. İşlemi Kaydet
    await db.transaction.create({
      data: {
        type,
        quantity,
        productId,
        partnerId: partnerId || null,
        userId: userId || null,
      },
    });

    // B. Ürün Stoğunu Güncelle
    if (type === "IN") {
      await db.product.update({
        where: { id: productId },
        data: { stockQuantity: { increment: quantity } }, // Arttır
      });
    } else {
      await db.product.update({
        where: { id: productId },
        data: { stockQuantity: { decrement: quantity } }, // Azalt
      });
    }

  } catch (error) {
    return { error: "Hereket döredilmedi." };
  }

  revalidatePath("/tk/transactions");
  revalidatePath("/tk/products");
  revalidatePath("/tk");
  
  redirect("/tk/transactions");
}

// 2. HEREKET POZMAK (SİLME) - YENİ EKLENDİ 🚀
export async function deleteTransaction(id: string) {
  try {
    // A. Önce silinecek işlemi bul (Detayları lazım)
    const transaction = await db.transaction.findUnique({
      where: { id }
    });

    if (!transaction) return { error: "Hereket tapylmady." };

    // B. Stok etkisini TERSİNE çevir
    // Eğer 'Giriş' işlemini siliyorsak, o mallar hiç girmemiş gibi stoktan düşmeliyiz.
    if (transaction.type === "IN") {
      await db.product.update({
        where: { id: transaction.productId },
        data: { stockQuantity: { decrement: transaction.quantity } } // Geri al (Düş)
      });
    } else {
      // Eğer 'Çıkış' işlemini siliyorsak, o mallar hiç çıkmamış gibi stoğa geri eklemeliyiz.
      await db.product.update({
        where: { id: transaction.productId },
        data: { stockQuantity: { increment: transaction.quantity } } // Geri al (Ekle)
      });
    }

    // C. Kaydı sil
    await db.transaction.delete({ where: { id } });

    // Sayfaları yenile
    revalidatePath("/tk/transactions");
    revalidatePath("/tk/products");
    revalidatePath("/tk"); // Dashboard da güncellensin

    return { success: true };
  } catch (error) {
    return { error: "Hereket pozulmady." };
  }
}

