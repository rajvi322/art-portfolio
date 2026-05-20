"use client";

import { useState, useEffect } from "react";
import {
  Palette,
  Mail,
  TrendingUp,
  Clock,
  Plus,
  ChevronRight,
  Eye,
  MessageSquare
} from "lucide-react";
import Link from "next/link";
import { AdminHeader } from "@/components/ui/AdminHeader";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: any;
  trend?: string;
  color: string;
}

const StatCard = ({ title, value, icon: Icon, trend, color }: StatCardProps) => (
  <div className="bg-white p-8 rounded-3xl border border-neutral/10 shadow-sm hover:shadow-md transition-all group">
    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 rounded-2xl ${color} bg-opacity-10 text-opacity-100 group-hover:scale-110 transition-transform duration-500`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
      {trend && (
        <span className="text-[10px] font-label font-bold text-success bg-success/10 px-2 py-1 rounded-full uppercase tracking-wider">
          {trend}
        </span>
      )}
    </div>
    <h3 className="text-text-muted text-xs font-label uppercase tracking-widest mb-1">{title}</h3>
    <p className="text-3xl font-headline font-bold text-text-header">{value}</p>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalWorks: 0,
    totalInquiries: 0,
    recentInquiries: [],
    recentWorks: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [worksRes, inquiriesRes] = await Promise.all([
          fetch("/api/artworks"),
          fetch("/api/inquiries")
        ]);
        const works = await worksRes.json();
        const inquiriesData = await inquiriesRes.json();
        
        const inquiriesList = Array.isArray(inquiriesData) ? inquiriesData : (inquiriesData.inquiries || []);
        const totalInquiriesCount = Array.isArray(inquiriesData) ? inquiriesData.length : (inquiriesData.allCount !== undefined ? inquiriesData.allCount : inquiriesList.length);

        setStats({
          totalWorks: works.length,
          totalInquiries: totalInquiriesCount,
          recentInquiries: inquiriesList.slice(0, 3),
          recentWorks: works.slice(0, 4)
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="w-full  h-full space-y-12 flex flex-col animate-in fade-in duration-500">
      {/* Header */}
      <AdminHeader
        title="Curator Dashboard"
        description="Overview of your digital archive and active communications."
        actions={
          <div className="text-right">
            <p className="text-[10px] font-label uppercase tracking-widest text-text-muted mb-1">Current Session</p>
            <p className="text-sm font-headline font-semibold text-text-header">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
        }
      />

      {/* Stats Grid */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard
          title="Total Artworks"
          value={stats.totalWorks}
          icon={Palette}
          trend="+2 this week"
          color="bg-accent"
        />
        <StatCard
          title="Active Inquiries"
          value={stats.totalInquiries}
          icon={MessageSquare}
          trend="New"
          color="bg-blue-500"
        />
        <StatCard
          title="Gallery Views"
          value="1.2k"
          icon={Eye}
          trend="+12%"
          color="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-headline font-bold text-text-header">Recent Additions</h3>
            <Link href="/admin/portfolio" className="text-xs font-label uppercase tracking-widest text-accent hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {stats.recentWorks.map((work: any) => (
              <div key={work._id} className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-neutral/10 bg-secondary/5">
                <img src={work.coverImage} alt={work.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <p className="text-white font-headline text-sm font-semibold">{work.title}</p>
                  <p className="text-white/70 text-[10px] font-label uppercase tracking-widest">{work.category}</p>
                </div>
              </div>
            ))}
            <Link href="/admin/portfolio" className="aspect-[4/3] rounded-2xl border-2 border-dashed border-neutral/20 flex flex-col items-center justify-center gap-2 text-text-muted hover:border-accent hover:text-accent transition-all group">
              <Plus size={24} className="group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-label uppercase tracking-widest">Add Piece</span>
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-headline font-bold text-text-header">Latest Inquiries</h3>
            <Link href="/admin/inquiries" className="text-xs font-label uppercase tracking-widest text-accent hover:underline">Manage Inbox</Link>
          </div>
          <div className="bg-white border border-neutral/10 rounded-3xl overflow-hidden shadow-sm">
            <div className="divide-y divide-neutral/5">
              {stats.recentInquiries.length > 0 ? (
                stats.recentInquiries.map((inquiry: any) => (
                  <Link
                    key={inquiry._id}
                    href="/admin/inquiries"
                    className="block p-6 hover:bg-secondary/5 transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-headline font-semibold text-text-header group-hover:text-accent transition-colors">{inquiry.name}</p>
                      <p className="text-[10px] font-label uppercase tracking-widest text-text-muted">{new Date(inquiry.createdAt).toLocaleDateString()}</p>
                    </div>
                    <p className="text-xs text-text-muted line-clamp-1">{inquiry.subject}</p>
                  </Link>
                ))
              ) : (
                <div className="p-12 text-center text-text-muted text-xs font-label italic">
                  Your inbox is quiet for now.
                </div>
              )}
            </div>
            <Link href="/admin/inquiries" className="block p-4 bg-secondary/5 text-center text-[10px] font-label uppercase tracking-widest text-text-muted hover:text-text-header transition-colors">
              View All Communications
            </Link>
          </div>
        </div>
      </div> */}

      <div className="m-auto flex-1 flex items-center justify-center text-4xl font-headline font-bold">Coming Soon</div>
    </div>
  );
};

export default Dashboard;