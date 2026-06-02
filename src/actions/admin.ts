"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// 1. KULLANICIYI ONAYLA (Aktif Et)
export async function approveUser(id: string) {
  try {
    await db.user.update({
      where: { id },
      data: { status: "APPROVED" } // Durumu 'ONAYLI' yap
    });
    revalidatePath("/tk/settings"); // Sayfayı yenile
    return { success: true };
  } catch (error) {
    return { error: "Hatä!" };
  }
}

// 2. KULLANICIYI REDDET (Sil)
export async function rejectUser(id: string) {
  try {
    await db.user.delete({
      where: { id }
    });
    revalidatePath("/tk/settings");
    return { success: true };
  } catch (error) {
    return { error: "Hatä!" };
  }
}

// ... (Önceki kodların altına)

// 3. KULLANICI BİLGİLERİNİ GÜNCELLE
export async function updateUser(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const jobTitle = formData.get("jobTitle") as string;
  const role = formData.get("role") as "ADMIN" | "USER";

  try {
    await db.user.update({
      where: { id },
      data: {
        name,
        phone,
        jobTitle,
        role, // Admin yetkisi verip alabilir
      },
    });
  } catch (error) {
    return { error: "Güncelleme şowsuz boldy." };
  }

  revalidatePath("/tk/settings");
  // Yönlendirme işlemini sayfada yapacağız
  return { success: true };
}