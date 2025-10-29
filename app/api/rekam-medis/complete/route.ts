import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// ✅ Konfigurasi koneksi database
const dbConfig = {
  host: process.env.MYSQL_HOST || "nozomi.proxy.rlwy.net",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "NNStZTjxpLyfuSidoiIWdRRabuCTDEQS",
  database: process.env.MYSQL_DATABASE || "railway",
  port: Number(process.env.MYSQL_PORT) || 55908,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const pool = mysql.createPool(dbConfig);

// ✅ Fungsi utama API
export async function POST(req: Request) {
  const body = await req.json();

  const pasienBody = body.pasien || {};
  const anamnesaBody = body.anamnesa || {};
  const resepArray = Array.isArray(body.resep) ? body.resep : [];

  let connection: mysql.PoolConnection | null = null;

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // 1️⃣ Generate no_rm unik kalau belum ada
    let no_rm = (pasienBody.no_rm || "").trim();
    if (!no_rm) {
      no_rm = "RM" + Date.now();
    }

    // 2️⃣ Cek apakah pasien sudah ada
    const [checkRows]: any = await connection.query(
      "SELECT id FROM pasien WHERE no_rm = ?",
      [no_rm]
    );

    // 3️⃣ Jika belum ada, buat data pasien baru
    if ((checkRows || []).length === 0) {
      const sqlPasien = `
        INSERT INTO pasien (no_rm, nama, tanggal_lahir, usia, jenis_kelamin, alamat, no_hp, nik)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      await connection.query(sqlPasien, [
        no_rm,
        pasienBody.nama || null,
        pasienBody.tanggal_lahir || null,
        pasienBody.usia || null,
        pasienBody.jenis_kelamin || null,
        pasienBody.alamat || null,
        pasienBody.no_hp || null,
        pasienBody.nik || null,
      ]);
    }

    // 4️⃣ Simpan anamnesa baru
    const [anamnesaResult]: any = await connection.query(
      `INSERT INTO anamnesa (no_rm, keluhan, riwayat, tensi, hasil_lab, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [
        no_rm,
        anamnesaBody.keluhan || "",
        anamnesaBody.riwayat || "",
        anamnesaBody.tensi || "",
        anamnesaBody.hasil_lab || "",
      ]
    );

    const anamnesa_id = anamnesaResult.insertId;

    // 🔒 5️⃣ Cegah duplikasi resep (klik dua kali)
    const [cekResep]: any = await connection.query(
      "SELECT COUNT(*) as total FROM resep WHERE anamnesa_id = ?",
      [anamnesa_id]
    );

    if (cekResep[0].total > 0) {
      console.warn("⚠️ Duplikat terdeteksi, resep sudah pernah disimpan!");
    } else {
      // 6️⃣ Simpan resep (fix logika status_cocok)
      for (const r of resepArray) {
        if (!r.nama_obat || !r.nama_obat.toString().trim()) continue;

        // ✨ Normalisasi dan validasi status
        let status = "cocok"; // default aman
        if (r.status_cocok) {
          const val = r.status_cocok.toString().trim().toLowerCase().replace(" ", "_");
          if (val === "tidak_cocok") status = "tidak_cocok";
        }

        await connection.query(
          `INSERT INTO resep (
              no_rm,
              nama_pasien,
              diagnosa,
              anamnesa_id,
              nama_obat,
              dosis,
              aturan,
              status_cocok,
              tanggal
            )
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
          [
            no_rm,
            pasienBody.nama || null,
            null, // diagnosa masih kosong
            anamnesa_id,
            r.nama_obat || null,
            r.dosis || null,
            r.aturan || null,
            status,
          ]
        );

        console.log(`💊 Simpan obat: ${r.nama_obat} → ${status}`);
      }
    }

    // 7️⃣ Commit transaksi
    await connection.commit();
    connection.release();

    console.log("✅ Rekam medis tersimpan:", no_rm);

    return NextResponse.json({
      success: true,
      message: "✅ Rekam medis (pasien, anamnesa, resep) berhasil disimpan!",
      no_rm,
      anamnesa_id,
    });
  } catch (err: any) {
    if (connection) {
      try {
        await connection.rollback();
        connection.release();
      } catch (e) {
        console.error("Rollback error:", e);
      }
    }
    console.error("🔥 Error simpan rekam medis:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal menyimpan rekam medis",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
