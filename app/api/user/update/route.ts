import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

export async function PUT(req: Request) {
  try {
    const { email, nama, passwordLama, passwordBaru } = await req.json();

    const [rows]: any = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "Email tidak ditemukan." });
    }

    const user = rows[0];
    const validPassword = await bcrypt.compare(passwordLama, user.password);

    if (!validPassword) {
      return NextResponse.json({ success: false, message: "Password lama salah." });
    }

    const hashedPassword = await bcrypt.hash(passwordBaru, 10);

    await pool.query(
      "UPDATE users SET nama = ?, password = ? WHERE email = ?",
      [nama, hashedPassword, email]
    );

    return NextResponse.json({ success: true, message: "Akun berhasil diperbarui!" });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan pada server." });
  }
}
