import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

const DB_URL = process.env.DATABASE_URL;

export async function findUser(username, password) {
  try {
    const connection = await mysql.createConnection(DB_URL);

    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    await connection.end();

    if (rows.length === 0) return null;

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) return null;

    return user;
  } catch (error) {
    console.error("findUser error:", error);
    return null;
  }
}
