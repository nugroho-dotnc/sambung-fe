"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  TrendingUp,
  Scale,
  ShieldCheck,
  Sprout,
  Building2,
  Sparkles,
  MapPin,
  ChevronDown,
  Download,
  AlertCircle,
  TrendingDown,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatRupiah } from "@/features/offers/components/offer-summary";
import { PriceBoardService } from "@/features/price-board/services/price-board.service";
import type { SupplyChainLevel } from "@/features/price-board/domain/price-chain";
import {
  SEED_PROVINCIAL_DATA,
  type ProvincialPriceComparison,
} from "@/features/region-map/domain/map-types";
import { IndonesiaSvgMap } from "@/features/region-map/components/indonesia-svg-map";
import { FairPriceSimulator } from "@/features/fair-price/components/fair-price-simulator";

export default function HomePage() {
  // 1. State for Papan Rantai Harga Section
  const [commodity, setCommodity] = useState("Gabah Kering Panen (GKP)");
  const [region, setRegion] = useState("Jawa Barat");
  const [period, setPeriod] = useState("Pekan Berjalan");

  const comparison = useMemo(() => {
    return PriceBoardService.getSupplyChainComparison(commodity, region, period);
  }, [commodity, region, period]);

  // 2. State for Peta Disparitas Section
  const [selectedProvince, setSelectedProvince] = useState<string>("Jawa Barat");

  const minPriceItem = useMemo(() => {
    return SEED_PROVINCIAL_DATA.reduce(
      (prev, curr) => (curr.price < prev.price ? curr : prev),
      SEED_PROVINCIAL_DATA[0]
    );
  }, []);

  const maxPriceItem = useMemo(() => {
    return SEED_PROVINCIAL_DATA.reduce(
      (prev, curr) => (curr.price > prev.price ? curr : prev),
      SEED_PROVINCIAL_DATA[0]
    );
  }, []);

  const disparityPercent = useMemo(() => {
    if (!minPriceItem || !maxPriceItem || minPriceItem.price === 0) return "0";
    return (((maxPriceItem.price - minPriceItem.price) / minPriceItem.price) * 100).toFixed(1);
  }, [minPriceItem, maxPriceItem]);

  const activeProvinceItem = useMemo(() => {
    return (
      SEED_PROVINCIAL_DATA.find(
        (p) => p.province.toLowerCase() === selectedProvince.toLowerCase()
      ) || SEED_PROVINCIAL_DATA[0]
    );
  }, [selectedProvince]);

  return (
    <div className="w-full space-y-20 py-8 sm:py-16">
      {/* 1. HERO SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <Badge
          variant="outline"
          className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border-primary/20"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Intelijen Pasar & Komitmen Pasokan Gabah Terikat
        </Badge>

        <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground max-w-4xl mx-auto leading-[1.15]">
          Transparansi Nilai Gabah,{" "}
          <span className="text-primary underline decoration-primary/30 decoration-wavy">
            Keadilan bagi Petani
          </span>
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Platform transaksi digital yang mempertemukan Kelompok Tani dengan Pabrik Penggilingan melalui
          acuan rentang harga wajar, lampu indikator harga, dan komitmen pasokan digital bebas komisi.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button
            size="lg"
            className="min-h-12 px-6 text-base font-semibold shadow-md cursor-pointer"
            render={<Link href="/masuk" />}
          >
            Masuk / Mulai Bertransaksi
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="min-h-12 px-6 text-base font-medium cursor-pointer"
            render={<Link href="/#rantai-harga" />}
          >
            Jelajahi Papan Rantai Harga
          </Button>
        </div>
      </section>

      {/* 2. PILAR KEUNGGULAN SAMBUNG */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="rounded-2xl border-border/80 bg-card p-6 space-y-3 shadow-xs hover:border-primary/50 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-foreground font-display">Acuan Rentang Harga Wajar</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Kalkulasi batas bawah dan atas operasional gabah (GKP/GKG) secara transparan berdasarkan rendemen giling dan harga beras produsen.
            </p>
          </Card>

          <Card className="rounded-2xl border-border/80 bg-card p-6 space-y-3 shadow-xs hover:border-primary/50 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-foreground font-display">Kesepakatan Digital Terikat</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Petani dan pembeli menyepakati tonase dan harga secara langsung dalam komitmen digital terikat, dilengkapi bukti cetak resmi dan bebas komisi.
            </p>
          </Card>

          <Card className="rounded-2xl border-border/80 bg-card p-6 space-y-3 shadow-xs hover:border-primary/50 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-700 dark:text-blue-400 flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-foreground font-display">Disparitas Spasial 34 Provinsi</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Pemetaan selisih harga gabah antarpulau dan antarwilayah sentra surplus versus wilayah konsumen secara geospasial real-time.
            </p>
          </Card>
        </div>
      </section>

      {/* 3. SECTION: PAPAN RANTAI HARGA 2 SISI */}
      <section id="rantai-harga" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Transparansi Rantai Pasok
              </span>
              <Badge variant="outline" className="text-xs font-bold">
                Papan Rantai Harga
              </Badge>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-1">
              Transmisi Harga dari Petani hingga Eceran
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Pantau pembagian nilai tambah (*farmer&apos;s share*) dan margin distribusi antar mata rantai gabah dan beras.
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4 sm:p-5 bg-card border border-border/80 rounded-2xl shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Komoditas Acuan
              </label>
              <div className="relative">
                <select
                  value={commodity}
                  onChange={(e) => setCommodity(e.target.value)}
                  className="w-full h-10 appearance-none rounded-xl border border-border/80 bg-background px-3.5 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary pr-9 cursor-pointer shadow-2xs"
                >
                  <option value="Gabah Kering Panen (GKP)">Gabah Kering Panen (GKP)</option>
                  <option value="Gabah Kering Giling (GKG)">Gabah Kering Giling (GKG)</option>
                  <option value="Beras Medium">Beras Medium</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Wilayah Pengamatan
              </label>
              <div className="relative">
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full h-10 appearance-none rounded-xl border border-border/80 bg-background px-3.5 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary pr-9 cursor-pointer shadow-2xs"
                >
                  <option value="Jawa Barat">Jawa Barat (Sentra Utama)</option>
                  <option value="Jawa Tengah">Jawa Tengah</option>
                  <option value="Jawa Timur">Jawa Timur</option>
                  <option value="Sulawesi Selatan">Sulawesi Selatan</option>
                  <option value="Sumatera Utara">Sumatera Utara</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Periode Snapshot
              </label>
              <div className="relative">
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full h-10 appearance-none rounded-xl border border-border/80 bg-background px-3.5 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary pr-9 cursor-pointer shadow-2xs"
                >
                  <option value="Pekan Berjalan">Pekan Berjalan (Terkini)</option>
                  <option value="Rata-rata 30 Hari">Rata-rata 30 Hari</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>
        </Card>

        {/* 2-Side Table & Share Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <Card className="lg:col-span-8 p-0 border border-border/80 bg-card rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-border/80">
              <h3 className="font-display font-bold text-base text-foreground">
                Rincian Transmisi Harga 4 Tingkat di {region}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Nilai acuan pasar per kilogram komoditas ekuivalen beras.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/60 border-b border-border/80">
                  <tr className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    <th className="p-3.5">Tingkat Rantai Pasok</th>
                    <th className="p-3.5 text-right">Harga Acuan</th>
                    <th className="p-3.5 text-right">Margin Penambahan</th>
                    <th className="p-3.5">Catatan Teknis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {comparison.levels.map((item: SupplyChainLevel, index: number) => {
                    const prevPrice = index > 0 ? comparison.levels[index - 1].price : item.price;
                    const diff = item.price - prevPrice;

                    return (
                      <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3.5 font-bold text-foreground">
                          {item.level}
                        </td>
                        <td className="p-3.5 text-right font-mono font-bold text-foreground tabular-nums">
                          {formatRupiah(item.price)}
                          <span className="text-[10px] font-normal text-muted-foreground">/kg</span>
                        </td>
                        <td className="p-3.5 text-right font-mono font-semibold tabular-nums">
                          {diff > 0 ? (
                            <span className="text-amber-700 dark:text-amber-400">
                              +{formatRupiah(diff)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">Dasar</span>
                          )}
                        </td>
                        <td className="p-3.5 text-muted-foreground text-[11px]">
                          {item.note}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="lg:col-span-4 space-y-4">
            <Card className="p-5 rounded-2xl border border-border/80 bg-card shadow-xs space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Bagian Petani (Farmer&apos;s Share)
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold font-mono text-emerald-700 dark:text-emerald-400 tabular-nums font-display">
                  {comparison.farmerSharePercent.toFixed(1)}%
                </span>
                <span className="text-xs text-muted-foreground font-semibold">
                  dari harga eceran
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Dari setiap Rp1.000 yang dibayarkan konsumen di pasar eceran, petani menerima sekitar{" "}
                <strong className="text-foreground font-mono">
                  Rp{Math.round(comparison.farmerSharePercent * 10)}
                </strong>.
              </p>
            </Card>

            <Card className="p-5 rounded-2xl border border-border/80 bg-card shadow-xs space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Total Margin Distribusi
              </span>
              <p className="text-2xl font-black font-mono text-foreground tabular-nums">
                {formatRupiah(comparison.marginAmount)}
                <span className="text-xs font-normal text-muted-foreground">/kg</span>
              </p>
              <p className="text-[11px] text-muted-foreground">
                Mencakup biaya penggilingan, susut bobot, logistik, dan margin pedagang.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. SECTION: PETA SEBARAN DISPARITAS REGIONAL */}
      <section id="peta-sebaran" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Geospasial Indonesia
              </span>
              <Badge variant="outline" className="text-xs font-bold">
                Peta Disparitas
              </Badge>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-1">
              Sebaran Harga Gabah di 34 Provinsi
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Klik provinsi pada peta untuk melihat deviasi harga lokal terhadap median pasar nasional.
            </p>
          </div>
        </div>

        <Card className="p-6 sm:p-7 space-y-6 rounded-2xl border border-border/80 bg-card shadow-xs">
          <IndonesiaSvgMap
            data={SEED_PROVINCIAL_DATA}
            selectedProvince={selectedProvince}
            onSelectProvince={(prov) => setSelectedProvince(prov)}
          />

          {/* 3 Summary Metrics */}
          <div className="pt-4 border-t border-border/80 grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-4 rounded-xl bg-muted/40 border border-border/80 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                <TrendingDown className="w-4 h-4" />
                <p className="text-[11px] font-bold uppercase tracking-wider">
                  Harga Terendah (Sentra Surplus)
                </p>
              </div>
              <p className="text-sm font-bold text-foreground">
                {minPriceItem.province}
              </p>
              <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400 font-display tabular-nums font-mono">
                {formatRupiah(minPriceItem.price)}
                <span className="text-xs font-normal text-muted-foreground">/kg</span>
              </p>
              <p className="text-[11px] text-muted-foreground">
                Deviasi: {minPriceItem.percentageDiff.toFixed(1)}% di bawah median
              </p>
            </div>

            <div className="p-4 rounded-xl bg-muted/40 border border-border/80 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
                <TrendingUp className="w-4 h-4" />
                <p className="text-[11px] font-bold uppercase tracking-wider">
                  Harga Tertinggi (Wilayah Konsumen)
                </p>
              </div>
              <p className="text-sm font-bold text-foreground">
                {maxPriceItem.province}
              </p>
              <p className="text-2xl font-black text-amber-700 dark:text-amber-400 font-display tabular-nums font-mono">
                {formatRupiah(maxPriceItem.price)}
                <span className="text-xs font-normal text-muted-foreground">/kg</span>
              </p>
              <p className="text-[11px] text-muted-foreground">
                Deviasi: +{maxPriceItem.percentageDiff.toFixed(1)}% di atas median
              </p>
            </div>

            <div className="p-4 rounded-xl bg-muted/40 border border-border/80 space-y-1">
              <div className="flex items-center gap-1.5 text-foreground">
                <Scale className="w-4 h-4 text-primary" />
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Rentang Disparitas Nasional
                </p>
              </div>
              <p className="text-sm font-bold text-foreground">
                Selisih Wilayah Antarpulau
              </p>
              <p className="text-2xl font-black text-foreground font-display tabular-nums font-mono">
                {disparityPercent}%
              </p>
              <p className="text-[11px] text-muted-foreground">
                Dipengaruhi jarak angkut & anomali iklim
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* 5. SECTION: KALKULATOR ACUAN HARGA WAJAR */}
      <section id="harga-wajar" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Kalkulator Transparan
              </span>
              <Badge variant="outline" className="text-xs font-bold">
                Acuan Harga Wajar
              </Badge>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-1">
              Simulasi Hitung Batas Bawah & Batas Atas Gabah
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Eksplorasi batas kewajaran harga jual gabah berdasarkan rendemen konversi giling dan kadar air panen.
            </p>
          </div>
        </div>

        <FairPriceSimulator />
      </section>

      {/* 6. BANNER DUA RUANG KERJA (ACTION CTA) */}
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
    </div>
  );
}
