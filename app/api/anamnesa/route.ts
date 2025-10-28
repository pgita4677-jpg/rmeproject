import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: Number(process.env.MYSQL_PORT) || 3306,
  ssl: { rejectUnauthorized: false },
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { no_rm, keluhan, riwayat, tensi, hasil_lab, resep } = body;

    // 1️⃣ Simpan anamnesa baru
    const [anamnesaResult]: any = await pool.query(
      `INSERT INTO anamnesa (no_rm, keluhan, riwayat, tensi, hasil_lab, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [no_rm, keluhan, riwayat, tensi, hasil_lab]
    );

    const anamnesa_id = anamnesaResult.insertId;

    // 2️⃣ Simpan resep (jika ada)
    if (Array.isArray(resep) && resep.length > 0) {
      const values = resep
        .filter((r) => r.nama_obat && r.dosis && r.aturan)
        .map((r) => [no_rm, r.nama_obat, r.dosis, r.aturan, new Date(), anamnesa_id]);
      if (values.length > 0) {
        await pool.query(
          `INSERT INTO resep (no_rm, nama_obat, dosis, aturan, tanggal, anamnesa_id)
           VALUES ?`,
          [values]
        );
      }
    }

    // 🌟 3️⃣ Tambahan: update status pasien di tabel rekam_medis
    try {
      await pool.query(
        `INSERT INTO rekam_medis (no_rm, status, tanggal_terakhir)
         VALUES (?, 'Kunjungan Ulang', NOW())
         ON DUPLICATE KEY UPDATE 
           status = 'Kunjungan Ulang',
           tanggal_terakhir = NOW()`,
        [no_rm]
      );
    } catch (updateErr: any) {
      console.warn("⚠️ Gagal update rekam_medis:", updateErr.message);
    }

    return NextResponse.json({
      success: true,
      message: "✅ Data anamnesa & resep berhasil disimpan dan rekam medis diperbarui",
    });
  } catch (err: any) {
    console.error("❌ [API ERROR] Gagal simpan anamnesa:", err);
    return NextResponse.json(
      { success: false, message: "Gagal simpan data anamnesa", error: err.message },
      { status: 500 }
    );
  }
}
