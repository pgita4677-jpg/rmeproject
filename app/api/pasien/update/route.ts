import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "rme-system",
  port: 3306,
});

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { no_rm, nama, tanggal_lahir, usia, jenis_kelamin, alamat, no_hp, nik } = body;

    console.log("✏️ PARAMS UPDATE:", no_rm);

    if (!no_rm) {
      return NextResponse.json(
        { success: false, message: "no_rm wajib diisi untuk update" },
        { status: 400 }
      );
    }

    // ✅ Format tanggal_lahir agar sesuai format MySQL (YYYY-MM-DD)
    let tanggalLahirFormatted: string | null = null;
    if (tanggal_lahir) {
      try {
        const tgl = new Date(tanggal_lahir);
        if (!isNaN(tgl.getTime())) {
          // ubah ke string YYYY-MM-DD
          const year = tgl.getFullYear();
          const month = String(tgl.getMonth() + 1).padStart(2, "0");
          const day = String(tgl.getDate()).padStart(2, "0");
          tanggalLahirFormatted = `${year}-${month}-${day}`;
        }
      } catch (err) {
        console.error("❌ Format tanggal error:", err);
      }
    }

    console.log("📅 Tanggal lahir diformat:", tanggalLahirFormatted);

    // ✅ Jalankan query update
    const [result]: any = await pool.query(
      `UPDATE pasien
       SET nama = ?, tanggal_lahir = ?, usia = ?, jenis_kelamin = ?, alamat = ?, no_hp = ?, nik = ?
       WHERE no_rm = ?`,
      [
        nama || null,
        tanggalLahirFormatted || null,
        usia || null,
        jenis_kelamin || null,
        alamat || null,
        no_hp || null,
        nik || null,
        no_rm,
      ]
    );

    console.log("📊 Hasil query update:", result);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: `Pasien dengan no_rm ${no_rm} tidak ditemukan` },
        { status: 404 }
      );
    }

    const [rows]: any = await pool.query("SELECT * FROM pasien WHERE no_rm = ?", [no_rm]);
    const pasien = rows && rows[0] ? rows[0] : null;

    return NextResponse.json({
      success: true,
      message: "✅ Data pasien berhasil diperbarui",
      data: pasien,
    });
  } catch (err: any) {
    console.error("🔥 Error PUT /api/pasien/update:", err);
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui data pasien", error: err.message },
      { status: 500 }
    );
  }
}
