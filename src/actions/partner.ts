"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

// 1. YENİ PARTNER OLUŞTUR (Resim Yükleme Dahil)
export async function createPartner(formData: FormData) {
  const name = formData.get("name") as string;
  const type = formData.get("type") as "CUSTOMER" | "SUPPLIER"; // Enum kontrolü
  const contactPerson = formData.get("contactPerson") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;

  if (!name || !type) {
    return { error: "Ady we Güşi hökman doldurylmaly!" };
  }

  // --- RESİM YÜKLEME İŞLEMİ ---
  const file = formData.get("image") as File;
  let imagePath = null;

  if (file && file.size > 0) {
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Dosya adını güvenli hale getir
      const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
      const fileName = `${Date.now()}-${safeName}`;
      
      // Klasör yoksa oluştur
      const uploadDir = join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });

      // Dosyayı kaydet
      const filePath = join(uploadDir, fileName);
      await writeFile(filePath, buffer);
      
      imagePath = `/uploads/${fileName}`;
    } catch (error) {
      console.error("Resim yükleme hatası:", error);
      // Resim yüklenemese bile devam etsin mi? Evet.
    }
  }
  // -----------------------------

  try {
    await db.partner.create({
      data: {
        name,
        type,
        contactPerson,
        email,
        phone,
        address,
        image: imagePath, // Resim yolu veritabanına
      },
    });
  } catch (error) {
    return { error: "Hyzmatdaş döredilmedi." };
  }

  revalidatePath("/tk/partners");
  redirect("/tk/partners");
}

// 2. PARTNER GÜNCELLE (Senin Kodun + Create Eksikleri)
export async function updatePartner(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const contactPerson = formData.get("contactPerson") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const type = formData.get("type") as "CUSTOMER" | "SUPPLIER";

  // Resim İşleme
  const file = formData.get("image") as File;
  let imagePath = undefined; // undefined bırakırsak Prisma dokunmaz (Eski resim kalır)

  if (file && file.size > 0) {
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
      const fileName = `${Date.now()}-${safeName}`;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const uploadDir = join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });
      await writeFile(join(uploadDir, fileName), buffer);
      
      imagePath = `/uploads/${fileName}`;
    } catch (e) {
      console.error("Resim güncelleme hatası", e);
    }
  }

  try {
    await db.partner.update({
      where: { id },
      data: {
        name,
        contactPerson,
        email,
        phone,
        address,
        type,
        // Eğer imagePath doluysa güncelle, yoksa (undefined) hiç dokunma
        ...(imagePath && { image: imagePath }), 
      },
    });
  } catch (error) {
    return { error: "Hyzmatdaş üýtgedilmedi." };
  }

  revalidatePath("/tk/partners");
  redirect("/tk/partners");
}

// 3. PARTNER SİL (Delete Fonksiyonu)
export async function deletePartner(id: string) {
  try {
    await db.partner.delete({
      where: { id },
    });
    
    revalidatePath("/tk/partners");
    return { success: "Hyzmatdaş üstünlikli pozuldy." };
  } catch (error) {
    return { error: "Hyzmatdaş pozulmady." };
  }
}