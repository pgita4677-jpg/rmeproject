import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import mysql from "mysql2/promise";

// 🔹 POST /api/pasien/select
export async function POST(req: Request) {
  try {
    const db = await connectDB();
    const body = await req.json();

    const {
      no_rm,
      keluhan,
      riwayat,
      tensi,
      hasil_lab,
      resep = [], // array [{ nama_obat, dosis, aturan }]
    } = body;

    // 🔹 Pastikan pasiennya ada
    const [cekPasien]: any = await db.execute("SELECT * FROM pasien WHERE no_rm = ?", [no_rm]);
    if (cekPasien.length === 0) {
      return NextResponse.json({ message: "Pasien tidak ditemukan" }, { status: 404 });
    }

    // 🔹 Tambahkan data kunjungan baru
    const [insertKunjungan]: any = await db.execute(
      `INSERT INTO kunjungan (no_rm, keluhan, riwayat, tensi, hasil_lab, tanggal_kunjungan)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [no_rm, keluhan, riwayat, tensi, hasil_lab]
    );

    const id_kunjungan = insertKunjungan.insertId;

    // 🔹 Tambahkan resep (jika ada)
    if (Array.isArray(resep) && resep.length > 0) {
      for (const r of resep) {
        await db.execute(
          `INSERT INTO resep (id_kunjungan, nama_obat, dosis, aturan)
           VALUES (?, ?, ?, ?)`,
          [id_kunjungan, r.nama_obat, r.dosis, r.aturan]
        );
      }
    }

    return NextResponse.json({
      message: "✅ Kunjungan pasien lama berhasil ditambahkan",
      id_kunjungan,
    });
  } catch (err: any) {
    console.error("🔥 Error di /api/pasien/select:", err);
    return NextResponse.json(
      { message: "Terjadi kesalahan server", error: err.message },
      { status: 500 }
    );
  }
}
