import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(req: Request, { params }: { params: { no_rm: string } }) {
  try {
    const { no_rm } = params;

    const pool = await mysql.createPool({
      host: "127.0.0.1",
      user: "root",
      password: "",
      database: "rme_system",
    });

    const [pasien]: any = await pool.query("SELECT * FROM pasien WHERE no_rm = ?", [no_rm]);
    const [anamnesa]: any = await pool.query(
      "SELECT * FROM anamnesa WHERE no_rm = ? ORDER BY tanggal DESC",
      [no_rm]
    );

    if (pasien.length === 0)
      return NextResponse.json({ success: false, message: "Data pasien tidak ditemukan" }, { status: 404 });

    return NextResponse.json({
      success: true,
      pasien: pasien[0],
      anamnesa,
    });
  } catch (err: any) {
    console.error("❌ Error ambil data rekam medis:", err);
    return NextResponse.json(
      { success: false, message: "Kesalahan server", error: err.message },
      { status: 500 }
    );
  }
}
