import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = process.env.JWT_SECRET || "rahasia_super_kamu";

// Konversi secret ke bentuk Uint8Array
const encoder = new TextEncoder();
const secretKey = encoder.encode(SECRET);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 🚫 Abaikan halaman publik
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/login") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // 🔹 Cek token dari cookie
  const token = req.cookies.get("token")?.value;

  if (!token) {
    console.log("🚫 Tidak ada token, redirect ke login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, secretKey);
    console.log("✅ Token valid:", payload);

    // Simpan data user di request attributes (optional)
    req.headers.set("x-user-id", String(payload.id));
    req.headers.set("x-username", String(payload.username));

    return NextResponse.next();
  } catch (err) {
    console.error("❌ Token invalid:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/((?!api/login|login|_next|favicon.ico).*)"],
};
