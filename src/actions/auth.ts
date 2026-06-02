"use server";

import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { createSession, deleteSession } from "@/lib/session"; 
import { hash, compare } from "bcryptjs"; // <--- EKLENDİ: Şifreleme kütüphanesi

// ---------------------------------------------------------
// 1. KULLANICI KAYIT (REGISTER)
// ---------------------------------------------------------
export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const password = formData.get("password") as string;
  const age = parseInt((formData.get("age") as string) || "0");
  const jobTitle = formData.get("jobTitle") as string;
  const locale = (formData.get("locale") as string) || "tk";

  // Resim Yükleme İşlemi (Pasaport)
  const file = formData.get("image") as File;
  let passportImage = null;

  if (file && file.size > 0) {
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
      const fileName = `passport-${Date.now()}-${safeName}`;
      
      const uploadDir = join(process.cwd(), "public", "uploads");
      
      // Klasör yoksa oluştur
      await mkdir(uploadDir, { recursive: true });

      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(join(uploadDir, fileName), buffer);
      
      passportImage = `/uploads/${fileName}`;
    } catch (error) {
      console.error("Resim yükleme hatası:", error);
    }
  }

  try {
    // ŞİFREYİ KRİPTOLA (HASH) - EKLENDİ
    const hashedPassword = await hash(password, 12);

    // Kullanıcıyı veritabanına kaydet
    await db.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword, // Artık şifreli kaydediyoruz
        age: age > 0 ? age : null,
        jobTitle,
        passportImage,
        status: "PENDING",
        role: "USER",
      },
    });
  } catch (error) {
    console.error("Kayıt hatası:", error);
    return { error: "Kayıt şowsuz boldy. Email eýýäm ulanylan bolup biler." };
  }

  // Başarılı olursa login sayfasına yönlendir
  redirect(`/${locale}/login?registered=true`);
}


// ---------------------------------------------------------
// 2. GİRİŞ YAPMA (LOGIN)
// ---------------------------------------------------------
export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  //const locale = (formData.get("locale") as string) || "tk"; 
  // Formdan locale gelmeyebilir, varsayılan bir değer atayalım veya yönlendirmeyi sabitleyelim.
  const locale = "tk"; 

  try {
    // 1. Kullanıcıyı Bul
    const user = await db.user.findUnique({
      where: { email },
    });

    // 2. Kullanıcı Yoksa
    if (!user) {
      return { error: "Email ýa-da parol ýalňyş!" };
    }

    // 3. ŞİFRE KONTROLÜ (GÜNCELLENDİ) 🛠️
    // Düz yazı (123123) ile Hash ($2b$12$...) karşılaştırılıyor
    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
       return { error: "Email ýa-da parol ýalňyş!" };
    }

    // 4. ONAY KONTROLÜ (Status)
    if (user.status === "PENDING") {
      return { error: "Hasabyňyz entek tassyklanmady! Admin garaşyň." };
    }
    
    if (user.status === "REJECTED") {
      return { error: "Hasabyňyz bloklanan (Reddedildi)." };
    }

    // 5. OTURUM AÇ (Session Oluştur)
    await createSession(user.id, user.role);

  } catch (error) {
    console.error("Giriş hatası:", error);
    return { error: "Ulgam hatasy ýüze çykdy." };
  }

  // 6. ANA SAYFAYA YÖNLENDİR
  redirect(`/${locale}`);
}


// ---------------------------------------------------------
// 3. ÇIKIŞ YAPMA (LOGOUT)
// ---------------------------------------------------------
export async function logoutUser() {
  await deleteSession();
  redirect("/tk/login");
}