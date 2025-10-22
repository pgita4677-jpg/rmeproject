import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { cookies } from "next/headers";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "rme_db", // ganti sesuai database kamu
});

export async function GET() {
  try {
    const cookieStore = await cookies();
    const clinic_id = cookieStore.get("clinic_id")?.value;

    if (!clinic_id) {
      return NextResponse.json(
        { success: false, message: "Clinic ID tidak ditemukan. Silakan login ulang." },
        { status: 401 }
      );
    }

    const [rows] = await pool.query("SELECT * FROM pasien WHERE clinic_id = ?", [clinic_id]);

    return NextResponse.json({ success: true, data: rows });
  } catch (err) {
    console.error("❌ Gagal ambil data pasien:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
