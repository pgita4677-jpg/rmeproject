import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

const DB_URL = process.env.DATABASE_URL || "";

export async function findUser(username: string, password: string) {
  try {
    const connection = await mysql.createConnection(DB_URL);

    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    console.log("🟢 Query result:", rows); // Tambahan log
    await connection.end();

    if ((rows as any[]).length === 0) return null;

    const user: any = (rows as any[])[0];
    const match = await bcrypt.compare(password, user.password);

    console.log("🔍 Password match:", match); // Tambahan log

    if (!match) return null;

    return user;
  } catch (error) {
    console.error("findUser error:", error);
    return null;
  }
}
