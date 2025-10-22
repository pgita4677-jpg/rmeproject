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

// =====================================================
// GET -> ambil 1 data anamnesa berdasarkan id
// =====================================================
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const [anamnesaRows]: any = await pool.query(
      `SELECT * FROM anamnesa WHERE id = ?`,
      [id]
    );

    if (anamnesaRows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Data anamnesa tidak ditemukan" },
        { status: 404 }
      );
    }

    const [resepRows]: any = await pool.query(
      `SELECT * FROM resep WHERE anamnesa_id = ? ORDER BY tanggal DESC`,
      [id]
    );

    const dataGabung = {
      ...anamnesaRows[0],
      resep: resepRows || [],
    };

    return NextResponse.json({ success: true, data: dataGabung });
  } catch (error: any) {
    console.error("🔥 Error GET /api/anamnesa/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Gagal ambil data anamnesa", error: error.message },
      { status: 500 }
    );
  }
}

// =====================================================
// PUT -> update data anamnesa + resep
// =====================================================
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { keluhan, riwayat, tensi, hasil_lab, resep } = body;

    // update anamnesa
    await pool.query(
      `UPDATE anamnesa SET keluhan=?, riwayat=?, tensi=?, hasil_lab=? WHERE id=?`,
      [keluhan, riwayat || "", tensi || "", hasil_lab || "", id]
    );

    // kalau ada resep, hapus dulu resep lama lalu masukkan yang baru
    if (Array.isArray(resep)) {
      await pool.query(`DELETE FROM resep WHERE anamnesa_id = ?`, [id]);

      for (const r of resep) {
        if (r.nama_obat && r.dosis && r.aturan) {
          await pool.query(
            `INSERT INTO resep (no_rm, anamnesa_id, nama_obat, dosis, aturan, tanggal)
             VALUES (?, ?, ?, ?, ?, NOW())`,
            [body.no_rm, id, r.nama_obat, r.dosis, r.aturan]
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "✅ Data anamnesa & resep berhasil diperbarui",
    });
  } catch (error: any) {
    console.error("🔥 Error PUT /api/anamnesa/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Gagal update data", error: error.message },
      { status: 500 }
    );
  }
}

// =====================================================
// DELETE -> hapus anamnesa + semua resep terkait
// =====================================================
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // hapus resep dulu (biar foreign key aman)
    await pool.query(`DELETE FROM resep WHERE anamnesa_id = ?`, [id]);
    await pool.query(`DELETE FROM anamnesa WHERE id = ?`, [id]);

    return NextResponse.json({
      success: true,
      message: "🗑️ Data anamnesa & resep terkait berhasil dihapus",
    });
  } catch (error: any) {
    console.error("🔥 Error DELETE /api/anamnesa/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Gagal hapus data", error: error.message },
      { status: 500 }
    );
  }
}
