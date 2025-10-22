import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// 🔹 Koneksi database
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "rme-system", // ganti sesuai database kamu
});

// 🔹 Ambil data dari tabel ANAMNESA (bukan kunjungan)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const no_rm = searchParams.get("no_rm");

    if (!no_rm) {
      return NextResponse.json(
        { success: false, message: "Parameter no_rm wajib diisi" },
        { status: 400 }
      );
    }

    // 🔹 Ambil semua data anamnesa berdasarkan no_rm
    const [rows]: any = await pool.query(
      `SELECT * FROM anamnesa WHERE no_rm = ? ORDER BY created_at DESC`,
      [no_rm]
    );

    // 🔹 Kalau data kosong
    if (rows.length === 0) {
      return NextResponse.json({
        success: true,
        message: "Belum ada data anamnesa",
        data: [],
      });
    }

    // 🔹 Parsing kolom resep (jika berupa string JSON)
    const data = rows.map((item: any) => ({
      ...item,
      resep:
        typeof item.resep === "string"
          ? JSON.parse(item.resep || "[]")
          : Array.isArray(item.resep)
          ? item.resep
          : [],
    }));

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("❌ Error ambil data anamnesa:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server", error: error.message },
      { status: 500 }
    );
  }
}
