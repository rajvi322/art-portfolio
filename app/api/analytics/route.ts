import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Visitor from "@/models/Visitor";
import AnalyticsEvent from "@/models/AnalyticsEvent";
import { verifyAdmin } from "@/lib/auth";
import crypto from "crypto";

export const dynamic = "force-dynamic";

function parseUA(userAgent: string) {
  const ua = userAgent.toLowerCase();
  
  // Device
  let device: "Desktop" | "Mobile" | "Tablet" | "Unknown" = "Desktop";
  if (/mobile|android|iphone|ipad|phone/i.test(ua)) {
    device = /ipad|tablet/i.test(ua) ? "Tablet" : "Mobile";
  }
  
  // OS
  let os = "Unknown";
  if (ua.includes("windows")) os = "Windows";
  else if (ua.includes("macintosh") || ua.includes("mac os")) os = "macOS";
  else if (ua.includes("iphone") || ua.includes("ipad")) os = "iOS";
  else if (ua.includes("android")) os = "Android";
  else if (ua.includes("linux")) os = "Linux";

  // Browser
  let browser = "Unknown";
  if (ua.includes("edg/")) browser = "Edge";
  else if (ua.includes("chrome") && !ua.includes("chromium")) browser = "Chrome";
  else if (ua.includes("safari") && !ua.includes("chrome") && !ua.includes("chromium")) browser = "Safari";
  else if (ua.includes("firefox")) browser = "Firefox";
  else if (ua.includes("opera") || ua.includes("opr/")) browser = "Opera";
  
  return { device, os, browser };
}

export async function POST(request: NextRequest) {
  try {
    // 1. Check if caller is an admin
    const adminId = await verifyAdmin();
    if (adminId) {
      // Silently skip tracking admin activity to keep data clean
      return NextResponse.json({ success: true, message: "Admin session excluded from tracking" }, { status: 200 });
    }

    await dbConnect();

    // 2. Parse request details
    const body = await request.json();
    const { type, path, referrer, artworkId, label } = body;

    // Get session ID from cookie or request body
    const sessionId = request.cookies.get("visitor_session_id")?.value || body.sessionId;

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
    }

    // Hash client IP
    const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0] || 
                     request.headers.get("x-real-ip") || 
                     "127.0.0.1";
    const ipHash = crypto.createHash("sha256").update(clientIp).digest("hex");

    // Geolocation from Vercel headers (or local fallback)
    const countryCode = request.headers.get("x-vercel-ip-country") || "Unknown";
    const country = countryCode === "IN" ? "India" : countryCode;
    const city = request.headers.get("x-vercel-ip-city") || "Unknown";

    // User-Agent and referrer details
    const userAgentStr = request.headers.get("user-agent") || "";
    const { device, os, browser } = parseUA(userAgentStr);
    const finalReferrer = referrer || request.headers.get("referer") || "Direct";

    // Clean up referrer string for readable dashboard representation
    let cleanReferrer = "Direct";
    if (finalReferrer && finalReferrer !== "Direct") {
      try {
        const refUrl = new URL(finalReferrer);
        if (refUrl.hostname.includes("google.")) {
          cleanReferrer = "Google";
        } else if (refUrl.hostname.includes("instagram.com")) {
          cleanReferrer = "Instagram";
        } else if (refUrl.hostname.includes("youtube.com") || refUrl.hostname.includes("youtu.be")) {
          cleanReferrer = "YouTube";
        } else if (refUrl.hostname.includes("pinterest.com") || refUrl.hostname.includes("pin.it")) {
          cleanReferrer = "Pinterest";
        } else {
          cleanReferrer = refUrl.hostname.replace("www.", "");
        }
      } catch {
        cleanReferrer = finalReferrer;
      }
    }

    // 3. Upsert Visitor record (only insert if doesn't exist, preserving original fields like referrer/device)
    await Visitor.findOneAndUpdate(
      { sessionId },
      {
        $setOnInsert: {
          sessionId,
          ipHash,
          userAgent: userAgentStr,
          device,
          os,
          browser,
          country,
          city,
          referrer: cleanReferrer,
        }
      },
      { upsert: true, new: true }
    );

    // 4. Save Analytics Event
    const eventData: any = {
      sessionId,
      type,
      path,
      label: label || "",
    };

    if (artworkId) {
      eventData.artwork = artworkId;
    }

    await AnalyticsEvent.create(eventData);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    console.error("Analytics POST error:", error);
    return NextResponse.json({ error: error.message || "Failed to log event" }, { status: 500 });
  }
}
