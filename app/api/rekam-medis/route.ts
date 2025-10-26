import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

// 🔹 GET /api/rekam-medis
export async function GET() {
  try {
    const db = await connectDB();

    const [rows]: any = await db.query(`
      SELECT 
        p.no_rm,
        p.nama,
        p.tanggal_lahir,
        p.usia,
        p.jenis_kelamin,
        p.alamat,
        p.no_hp,
        (
          SELECT a.keluhan
          FROM anamnesa a
          WHERE a.no_rm = p.no_rm
          ORDER BY a.created_at DESC
          LIMIT 1
        ) AS keluhan,
        (
          SELECT a.created_at
          FROM anamnesa a
          WHERE a.no_rm = p.no_rm
          ORDER BY a.created_at DESC
          LIMIT 1
        ) AS tanggal_terakhir,
        (
          SELECT GROUP_CONCAT(CONCAT(r.nama_obat, ' (', r.dosis, ')') SEPARATOR ', ')
          FROM resep r
          WHERE r.no_rm = p.no_rm
          ORDER BY r.tanggal DESC
          LIMIT 3
        ) AS resep_terakhir
      FROM pasien p
      ORDER BY p.id DESC
    `);

    await db.end();

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (err: any) {
    console.error("❌ Error GET /rekam-medis:", err);
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
