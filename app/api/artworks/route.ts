import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Artwork from "@/models/Artwork";
import { verifyAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const pageParam = searchParams.get("page");

    // If no page parameter is provided, keep backwards compatibility and return all artworks as a flat list
    if (!pageParam) {
      const artworks = await Artwork.find({}).sort({ createdAt: -1 });
      return NextResponse.json(artworks);
    }

    const page = parseInt(pageParam, 10);
    const limit = parseInt(searchParams.get("limit") || "6", 10);
    const category = searchParams.get("category") || "all";

    const query: any = {};
    if (category && category !== "all") {
      query.category = category;
    }

    const skip = (page - 1) * limit;

    const total = await Artwork.countDocuments(query);
    const artworks = await Artwork.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const hasMore = skip + artworks.length < total;

    return NextResponse.json({
      artworks,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore,
    });
  } catch (error) {
    console.error("Failed to fetch artworks:", error);
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
