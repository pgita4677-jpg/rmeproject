import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { findUser } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    const found = await findUser(username, password);

    if (!found) {
      return NextResponse.json(
        { error: "Username atau password salah" },
        { status: 401 }
      );
    }

    const { user, dbName } = found;

    // 🔹 Buat token JWT
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        clinic_id: user.clinic_id,
        db: dbName,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // 🔹 Gunakan NextResponse buat kirim cookie
    const res = NextResponse.json({
      success: true,
      message: "Login berhasil",
      user: {
        id: user.id,
        username: user.username,
        clinic_id: user.clinic_id,
        database: dbName,
      },
    });

    // 🔹 Simpan token di cookie
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 hari
    });

    // 🔹 Simpan clinic_id di cookie juga (non-httpOnly biar bisa diakses di client)
    res.cookies.set("clinic_id", String(user.clinic_id), {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return res;
  } catch (err) {
    console.error("❌ Login error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
