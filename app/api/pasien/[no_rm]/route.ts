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

// ==========================================================
// 🔹 GET: Ambil data pasien berdasarkan no_rm
// ==========================================================
export async function GET(req: Request, context: { params: Promise<{ no_rm: string }> }) {
  const { no_rm } = await context.params; // ✅ perhatikan: harus di-await
  console.log("📋 PARAMS DITERIMA:", no_rm);

  if (!no_rm || no_rm === "undefined" || no_rm.trim() === "") {
    return NextResponse.json(
      { success: false, message: "⚠️ no_rm tidak dikirim dari client" },
      { status: 400 }
    );
  }

  try {
    const db = await mysql.createPool(dbConfig);
    const [rows]: any = await db.query("SELECT * FROM pasien WHERE no_rm = ?", [no_rm]);

    console.log("📊 HASIL QUERY PASIEN:", rows);

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { success: false, message: `❌ Pasien dengan no_rm ${no_rm} tidak ditemukan` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: rows[0],
    });
  } catch (error: any) {
    console.error("🔥 Error ambil data pasien:", error.message);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data pasien", error: error.message },
      { status: 500 }
    );
  }
}

// ==========================================================
// 🔹 PUT: Update data pasien berdasarkan no_rm
// ==========================================================
export async function PUT(req: Request, context: { params: Promise<{ no_rm: string }> }) {
  const { no_rm } = await context.params; // ✅ fix utama: tunggu params
  console.log("✏️ PARAMS UPDATE:", no_rm);

  if (!no_rm || no_rm === "undefined" || no_rm.trim() === "") {
    return NextResponse.json(
      { success: false, message: "⚠️ no_rm tidak dikirim dari client" },
      { status: 400 }
    );
  }

  try {
    const db = await mysql.createPool(dbConfig);
    const body = await req.json();

    const { nama, tanggal_lahir, usia, jenis_kelamin, alamat, no_hp, nik } = body;

    const [result]: any = await db.query(
      `UPDATE pasien 
       SET nama = ?, tanggal_lahir = ?, usia = ?, jenis_kelamin = ?, alamat = ?, no_hp = ?, nik = ?
       WHERE no_rm = ?`,
      [nama, tanggal_lahir, usia, jenis_kelamin, alamat, no_hp, nik, no_rm]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: `❌ Pasien dengan no_rm ${no_rm} tidak ditemukan` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "✅ Data pasien berhasil diperbarui",
    });
  } catch (error: any) {
    console.error("🔥 Error update pasien:", error.message);
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui data pasien", error: error.message },
      { status: 500 }
    );
  }
}
