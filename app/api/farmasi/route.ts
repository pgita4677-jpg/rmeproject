import { NextResponse } from "next/server";
import { connectDB } from "lib/db";

export async function GET(req: Request) {
  try {
    const db = await connectDB();
    const { searchParams } = new URL(req.url);
    const dari = searchParams.get("dari");
    const sampai = searchParams.get("sampai");

    let query = `
      SELECT 
        r.no_rm, 
        COALESCE(r.nama_pasien, p.nama) AS nama_pasien,
        r.nama_obat AS obat,
        r.dosis,
        r.aturan,
        r.tanggal
      FROM resep r
      LEFT JOIN pasien p ON r.no_rm = p.no_rm
      WHERE 1=1
    `;

    const params: any[] = [];

    if (dari && sampai) {
      query += " AND DATE(r.tanggal) BETWEEN ? AND ?";
      params.push(dari, sampai);
    }

    query += " ORDER BY r.tanggal DESC";

    const [rows]: any = await db.query(query, params);
    await db.end();

    if (!rows || rows.length === 0) {
      return NextResponse.json({
        success: true,
        message: "Tidak ada data resep.",
        data: [],
      });
    }

    return NextResponse.json({
      success: true,
      message: "Data resep berhasil diambil.",
      data: rows,
    });
  } catch (err: any) {
    console.error("❌ Error farmasi:", err);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
