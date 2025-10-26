import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: Number(process.env.MYSQL_PORT),
});

export async function GET(req, { params }) {
  const { no_rm } = params;
  const [rows]: any = await pool.query(`SELECT * FROM pasien WHERE no_rm = ?`, [no_rm]);
  if (rows.length === 0) {
    return NextResponse.json({ success: false, message: "Pasien tidak ditemukan" }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: rows[0] });
}

export async function PUT(req, { params }) {
  const { no_rm } = params;
  const body = await req.json();
  await pool.query(
    `UPDATE pasien SET nama=?, tanggal_lahir=?, usia=?, jenis_kelamin=?, alamat=?, no_hp=? WHERE no_rm=?`,
    [body.nama, body.tanggal_lahir, body.usia, body.jenis_kelamin, body.alamat, body.no_hp, no_rm]
  );
  return NextResponse.json({ success: true });
}
