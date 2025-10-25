import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

export async function findUser(username: string, password: string) {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: Number(process.env.MYSQL_PORT) || 3306,
    });

    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    console.log("🟢 Query result:", rows);
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
