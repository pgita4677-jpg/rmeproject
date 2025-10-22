import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// 🔹 Pool koneksi
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "rme-system",
});

// 🔸 POST → Tambah pasien baru
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { no_rm, nama, tanggal_lahir, usia, jenis_kelamin, alamat, no_hp, nik } = body;

    // ✅ Validasi sederhana
    if (!no_rm || !nama || !jenis_kelamin) {
      return NextResponse.json(
        { success: false, message: "Data tidak lengkap (no_rm, nama, jenis_kelamin wajib diisi)" },
        { status: 400 }
      );
    }

    const sql = `
      INSERT INTO pasien (no_rm, nama, tanggal_lahir, usia, jenis_kelamin, alamat, no_hp, nik)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result]: any = await pool.query(sql, [
      no_rm,
      nama,
      tanggal_lahir,
      usia,
      jenis_kelamin,
      alamat,
      no_hp,
      nik,
    ]);

    return NextResponse.json({
      success: true,
      message: "✅ Data pasien berhasil disimpan",
      id: result.insertId,
    });
  } catch (error: any) {
    console.error("❌ Error API /pasien (POST):", error);
    return NextResponse.json(
      { success: false, message: "Gagal simpan data", error: error.message },
      { status: 500 }
    );
  }
}

// 🔸 GET → Ambil semua pasien atau 1 pasien berdasarkan no_rm
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const no_rm = searchParams.get("no_rm");

    let rows: any[] = [];

    if (no_rm) {
      const [data]: any = await pool.query("SELECT * FROM pasien WHERE no_rm = ?", [no_rm]);
      rows = data;
    } else {
      const [data]: any = await pool.query("SELECT * FROM pasien ORDER BY id DESC");
      rows = data;
    }

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("❌ Error GET /pasien:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data pasien" },
      { status: 500 }
    );
  }
}

// 🔸 PUT → Update data pasien berdasarkan no_rm
export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const no_rm = searchParams.get("no_rm");

    if (!no_rm) {
      return NextResponse.json(
        { success: false, message: "Parameter no_rm wajib disertakan di URL" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { nama, tanggal_lahir, usia, jenis_kelamin, alamat, no_hp, nik } = body;

    const sql = `
      UPDATE pasien 
      SET nama = ?, tanggal_lahir = ?, usia = ?, jenis_kelamin = ?, alamat = ?, no_hp = ?, nik = ?
      WHERE no_rm = ?
    `;
    const [result]: any = await pool.query(sql, [
      nama,
      tanggal_lahir,
      usia,
      jenis_kelamin,
      alamat,
      no_hp,
      nik,
      no_rm,
    ]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Pasien tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "✅ Data pasien berhasil diperbarui",
    });
  } catch (error: any) {
    console.error("❌ Error API /pasien (PUT):", error);
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui data pasien", error: error.message },
      { status: 500 }
    );
  }
}
