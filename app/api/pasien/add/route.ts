import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// 🔧 Konfigurasi koneksi ke database Railway
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "nozomi.proxy.rlwy.net",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "NNStZTjxpLyfuSidoiIWdRRabuCTDEQS",
  database: process.env.MYSQL_DATABASE || "railway",
  port: Number(process.env.MYSQL_PORT) || 55908,
  ssl: { rejectUnauthorized: false },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ✅ Endpoint: Tambah data pasien baru
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

    // 🔹 Validasi wajib isi
    if (!no_rm || !nama) {
      return NextResponse.json(
        { success: false, message: "Nomor RM dan Nama wajib diisi" },
        { status: 400 }
      );
    }

    // 🔹 Cek apakah no_rm sudah ada di database
    const [cek]: any = await pool.query(
      "SELECT no_rm FROM pasien WHERE no_rm = ? LIMIT 1",
      [no_rm]
    );

    if (cek.length > 0) {
      return NextResponse.json({
        success: false,
        message: `Pasien dengan No. RM ${no_rm} sudah ada!`,
      });
    }

    // 🔹 Simpan data ke tabel pasien
    const [result]: any = await pool.query(
      `INSERT INTO pasien 
        (no_rm, nama, tanggal_lahir, usia, jenis_kelamin, no_hp, alamat, nik) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [no_rm, nama, tanggal_lahir, usia, jenis_kelamin, no_hp, alamat, nik]
    );

    // 🔹 Tambahkan data awal ke rekam_medis
    await pool.query(
      `INSERT INTO rekam_medis (no_rm, nama, status, tanggal_terakhir)
       VALUES (?, ?, 'Baru', NOW())`,
      [no_rm, nama]
    );

    return NextResponse.json({
      success: true,
      message: "✅ Data pasien baru berhasil disimpan",
      no_rm,
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
