import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { findUser } from "@/lib/db";

const SECRET = process.env.JWT_SECRET || "rahasia_super_kamu";

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

    const user = found.user || found;

    // 🔹 Buat token JWT (tanpa clinic_id)
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role || "user",
      },
      SECRET,
      { expiresIn: "7d" }
    );

    // 🔹 Buat response JSON
    const res = NextResponse.json({
      success: true,
      message: "Login berhasil",
      user: {
        id: user.id,
        username: user.username,
        role: user.role || "user",
      },
    });

    // 🔹 Simpan token ke cookie
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 hari
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
