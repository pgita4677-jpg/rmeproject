import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: Number(process.env.MYSQL_PORT),
  ssl: { rejectUnauthorized: false },
});

export async function PUT(req: Request) {
  try {
    const { id, nama, email, passwordLama, passwordBaru } = await req.json();

    const [rows]: any = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "User tidak ditemukan." });
    }

    const user = rows[0];

    // Cek password lama
    if (passwordLama && !(await bcrypt.compare(passwordLama, user.password))) {
      return NextResponse.json({ success: false, message: "Password lama salah." });
    }

    // Update data
    let query = "UPDATE users SET ";
    const values: any[] = [];

    if (nama) {
      query += "username = ?";
      values.push(nama);
    }

    if (email) {
      if (values.length > 0) query += ", ";
      query += "email = ?";
      values.push(email);
    }

    if (passwordBaru) {
      const hashed = await bcrypt.hash(passwordBaru, 10);
      if (values.length > 0) query += ", ";
      query += "password = ?";
      values.push(hashed);
    }

    query += " WHERE id = ?";
    values.push(id);

    await pool.query(query, values);

    return NextResponse.json({ success: true, message: "Data berhasil diperbarui." });
  } catch (error: any) {
    console.error("Error update user:", error);
    return NextResponse.json({ success: false, message: "Gagal memperbarui data." });
  }
}
