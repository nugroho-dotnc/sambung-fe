import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, Map, TrendingUp, ShieldAlert, ArrowRight } from "lucide-react";

export default function FeatureSection() {
  return (
    <section id="fitur" className="min-h-screen flex flex-col justify-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8 scroll-mt-20">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Instrumen Digital untuk Perdagangan Gabah Modern
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Dari kalkulasi harga wajar sebelum panen hingga peta sebaran spasial nasional, semua dirancang untuk efisiensi dan transparansi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fitur 1: Kalkulator Harga Wajar */}
        <Card className="rounded-3xl border-border/80 bg-card p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs hover:border-primary/40 transition-colors">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <Calculator className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-display font-extrabold text-xl sm:text-2xl text-foreground">
                Simulasi Rentang Harga Wajar Gabah
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Hitung batas bawah dan batas atas operasional gabah (GKP/GKG) secara akurat berdasarkan estimasi rendemen giling, kadar air, dan harga pasar beras produsen.
              </p>
            </div>
          </div>

          <div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 font-semibold text-xs cursor-pointer hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-400 hover:border-emerald-500/40"
              render={<Link href="/kalkulator" />}
            >
              Coba Kalkulator Harga Wajar
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </Card>

        {/* Fitur 2: Peta Sebaran Disparitas Spasial */}
        <Card className="rounded-3xl border-border/80 bg-card p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs hover:border-primary/40 transition-colors">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-700 dark:text-blue-400 flex items-center justify-center">
              <Map className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-display font-extrabold text-xl sm:text-2xl text-foreground">
                Peta Sebaran Disparitas Antarpulau
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Visualisasikan sebaran harga gabah di 34 provinsi dengan indikator deviasi terhadap median nasional untuk mengenali sentra surplus dan wilayah defisit pasokan.
              </p>
            </div>
          </div>

          <div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 font-semibold text-xs cursor-pointer hover:bg-blue-500/10 hover:text-blue-700 dark:hover:text-blue-400 hover:border-blue-500/40"
              render={<Link href="/peta-harga" />}
            >
              Jelajahi Peta Sebaran
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </Card>

        {/* Fitur 3: Papan Rantai Transmisi Harga */}
        <Card className="rounded-3xl border-border/80 bg-card p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs hover:border-primary/40 transition-colors">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-display font-extrabold text-xl sm:text-2xl text-foreground">
                Papan Transmisi Rantai Harga
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Analisis pergerakan marjin harga dari sawah petani, pabrik penggilingan, pedagang grosir, hingga pasar eceran konsumen secara transparan.
              </p>
            </div>
          </div>

          <div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 font-semibold text-xs cursor-pointer hover:bg-amber-500/10 hover:text-amber-700 dark:hover:text-amber-400 hover:border-amber-500/40"
              render={<Link href="/peta-harga" />}
            >
              Buka Papan Rantai Harga
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </Card>

        {/* Fitur 4: Indikator Spektrum Lampu Harga */}
        <Card className="rounded-3xl border-border/80 bg-card p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs hover:border-primary/40 transition-colors">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-display font-extrabold text-xl sm:text-2xl text-foreground">
                Bilah Spektrum Lampu Harga
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Deteksi 4 zona harga (Hijau, Kuning, Oranye, Merah) secara otomatis saat petani membuat tawaran, mencegah penjualan di bawah batas kritis operasional.
              </p>
            </div>
          </div>

          <div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 font-semibold text-xs cursor-pointer hover:bg-primary/10 hover:text-primary"
              render={<Link href="/masuk" />}
            >
              Mulai Buat Tawaran Aman
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}
