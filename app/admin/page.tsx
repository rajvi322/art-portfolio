"use client";

import { useState, useEffect } from "react";
import {
  Palette,
  Eye,
  MousePointer2,
  Clock,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  User,
  Globe,
  Laptop,
  ChevronRight,
  Plus,
  Share2
} from "lucide-react";
import Link from "next/link";
import { AdminHeader } from "@/components/ui/AdminHeader";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: any;
  trend: number | null;
  hexColor: string;
}

const StatCard = ({ title, value, icon: Icon, trend, hexColor }: StatCardProps) => {
  const isPositive = trend !== null && trend >= 0;
  const isNegative = trend !== null && trend < 0;

  return (
    <div className="bg-secondary p-6 rounded-3xl border border-border shadow-sm hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div 
          className="p-3 rounded-2xl group-hover:scale-110 transition-transform duration-500"
          style={{ backgroundColor: `${hexColor}1A`, color: hexColor }}
        >
          <Icon size={20} />
        </div>
        {trend !== null && (
          <span className={`text-[10px] font-label font-bold px-2 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 ${isPositive ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <h3 className="text-text-muted text-[10px] font-label uppercase tracking-widest mb-1">{title}</h3>
      <p className="text-2xl font-headline font-bold text-text-header">{value}</p>
    </div>
  );
};

interface TrafficTrendProps {
  data: { date: string; fullDate: string; views: number; uniqueVisitors: number }[];
}

const DualLineChart = ({ data }: TrafficTrendProps) => {
  const maxVal = Math.max(...data.map((d) => Math.max(d.views, d.uniqueVisitors)), 5);

  const width = 800;
  const height = 250;
  const padding = { top: 20, right: 30, bottom: 40, left: 40 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const getPoints = (key: 'views' | 'uniqueVisitors') => data.map((d, index) => {
    const x = padding.left + (index * innerWidth) / (Math.max(data.length - 1, 1));
    const y = padding.top + innerHeight - (d[key] * innerHeight) / maxVal;
    return { x, y, val: d[key], date: d.date };
  });

  const viewsPoints = getPoints('views');
  const uniquePoints = getPoints('uniqueVisitors');

  const createPath = (points: {x: number, y: number}[]) => 
    points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  
  const createArea = (points: {x: number, y: number}[], path: string) => 
    points.length > 0
      ? `${path} L ${points[points.length - 1].x} ${padding.top + innerHeight} L ${points[0].x} ${padding.top + innerHeight} Z`
      : "";

  const viewsLinePath = createPath(viewsPoints);
  const viewsAreaPath = createArea(viewsPoints, viewsLinePath);
  
  const uniqueLinePath = createPath(uniquePoints);
  const uniqueAreaPath = createArea(uniquePoints, uniqueLinePath);

  const yTicks = [0, maxVal / 2, maxVal];

  return (
    <div className="w-full h-full flex flex-col">
      <div className="relative w-full h-64 mt-4">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="views-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="unique-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {yTicks.map((tick, i) => {
            const y = padding.top + innerHeight - (tick * innerHeight) / maxVal;
            return (
              <g key={`grid-${i}`}>
                <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#f3f4f6" strokeWidth="1" />
                <text x={padding.left - 10} y={y + 4} textAnchor="end" className="text-[10px] font-label fill-text-muted">
                  {Math.round(tick)}
                </text>
              </g>
            );
          })}

          {viewsAreaPath && <path d={viewsAreaPath} fill="url(#views-grad)" className="transition-all duration-700" />}
          {viewsLinePath && <path d={viewsLinePath} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-700" />}

          {uniqueAreaPath && <path d={uniqueAreaPath} fill="url(#unique-grad)" className="transition-all duration-700" />}
          {uniqueLinePath && <path d={uniqueLinePath} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-700" />}

          {viewsPoints.map((p, i) => {
             const showLabel = data.length <= 14 || i % Math.ceil(data.length / 7) === 0 || i === data.length - 1;
             if (!showLabel) return null;
             return (
              <text key={`x-${i}`} x={p.x} y={height - 5} textAnchor="middle" className="text-[10px] font-label fill-text-muted font-medium">
                {p.date}
              </text>
             )
          })}
        </svg>
      </div>
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
          <span className="text-[10px] font-label text-text-muted uppercase tracking-wider">Views</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500"></span>
          <span className="text-[10px] font-label text-text-muted uppercase tracking-wider">Unique Visitors</span>
        </div>
      </div>
    </div>
  );
};

const ArtworkPieChart = ({ data }: { data: any[] }) => {
  // Top 5 for the pie chart
  const displayData = data.slice(0, 5);
  const total = displayData.reduce((acc, curr) => acc + curr.count, 0);
  const grandTotal = data.reduce((acc, curr) => acc + curr.count, 0);

  if (grandTotal === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-text-muted text-xs font-label italic border border-dashed border-neutral/10 rounded-2xl w-full m-8">
        No artwork views recorded yet.
      </div>
    );
  }

  // Pastel palette: rose, peach, yellow, mint, sky
  const colors = ["#fca5a5", "#fdba74", "#fcd34d", "#86efac", "#93c5fd"];
  const radius = 50;
  const circumference = 2 * Math.PI * (radius / 2);
  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col w-full">
      {/* Top section: Pie Chart + Legend */}
      <div className="flex flex-col lg:flex-row items-center gap-8 w-full p-8 border-b border-neutral/10">
        {/* SVG Pie Chart */}
        <div className="relative w-52 h-52 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            <circle cx="50" cy="50" r={radius / 2} fill="transparent" stroke="#f3f4f6" strokeWidth={radius} />
            {displayData.map((item, idx) => {
              const percent = (item.count / total) * 100;
              const segmentLength = (percent / 100) * circumference;
              const strokeOffset = -accumulatedPercent;
              accumulatedPercent += segmentLength;
              const color = colors[idx % colors.length];
              return (
                <circle
                  key={item._id}
                  cx="50"
                  cy="50"
                  r={radius / 2}
                  fill="transparent"
                  stroke={color}
                  strokeWidth={radius}
                  strokeDasharray={`${segmentLength} ${circumference}`}
                  strokeDashoffset={strokeOffset}
                  className="transition-all duration-700 ease-out hover:opacity-80 cursor-pointer"
                >
                  <title>{`${item.title}: ${item.count} views (${percent.toFixed(1)}%)`}</title>
                </circle>
              );
            })}
          </svg>
        </div>

        {/* Top 5 Legend */}
        <div className="flex-1 w-full space-y-2 overflow-y-auto max-h-56 pr-1" style={{ scrollbarWidth: "thin" }}>
          <h4 className="text-text-muted text-[10px] font-label uppercase tracking-widest mb-4">Top 5 Artworks</h4>
          {displayData.map((item, idx) => {
            const color = colors[idx % colors.length];
            const pct = total > 0 ? ((item.count / total) * 100).toFixed(1) : "0.0";
            return (
              <div key={item._id} className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-secondary/20 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                  <div>
                    <p className="text-sm font-headline font-semibold text-text-header leading-tight">{item.title}</p>
                    <p className="text-[10px] font-label text-text-muted uppercase tracking-wider">{item.category}</p>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="text-sm font-headline font-bold text-text-header">{item.count}</p>
                  <p className="text-[10px] font-label text-text-muted font-mono">{pct}%</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* All Artworks scrollable list */}
      <div className="p-6">
        <div className="mb-4">
          <h4 className="text-sm font-headline font-semibold text-text-header">All Artworks</h4>
          <p className="text-[11px] font-label text-text-muted mt-0.5">Complete list of artwork interactions</p>
        </div>
        <div className="overflow-y-auto max-h-72 space-y-1 pr-1" style={{ scrollbarWidth: "thin" }}>
          {data.map((item, idx) => {
            const color = colors[idx % colors.length];
            const pct = grandTotal > 0 ? ((item.count / grandTotal) * 100).toFixed(0) : "0";
            const isTop = idx === 0;
            return (
              <div key={item._id} className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-secondary/20 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-label text-text-muted w-5 text-center font-mono">#{idx + 1}</span>
                  <div>
                    <p className="text-sm font-headline font-semibold text-text-header">{item.title}</p>
                    <p className="text-[10px] font-label text-text-muted uppercase tracking-wider">{item.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {isTop && (
                    <span className="text-[10px] font-label font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase tracking-widest">
                      Top
                    </span>
                  )}
                  <div className="text-right">
                    <p className="text-sm font-headline font-bold text-text-header">{item.count} <span className="text-xs font-label font-normal text-text-muted">views</span></p>
                    <p className="text-[10px] font-label text-text-muted font-mono">{pct}%</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState("30d");
  const [activeTab, setActiveTab] = useState<"artwork" | "visitors" | "social">("artwork");
  
  const [stats, setStats] = useState({
    totalWorks: 0,
    recentWorks: [],
  });
  
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [worksRes, analyticsRes] = await Promise.all([
          fetch("/api/artworks"),
          fetch(`/api/admin/analytics?timeframe=${timeframe}`),
        ]);

        const works = await worksRes.json();
        const analyticsData = await analyticsRes.json();

        setStats({
          totalWorks: works.length,
          recentWorks: works.slice(0, 4),
        });

        if (!analyticsData.error) {
          setAnalytics(analyticsData);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [timeframe]);

  const toggleSession = (sessionId: string) => {
    setExpandedSession(expandedSession === sessionId ? null : sessionId);
  };

  const summary = analytics?.summary || {};
  const trafficTrend = analytics?.trafficTrend || [];
  const artworkViews = analytics?.artworkViews || [];
  const recentVisitors = analytics?.recentVisitors || [];
  const socialClicks = analytics?.socialClicks || [];

  return (
    <div className="w-full h-full space-y-8 flex flex-col animate-in fade-in duration-500 pb-12">
      <AdminHeader
        title="Curator Analytics"
        description="Monitor engagement, visitor behavior, and artwork performance."
        actions={
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-primary border border-border px-4 py-2 rounded-full text-xs font-label uppercase tracking-widest text-text-header hover:bg-secondary transition-colors"
            >
              {timeframe === "7d" ? "Last 7 Days" : timeframe === "30d" ? "Last 30 Days" : "All Time"}
              <ChevronDown size={14} />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-primary border border-border rounded-2xl shadow-lg overflow-hidden z-10">
                <button 
                  onClick={() => { setTimeframe("7d"); setIsDropdownOpen(false); }}
                  className="w-full text-left px-4 py-3 text-xs font-label uppercase tracking-widest hover:bg-secondary text-text-header"
                >
                  Last 7 Days
                </button>
                <button 
                  onClick={() => { setTimeframe("30d"); setIsDropdownOpen(false); }}
                  className="w-full text-left px-4 py-3 text-xs font-label uppercase tracking-widest hover:bg-secondary border-t border-border text-text-header"
                >
                  Last 30 Days
                </button>
                <button 
                  onClick={() => { setTimeframe("all"); setIsDropdownOpen(false); }}
                  className="w-full text-left px-4 py-3 text-xs font-label uppercase tracking-widest hover:bg-secondary border-t border-border text-text-header"
                >
                  All Time
                </button>
              </div>
            )}          </div>
        }
      />

      {isLoading && !analytics ? (
        <div className="w-full space-y-12 animate-pulse">
           <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white h-32 rounded-3xl border border-neutral/10" />
            ))}
          </div>
          <div className="bg-white h-80 rounded-3xl border border-neutral/10" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            <StatCard
              title="Total Views"
              value={summary.totalViews?.value || 0}
              icon={Eye}
              trend={summary.totalViews?.trend}
              hexColor="#10b981"
            />
            <StatCard
              title="Unique Views"
              value={summary.uniqueViews?.value || 0}
              icon={Eye}
              trend={summary.uniqueViews?.trend}
              hexColor="#10b981"
            />
            <StatCard
              title="Unique Visitors"
              value={summary.uniqueVisitors?.value || 0}
              icon={User}
              trend={summary.uniqueVisitors?.trend}
              hexColor="#f59e0b"
            />
            <StatCard
              title="Total Time Spent"
              value={summary.timeSpent?.value || "0h 0m"}
              icon={Clock}
              trend={null}
              hexColor="#3b82f6"
            />
            <StatCard
              title="Interactions"
              value={summary.interactions?.value || 0}
              icon={MousePointer2}
              trend={summary.interactions?.trend}
              hexColor="#6366f1"
            />
          </div>

          <div className="bg-secondary p-6 md:p-8 rounded-3xl border border-border shadow-sm flex flex-col justify-between">
             <h4 className="text-text-muted text-xs font-label uppercase tracking-widest mb-2">Engagement Overview</h4>
             <DualLineChart data={trafficTrend} />
          </div>

          <div className="bg-primary border border-border rounded-3xl overflow-hidden shadow-sm">
            <div className="flex border-b border-border overflow-x-auto">
              <button 
                onClick={() => setActiveTab("artwork")}
                className={`flex-1 min-w-[200px] py-4 text-xs font-label uppercase tracking-widest transition-colors ${activeTab === 'artwork' ? 'bg-secondary/50 text-text-header border-b-2 border-accent' : 'text-text-muted hover:bg-secondary/5'}`}
              >
                Top 5 Artworks
              </button>
              <button 
                onClick={() => setActiveTab("social")}
                className={`flex-1 min-w-[200px] py-4 text-xs font-label uppercase tracking-widest transition-colors ${activeTab === 'social' ? 'bg-secondary/50 text-text-header border-b-2 border-accent' : 'text-text-muted hover:bg-secondary/5'}`}
              >
                Social Clicks
              </button>
              <button 
                onClick={() => setActiveTab("visitors")}
                className={`flex-1 min-w-[200px] py-4 text-xs font-label uppercase tracking-widest transition-colors ${activeTab === 'visitors' ? 'bg-secondary/50 text-text-header border-b-2 border-accent' : 'text-text-muted hover:bg-secondary/5'}`}
              >
                Recent Activity
              </button>
            </div>

            <div className="min-h-[400px]">
              {activeTab === "artwork" ? (
                <ArtworkPieChart data={artworkViews} />
              ) : activeTab === "social" ? (
                <div className="p-8">
                  <div className="mb-6">
                    <h4 className="text-sm font-headline font-semibold text-text-header">Social Link Engagements</h4>
                    <p className="text-[11px] font-label text-text-muted mt-0.5">Individual clicks on outbound social links</p>
                  </div>
                  {socialClicks.length > 0 ? (
                    <div className="overflow-y-auto max-h-80 space-y-3 pr-1" style={{ scrollbarWidth: "thin" }}>
                      {socialClicks.map((item: any) => (
                        <div key={item._id} className="bg-primary p-4 rounded-2xl border border-border shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                               <Share2 size={18} />
                            </div>
                            <div>
                              <p className="text-sm font-headline font-semibold text-text-header capitalize">{item._id}</p>
                              <p className="text-[10px] font-label text-text-muted uppercase tracking-wider">Outbound Link</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-headline font-bold text-text-header">{item.count}</p>
                            <p className="text-[10px] font-label text-text-muted uppercase tracking-wider">Clicks</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-text-muted text-xs font-label italic border border-dashed border-neutral/10 rounded-2xl">
                      No social media clicks recorded yet.
                    </div>
                  )}
                </div>
              ) : (
                <div className="overflow-y-auto max-h-[560px]" style={{ scrollbarWidth: "thin" }}>
                  <div className="divide-y divide-neutral/10">
                  {recentVisitors.length > 0 ? (
                    recentVisitors.map((visitor: any) => {
                      const isExpanded = expandedSession === visitor.sessionId;
                      const hasIdentity = visitor.name || visitor.email;
                      const locationStr =
                        visitor.city !== "Unknown" || visitor.country !== "Unknown"
                          ? `${visitor.city === "Unknown" ? "" : visitor.city + ", "}${visitor.country}`
                          : "Localhost / Unknown";

                      return (
                        <div key={visitor.sessionId} className="block transition-all">
                          <div
                            onClick={() => toggleSession(visitor.sessionId)}
                            className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-secondary/5 transition-colors group"
                          >
                            <div className="flex items-start gap-4">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                  hasIdentity ? "bg-accent text-primary font-semibold" : "bg-secondary text-text-muted"
                                }`}
                              >
                                {hasIdentity ? <User size={16} /> : <Globe size={16} />}
                              </div>

                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className={`font-headline font-semibold text-sm ${hasIdentity ? "text-accent text-base" : "text-text-header"}`}>
                                    {hasIdentity ? `${visitor.name}` : "Anonymous Visitor"}
                                  </p>
                                  {visitor.email && (
                                    <span className="text-[11px] font-mono text-text-muted border border-neutral/15 px-1.5 py-0.5 rounded">
                                      {visitor.email}
                                    </span>
                                  )}
                                  <span className="text-[10px] font-label text-text-muted font-medium bg-secondary px-2 py-0.5 rounded-full uppercase tracking-widest">
                                    {visitor.referrer}
                                  </span>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-label text-text-muted mt-1 flex-wrap">
                                  <span className="flex items-center gap-1">
                                    <Globe size={12} /> {locationStr}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Laptop size={12} /> {visitor.browser} ({visitor.os})
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between md:justify-end gap-6">
                              <div className="flex gap-2 text-[10px] font-label font-bold text-text-muted flex-wrap">
                                {visitor.pageViews > 0 && (
                                  <span className="bg-secondary/80 px-2 py-1 rounded-md">{visitor.pageViews} Page views</span>
                                )}
                                {visitor.artworkViews > 0 && (
                                  <span className="bg-amber-50 text-amber-600 border border-amber-100 px-2 py-1 rounded-md">
                                    {visitor.artworkViews} Gallery opens
                                  </span>
                                )}
                                {visitor.socialClicks > 0 && (
                                  <span className="bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-1 rounded-md">
                                    {visitor.socialClicks} Social clicks
                                  </span>
                                )}
                                {visitor.inquiries > 0 && (
                                  <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-1 rounded-md">
                                    {visitor.inquiries} Form submits
                                  </span>
                                )}
                              </div>

                              <div className="text-text-muted group-hover:text-accent transition-colors flex items-center gap-1">
                                <span className="text-[10px] font-label uppercase tracking-widest hidden sm:inline">Path</span>
                                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                              </div>
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="bg-secondary/5 border-t border-neutral/5 px-8 py-6 animate-in slide-in-from-top-2 duration-200">
                              <h5 className="text-[10px] font-label uppercase tracking-widest text-text-muted mb-4 font-semibold">
                                Detailed Activity Timeline
                              </h5>
                              {visitor.history && visitor.history.length > 0 ? (
                                <div className="relative border-l border-neutral/20 pl-4 ml-2 space-y-4">
                                  {visitor.history.map((event: any, idx: number) => {
                                    let iconColor = "bg-neutral-400";
                                    let eventTitle = "Interaction";
                                    let metaText = event.path;

                                    if (event.type === "page_view") {
                                      iconColor = "bg-accent";
                                      eventTitle = `Visited page ${event.path}`;
                                    } else if (event.type === "artwork_view") {
                                      iconColor = "bg-amber-500";
                                      eventTitle = `Opened artwork lightbox: "${event.label || "Untitled"}"`;
                                      metaText = "Gallery Grid selection";
                                    } else if (event.type === "social_click") {
                                      iconColor = "bg-indigo-500";
                                      eventTitle = `Clicked outbound link to: ${event.label}`;
                                    } else if (event.type === "inquiry") {
                                      iconColor = "bg-emerald-500";
                                      eventTitle = `Submitted form inquiry: "${event.label}"`;
                                      metaText = `Inquiry Route: ${event.path}`;
                                    }

                                    return (
                                      <div key={idx} className="relative flex items-start gap-4 text-xs font-label">
                                        <div className={`absolute -left-[21px] w-2.5 h-2.5 rounded-full ${iconColor} border border-white`} />
                                        <div className="flex-1">
                                          <div className="flex justify-between items-start gap-2 flex-wrap">
                                            <span className="font-semibold text-text-header">{eventTitle}</span>
                                            <span className="text-[10px] text-text-muted font-mono">
                                              {new Date(event.createdAt).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                second: "2-digit",
                                              })}
                                            </span>
                                          </div>
                                          <p className="text-[11px] text-text-muted mt-0.5">{metaText}</p>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <p className="text-xs text-text-muted italic">No timeline entries.</p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-12 text-center text-text-muted text-xs font-label italic">
                      No recent visitor activity recorded yet.
                    </div>
                  )}
                </div>
              </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}