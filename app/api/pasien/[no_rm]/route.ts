// app/api/pasien/[no_rm]/route.ts
import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: Number(process.env.MYSQL_PORT) || 3306,
  ssl: { rejectUnauthorized: false }, // ✅ biar koneksi Railway lancar
});

export async function PUT(req: Request, { params }: { params: { no_rm: string } }) {
  const { no_rm } = params;

  try {
    const body = await req.json();
    const { nama, alamat, tanggal_lahir, jenis_kelamin, usia, no_hp, nik } = body;

    const [result]: any = await pool.query(
      `UPDATE pasien 
       SET nama = ?, alamat = ?, tanggal_lahir = ?, jenis_kelamin = ?, usia = ?, no_hp = ?, nik = ?
       WHERE no_rm = ?`,
      [nama, alamat, tanggal_lahir, jenis_kelamin, usia, no_hp, nik, no_rm]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: `Pasien ${no_rm} tidak ditemukan.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "✅ Data pasien berhasil diperbarui.",
    });
  } catch (error: any) {
    console.error("❌ PUT error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui data pasien", error: error.message },
      { status: 500 }
    );
  }
}
