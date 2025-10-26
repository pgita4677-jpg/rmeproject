import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.MYSQL_HOST || "nozomi.proxy.rlwy.net",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "NNStZTjxpLyfuSidoiIWdRRabuCTDEQS",
  database: process.env.MYSQL_DATABASE || "railway",
  port: Number(process.env.MYSQL_PORT) || 55908,
};

const pool = mysql.createPool(dbConfig);

// 🔹 Ambil semua rekam medis pasien
export async function GET() {
  try {
    const [rows]: any = await pool.query(`
      SELECT 
        p.no_rm,
        p.nama,
        a.keluhan AS keluhan_terakhir,
        MAX(a.created_at) AS tanggal_terakhir,
        COUNT(a.no_rm) AS total_kunjungan
      FROM pasien p
      LEFT JOIN anamnesa a ON p.no_rm = a.no_rm
      GROUP BY p.no_rm, p.nama, a.keluhan
      ORDER BY tanggal_terakhir DESC
    `);

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (error: any) {
    console.error("🔥 Error GET /api/rekam-medis:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data", error: error.message },
      { status: 500 }
    );
  }
}
