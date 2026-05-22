import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Visitor from "@/models/Visitor";
import AnalyticsEvent from "@/models/AnalyticsEvent";
import Artwork from "@/models/Artwork";
import { verifyAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // 1. Verify admin credentials
    const adminId = await verifyAdmin();
    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    await dbConnect();

    // Parse timeframe
    const { searchParams } = new URL(request.url);
    const timeframeParam = searchParams.get("timeframe") || "all";
    
    let currentStartDate: Date | null = null;
    let previousStartDate: Date | null = null;
    let previousEndDate: Date | null = null;
    
    const now = new Date();
    
    if (timeframeParam === "7d") {
      currentStartDate = new Date();
      currentStartDate.setDate(now.getDate() - 7);
      previousStartDate = new Date(currentStartDate);
      previousStartDate.setDate(currentStartDate.getDate() - 7);
      previousEndDate = currentStartDate;
    } else if (timeframeParam === "30d") {
      currentStartDate = new Date();
      currentStartDate.setDate(now.getDate() - 30);
      previousStartDate = new Date(currentStartDate);
      previousStartDate.setDate(currentStartDate.getDate() - 30);
      previousEndDate = currentStartDate;
    }

    const currentMatch = currentStartDate ? { createdAt: { $gte: currentStartDate } } : {};
    const previousMatch = (previousStartDate && previousEndDate) ? { createdAt: { $gte: previousStartDate, $lt: previousEndDate } } : null;

    // Helper to calculate percentage change
    const calcTrend = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Number((((current - previous) / previous) * 100).toFixed(1));
    };

    // 2. Fetch basic counts
    const [
      totalUniqueVisitorsCurr, totalUniqueVisitorsPrev,
      totalPageViewsCurr, totalPageViewsPrev,
      totalInteractionsCurr, totalInteractionsPrev
    ] = await Promise.all([
      Visitor.countDocuments(currentMatch),
      previousMatch ? Visitor.countDocuments(previousMatch) : Promise.resolve(0),
      AnalyticsEvent.countDocuments({ type: "page_view", ...currentMatch }),
      previousMatch ? AnalyticsEvent.countDocuments({ type: "page_view", ...previousMatch }) : Promise.resolve(0),
      AnalyticsEvent.countDocuments({ type: { $in: ["social_click", "inquiry", "artwork_view"] }, ...currentMatch }),
      previousMatch ? AnalyticsEvent.countDocuments({ type: { $in: ["social_click", "inquiry", "artwork_view"] }, ...previousMatch }) : Promise.resolve(0)
    ]);

    // Unique views calculation (group by sessionId and path for page_view)
    const uniqueViewsAggrCurr = await AnalyticsEvent.aggregate([
      { $match: { type: "page_view", ...currentMatch } },
      { $group: { _id: { sessionId: "$sessionId", path: "$path" } } },
      { $count: "count" }
    ]);
    const uniqueViewsCurr = uniqueViewsAggrCurr.length > 0 ? uniqueViewsAggrCurr[0].count : 0;

    let uniqueViewsPrev = 0;
    if (previousMatch) {
       const uniqueViewsAggrPrev = await AnalyticsEvent.aggregate([
         { $match: { type: "page_view", ...previousMatch } },
         { $group: { _id: { sessionId: "$sessionId", path: "$path" } } },
         { $count: "count" }
       ]);
       uniqueViewsPrev = uniqueViewsAggrPrev.length > 0 ? uniqueViewsAggrPrev[0].count : 0;
    }

    // Time Spent calculation (max 2 mins between interactions)
    const allEventsForTime = await AnalyticsEvent.find(currentMatch)
      .select('sessionId createdAt')
      .sort({ sessionId: 1, createdAt: 1 })
      .lean();

    let totalTimeSpentMs = 0;
    let prevEvent: any = null;

    allEventsForTime.forEach((event: any) => {
      if (prevEvent && prevEvent.sessionId === event.sessionId) {
        const diff = new Date(event.createdAt).getTime() - new Date(prevEvent.createdAt).getTime();
        // If interaction gap is 2 minutes (120,000 ms) or less, add it to total
        if (diff > 0 && diff <= 120000) {
          totalTimeSpentMs += diff;
        }
      }
      prevEvent = event;
    });

    const timeSpentHours = Math.floor(totalTimeSpentMs / (1000 * 60 * 60));
    const timeSpentMinutes = Math.floor((totalTimeSpentMs % (1000 * 60 * 60)) / (1000 * 60));
    const formattedTimeSpent = `${timeSpentHours}h ${timeSpentMinutes}m`;

    // 5. Aggregate Top Artwork Views (Hotspot Distribution)
    const artworkViewsRaw = await AnalyticsEvent.aggregate([
      { $match: { type: "artwork_view", artwork: { $ne: null }, ...currentMatch } },
      { $group: { _id: "$artwork", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    let artworkViewsBreakdown: any[] = [];
    let totalArtworkViews = 0;
    
    if (artworkViewsRaw.length > 0) {
      totalArtworkViews = artworkViewsRaw.reduce((acc, curr) => acc + curr.count, 0);
      const artworkIds = artworkViewsRaw.map((item) => item._id);
      const artworks = await Artwork.find({ _id: { $in: artworkIds } }).lean();
      
      artworkViewsBreakdown = artworkViewsRaw.map((item) => {
        const artwork = artworks.find((a) => a._id.toString() === item._id.toString());
        return {
          _id: item._id,
          count: item.count,
          percentage: totalArtworkViews > 0 ? ((item.count / totalArtworkViews) * 100).toFixed(1) : "0",
          title: artwork ? (artwork as any).title : "Deleted Artwork",
          category: artwork ? (artwork as any).category : "Unknown",
        };
      });
    }

    // 5.b Social Clicks Breakdown
    const socialClicksRaw = await AnalyticsEvent.aggregate([
      { $match: { type: "social_click", ...currentMatch } },
      { $group: { _id: "$label", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // 6. Aggregate Activity Over the selected timeframe (for trend lines)
    let trendDays = 30;
    if (timeframeParam === "7d") trendDays = 7;
    
    const trendStartDate = new Date();
    trendStartDate.setDate(now.getDate() - trendDays);

    const trafficOverTimeRaw = await AnalyticsEvent.aggregate([
      {
        $match: {
          type: "page_view",
          createdAt: { $gte: trendStartDate }
        }
      },
      {
        $group: {
          _id: { 
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            sessionId: "$sessionId"
          },
          views: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: "$_id.date",
          views: { $sum: "$views" },
          uniqueVisitors: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Fill missing dates
    const trafficOverTime = [];
    for (let i = trendDays - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split("T")[0];
      const match = trafficOverTimeRaw.find((t) => t._id === dateString);
      trafficOverTime.push({
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        fullDate: dateString,
        views: match ? match.views : 0,
        uniqueVisitors: match ? match.uniqueVisitors : 0
      });
    }

    // 7. Get Recent Visitor Profiles with Activities
    const recentVisitors = await Visitor.find(currentMatch)
      .sort({ updatedAt: -1 })
      .limit(10)
      .lean();

    let visitorActivityFeed: any[] = [];
    if (recentVisitors.length > 0) {
      const sessionIds = recentVisitors.map((v) => v.sessionId);
      const events = await AnalyticsEvent.find({ sessionId: { $in: sessionIds } })
        .sort({ createdAt: -1 })
        .populate("artwork")
        .lean();

      visitorActivityFeed = recentVisitors.map((visitor) => {
        const visitorEvents = events.filter((e) => e.sessionId === visitor.sessionId);
        
        return {
          sessionId: visitor.sessionId,
          name: (visitor as any).name || "",
          email: (visitor as any).email || "",
          device: (visitor as any).device || "Unknown",
          browser: (visitor as any).browser || "Unknown",
          os: (visitor as any).os || "Unknown",
          country: (visitor as any).country || "Unknown",
          city: (visitor as any).city || "Unknown",
          referrer: (visitor as any).referrer || "Direct",
          firstActive: (visitor as any).createdAt,
          lastActive: visitorEvents[0]?.createdAt || (visitor as any).updatedAt,
          pageViews: visitorEvents.filter((e) => e.type === "page_view").length,
          artworkViews: visitorEvents.filter((e) => e.type === "artwork_view").length,
          socialClicks: visitorEvents.filter((e) => e.type === "social_click").length,
          inquiries: visitorEvents.filter((e) => e.type === "inquiry").length,
          history: visitorEvents.slice(0, 5).map((e) => ({
            type: e.type,
            path: e.path,
            label: e.label,
            artworkTitle: e.artwork ? (e.artwork as any).title : "",
            createdAt: e.createdAt,
          })),
        };
      });
    }

    // Return compiled metrics
    return NextResponse.json({
      summary: {
        totalViews: {
          value: totalPageViewsCurr,
          trend: previousMatch ? calcTrend(totalPageViewsCurr, totalPageViewsPrev) : null
        },
        uniqueViews: {
          value: uniqueViewsCurr,
          trend: previousMatch ? calcTrend(uniqueViewsCurr, uniqueViewsPrev) : null
        },
        uniqueVisitors: {
          value: totalUniqueVisitorsCurr,
          trend: previousMatch ? calcTrend(totalUniqueVisitorsCurr, totalUniqueVisitorsPrev) : null
        },
        timeSpent: {
          value: formattedTimeSpent,
          trend: null
        },
        interactions: {
          value: totalInteractionsCurr,
          trend: previousMatch ? calcTrend(totalInteractionsCurr, totalInteractionsPrev) : null
        }
      },
      artworkViews: artworkViewsBreakdown,
      trafficTrend: trafficOverTime,
      socialClicks: socialClicksRaw,
      recentVisitors: visitorActivityFeed,
    });
  } catch (error: any) {
    console.error("GET Admin Analytics error:", error);
    return NextResponse.json({ error: error.message || "Failed to load admin analytics" }, { status: 500 });
  }
}
