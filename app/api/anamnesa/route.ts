import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "rme-system",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const pool = mysql.createPool(dbConfig);

// =========================================================
// GET -> ambil semua anamnesa untuk no_rm, lalu gabungkan resep
// =========================================================
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const no_rm = searchParams.get("no_rm");

    if (!no_rm) {
      return NextResponse.json(
        { success: false, message: "⚠️ no_rm wajib dikirim pada query" },
        { status: 400 }
      );
    }

    // ambil anamnesa
    const [anamnesaRows]: any = await pool.query(
      `SELECT * FROM anamnesa WHERE no_rm = ? ORDER BY created_at DESC`,
      [no_rm]
    );

    // ambil resep untuk pasien ini
    const [resepRows]: any = await pool.query(
      `SELECT * FROM resep WHERE no_rm = ? ORDER BY tanggal DESC`,
      [no_rm]
    );

    // gabungkan resep ke masing-masing anamnesa
    const dataGabung = anamnesaRows.map((a: any) => ({
      ...a,
      resep: resepRows.filter((r: any) => r.anamnesa_id === a.id) || [],
    }));

    return NextResponse.json({ success: true, data: dataGabung });
  } catch (error: any) {
    console.error("🔥 Error GET /api/anamnesa:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal ambil data anamnesa",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// =========================================================
// POST -> simpan anamnesa + resep (jika ada)
// =========================================================
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { no_rm, keluhan, riwayat, tensi, hasil_lab, resep } = body;

    if (!no_rm || !keluhan) {
      return NextResponse.json(
        { success: false, message: "⚠️ no_rm dan keluhan wajib diisi" },
        { status: 400 }
      );
    }

    // simpan ke tabel anamnesa
    const [result]: any = await pool.query(
      `INSERT INTO anamnesa (no_rm, keluhan, riwayat, tensi, hasil_lab, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [no_rm, keluhan, riwayat || "", tensi || "", hasil_lab || ""]
    );

    const anamnesa_id = result.insertId;

    // simpan ke tabel resep jika ada datanya
    if (Array.isArray(resep) && resep.length > 0) {
      for (const r of resep) {
        if (r.nama_obat && r.dosis && (r.pemakaian || r.aturan)) {
          await pool.query(
            `INSERT INTO resep (no_rm, anamnesa_id, nama_obat, dosis, aturan, tanggal)
             VALUES (?, ?, ?, ?, ?, NOW())`,
            [no_rm, anamnesa_id, r.nama_obat, r.dosis, r.pemakaian || r.aturan]
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "✅ Data anamnesa dan resep berhasil disimpan",
      insertId: anamnesa_id,
    });
  } catch (error: any) {
    console.error("🔥 Error POST /api/anamnesa:", error);
    return NextResponse.json(
      { success: false, message: "Gagal simpan anamnesa", error: error.message },
      { status: 500 }
    );
  }
}
