"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

// 1. HARYT DÖRET (CREATE)
export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  
  // Barkod boşsa NULL olsun
  const rawBarcode = formData.get("barcode") as string;
  const barcode = rawBarcode.trim() === "" ? null : rawBarcode.trim();

  // Sayıları güvenli çevir
  const stockQuantity = parseInt((formData.get("stockQuantity") as string) || "0");
  const minStockLevel = parseInt((formData.get("minStockLevel") as string) || "5");
  const buyPrice = parseFloat((formData.get("buyPrice") as string) || "0");
  const unit = (formData.get("unit") as string) || "PIECE";
  
  // RESİM İŞLEME
  const file = formData.get("image") as File;
  let savedImagePath = null;

  if (file && file.size > 0) {
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
      const fileName = `${Date.now()}-${safeName}`;
      
      const uploadDir = join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });
      await writeFile(join(uploadDir, fileName), Buffer.from(await file.arrayBuffer()));
      
      savedImagePath = `/uploads/${fileName}`;
    } catch (error) {
      console.error("Resim yükleme hatası:", error);
    }
  }

  // VERİTABANINA KAYIT (Hata Yakalama Bloklu)
  try {
    await db.product.create({
      data: {
        name,
        barcode,
        description,
        stockQuantity,
        minStockLevel,
        buyPrice,
        unit,
        image: savedImagePath,
      },
    });
  } catch (error: any) {
    console.error("Veritabanı hatası:", error);
    // P2002: Prisma'nın "Bu kayıttan zaten var" hata kodudur
    if (error.code === 'P2002') {
      return { error: "Bu barkod eýýäm ulanylýar! Başga barkod giriziň." };
    }
    return { error: "Haryt döredilmedi. Garaşylmadyk ýalňyşlyk." };
  }

  // 🚀 ÖNEMLİ: Yönlendirme try-catch dışında olmalı!
  revalidatePath("/tk/products");
  redirect("/tk/products");
}


// 2. HARYT SİLME (DELETE)
export async function deleteProduct(id: string) {
  try {
    const transactionCount = await db.transaction.count({
      where: { productId: id }
    });

    if (transactionCount > 0) {
      return { error: `Bu harydyň ${transactionCount} sany hereketi bar. Pozup bolmaz!` };
    }

    await db.product.delete({ where: { id } });
    revalidatePath("/tk/products");
    return { success: true };
  } catch (error) {
    return { error: "Haryt pozulmady." };
  }
}


// 3. HARYT GÜNCELLE (UPDATE)
export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  
  // Barkod Kontrolü (Boşsa NULL)
  const rawBarcode = formData.get("barcode") as string;
  const barcode = rawBarcode.trim() === "" ? null : rawBarcode.trim();

  const stockQuantity = parseInt((formData.get("stockQuantity") as string) || "0");
  const minStockLevel = parseInt((formData.get("minStockLevel") as string) || "5");
  const buyPrice = parseFloat((formData.get("buyPrice") as string) || "0");
  const unit = formData.get("unit") as string;

  // Resim İşleme
  const file = formData.get("image") as File;
  let imagePath = undefined;

  if (file && file.size > 0) {
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
      const fileName = `${Date.now()}-${safeName}`;
      
      const uploadDir = join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });
      await writeFile(join(uploadDir, fileName), Buffer.from(await file.arrayBuffer()));
      
      imagePath = `/uploads/${fileName}`;
    } catch (e) {
      console.error("Resim hatası", e);
    }
  }

  // VERİTABANINI GÜNCELLEME
  try {
    await db.product.update({
      where: { id },
      data: {
        name,
        barcode,
        description,
        stockQuantity,
        minStockLevel,
        buyPrice,
        unit,
        ...(imagePath && { image: imagePath }),
      },
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: "Bu barkod eýýäm ulanylýar! Başga barkod giriziň." };
    }
    return { error: "Haryt üýtgedilmedi." };
  }

  revalidatePath("/tk/products");
  redirect("/tk/products");
}