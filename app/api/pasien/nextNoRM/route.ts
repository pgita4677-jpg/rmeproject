import { NextResponse } from "next/server";
import { connectDB } from "lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { no_rm, nama, nik, tanggal_lahir, usia, alamat } = body;

    if (!no_rm || !nama || !tanggal_lahir || !alamat) {
      return NextResponse.json(
        { error: "Data pasien tidak lengkap" },
        { status: 400 }
      );
    }

    const db = await connectDB();

    const query = `
      INSERT INTO pasien (no_rm, nama, nik, tanggal_lahir, usia, alamat, created_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    const [result]: any = await db.execute(query, [
      no_rm,
      nama,
      nik,
      tanggal_lahir,
      usia,
      alamat,
    ]);

    return NextResponse.json(
      { message: "Pasien berhasil disimpan", insertId: result.insertId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Gagal menyimpan pasien:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan pasien ke database" },
      { status: 500 }
    );
  }
}

// --- Ambil semua pasien (opsional) ---
export async function GET() {
  try {
    const db = await connectDB();
    const [rows]: any = await db.query("SELECT * FROM pasien ORDER BY created_at DESC");
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Gagal mengambil data pasien:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data pasien" },
      { status: 500 }
    );
  }
}
