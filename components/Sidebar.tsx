"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
    LayoutDashboard,
    LogOut,
    Palette,
    Mail,
    Settings
} from "lucide-react";

const Sidebar = () => {
    const pathname = usePathname();
    const router = useRouter();

    const menuItems = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Portfolio", href: "/admin/portfolio", icon: Palette },
        { name: "Inquiries", href: "/admin/inquiries", icon: Mail },
        // { name: "Settings", href: "/admin/settings", icon: Settings },
    ];

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/sign-in");
            router.refresh();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <aside className="hidden md:flex w-64 h-screen sticky top-0 bg-primary border-r border-border flex-col">
            <div className="p-8">
                <Link href="/" className="text-xl font-headline font-bold text-accent tracking-tighter">
                    RS Artelier <span className="text-[10px] uppercase tracking-widest text-text-muted ml-1">Admin</span>
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                                ? "text-accent"
                                : "text-text-muted hover:text-accent"
                                }`}
                        >
                            <Icon size={18} className={isActive ? "text-accent" : "text-text-muted group-hover:text-accent"} />
                            <span className="font-label text-sm font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-border">
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full text-text-muted hover:text-error transition-colors font-label text-sm font-medium cursor-pointer"
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;