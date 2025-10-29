import { NextResponse } from "next/server";
import mysql, { RowDataPacket } from "mysql2/promise";

// ✅ Gunakan pool biar koneksi stabil di Railway
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: Number(process.env.MYSQL_PORT) || 3306,
  ssl: { rejectUnauthorized: false }, // 💖 FIX SSL ERROR UNTUK RAILWAY
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ============================================================
// 🔹 GET: Ambil data pasien + anamnesa + resep berdasarkan no_rm
// ============================================================
export async function GET(
  req: Request,
  { params }: { params: { no_rm: string } }
) {
  const { no_rm } = params;

  if (!no_rm || no_rm === "undefined" || no_rm.trim() === "") {
    return NextResponse.json(
      { success: false, message: "⚠️ Parameter no_rm tidak valid" },
      { status: 400 }
    );
  }

  try {
    const conn = await pool.getConnection();
    console.log("✅ Terhubung ke database Railway!");

    // 🔍 Ambil data pasien
    const [pasienRows] = await conn.query<RowDataPacket[]>(
      "SELECT * FROM pasien WHERE no_rm = ?",
      [no_rm]
    );

    if (!pasienRows || pasienRows.length === 0) {
      conn.release();
      return NextResponse.json(
        {
          success: false,
          message: `❌ Pasien dengan no_rm ${no_rm} tidak ditemukan`,
        },
        { status: 404 }
      );
    }

    const pasien = pasienRows[0];

    // 🩺 Ambil semua anamnesa pasien
    const [anamnesaRows] = await conn.query<RowDataPacket[]>(
      "SELECT * FROM anamnesa WHERE no_rm = ? ORDER BY created_at DESC",
      [no_rm]
    );

    // 💊 Ambil semua resep yang berkaitan dengan anamnesa
    let resepRows: RowDataPacket[] = [];
    if (anamnesaRows.length > 0) {
      const anamnesaIds = anamnesaRows.map((a) => a.id);

      // ✨ Tambahan di sini:
      // Ambil kolom status_cocok agar ditampilkan di frontend
      const [resepData] = await conn.query<RowDataPacket[]>(
        `SELECT id, no_rm, nama_pasien, diagnosa, anamnesa_id,
                nama_obat, dosis, aturan, status_cocok, tanggal
         FROM resep
         WHERE anamnesa_id IN (?)`,
        [anamnesaIds]
      );

      // 🪄 Log tambahan biar kelihatan di terminal
      console.log("📋 Data resep diambil (termasuk status_cocok):", resepData);

      resepRows = resepData;
    }

    conn.release();

    console.log("📦 Data rekam medis berhasil diambil untuk:", no_rm);

    // ✅ Format response untuk frontend
    return NextResponse.json({
      success: true,
      message: "Data rekam medis berhasil diambil",
      data: {
        pasien,
        anamnesa: anamnesaRows,
        resep: resepRows,
      },
    });
  } catch (error: any) {
    console.error("❌ Error fetch rekam medis:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data rekam medis",
        error: error.message || String(error),
      },
      { status: 500 }
    );
  }
}
