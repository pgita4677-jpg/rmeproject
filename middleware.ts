import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // Kalau gak ada token → arahkan ke login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // 🔹 FIX: gunakan "clinic_id" (underscore), sesuai yang kamu simpan waktu login
    if (!decoded.clinic_id) {
      console.warn("⚠️ clinic_id tidak ada di token, redirect login");
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // ✅ Token valid, lanjut ke halaman berikutnya
    return NextResponse.next();
  } catch (err) {
    console.error("❌ Token invalid:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// 🔹 Middleware ini hanya aktif untuk halaman pasien (bisa tambah nanti)
export const config = {
  matcher: [ "/dashboard/:path*",
    "/pasien/:path*",
    "/anamnesa/:path*",
    "/laporan/:path*",
  ],
  runtime: "nodejs"
};
