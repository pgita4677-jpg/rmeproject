import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db"; // ✅ gunakan koneksi dari lib/db.ts

// ======================================================
// ✅ GET /api/anamnesa/[id]
// ======================================================
export async function GET(req, context) {
  const { id } = await context.params;
  const conn = await connectDB(); // pakai koneksi tunggal

  try {
    const [rows]: any = await conn.query(
      `
      SELECT 
        a.*, 
        p.nama AS nama_pasien, p.no_rm, p.tanggal_lahir, p.jenis_kelamin,
        r.id AS resep_id, r.nama_obat, r.dosis, r.aturan, 
        r.status_cocok, r.kecocokan
      FROM anamnesa a
      JOIN pasien p ON a.no_rm = p.no_rm
      LEFT JOIN resep r ON r.anamnesa_id = a.id
      WHERE a.id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "Data tidak ditemukan" }, { status: 404 });
    }

    const data = {
      id: rows[0].id,
      no_rm: rows[0].no_rm,
      nama_pasien: rows[0].nama_pasien,
      keluhan: rows[0].keluhan,
      riwayat: rows[0].riwayat,
      resep: rows
        .filter((r: any) => r.resep_id)
        .map((r: any) => ({
          id: r.resep_id,
          nama_obat: r.nama_obat,
          dosis: r.dosis,
          aturan: r.aturan,
          status_cocok: r.status_cocok,
          kecocokan: r.kecocokan,
        })),
    };

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("🔥 Error GET anamnesa:", err);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data", error: err.message },
      { status: 500 }
    );
  } finally {
    await conn.end(); // pastikan koneksi ditutup
  }
}

// ======================================================
// ✅ PUT /api/anamnesa/[id]
// ======================================================
export async function PUT(req, context) {
  const { id } = await context.params;
  const conn = await connectDB();

  try {
    const body = await req.json();
    const { keluhan, riwayat, resep } = body;

    await conn.query("UPDATE anamnesa SET keluhan = ?, riwayat = ? WHERE id = ?", [keluhan, riwayat, id]);
    await conn.query("DELETE FROM resep WHERE anamnesa_id = ?", [id]);

    if (resep && resep.length > 0) {
      const values = resep.map((r: any) => [
        id,
        r.nama_obat,
        r.dosis,
        r.aturan || "",
        r.status_cocok || "cocok",
        r.kecocokan || "cocok",
      ]);
      await conn.query(
        "INSERT INTO resep (anamnesa_id, nama_obat, dosis, aturan, status_cocok, kecocokan) VALUES ?",
        [values]
      );
    }

    return NextResponse.json({ success: true, message: "Data anamnesa berhasil diperbarui" });
  } catch (err: any) {
    console.error("🔥 Error PUT anamnesa:", err);
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui data", error: err.message },
      { status: 500 }
    );
  } finally {
    await conn.end();
  }
}

// ======================================================
// ✅ DELETE /api/anamnesa/[id]
// ======================================================
export async function DELETE(req, context) {
  const { id } = await context.params;
  const conn = await connectDB();

  try {
    console.log("🧾 Menghapus kunjungan dengan ID:", id);

    await conn.query("DELETE FROM resep WHERE anamnesa_id = ?", [id]);
    const [delAnamnesa]: any = await conn.query("DELETE FROM anamnesa WHERE id = ?", [id]);

    if (delAnamnesa.affectedRows === 0) {
      return NextResponse.json({ success: false, message: "Data tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Kunjungan berhasil dihapus" });
  } catch (err: any) {
    console.error("🔥 ERROR DELETE anamnesa:", err);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus kunjungan", error: err.message },
      { status: 500 }
    );
  } finally {
    await conn.end();
  }
}
