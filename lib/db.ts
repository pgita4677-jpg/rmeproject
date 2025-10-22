import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

// ✅ Konfigurasi database tunggal
const DB_CONFIG = {
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "rme-system",
};

// 🔹 Fungsi koneksi tunggal
export async function getConnection() {
  return await mysql.createConnection(DB_CONFIG);
}

// 🔹 Alias agar file lain tetap bisa pakai connectDB()
export async function connectDB() {
  return await getConnection();
}

// 🔹 Fungsi login user
export async function findUser(username: string, password: string) {
  try {
    const conn = await getConnection();

    const [rows]: any = await conn.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    await conn.end();

    if (rows.length > 0) {
      const user = rows[0];
      const valid = await bcrypt.compare(password, user.password);
      if (valid) return { user };
    }
  } catch (err: any) {
    console.error("❌ Gagal akses database:", err.message);
  }

  return null;
}
