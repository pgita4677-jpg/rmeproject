// app/api/pasien/select/route.ts
import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// 🔧 Koneksi Database (Railway / env)
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

// ======================
// ✅ GET: Ambil pasien + anamnesa terakhir
// ======================
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

    // 🩹 FIX: pastikan data selalu berupa array
    const safeRows = Array.isArray(rows) ? rows : [];
    console.log("✅ Data pasien diambil:", safeRows.length, "baris");

    return NextResponse.json({
      success: true,
      data: safeRows,
    });
  } catch (err: any) {
    console.error("❌ [API ERROR] Gagal ambil data pasien:", err);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data pasien", error: err.message },
      { status: 500 }
    );
  }
}

// ======================
// 🗑️ DELETE: Hapus pasien beserta anamnesa & resep
// ======================
export async function DELETE(req: Request) {
  try {
    // 1️⃣ Coba ambil dari query string (?no_rm=...)
    const url = new URL(req.url);
    let no_rm = url.searchParams.get("no_rm");

    // 2️⃣ Jika tidak ada, coba baca dari JSON body
    if (!no_rm) {
      try {
        const body = await req.json().catch(() => null);
        if (body && typeof body === "object" && body.no_rm) no_rm = body.no_rm;
      } catch {
        // abaikan error JSON parse
      }
    }

    if (!no_rm) {
      return NextResponse.json(
        { success: false, message: "No. RM tidak diberikan (query ?no_rm= atau JSON body)." },
        { status: 400 }
      );
    }

    // 🔍 Pastikan pasien ada
    const [checkRows]: any = await pool.query("SELECT no_rm FROM pasien WHERE no_rm = ?", [no_rm]);
    if (!checkRows || checkRows.length === 0) {
      return NextResponse.json(
        { success: false, message: `Pasien dengan no_rm ${no_rm} tidak ditemukan` },
        { status: 404 }
      );
    }

    // 🧹 Hapus resep terkait (coba lewat anamnesa_id dulu)
    try {
      await pool.query(
        `DELETE r FROM resep r
         INNER JOIN anamnesa a ON r.anamnesa_id = a.id
         WHERE a.no_rm = ?`,
        [no_rm]
      );
    } catch (e) {
      // fallback kalau tabel resep tidak punya kolom anamnesa_id
      try {
        await pool.query(`DELETE FROM resep WHERE no_rm = ?`, [no_rm]);
      } catch (ee) {
        console.warn("⚠ fallback hapus resep juga gagal:", ee);
      }
    }

    // 🧹 Hapus anamnesa
    await pool.query(`DELETE FROM anamnesa WHERE no_rm = ?`, [no_rm]);

    // 🧹 Hapus pasien
    const [delRes]: any = await pool.query(`DELETE FROM pasien WHERE no_rm = ?`, [no_rm]);

    if (delRes.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Gagal menghapus pasien (tidak ada perubahan)." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `✅ Pasien dengan No. RM ${no_rm} berhasil dihapus beserta data anamnesa/resep.`,
    });
  } catch (err: any) {
    console.error("🔥 [API ERROR] Gagal menghapus pasien:", err);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus data pasien", error: err.message },
      { status: 500 }
    );
  }
}
