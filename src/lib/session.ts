import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const secretKey = process.env.SESSION_SECRET || "gizli-anahtar-yoksa-bu-kullanilir";
const key = new TextEncoder().encode(secretKey);

// 1. ŞİFRELEME
export async function encrypt(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

// 2. ŞİFRE ÇÖZME
export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

// 3. OTURUM AÇMA
export async function createSession(userId: string, role: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, role, expiresAt });
  
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

// 4. OTURUM KAPATMA
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

// 5. OTURUM KONTROL (verifySession) - İŞTE BU EKSİKTİ!
export async function verifySession() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    redirect("/tk/login");
  }

  return { isAuth: true, userId: session.userId as string, role: session.role as string };
}