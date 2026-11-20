import Link from "next/link";
import { Sprout } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border/80 bg-card py-8 text-xs text-muted-foreground mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div className="space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <div className="w-5 h-5 rounded-md bg-primary text-primary-foreground flex items-center justify-center text-[10px]">
              <Sprout className="w-3.5 h-3.5" />
            </div>
            <p className="font-bold text-foreground text-sm">
              SAMBUNG
            </p>
          </div>
          <p className="text-[11px] text-muted-foreground max-w-md leading-relaxed">
            Sistem Agrikultur Modern Berbasis Unggulan Nilai Gabah. Mendorong transparansi rantai pasok dan memperkuat posisi tawar petani Indonesia.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
          <Link href="/#rantai-harga" className="hover:text-foreground hover:underline">
            Papan Rantai Harga
          </Link>
          <span>·</span>
          <Link href="/#peta-sebaran" className="hover:text-foreground hover:underline">
            Peta Sebaran Harga
          </Link>
          <span>·</span>
          <Link href="/#harga-wajar" className="hover:text-foreground hover:underline">
            Acuan Harga Wajar
          </Link>
          <span>·</span>
          <Link href="/bantuan" className="hover:text-foreground hover:underline">
            Bantuan & Ketentuan
          </Link>
          <span>·</span>
          <Link href="/admin/masuk" className="hover:text-foreground hover:underline text-muted-foreground/70">
            Akses Pengawas
          </Link>
        </div>
      </div>
    </footer>
  );
}
