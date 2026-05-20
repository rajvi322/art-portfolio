import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "rs-artelier-secret-key-12345";

export async function verifyAdmin() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return null;
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);
    if (!decoded || !decoded.id) {
      return null;
    }

    return decoded.id;
  } catch (error) {
    return null;
  }
}
