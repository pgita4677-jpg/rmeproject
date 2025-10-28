import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// 🔧 Koneksi ke database Railway
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "nozomi.proxy.rlwy.net",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "NNStZTjxpLyfuSidoiIWdRRabuCTDEQS",
  database: process.env.MYSQL_DATABASE || "railway",
  port: Number(process.env.MYSQL_PORT) || 55908,
  ssl: { rejectUnauthorized: false },
});

// ✅ GET /api/kunjungan?no_rm=RM2025001
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const no_rm = searchParams.get("no_rm");

  if (!no_rm) {
    return NextResponse.json(
      { success: false, message: "Nomor RM wajib dikirim!" },
      { status: 400 }
    );
  }

  try {
    const [rows]: any = await pool.query(
      `
      SELECT 
        a.id,
        a.no_rm,
        a.keluhan,
        a.riwayat,
        a.tensi,
        a.hasil_lab,
        a.created_at,
        r.nama_obat,
        r.dosis,
        r.aturan
      FROM anamnesa a
      LEFT JOIN resep r ON a.id = r.anamnesa_id
      WHERE a.no_rm = ?
      ORDER BY a.created_at DESC
      `,
      [no_rm]
    );

    // 🔹 Gabungkan resep ke dalam setiap kunjungan
    const grouped = rows.reduce((acc: any, row: any) => {
      const existing = acc.find((x: any) => x.id === row.id);
      if (existing) {
        if (row.nama_obat) {
          existing.resep.push({
            nama_obat: row.nama_obat,
            dosis: row.dosis,
            aturan: row.aturan,
          });
        }
      } else {
        acc.push({
          id: row.id,
          no_rm: row.no_rm,
          keluhan: row.keluhan,
          riwayat: row.riwayat,
          tensi: row.tensi,
          hasil_lab: row.hasil_lab,
          created_at: row.created_at,
          resep: row.nama_obat
            ? [{ nama_obat: row.nama_obat, dosis: row.dosis, aturan: row.aturan }]
            : [],
        });
      }
      return acc;
    }, []);

    return NextResponse.json({ success: true, data: grouped });
  } catch (err: any) {
    console.error("❌ Gagal ambil data kunjungan:", err);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data kunjungan", error: err.message },
      { status: 500 }
    );
  }
}
