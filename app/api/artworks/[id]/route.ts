import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Artwork from "@/models/Artwork";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;
  try {
    const artwork = await Artwork.findById(id);
    if (!artwork) {
      return NextResponse.json({ error: "Artwork not found" }, { status: 404 });
    }
    return NextResponse.json(artwork);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch artwork" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  try {
    const { id } = await params;
    const body = await request.json();
    const artwork = await Artwork.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!artwork) {
      return NextResponse.json({ error: "Artwork not found" }, { status: 404 });
    }

    return NextResponse.json(artwork);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update artwork" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  try {
    const { id } = await params;
    const artwork = await Artwork.findByIdAndDelete(id);

    if (!artwork) {
      return NextResponse.json({ error: "Artwork not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Artwork deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete artwork" }, { status: 500 });
  }
}
