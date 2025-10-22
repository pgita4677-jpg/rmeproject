import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// Koneksi ke database
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "rme-system",
});

export async function GET() {
  try {
    const sql = `
      SELECT 
        p.no_rm,
        p.nama,
        (
          SELECT a.keluhan
          FROM anamnesa a
          WHERE a.no_rm = p.no_rm
          ORDER BY a.created_at DESC
          LIMIT 1
        ) AS keluhan,
        (
          SELECT a.created_at
          FROM anamnesa a
          WHERE a.no_rm = p.no_rm
          ORDER BY a.created_at DESC
          LIMIT 1
        ) AS tanggal_terakhir
      FROM pasien p
      ORDER BY p.id DESC
    `;

    const [rows]: any = await pool.query(sql);
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("❌ Error GET /rekam-medis:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data rekam medis", error: error.message },
      { status: 500 }
    );
  }
}
