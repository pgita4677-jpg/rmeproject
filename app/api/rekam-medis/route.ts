import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.MYSQL_HOST || "nozomi.proxy.rlwy.net",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "NNStZTjxpLyfuSidoiIWdRRabuCTDEQS",
  database: process.env.MYSQL_DATABASE || "railway",
  port: Number(process.env.MYSQL_PORT) || 55908,
  ssl: { rejectUnauthorized: false },
};

const pool = mysql.createPool(dbConfig);

// ============================================================
// 🔹 GET: Ambil semua rekam medis pasien (lengkap & aman)
// ============================================================
export async function GET() {
  try {
    const [rows]: any = await pool.query(`
      SELECT 
        p.no_rm,
        p.nama,
        (
          SELECT a1.keluhan
          FROM anamnesa a1
          WHERE a1.no_rm = p.no_rm
          ORDER BY a1.created_at DESC
          LIMIT 1
        ) AS keluhan_terakhir,
        (
          SELECT MAX(a2.created_at)
          FROM anamnesa a2
          WHERE a2.no_rm = p.no_rm
        ) AS tanggal_terakhir,
        COUNT(a.no_rm) AS total_kunjungan
      FROM pasien p
      LEFT JOIN anamnesa a ON p.no_rm = a.no_rm
      GROUP BY p.no_rm, p.nama
      ORDER BY tanggal_terakhir DESC
    `);

    // 🔸 Format tanggal biar rapi & aman kalau null
    const dataFix = rows.map((item: any) => ({
      ...item,
      keluhan_terakhir: item.keluhan_terakhir || "-",
      tanggal_terakhir: item.tanggal_terakhir
        ? new Date(item.tanggal_terakhir).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })
        : "-",
      total_kunjungan: item.total_kunjungan || 0,
    }));

    return NextResponse.json({
      success: true,
      message: "✅ Data rekam medis berhasil diambil",
      data: dataFix,
    });
  } catch (error: any) {
    console.error("🔥 Error GET /api/rekam-medis:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data", error: error.message },
      { status: 500 }
    );
  }
}
