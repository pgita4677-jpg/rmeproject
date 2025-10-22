import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

const SECRET = process.env.JWT_SECRET || "my-super-secret"

export function verifyToken() {
  const cookieStore = cookies() // ❌ tanpa await
  const token = cookieStore.get("token")?.value

  if (!token) return null

  try {
    const decoded = jwt.verify(token, SECRET) as any
    return decoded
  } catch {
    return null
  }
}
