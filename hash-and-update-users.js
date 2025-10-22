import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

async function hashPasswords() {
  const connection = await mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "rme-system",
  });

  const [users] = await connection.query("SELECT id, password FROM users");

  for (const user of users) {
    // Kalau password belum di-hash (masih pendek)
    if (user.password.length < 20) {
      const hashed = await bcrypt.hash(user.password, 10);
      await connection.query("UPDATE users SET password = ? WHERE id = ?", [
        hashed,
        user.id,
      ]);
      console.log(`✅ Password user ID ${user.id} di-hash`);
    } else {
      console.log(`⏩ User ID ${user.id} sudah hashed, dilewati`);
    }
  }

  await connection.end();
  console.log("Selesai mengupdate semua password!");
}

hashPasswords().catch(console.error);
