"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sprout, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";

const NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/#rantai-harga", label: "Papan Rantai Harga" },
  { href: "/#peta-sebaran", label: "Peta Sebaran" },
  { href: "/#harga-wajar", label: "Acuan Harga Wajar" },
  { href: "/bantuan", label: "Bantuan & Ketentuan" },
];

function NavbarContent() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/95 backdrop-blur-md">
      <nav
        aria-label="Navigasi publik"
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
              <Sprout className="w-5 h-5" />
            </div>
            <span className="font-display font-extrabold text-base tracking-tight text-foreground">
              SAMBUNG
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <Button size="sm" className="min-h-9 px-4 text-xs font-semibold cursor-pointer" render={<Link href="/masuk" />}>
            <LogIn className="w-3.5 h-3.5 mr-1.5" />
            Masuk / Daftar
          </Button>
        </div>
      </nav>
    </header>
  );
}

export default function PublicNavbar() {
  return (
    <Suspense fallback={<header className="h-16 border-b border-border/80 bg-background" />}>
      <NavbarContent />
    </Suspense>
  );
}
