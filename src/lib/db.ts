import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

// Eğer globalde varsa onu kullan, yoksa yeni oluştur.
export const db = globalThis.prisma || new PrismaClient();

// Geliştirme ortamındaysak, bağlantıyı globale kaydet ki tekrar tekrar açılmasın.
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}