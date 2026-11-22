"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Download,
  Percent,
  Sprout,
  Building2,
  Truck,
  Store,
  ChevronDown,
  Info,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Scale,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { PriceBoardService } from "@/features/price-board/services/price-board.service";
import {
  generateSupplyChainCsv,
  SupplyChainLevel,
} from "@/features/price-board/domain/price-chain";
import { PriceChainChart } from "@/features/price-board/components/price-chain-chart";
import { formatRupiah } from "@/features/offers/components/offer-summary";

const LEVEL_ICONS: Record<string, typeof Sprout> = {
  petani: Sprout,
  penggilingan: Building2,
  grosir: Truck,
  konsumen: Store,
};

export default function PriceBoardPage() {
  const [commodity, setCommodity] = useState<string>("Beras Medium I");
  const [region, setRegion] = useState<string>("Jawa Barat");
  const [period, setPeriod] = useState<string>("12 Pekan Terakhir");

  const comparison = useMemo(() => {
    return PriceBoardService.getSupplyChainComparison(commodity, region, period);
  }, [commodity, region, period]);

  const trends = useMemo(() => {
    return PriceBoardService.getHistoricalTrends(region);
  }, [region]);

  function handleExportCsv() {
    const csvContent = generateSupplyChainCsv(comparison);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `SAMBUNG_Papan_Rantai_Harga_${commodity.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <PageContainer>
      <PageHeader
        title="Papan Rantai Harga 2 Sisi"
        description="Ikuti pembentukan nilai komoditas dari petani gabah hingga pasar konsumen eceran. Bandingkan margin distribusi secara transparan."
        actions={
          <Button
            variant="outline"
            className="min-h-10 text-xs font-semibold gap-1.5 shadow-2xs"
            onClick={handleExportCsv}
          >
            <Download className="w-3.5 h-3.5 text-primary" />
            Unduh Ringkasan (CSV)
          </Button>
        }
      />

      {/* Filter Bar (3 Columns) */}
      <Card className="p-4 sm:p-5 bg-card border border-border/80 rounded-2xl shadow-xs mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
              Komoditas Acuan
            </label>
            <select
              value={commodity}
              onChange={(e) => setCommodity(e.target.value)}
              className="w-full h-11 rounded-xl border border-input bg-background px-3 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-2xs cursor-pointer"
            >
              <option value="Beras Medium I">Beras Medium I (Standar)</option>
              <option value="Beras Premium">Beras Premium</option>
              <option value="Gabah Kering Panen (GKP)">Gabah Kering Panen (GKP)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
              Wilayah Pembanding
            </label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full h-11 rounded-xl border border-input bg-background px-3 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-2xs cursor-pointer"
            >
              <option value="Jawa Barat">Provinsi Jawa Barat (Subang/Karawang)</option>
              <option value="Jawa Tengah">Provinsi Jawa Tengah</option>
              <option value="Jawa Timur">Provinsi Jawa Timur</option>
              <option value="Nasional">Rata-rata Nasional (Bapanas)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
              Rentang Pengamatan
            </label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full h-11 rounded-xl border border-input bg-background px-3 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-2xs cursor-pointer"
            >
              <option value="12 Pekan Terakhir">12 Pekan Terakhir</option>
              <option value="8 Pekan Terakhir">8 Pekan Terakhir</option>
              <option value="4 Pekan Terakhir">4 Pekan Terakhir</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-8">
        {/* Left Column: Dari Petani ke Pembeli */}
        <Card className="lg:col-span-7 p-6 sm:p-7 space-y-5 rounded-2xl border border-border/80 bg-card shadow-xs">
          <div className="border-b border-border/60 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Struktur Rantai Pasok Gabah & Beras
            </span>
            <h2 className="text-lg font-bold text-foreground mt-0.5">
              Dari Petani hingga Konsumen Akhir
            </h2>
            <p className="text-xs text-muted-foreground">
              Harga per kilogram ekuivalen beras medium di wilayah {region}.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border/80">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/60 border-b border-border/80 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="py-3 px-4">Tingkat Rantai</th>
                  <th className="py-3 px-4">Keterangan Biaya</th>
                  <th className="py-3 px-4 text-right">Harga Acuan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {comparison.levels.map((item) => {
                  const Icon = LEVEL_ICONS[item.category] || Sprout;
                  return (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-foreground">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="block font-bold">{item.level}</span>
                            <span className="text-xs text-muted-foreground font-normal sm:hidden">
                              {item.note}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground text-xs hidden sm:table-cell">
                        {item.note}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold tabular-nums text-foreground">
                        {formatRupiah(item.price)} / kg
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Right Column: Indikator Farmer's Share */}
        <Card className="lg:col-span-5 p-6 sm:p-7 space-y-5 rounded-2xl border border-border/80 bg-card shadow-xs">
          <div className="border-b border-border/60 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Indikator Keadilan Distribusi
            </span>
            <h2 className="text-lg font-bold text-foreground mt-0.5">
              Transparansi Nilai & Farmer&apos;s Share
            </h2>
          </div>

          {/* Farmer's Share Percentage Box */}
          <div className="p-4 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                Bagian Petani (Farmer&apos;s Share)
              </p>
              <p className="text-2xl font-extrabold tabular-nums text-emerald-700 dark:text-emerald-400">
                {comparison.farmerSharePercent}%
              </p>
            </div>
          </div>

          {/* Total Margin Spread */}
          <div className="space-y-1.5 p-4 rounded-xl bg-muted/40 border border-border/60">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Selisih (Petani → Konsumen)
            </p>
            <p className="text-2xl sm:text-3xl font-bold tabular-nums text-foreground">
              {formatRupiah(comparison.marginAmount)}{" "}
              <span className="text-xs font-normal text-muted-foreground font-sans">/ kg</span>
            </p>
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              +{comparison.marginPercent}% marjin kumulatif rantai pasok
            </p>
          </div>

          <div className="pt-2 border-t border-border/60 space-y-2 text-xs text-muted-foreground leading-relaxed">
            <p>
              Selisih nilai sebesar {formatRupiah(comparison.marginAmount)}/kg mencakup biaya pengeringan padi, penggilingan, susut mutu alami, transportasi antarkabupaten, dan kemasan ritel.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground" title="Formula rasio: (Harga Petani ÷ Harga Konsumen) × 100%">
              <Info className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>Persentase dihitung dari perbandingan harga gabah di sawah terhadap harga beras di pasar eceran.</span>
            </div>
          </div>
        </Card>
      </div>

      {/* 12-Week Price Transmission Trend Chart */}
      <Card className="p-6 sm:p-7 space-y-4 rounded-2xl border border-border/80 bg-card shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Pergerakan Harga Rantai Pasok ({period})
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Transmisi pergerakan harga dari tingkat petani, penggilingan padi, hingga pasar konsumen di {region}.
            </p>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground tabular-nums self-start sm:self-auto font-semibold">
            Satuan: Rp/kg
          </span>
        </div>

        <PriceChainChart data={trends} />
      </Card>

      {/* Jembatan Aksi: Hubungkan Rantai Pasok ke Simulasi & Jual */}
      <Card className="p-6 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-500/30 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 block">
              Rekomendasi Tindakan
            </span>
            <h4 className="text-base font-bold text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              Ingin Mengetahui Harga Bersih yang Adil untuk Gabah Anda?
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
              Gunakan kalkulator harga wajar untuk menghitung nilai gabah Anda berdasarkan kadar air dan rendemen riil sebelum menetapkan harga di katalog pasar.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <Button
              className="font-semibold text-xs min-h-10 px-4 cursor-pointer gap-2 flex-1 sm:flex-initial"
              render={
                <Link href="/harga-wajar">
                  <Scale className="w-4 h-4" />
                  Hitung di Kalkulator Harga Wajar
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              }
            />
            <Button
              variant="outline"
              className="text-xs min-h-10 px-3 cursor-pointer gap-1.5 flex-1 sm:flex-initial"
              render={
                <Link href="/petani/jual">
                  Daftarkan Hasil Panen
                </Link>
              }
            />
          </div>
        </div>
      </Card>
    </PageContainer>
  );
}
