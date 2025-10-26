import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET() {
  try {
    // ✅ Koneksi ke database Railway dengan variabel env yang benar
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: Number(process.env.MYSQL_PORT) || 3306,
      ssl: { rejectUnauthorized: true },
    });

    // ✅ Query data pasien (ubah kolom sesuai struktur di DB kamu)
    const [rows] = await connection.execute(
      "SELECT no_rm, nama, alamat FROM pasien"
    );

    await connection.end();

    // ✅ Kembalikan hasil
    return NextResponse.json(rows);
  } catch (error) {
    console.error("❌ Gagal mengambil data pasien:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data pasien",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

