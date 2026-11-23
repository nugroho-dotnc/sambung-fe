import { Card } from "@/components/ui/card";
import { Database, BadgePercent, ShieldCheck, Info } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="tentang" className="min-h-screen flex flex-col justify-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8 scroll-mt-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Title & Description */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
            Tahu Harga Sebelum Menjual, Itu Hak Petani
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Panen yang bagus layak dijual dengan harga yang pantas. SAMBUNG membuka informasi harga gabah (GKP dan GKG) agar Anda punya pegangan, lalu menghubungkan Anda langsung dengan penggilingan untuk bernegosiasi secara setara.
          </p>
        </div>

        {/* Right: Three Cards in 2 rows */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Row 1 - Card 1 */}
          <Card className="rounded-2xl border-border/80 bg-card p-5 sm:p-6 shadow-xs hover:border-primary/40 transition-colors flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-base text-foreground">
                  Harga dengan sumber jelas
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Rentang harga wajar dan proyeksi bersumber dari PIHPS dan BPS, lengkap dengan tanggal pembaruan datanya.
                </p>
              </div>
            </div>
          </Card>

          {/* Row 1 - Card 2 */}
          <Card className="rounded-2xl border-border/80 bg-card p-5 sm:p-6 shadow-xs hover:border-primary/40 transition-colors flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <BadgePercent className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-base text-foreground">
                  Gratis, tanpa komisi
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Cek harga, ajukan penawaran, dan nego langsung tanpa langganan maupun potongan.
                </p>
              </div>
            </div>
          </Card>

          {/* Row 2 - Card 3 (Spans 2 columns) */}
          <Card className="rounded-2xl border-border/80 bg-card p-5 sm:p-6 shadow-xs hover:border-primary/40 transition-colors sm:col-span-2">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-base text-foreground">
                  Nomor Anda aman
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Nomor ponsel tidak dipajang di katalog umum. Baru terbuka setelah kedua pihak sepakat harga.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Disclaimer Text Only (Without Box) */}
      <div className="flex items-start gap-2.5 pt-4 text-xs sm:text-sm text-muted-foreground/80 leading-relaxed border-t border-border/40">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p>
          SAMBUNG mencatat kesepakatan harga dan volume antara petani dan penggilingan. Pembayaran dan pengiriman diatur langsung oleh kedua pihak. Harga wajar dan proyeksi menjadi acuan, bukan harga yang pasti.
        </p>
      </div>
    </section>
  );
}
