import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";
import { sendInquiryEmail } from "@/lib/mail";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    
    // Pagination parameters
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    // Sorting
    const sort = searchParams.get("sort") === "oldest" ? 1 : -1;

    // Search query
    const search = searchParams.get("search") || "";
    
    // Filters
    const starFilter = searchParams.get("starred"); // "true" or "false"
    const readFilter = searchParams.get("read"); // "true" or "false"
    
    // Date filters
    const startDate = searchParams.get("startDate"); // "YYYY-MM-DD"
    const endDate = searchParams.get("endDate"); // "YYYY-MM-DD"

    // Construct query object
    const query: any = { deletedAt: null };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ];
    }

    if (starFilter === "true") {
      query.isStarred = true;
    } else if (starFilter === "false") {
      query.isStarred = false;
    }

    if (readFilter === "true") {
      query.isRead = true;
    } else if (readFilter === "false") {
      query.isRead = false;
    }

    // Date range filtering
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        query.createdAt.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    // Fetch matching data and total count along with global unread and starred counts
    const [inquiries, total, unreadCount, starredCount, allCount] = await Promise.all([
      Inquiry.find(query)
        .sort({ createdAt: sort })
        .skip(skip)
        .limit(limit),
      Inquiry.countDocuments(query),
      Inquiry.countDocuments({ deletedAt: null, isRead: false }),
      Inquiry.countDocuments({ deletedAt: null, isStarred: true }),
      Inquiry.countDocuments({ deletedAt: null }),
    ]);

    return NextResponse.json({
      inquiries,
      unreadCount,
      starredCount,
      allCount,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error("GET Inquiries API error:", error);
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Field validation
    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!email || !email.trim() || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
    }
    if (!subject || !subject.trim()) {
      return NextResponse.json({ error: "Subject is required" }, { status: 400 });
    }
    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Create record in DB
    const inquiry = await Inquiry.create({
      name,
      email,
      phone: phone || "",
      subject,
      message,
      isRead: false,
      isStarred: false,
      status: "New"
    });

    // Send email using SMTP
    try {
      await sendInquiryEmail({
        name,
        email,
        phone,
        subject,
        message,
      });
    } catch (emailError) {
      // Log email error, but do not block the API success since DB record succeeded
      console.error("SMTP sending failed inside POST route:", emailError);
    }

    return NextResponse.json(inquiry, { status: 201 });
  } catch (error: any) {
    console.error("POST Inquiry error:", error);
    return NextResponse.json({ error: error.message || "Failed to submit inquiry" }, { status: 500 });
  }
}
