"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const links = [
    { name: "Gallery", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="w-full bg-primary/80 backdrop-blur-md sticky top-0 z-50 border-b border-neutral/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="text-2xl font-newsreader font-bold text-text-header tracking-tight">
          RS Artelier
        </Link>

        <nav className="flex items-center justify-center flex-1 space-x-10">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-newsreader transition-colors ${isActive
                  ? "text-text-header font-medium"
                  : "text-text-muted hover:text-text-header"
                  }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Toggle Placeholder */}
        {/* <button className="md:hidden text-accent">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button> */}
      </div>
    </header>
  );
}
