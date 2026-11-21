"use client";

import { useEffect, useState } from "react";
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

const SECTION_IDS = ["rantai-harga", "peta-sebaran", "harga-wajar"];
const SCROLL_OFFSET = 96;

function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setActive(null);
      return;
    }

    const onScroll = () => {
      let current: string | null = null;
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top - SCROLL_OFFSET <= 0) {
          current = id;
        }
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [enabled]);

  return active;
}

export default function PublicNavbar() {
  const pathname = usePathname();
  const activeSection = useActiveSection(pathname === "/");

  const isLinkActive = (href: string) => {
    const [path, hash] = href.split("#");
    if (hash) return pathname === "/" && activeSection === hash;
    if (href === "/") return pathname === "/" && activeSection === null;
    return pathname === path || pathname.startsWith(`${path}/`);
  };

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
        </div>

        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = isLinkActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
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

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button
            size="sm"
            nativeButton={false}
            className="min-h-9 px-4 text-xs font-semibold cursor-pointer"
            render={<Link href="/masuk" />}
          >
            <LogIn className="w-3.5 h-3.5 mr-1.5" />
            Masuk / Daftar
          </Button>
        </div>
      </nav>
    </header>
  );
}