import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// 🔧 Koneksi ke database (1 user versi)
const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "rme-system",
  port: 3306,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      no_rm,
      nama,
      tanggal_lahir,
      usia,
      jenis_kelamin,
      no_hp,
      alamat,
      nik,
    } = body;

    // 🔹 Validasi data wajib
    if (!no_rm || !nama) {
      return NextResponse.json(
        { success: false, message: "Nomor RM dan Nama wajib diisi" },
        { status: 400 }
      );
    }

    // 🔹 Simpan data pasien
    const [result]: any = await pool.query(
      `INSERT INTO pasien 
        (no_rm, nama, tanggal_lahir, usia, jenis_kelamin, no_hp, alamat, nik) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [no_rm, nama, tanggal_lahir, usia, jenis_kelamin, no_hp, alamat, nik]
    );

    return NextResponse.json({
      success: true,
      message: "✅ Data pasien berhasil disimpan",
      no_rm, // dikirim biar bisa redirect ke anamnesa
      insertedId: result.insertId,
    });
  } catch (err: any) {
    console.error("❌ Gagal simpan pasien:", err.message);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal menyimpan data pasien",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
