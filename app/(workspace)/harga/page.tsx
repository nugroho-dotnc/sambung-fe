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
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { PriceBoardService } from "@/features/price-board/services/price-board.service";
import {
  generateSupplyChainCsv,
  SupplyChainLevel,
} from "@/features/price-board/domain/price-chain";
import { PriceChainChart } from "@/features/price-board/components/price-chain-chart";
import { formatRupiah } from "@/features/offers/components/offer-summary";
import { useMobile } from "@/hooks/use-mobile";

const COMMODITY_OPTIONS = [
  { value: "Beras Medium I", label: "Beras Medium I (Standar)" },
  { value: "Beras Premium", label: "Beras Premium" },
  { value: "Gabah Kering Panen (GKP)", label: "Gabah Kering Panen (GKP)" },
];

const REGION_OPTIONS = [
  { value: "Jawa Barat", label: "Provinsi Jawa Barat (Subang/Karawang)" },
  { value: "Jawa Tengah", label: "Provinsi Jawa Tengah" },
  { value: "Jawa Timur", label: "Provinsi Jawa Timur" },
  { value: "Nasional", label: "Rata-rata Nasional (Bapanas)" },
];

const PERIOD_OPTIONS = [
  { value: "12 Pekan Terakhir", label: "12 Pekan Terakhir" },
  { value: "8 Pekan Terakhir", label: "8 Pekan Terakhir" },
  { value: "4 Pekan Terakhir", label: "4 Pekan Terakhir" },
];

const LEVEL_ICONS: Record<string, typeof Sprout> = {
  petani: Sprout,
  penggilingan: Building2,
  grosir: Truck,
  konsumen: Store,
};

export default function PriceBoardPage() {
  const isMobile = useMobile();
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
            {isMobile ? "Unduh CSV" : "Unduh Ringkasan (CSV)"}
          </Button>
        }
      />

      {/* Filter Bar (3 Columns) */}
      <Card className="p-4 sm:p-5 bg-card rounded-2xl mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground block">
              Komoditas Acuan
            </label>
            <Select
              items={COMMODITY_OPTIONS}
              value={commodity}
              onValueChange={(val) => {
                if (val) setCommodity(val);
              }}
            >
              <SelectTrigger className="w-full h-11 rounded-lg bg-background px-3 text-xs font-semibold text-foreground">
                <SelectValue placeholder="Pilih komoditas" />
              </SelectTrigger>
              <SelectContent>
                {COMMODITY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground block">
              Wilayah Pembanding
            </label>
            <Select
              items={REGION_OPTIONS}
              value={region}
              onValueChange={(val) => {
                if (val) setRegion(val);
              }}
            >
              <SelectTrigger className="w-full h-11 rounded-lg bg-background px-3 text-xs font-semibold text-foreground">
                <SelectValue placeholder="Pilih wilayah" />
              </SelectTrigger>
              <SelectContent>
                {REGION_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground block">
              Rentang Pengamatan
            </label>
            <Select
              items={PERIOD_OPTIONS}
              value={period}
              onValueChange={(val) => {
                if (val) setPeriod(val);
              }}
            >
              <SelectTrigger className="w-full h-11 rounded-lg bg-background px-3 text-xs font-semibold text-foreground">
                <SelectValue placeholder="Pilih rentang" />
              </SelectTrigger>
              <SelectContent>
                {PERIOD_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-8">
        {/* Left Column: Dari Petani ke Pembeli */}
        <Card className="lg:col-span-7 p-6 sm:p-7 space-y-5 rounded-2xl bg-card">
          <div className="border-b border-border/60 pb-3.5 flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-primary">
                Rantai Pasok Gabah & Beras
              </span>
              <h2 className="type-subheading text-foreground font-bold mt-0.5">
                Pembentukan Harga dari Petani ke Konsumen
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Harga per kilogram ekuivalen beras medium di wilayah {region}.
              </p>
            </div>
            <Popover>
              <PopoverTrigger
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer shrink-0"
                aria-label="Penjelasan Tahapan Rantai Pasok"
              >
                <Info className="w-4 h-4" />
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 text-xs space-y-2 p-3.5">
                <PopoverTitle className="font-bold text-foreground text-xs flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-primary shrink-0" />
                  Tahapan Rantai Pasok
                </PopoverTitle>
                <PopoverDescription className="text-muted-foreground text-xs leading-relaxed">
                  Menampilkan runutan pembentukan harga dari petani di sawah, pengeringan dan penggilingan pabrik, distribusi logistik pedagang grosir, hingga tiba di pasar eceran konsumen.
                </PopoverDescription>
              </PopoverContent>
            </Popover>
          </div>

          <div className="overflow-x-auto rounded-lg border border-border/70">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border/70 text-xs font-semibold text-muted-foreground">
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
                          <div className="p-2 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
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
        <Card className="lg:col-span-5 p-6 sm:p-7 space-y-5 rounded-2xl bg-card">
          <div className="border-b border-border/60 pb-3.5 flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-primary">
                Keadilan Distribusi
              </span>
              <h2 className="type-subheading text-foreground font-bold mt-0.5">
                Porsi Nilai untuk Petani
              </h2>
            </div>
            <Popover>
              <PopoverTrigger
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer shrink-0"
                aria-label="Penjelasan Porsi Nilai & Marjin"
              >
                <Info className="w-4 h-4" />
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 text-xs space-y-2.5 p-3.5">
                <PopoverTitle className="font-bold text-foreground text-xs flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-primary shrink-0" />
                  Porsi Nilai & Marjin Rantai Pasok
                </PopoverTitle>
                <PopoverDescription className="text-muted-foreground text-xs leading-relaxed space-y-1.5">
                  <p>
                    Selisih nilai sebesar {formatRupiah(comparison.marginAmount)}/kg mencakup biaya pengeringan padi, penggilingan, susut mutu alami, transportasi antarkabupaten, dan kemasan ritel.
                  </p>
                  <p className="pt-1.5 border-t border-border/50 text-[11px]">
                    Persentase bagian petani dihitung dari perbandingan harga gabah di sawah terhadap harga beras di pasar eceran: (Harga Petani ÷ Harga Konsumen) × 100%.
                  </p>
                </PopoverDescription>
              </PopoverContent>
            </Popover>
          </div>

          {/* Farmer's Share Percentage Box */}
          <div className="space-y-1.5 p-4.5 rounded-lg flex bg-muted/30 border border-border/50 items-center gap-4">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold font-display tabular-nums text-emerald-700 dark:text-emerald-400">
                {comparison.farmerSharePercent}%
              </p>
              <p className="text-xs font-medium text-muted-foreground">
                Bagian Petani (Farmer&apos;s Share)
              </p>
            </div>
          </div>

          {/* Total Margin Spread */}
          <div className="space-y-1.5 p-4 rounded-lg bg-muted/30 border border-border/50">
            <p className="text-xs font-medium text-muted-foreground">
              Total Selisih (Petani → Konsumen)
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold font-display tabular-nums text-foreground">
              {formatRupiah(comparison.marginAmount)}{" "}
              <span className="text-xs font-normal text-muted-foreground font-sans">/ kg</span>
            </p>
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              +{comparison.marginPercent}% marjin kumulatif rantai pasok
            </p>
          </div>
        </Card>
      </div>

      {/* 12-Week Price Transmission Trend Chart */}
      <Card className="p-6 sm:p-7 space-y-4 rounded-2xl bg-card mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3.5">
          <div>
            <h2 className="type-subheading text-foreground font-bold">
              Pergerakan Harga Rantai Pasok ({period})
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Transmisi pergerakan harga dari tingkat petani, penggilingan padi, hingga pasar konsumen di {region}.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground tabular-nums font-semibold">
              Satuan: Rp/kg
            </span>
            <Popover>
              <PopoverTrigger
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
                aria-label="Penjelasan Tren Rantai Pasok"
              >
                <Info className="w-4 h-4" />
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 text-xs space-y-2 p-3.5">
                <PopoverTitle className="font-bold text-foreground text-xs flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-primary shrink-0" />
                  Tentang Data Historis
                </PopoverTitle>
                <PopoverDescription className="text-muted-foreground text-xs leading-relaxed">
                  Grafik ini memantau transmisi pergerakan harga dari tingkat petani, penggilingan padi, hingga pasar konsumen di {region} dalam rentang waktu yang dipilih.
                </PopoverDescription>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <PriceChainChart data={trends} />
      </Card>

      {/* Jembatan Aksi: Hubungkan Rantai Pasok ke Simulasi & Jual */}
      {/* <Card className="p-6 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 mb-8">
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
              className="font-semibold text-xs min-h-10 px-4 cursor-pointer gap-2 flex-1 sm:flex-initial rounded-lg"
              render={
                <Link href="/harga-wajar">
                  <Scale className="w-4 h-4" />
                  {isMobile ? "Kalkulator Harga" : "Hitung di Kalkulator Harga Wajar"}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              }
            />
            <Button
              variant="outline"
              className="text-xs min-h-10 px-3 cursor-pointer gap-1.5 flex-1 sm:flex-initial rounded-lg"
              render={
                <Link href="/petani/jual">
                  {isMobile ? "Daftar Panen" : "Daftarkan Hasil Panen"}
                </Link>
              }
            />
          </div>
        </div>
      </Card> */}
    </PageContainer>
  );
}
