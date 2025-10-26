import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

// 🔹 Fungsi untuk mencari user (login)
export async function findUser(username: string, password: string) {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || "nozomi.proxy.rlwy.net",
      user: process.env.MYSQL_USER || "root",
      password: process.env.MYSQL_PASSWORD || "NNStZTjxpLyfuSidoiIWdRRabuCTDEQS",
      database: process.env.MYSQL_DATABASE || "railway",
      port: Number(process.env.MYSQL_PORT) || 55908,
    });

    console.log("🟢 Query user from:", process.env.MYSQL_HOST);
    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    await connection.end();

    if ((rows as any[]).length === 0) return null;

    const user: any = (rows as any[])[0];
    const match = await bcrypt.compare(password, user.password);

    console.log("🔍 Password match:", match);

    if (!match) return null;

    return user;
  } catch (error) {
    console.error("findUser error:", error);
    return null;
  }
}

// 🔹 Fungsi tambahan untuk koneksi database umum (dipakai di API lain)
export async function connectDB() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || "nozomi.proxy.rlwy.net",
      user: process.env.MYSQL_USER || "root",
      password: process.env.MYSQL_PASSWORD || "NNStZTjxpLyfuSidoiIWdRRabuCTDEQS",
      database: process.env.MYSQL_DATABASE || "railway",
      port: Number(process.env.MYSQL_PORT) || 55908,
    });

    console.log("✅ MySQL connected (connectDB)");
    return connection;
  } catch (error) {
    console.error("❌ MySQL connection failed (connectDB):", error);
    throw error;
  }
}
