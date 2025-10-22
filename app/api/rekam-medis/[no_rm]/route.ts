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
// GET -> ambil data rekam medis berdasarkan no_rm
// =====================================================
export async function GET(req, { params }) {
  try {
    const { no_rm } = params;
    const [rows]: any = await pool.query(
      `SELECT * FROM rekam_medis WHERE no_rm = ?`,
      [no_rm]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Data rekam medis tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    console.error("🔥 Error GET /api/rekam-medis/[no_rm]:", error);
    return NextResponse.json(
      { success: false, message: "Gagal ambil data", error: error.message },
      { status: 500 }
    );
  }
}

// =====================================================
// PUT -> update data rekam medis
// =====================================================
export async function PUT(req, { params }) {
  try {
    const { no_rm } = params;
    const body = await req.json();

    await pool.query(
      `UPDATE rekam_medis SET nama_pasien=?, tanggal=?, diagnosa=? WHERE no_rm=?`,
      [body.nama_pasien, body.tanggal, body.diagnosa, no_rm]
    );

    return NextResponse.json({
      success: true,
      message: "✅ Data rekam medis berhasil diperbarui",
    });
  } catch (error: any) {
    console.error("🔥 Error PUT /api/rekam-medis/[no_rm]:", error);
    return NextResponse.json(
      { success: false, message: "Gagal update data", error: error.message },
      { status: 500 }
    );
  }
}

// =====================================================
// DELETE -> hapus data rekam medis
// =====================================================
export async function DELETE(req, { params }) {
  try {
    const { no_rm } = params;
    await pool.query(`DELETE FROM rekam_medis WHERE no_rm = ?`, [no_rm]);

    return NextResponse.json({
      success: true,
      message: "🗑️ Data rekam medis berhasil dihapus",
    });
  } catch (error: any) {
    console.error("🔥 Error DELETE /api/rekam-medis/[no_rm]:", error);
    return NextResponse.json(
      { success: false, message: "Gagal hapus data", error: error.message },
      { status: 500 }
    );
  }
}
