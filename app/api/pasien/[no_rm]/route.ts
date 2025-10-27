// app/api/pasien/[no_rm]/route.ts
import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: Number(process.env.MYSQL_PORT) || 3306,
  ssl: { rejectUnauthorized: true },
});

export async function GET(req: Request, { params }: { params: { no_rm: string } }) {
  const { no_rm } = params;

  console.log("🟡 GET pasien:", no_rm);

  try {
    const [rows]: any = await pool.query("SELECT * FROM pasien WHERE no_rm = ?", [no_rm]);
    console.log("📦 hasil query:", rows);

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { success: false, message: `Pasien ${no_rm} tidak ditemukan` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Data pasien ditemukan",
      data: { pasien: rows[0] },
    });
  } catch (error: any) {
    console.error("❌ GET error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data pasien", error: error.message },
      { status: 500 }
    );
  }
}
