import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "rs-artelier-secret-key-12345";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);
    if (!decoded || !decoded.id) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    await dbConnect();
    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true, admin });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
