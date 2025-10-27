import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// 🔧 Koneksi Database
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: Number(process.env.MYSQL_PORT) || 3306,
  ssl: { rejectUnauthorized: false },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ✅ Ambil pasien + anamnesa terakhir
export async function GET() {
  console.log("🚀 [API] /api/pasien/select dipanggil...");
  try {
    const [rows]: any = await pool.query(`
      SELECT 
        p.no_rm,
        p.nama,
        p.usia,
        p.alamat,
        a.keluhan,
        a.hasil_lab,
        a.created_at AS tanggal_periksa
      FROM pasien p
      LEFT JOIN (
        SELECT no_rm, keluhan, hasil_lab, created_at
        FROM anamnesa
        WHERE (no_rm, created_at) IN (
          SELECT no_rm, MAX(created_at)
          FROM anamnesa
          GROUP BY no_rm
        )
      ) a ON p.no_rm = a.no_rm
      ORDER BY a.created_at DESC
    `);

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (err: any) {
    console.error("❌ [API ERROR] Gagal ambil data pasien:", err);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data pasien", error: err.message },
      { status: 500 }
    );
  }
}
