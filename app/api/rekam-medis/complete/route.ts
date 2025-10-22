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

export async function POST(req: Request) {
  const body = await req.json();

  // body: { pasien: {...}, anamnesa: {...}, resep: [ {...}, ... ] }
  const pasienBody = body.pasien || {};
  const anamnesaBody = body.anamnesa || {};
  const resepArray = Array.isArray(body.resep) ? body.resep : [];

  let connection: mysql.PoolConnection | null = null;

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // 1) determine no_rm: use provided if present and not empty, else generate new unique
    let no_rm = (pasienBody.no_rm || "").trim();
    if (!no_rm) {
      // generate RM based on timestamp + random (ensure reasonably unique)
      no_rm = "RM" + Date.now();
    }

    // 2) check if pasien with no_rm already exists
    const [checkRows]: any = await connection.query(
      "SELECT id FROM pasien WHERE no_rm = ?",
      [no_rm]
    );

    if ((checkRows || []).length === 0) {
      // insert pasien
      const sqlPasien = `INSERT INTO pasien (no_rm, nama, tanggal_lahir, usia, jenis_kelamin, alamat, no_hp, nik)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      const [pasienResult]: any = await connection.query(sqlPasien, [
        no_rm,
        pasienBody.nama || null,
        pasienBody.tanggal_lahir || null,
        pasienBody.usia || null,
        pasienBody.jenis_kelamin || null,
        pasienBody.alamat || null,
        pasienBody.no_hp || null,
        pasienBody.nik || null,
      ]);
      // optional: pasienInsertId = pasienResult.insertId;
    } else {
      // optional: update pasien if you want - currently we leave existing data as-is
      // if you prefer to update, uncomment below:
      /*
      await connection.query(
        `UPDATE pasien SET nama=?, tanggal_lahir=?, usia=?, jenis_kelamin=?, alamat=?, no_hp=?, nik=? WHERE no_rm=?`,
        [pasienBody.nama, pasienBody.tanggal_lahir, pasienBody.usia, pasienBody.jenis_kelamin, pasienBody.alamat, pasienBody.no_hp, pasienBody.nik, no_rm]
      );
      */
    }

    // 3) insert anamnesa
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

    // 4) insert resep rows (if ada)
    for (const r of resepArray) {
      // only insert when nama_obat provided
      if (!r.nama_obat || !r.nama_obat.toString().trim()) continue;

      await connection.query(
        `INSERT INTO resep (no_rm, nama_pasien, diagnosa, anamnesa_id, nama_obat, dosis, aturan, tanggal)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          no_rm,
          pasienBody.nama || null,
          null, // diagnosa kita set null per request
          anamnesa_id,
          r.nama_obat || null,
          r.dosis || null,
          r.aturan || null,
        ]
      );
    }

    // commit
    await connection.commit();
    connection.release();

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
