import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// 🔹 koneksi database ke RAILWAY
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "nozomi.proxy.rlwy.net",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "NNStZTjxpLyfuSidoiIWdRRabuCTDEQS",
  database: process.env.MYSQL_DATABASE || "railway",
  port: Number(process.env.MYSQL_PORT) || 55908,
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const dari = searchParams.get("dari");
  const sampai = searchParams.get("sampai");

  try {
    let query = `
      SELECT 
        a.no_rm,
        p.nama AS nama_pasien,
        a.keluhan,
        a.riwayat,
        a.tensi,
        a.hasil_lab,
        a.created_at AS tanggal,
        p.alamat,
        CASE 
          WHEN (
            SELECT COUNT(*) 
            FROM anamnesa a2 
            WHERE a2.no_rm = a.no_rm 
            AND a2.created_at <= a.created_at
          ) = 1 THEN 'Pasien Baru'
          ELSE 'Kunjungan Ulang'
        END AS status_pasien
      FROM anamnesa a
      LEFT JOIN pasien p ON a.no_rm = p.no_rm
      WHERE 1=1
    `;

    const params: any[] = [];

    if (dari && sampai) {
      query += " AND DATE(a.created_at) BETWEEN ? AND ?";
      params.push(dari, sampai);
    }

    query += " ORDER BY a.created_at DESC";

    const [rows]: any = await pool.query(query, params);

    // 🧮 Hitung statistik
    const totalKunjungan = rows.length;
    const totalPasien = new Set(rows.map((r: any) => r.no_rm)).size;

    // 🔹 Hitung keluhan tersering
    const keluhanCount: Record<string, number> = {};
    rows.forEach((r: any) => {
      if (r.keluhan) {
        keluhanCount[r.keluhan] = (keluhanCount[r.keluhan] || 0) + 1;
      }
    });
    const keluhanTersering =
      Object.keys(keluhanCount).length > 0
        ? Object.entries(keluhanCount).sort((a, b) => b[1] - a[1])[0][0]
        : "-";

    // 🔹 Hitung obat tersering
    let obatTersering = "-";
    try {
      let obatQuery = `
        SELECT nama_obat, COUNT(*) AS total
        FROM resep
        WHERE 1=1
      `;
      const obatParams: any[] = [];
      if (dari && sampai) {
        obatQuery += " AND DATE(tanggal) BETWEEN ? AND ?";
        obatParams.push(dari, sampai);
      }
      obatQuery += " GROUP BY nama_obat ORDER BY total DESC LIMIT 1";

      const [obatRows]: any = await pool.query(obatQuery, obatParams);
      if (obatRows.length > 0) obatTersering = obatRows[0].nama_obat;
    } catch (e) {
      console.warn("⚠️ Tidak bisa ambil data obat:", e);
    }

    // 🔹 Hitung pasien baru & kunjungan ulang
    const totalPasienBaru = rows.filter((r: any) => r.status_pasien === "Pasien Baru").length;
    const totalKunjunganUlang = rows.filter((r: any) => r.status_pasien === "Kunjungan Ulang").length;

    // 🔹 Buat statistik ringkasan
    const statistik = {
      totalPasien,
      totalKunjungan,
      totalPasienBaru,
      totalKunjunganUlang,
      keluhanTersering,
      obatTersering,
    };

    return NextResponse.json({
      success: true,
      data: rows,
      statistik,
    });
  } catch (error: any) {
    console.error("❌ Error GET /api/laporan:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data laporan", error: error.message },
      { status: 500 }
    );
  }
}
