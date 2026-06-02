import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/session";
import createMiddleware from "next-intl/middleware";

// 1. DİL AYARLARI
const handleI18nRouting = createMiddleware({
  locales: ["tk", "en", "ru"], 
  defaultLocale: "tk",         
  localePrefix: "always",
  localeDetection: false 
});

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 2. OTURUM KONTROLÜ
  const cookie = request.cookies.get("session")?.value;
  const session = await decrypt(cookie);

  // 3. HALKA AÇIK SAYFALAR
  const isPublicPage = path.includes("/login") || path.includes("/register");

  // --- SENARYO 1: Giriş Yapmamış Kullanıcı ---
  if (!session?.userId) {
    if (!isPublicPage) {
      return NextResponse.redirect(new URL("/tk/login", request.nextUrl));
    }
  }

  // --- SENARYO 2: Giriş Yapmış Kullanıcı ---
  if (session?.userId) {
    if (isPublicPage) {
      return NextResponse.redirect(new URL("/tk", request.nextUrl));
    }
  }

  // 4. HİÇBİR SORUN YOKSA DİL YÖNLENDİRMESİNİ YAP
  return handleI18nRouting(request);
}

// 🚀 EN ÖNEMLİ KISIM (Resimlerin görünmesi için)
export const config = {
  matcher: [
    // 🚀 ÖNEMLİ: uploads kelimesini ve nokta içeren dosyaları tamamen hariç tut
    '/((?!api|_next|_vercel|.*\\..*|uploads).*)',
  ],
};