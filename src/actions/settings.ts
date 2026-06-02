"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises"; // Dosya işlemleri için ekledik
import { join } from "path";

// 1. KULLANICI PROFİLİNİ GÜNCELLE (BİZİM İÇİN ÖNEMLİ OLAN BU)
export async function updateProfile(userId: string, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const jobTitle = formData.get("jobTitle") as string;

  // RESİM YÜKLEME İŞLEMİ (Kopyala-Yapıştır Mantığı)
  const file = formData.get("image") as File;
  let imagePath = undefined; // undefined bırakırsak Prisma dokunmaz (Eski resim kalır)

  if (file && file.size > 0) {
    try {
      // Dosya adını güvenli hale getir
      const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
      const fileName = `${Date.now()}-${safeName}`;
      
      // Buffer'a çevir
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Klasör yolunu ayarla
      const uploadDir = join(process.cwd(), "public", "uploads");
      
      // Klasör yoksa oluştur
      await mkdir(uploadDir, { recursive: true });
      
      // Dosyayı kaydet
      await writeFile(join(uploadDir, fileName), buffer);
      
      // Veritabanı yolunu belirle
      imagePath = `/uploads/${fileName}`;
      
    } catch (e) {
      console.error("Profil resmi yüklenemedi", e);
    }
  }

  try {
    await db.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        phone,
        jobTitle,
        // Yeni resim varsa güncelle, yoksa eskisine dokunma
        ...(imagePath && { image: imagePath }),
      },
    });

    revalidatePath("/tk/settings");
    return { success: true };

  } catch (error) {
    console.error("Profil hatası:", error);
    return { error: "Profil üýtgedilmedi. Email başga biri tarapyndan ulanylýar." };
  }
}


// 2. SİSTEM AYARLARI (Senin eski kodun - İleride lazım olur diye burada tuttum)
export async function updateSystemSettings(formData: FormData) {
  const companyName = formData.get("companyName") as string;
  const phone = formData.get("phone") as string;

  try {
    // Eğer SystemSettings modelin yoksa burası hata verebilir, 
    // şimdilik yorum satırına alabilirsin veya model varsa açabilirsin.
    /*
    await db.systemSettings.upsert({
      where: { id: "default" },
      update: { companyName, phone },
      create: { id: "default", companyName, phone },
    });
    */

    revalidatePath("/tk/settings");
    return { success: true };
  } catch (error) {
    return { error: "Ayarlar kaydedilemedi." };
  }
}