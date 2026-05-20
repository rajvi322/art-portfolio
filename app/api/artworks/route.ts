import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Artwork from "@/models/Artwork";
import { verifyAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  await dbConnect();
  try {
    const artworks = await Artwork.find({}).sort({ createdAt: -1 });
    return NextResponse.json(artworks);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch artworks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const adminId = await verifyAdmin();
  if (!adminId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  try {
    const body = await request.json();
    const artwork = await Artwork.create(body);
    return NextResponse.json(artwork, { status: 201 });
  } catch (error: any) {
    console.error("Create artwork error:", error);
    return NextResponse.json({ error: error.message || "Failed to create artwork" }, { status: 500 });
  }
}
