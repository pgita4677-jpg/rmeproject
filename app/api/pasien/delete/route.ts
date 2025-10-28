import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: Number(process.env.MYSQL_PORT) || 3306,
  ssl: {
    rejectUnauthorized: false, // ✅ penting untuk Railway
  },
});

export async function DELETE(req: Request) {
  let conn;
  try {
    conn = await pool.getConnection();

    const { searchParams } = new URL(req.url);
    const no_rm = searchParams.get("no_rm");

    if (!no_rm) {
      return NextResponse.json(
        { success: false, message: "Nomor RM tidak ditemukan" },
        { status: 400 }
      );
    }

    await conn.beginTransaction();

    await conn.query("DELETE FROM resep WHERE no_rm = ?", [no_rm]);
    await conn.query("DELETE FROM anamnesa WHERE no_rm = ?", [no_rm]);
    await conn.query("DELETE FROM kunjungan WHERE no_rm = ?", [no_rm]);
    await conn.query("DELETE FROM pasien WHERE no_rm = ?", [no_rm]);

    await conn.commit();

    return NextResponse.json({
      success: true,
      message: `🗑️ Data pasien ${no_rm} berhasil dihapus permanen.`,
    });
  } catch (err: any) {
    if (conn) await conn.rollback();
    console.error("❌ Gagal hapus pasien:", err);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus data pasien.", error: err.message },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}
