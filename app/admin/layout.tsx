import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { Palette, Mail, LayoutDashboard } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-secondary/30">
      {/* Mobile Top Navigation */}
      <header className="md:hidden bg-primary border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="text-lg font-headline font-bold text-accent tracking-tighter">
          ARTÉ <span className="text-[9px] uppercase tracking-widest text-text-muted ml-1">Admin</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/admin" className="p-2 text-text-muted hover:text-accent transition-colors" title="Dashboard">
            <LayoutDashboard size={18} />
          </Link>
          <Link href="/admin/portfolio" className="p-2 text-text-muted hover:text-accent transition-colors" title="Portfolio">
            <Palette size={18} />
          </Link>
          <Link href="/admin/inquiries" className="p-2 text-text-muted hover:text-accent transition-colors" title="Inquiries">
            <Mail size={18} />
          </Link>
        </div>
      </header>

      <Sidebar />
      <main className="flex-1 p-6 md:p-12">
        <div className="max-w-6xl mx-auto h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
