import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

const DB_CONFIG = {
  host: process.env.MYSQL_HOST || "127.0.0.1",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "rme-system",
};

export async function getConnection() {
  return await mysql.createConnection(DB_CONFIG);
}

export const connectDB = getConnection; // ✅ tambahkan ini

export async function findUser(username: string, password: string) {
  try {
    const conn = await getConnection();
    const [rows]: any = await conn.query("SELECT * FROM users WHERE username = ?", [username]);
    await conn.end();

    if (rows.length > 0) {
      const user = rows[0];
      const valid = await bcrypt.compare(password, user.password);
      if (valid) return { user };
    }
  } catch (err: any) {
    console.error("❌ DB Error:", err.message);
  }

  return null;
}
