"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { name: "Gallery", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="w-full bg-primary/80 backdrop-blur-md sticky top-0 z-50 border-b border-neutral/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative">
        <Link href="/" className="text-2xl font-newsreader font-bold text-text-header tracking-tight">
          RS Artelier
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center justify-center flex-1 space-x-10">
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

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-text-header p-2 -mr-2"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-primary/95 backdrop-blur-md border-b border-neutral/10 shadow-lg animate-in slide-in-from-top-2 duration-200 z-40">
          <nav className="flex flex-col py-6 px-8 space-y-6">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-xl font-newsreader transition-colors ${isActive
                    ? "text-accent font-medium"
                    : "text-text-muted hover:text-text-header"
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
