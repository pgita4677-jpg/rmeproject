import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

interface User {
  id: number;
  username: string;
  password: string;
  role?: string;
  clinic_id?: number;
}

export async function getConnection() {
  try {
    if (process.env.DATABASE_URL) {
      return await mysql.createConnection(process.env.DATABASE_URL);
    }

    return await mysql.createConnection({
      host: process.env.MYSQL_HOST || "127.0.0.1",
      user: process.env.MYSQL_USER || "root",
      password: process.env.MYSQL_PASSWORD || "",
      database: process.env.MYSQL_DATABASE || "rme-system",
      port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,
    });
  } catch (err: any) {
    console.error("❌ Gagal konek ke database:", err.message);
    throw err;
  }
}

export async function findUser(username: string, password: string) {
  try {
    const conn = await getConnection();
    const [rows] = await conn.query<any[]>(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    await conn.end();

    if (Array.isArray(rows) && rows.length > 0) {
      const user: User = rows[0];
      const valid = await bcrypt.compare(password, user.password);
      if (valid) return { user };
    }
  } catch (err: any) {
    console.error("❌ DB Error (findUser):", err.message);
  }

  return null;
}
