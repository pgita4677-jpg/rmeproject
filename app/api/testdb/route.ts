import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: Number(process.env.MYSQL_PORT) || 3306,
    });

    // Ambil data user admin1
    const [rows] = await connection.execute(
      "SELECT username, password FROM users WHERE username = 'admin1'"
    );

    await connection.end();

    if ((rows as any[]).length === 0) {
      return NextResponse.json({ error: "User admin1 tidak ditemukan" });
    }

    const user: any = (rows as any[])[0];
    const hash = user.password;

    // Coba bandingkan password "admin123"
    const match = await bcrypt.compare("admin123", hash);

    return NextResponse.json({
      username: user.username,
      hash,
      testPassword: "admin123",
      match,
    });
  } catch (err: any) {
    console.error("❌ Error testdb:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
