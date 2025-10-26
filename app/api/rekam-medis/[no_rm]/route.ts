import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.MYSQL_HOST || "nozomi.proxy.rlwy.net",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "NNStZTjxpLyfuSidoiIWdRRabuCTDEQS",
  database: process.env.MYSQL_DATABASE || "railway",
  port: Number(process.env.MYSQL_PORT) || 55908,
};

const pool = mysql.createPool(dbConfig);

// GET detail rekam medis berdasarkan no_rm
export async function GET(req, { params }) {
  try {
    const { no_rm } = params;

    // 1️⃣ Ambil data pasien
    const [pasienRows]: any = await pool.query(
      `SELECT * FROM pasien WHERE no_rm = ? LIMIT 1`,
      [no_rm]
    );
    if (pasienRows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Data pasien tidak ditemukan" },
        { status: 404 }
      );
    }

    const pasien = pasienRows[0];

    // 2️⃣ Ambil anamnesa terakhir
    const [anamnesaRows]: any = await pool.query(
      `SELECT * FROM anamnesa WHERE no_rm = ? ORDER BY created_at DESC LIMIT 1`,
      [no_rm]
    );

    // 3️⃣ Ambil resep terkait anamnesa terakhir
    const [resepRows]: any = await pool.query(
      `SELECT * FROM resep WHERE no_rm = ? ORDER BY tanggal DESC`,
      [no_rm]
    );

    return NextResponse.json({
      success: true,
      data: {
        pasien,
        anamnesa: anamnesaRows[0] || null,
        resep: resepRows || [],
      },
    });
  } catch (error: any) {
    console.error("🔥 Error GET /api/rekam-medis/[no_rm]:", error);
    return NextResponse.json(
      { success: false, message: "Gagal ambil data", error: error.message },
      { status: 500 }
    );
  }
}
