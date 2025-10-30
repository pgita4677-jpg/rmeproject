import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: Number(process.env.MYSQL_PORT),
});

export async function GET() {
  try {
    const [rows]: any = await pool.query(`
      SELECT 
        p.no_rm,
        p.nama,
        a.created_at AS tanggal_kunjungan,
        a.keluhan AS diagnosa
      FROM pasien p
      JOIN anamnesa a ON p.no_rm = a.no_rm
      ORDER BY a.created_at DESC
    `);

    console.log("✅ Data berhasil diambil:", rows);

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (err: any) {
    console.error("❌ ERROR QUERY:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data rekam medis",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
