import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// 🔹 Koneksi ke database
const dbConfig = {
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "rme-system",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const pool = mysql.createPool(dbConfig);

// =========================================================
// 🔹 POST -> simpan anamnesa + resep
// =========================================================
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { no_rm, keluhan, riwayat, tensi, hasil_lab, resep } = body;

    if (!no_rm || !keluhan) {
      return NextResponse.json(
        { success: false, message: "⚠️ no_rm dan keluhan wajib diisi" },
        { status: 400 }
      );
    }

    // 🔸 Simpan anamnesa
    const [result]: any = await pool.query(
      `INSERT INTO anamnesa (no_rm, keluhan, riwayat, tensi, hasil_lab, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [no_rm, keluhan, riwayat || "", tensi || "", hasil_lab || ""]
    );

    const anamnesa_id = result.insertId;

    // 🔸 Simpan resep (jika ada)
    if (Array.isArray(resep) && resep.length > 0) {
      for (const r of resep) {
        if (r.nama_obat && r.dosis && r.aturan) {
          await pool.query(
            `INSERT INTO resep (no_rm, anamnesa_id, nama_obat, dosis, aturan, tanggal)
             VALUES (?, ?, ?, ?, ?, NOW())`,
            [no_rm, anamnesa_id, r.nama_obat, r.dosis, r.aturan]
          );
        }
      }
    }

    // 🔸 Kembalikan JSON valid ke frontend
    return NextResponse.json({
      success: true,
      message: "✅ Data anamnesa dan resep berhasil disimpan",
      data: {
        id: anamnesa_id,
        no_rm,
        keluhan,
        riwayat,
        tensi,
        hasil_lab,
        created_at: new Date().toISOString(),
        resep: resep || [],
      },
    });
  } catch (error: any) {
    console.error("🔥 Error POST /api/anamnesa:", error);
    return NextResponse.json(
      { success: false, message: "Gagal simpan anamnesa", error: error.message },
      { status: 500 }
    );
  }
}
