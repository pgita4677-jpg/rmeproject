import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "rme-system",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 🔹 GET -> ambil resep
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const no_rm = searchParams.get("no_rm");
    const anamnesa_id = searchParams.get("anamnesa_id");

    let query = "SELECT * FROM resep";
    const params: any[] = [];
    const where: string[] = [];

    if (no_rm) {
      where.push("no_rm = ?");
      params.push(no_rm);
    }
    if (anamnesa_id) {
      where.push("anamnesa_id = ?");
      params.push(anamnesa_id);
    }
    if (where.length) {
      query += " WHERE " + where.join(" AND ");
    }
    query += " ORDER BY tanggal DESC";

    const [rows]: any = await pool.query(query, params);
    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    console.error("🔥 Error GET /api/resep:", error);
    return NextResponse.json(
      { success: false, message: "Gagal ambil data resep", error: error.message },
      { status: 500 }
    );
  }
}

// 🔹 POST -> simpan resep (dengan validasi status)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { anamnesa_id, no_rm, nama_pasien, diagnosa, nama_obat, dosis, aturan, status_cocok } = body;

    if (!anamnesa_id || !no_rm || !nama_obat) {
      return NextResponse.json(
        { success: false, message: "anamnesa_id, no_rm, dan nama_obat wajib diisi" },
        { status: 400 }
      );
    }

    // 🔍 Normalisasi status cocok
    let status = (status_cocok || "").toLowerCase().trim();
    if (status.includes("tidak") && status.includes("cocok")) {
      status = "tidak_cocok";
    } else {
      status = "cocok";
    }

    const [result]: any = await pool.query(
      `INSERT INTO resep 
       (no_rm, nama_pasien, diagnosa, anamnesa_id, nama_obat, dosis, aturan, tanggal, status_cocok)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)`,
      [no_rm, nama_pasien || null, diagnosa || null, anamnesa_id, nama_obat, dosis || null, aturan || null, status]
    );

    return NextResponse.json({
      success: true,
      message: "✅ Resep berhasil disimpan",
      insertId: result.insertId,
    });
  } catch (error: any) {
    console.error("🔥 Error POST /api/resep:", error);
    return NextResponse.json(
      { success: false, message: "Gagal simpan resep", error: error.message },
      { status: 500 }
    );
  }
}
