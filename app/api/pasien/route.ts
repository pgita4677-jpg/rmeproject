import { NextResponse } from "next/server";
import mysql, { OkPacket } from "mysql2/promise";

// ✅ Gunakan koneksi pool ke Railway
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: Number(process.env.MYSQL_PORT) || 3306,
  ssl: { rejectUnauthorized: true }, // wajib untuk Railway
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ============================================================
// 🔹 POST: Tambah pasien baru
// ============================================================
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

    // 🔸 Validasi data
    if (!no_rm || !nama) {
      return NextResponse.json(
        { success: false, message: "Nomor RM dan Nama wajib diisi" },
        { status: 400 }
      );
    }

    // 🔹 Simpan data pasien baru ke tabel `pasien`
    const [result] = await pool.query<OkPacket>(
      `INSERT INTO pasien 
        (no_rm, nama, tanggal_lahir, usia, jenis_kelamin, no_hp, alamat, nik, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Baru')`,
      [no_rm, nama, tanggal_lahir, usia, jenis_kelamin, no_hp, alamat, nik]
    );

    // 🔹 Catat juga ke tabel `rekam_medis`
    await pool.query<OkPacket>(
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
    console.error("❌ Gagal simpan pasien:", err);
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
