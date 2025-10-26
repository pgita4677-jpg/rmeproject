import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

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

export async function POST(req: Request) {
  const body = await req.json();

  const pasienBody = body.pasien || {};
  const anamnesaBody = body.anamnesa || {};
  const resepArray = Array.isArray(body.resep) ? body.resep : [];

  let connection: mysql.PoolConnection | null = null;

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // 1️⃣ generate no_rm unik kalau belum ada
    let no_rm = (pasienBody.no_rm || "").trim();
    if (!no_rm) {
      no_rm = "RM" + Date.now();
    }

    // 2️⃣ cek apakah pasien sudah ada
    const [checkRows]: any = await connection.query(
      "SELECT id FROM pasien WHERE no_rm = ?",
      [no_rm]
    );

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

    // 3️⃣ insert anamnesa
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

    // 4️⃣ insert resep jika ada
    for (const r of resepArray) {
      if (!r.nama_obat || !r.nama_obat.toString().trim()) continue;

      await connection.query(
        `INSERT INTO resep (no_rm, nama_pasien, diagnosa, anamnesa_id, nama_obat, dosis, aturan, tanggal)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          no_rm,
          pasienBody.nama || null,
          null, // diagnosa kosong untuk sekarang
          anamnesa_id,
          r.nama_obat || null,
          r.dosis || null,
          r.aturan || null,
        ]
      );
    }

    // 5️⃣ commit
    await connection.commit();
    connection.release();

    console.log("✅ Rekam medis tersimpan di Railway:", no_rm);

    return NextResponse.json({
      success: true,
      message: "✅ Rekam medis tersimpan (pasien, anamnesa, resep)",
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
    console.error("🔥 Error simpan rekam medis complete:", err);
    return NextResponse.json(
      { success: false, message: "Gagal menyimpan rekam medis", error: err.message },
      { status: 500 }
    );
  }
}
