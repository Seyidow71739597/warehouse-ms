"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const barcode = formData.get("barcode") as string;
  const description = formData.get("description") as string;
  const unit = formData.get("unit") as string;
  const minStockLevel = parseInt(formData.get("minStockLevel") as string) || 10;

  if (!name || !barcode) {
    return { error: "Ad we Barkod hökmany!" };
  }

  try {
    await db.product.update({
      where: { id },
      data: {
        name,
        barcode,
        description,
        unit,
        minStockLevel,
      },
    });
  } catch (error) {
    return { error: "Güncelleme başarısız. Barkod kullanılıyor olabilir." };
  }

  revalidatePath("/tk/products");
  redirect("/tk/products");
}