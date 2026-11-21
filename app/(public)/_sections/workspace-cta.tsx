import Link from "next/link";
import { ArrowRight, Sprout, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WorkspaceCtaSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-emerald-500/20 bg-card p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <Sprout className="w-4 h-4" />
            Untuk Petani & Kelompok Tani
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-foreground">
            Jual Hasil Panen dengan Posisi Tawar Kuat
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Ketahui rentang harga wajar sebelum menjual. Gunakan indikator lampu harga spektrum untuk memastikan gabah Anda tidak dihargai terlalu rendah.
          </p>
          <Button
            variant="outline"
            className="min-h-11 border-emerald-600/40 text-emerald-800 dark:text-emerald-400 hover:bg-emerald-500/10 cursor-pointer"
            render={<Link href="/masuk" />}
          >
            Masuk sebagai Petani
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="rounded-3xl border border-amber-500/20 bg-card p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            Untuk Penggilingan & Pembeli
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-foreground">
            Akses Pasokan Gabah Terbuka & Pasti
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Jelajahi tawaran gabah dari kelompok tani di berbagai kecamatan. Lakukan pemesanan parsial dan sepakati komitmen pasokan tanpa perantara spekulan.
          </p>
          <Button
            variant="outline"
            className="min-h-11 border-amber-600/40 text-amber-800 dark:text-amber-400 hover:bg-amber-500/10 cursor-pointer"
            render={<Link href="/masuk" />}
          >
            Masuk sebagai Pembeli
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
