import { NextResponse } from "next/server";
import { connectDB } from "lib/db";

export async function GET() {
  try {
    const db = await connectDB();
    const [rows]: any = await db.query(`
      SELECT 
        pasien.no_rm,
        pasien.nama,
        IFNULL(MAX(anamnesa.created_at), pasien.created_at) AS tanggal_terakhir,
        (
          SELECT a.keluhan 
          FROM anamnesa a 
          WHERE a.no_rm = pasien.no_rm 
          ORDER BY a.created_at DESC 
          LIMIT 1
        ) AS diagnosa
      FROM pasien
      LEFT JOIN anamnesa ON pasien.no_rm = anamnesa.no_rm
      GROUP BY pasien.no_rm, pasien.nama, pasien.created_at
      ORDER BY tanggal_terakhir DESC
    `);
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("🔥 Error ambil data rekam medis:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
