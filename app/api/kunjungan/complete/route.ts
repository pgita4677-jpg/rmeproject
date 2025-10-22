import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "rme-system",
  port: 3306,
});

// 🔸 POST → Simpan data kunjungan + anamnesa + resep sekaligus
export async function POST(req: Request) {
  const conn = await pool.getConnection();
  try {
    const { no_rm, dokter, catatan, anamnesa, resep } = await req.json();

    if (!no_rm) {
      return NextResponse.json(
        { success: false, message: "⚠️ Nomor RM wajib diisi" },
        { status: 400 }
      );
    }

    await conn.beginTransaction();

    // 🧾 1. Simpan kunjungan
    const [kunjunganResult]: any = await conn.query(
      `INSERT INTO kunjungan (no_rm, dokter, catatan, tanggal)
       VALUES (?, ?, ?, NOW())`,
      [no_rm, dokter || null, catatan || null]
    );
    const kunjungan_id = kunjunganResult.insertId;

    // 🩺 2. Simpan anamnesa
    const [anamnesaResult]: any = await conn.query(
      `INSERT INTO anamnesa (no_rm, kunjungan_id, keluhan, riwayat, tensi, hasil_lab, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [
        no_rm,
        kunjungan_id,
        anamnesa?.keluhan || null,
        anamnesa?.riwayat || null,
        anamnesa?.tensi || null,
        anamnesa?.hasil_lab || null,
      ]
    );
    const anamnesa_id = anamnesaResult.insertId;

    // 💊 3. Simpan resep (bisa banyak)
    if (resep && resep.length > 0) {
      for (const r of resep) {
        await conn.query(
          `INSERT INTO resep (no_rm, anamnesa_id, nama_obat, dosis, aturan, tanggal)
           VALUES (?, ?, ?, ?, ?, NOW())`,
          [no_rm, anamnesa_id, r.nama_obat, r.dosis, r.aturan]
        );
      }
    }

    await conn.commit();

    return NextResponse.json({
      success: true,
      message: "✅ Kunjungan & data anamnesa berhasil disimpan",
    });
  } catch (err: any) {
    await conn.rollback();
    console.error("🔥 Gagal simpan kunjungan:", err);
    return NextResponse.json(
      { success: false, message: "Gagal simpan kunjungan", error: err.message },
      { status: 500 }
    );
  } finally {
    conn.release();
  }
}

// 🔹 GET → Ambil semua kunjungan berdasarkan no_rm
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const no_rm = searchParams.get("no_rm");

    if (!no_rm) {
      return NextResponse.json(
        { success: false, message: "Parameter no_rm diperlukan" },
        { status: 400 }
      );
    }

    const [rows]: any = await pool.query(
      `SELECT * FROM kunjungan WHERE no_rm = ? ORDER BY tanggal DESC`,
      [no_rm]
    );

    return NextResponse.json({ success: true, data: rows });
  } catch (err: any) {
    console.error("🔥 Error GET /api/kunjungan:", err);
    return NextResponse.json(
      { success: false, message: "Gagal ambil data kunjungan", error: err.message },
      { status: 500 }
    );
  }
}
