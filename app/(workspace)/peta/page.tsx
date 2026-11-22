"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  SEED_PROVINCIAL_DATA,
  type ProvincialPriceComparison,
} from "@/features/region-map/domain/map-types";
import { IndonesiaSvgMap } from "@/features/region-map/components/indonesia-svg-map";
import { ProvincialTable } from "@/features/region-map/components/provincial-table";
import { formatRupiah } from "@/features/offers/components/offer-summary";
import { PageContainer } from "@/components/shared/page-container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Map as MapIcon,
  Table as TableIcon,
  ChevronDown,
  TrendingDown,
  TrendingUp,
  Scale,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const COMMODITY_OPTIONS = [
  { value: "Gabah Kering Panen (GKP)", label: "Gabah Kering Panen (GKP)" },
  { value: "Gabah Kering Giling (GKG)", label: "Gabah Kering Giling (GKG)" },
  { value: "Beras Medium", label: "Beras Medium" },
];

const COVERAGE_OPTIONS = [
  { value: "Seluruh Indonesia", label: "Seluruh Indonesia (34 Provinsi)" },
  { value: "Pulau Jawa", label: "Pulau Jawa (Sentra Utama)" },
  { value: "Luar Jawa", label: "Luar Jawa" },
];

const TIME_OPTIONS = [
  { value: "Snapshot Terkini", label: "Snapshot Terkini (Pekan Berjalan)" },
  { value: "Rata-rata 30 Hari", label: "Rata-rata 30 Hari Terakhir" },
];

export default function PetaDisparitasPage() {
  const [viewMode, setViewMode] = useState<"map" | "table">("map");
  const [selectedCommodity, setSelectedCommodity] = useState("Gabah Kering Panen (GKP)");
  const [selectedCoverage, setSelectedCoverage] = useState("Seluruh Indonesia");
  const [selectedTime, setSelectedTime] = useState("Snapshot Terkini");
  const [selectedProvince, setSelectedProvince] = useState<string>("Jawa Barat");

  // Filter data based on coverage
  const displayData = useMemo(() => {
    let list = [...SEED_PROVINCIAL_DATA];

    if (selectedCoverage === "Pulau Jawa") {
      const javaProvinces = [
        "DKI Jakarta",
        "Jawa Barat",
        "Jawa Tengah",
        "DI Yogyakarta",
        "Jawa Timur",
        "Banten",
      ];
      list = list.filter((p) => javaProvinces.includes(p.province));
    } else if (selectedCoverage === "Luar Jawa") {
      const javaProvinces = [
        "DKI Jakarta",
        "Jawa Barat",
        "Jawa Tengah",
        "DI Yogyakarta",
        "Jawa Timur",
        "Banten",
      ];
      list = list.filter((p) => !javaProvinces.includes(p.province));
    }

    return list;
  }, [selectedCoverage]);

  // Calculations for summary metrics
  const minPriceItem = useMemo(() => {
    return displayData.reduce(
      (prev, curr) => (curr.price < prev.price ? curr : prev),
      displayData[0] || SEED_PROVINCIAL_DATA[0]
    );
  }, [displayData]);

  const maxPriceItem = useMemo(() => {
    return displayData.reduce(
      (prev, curr) => (curr.price > prev.price ? curr : prev),
      displayData[0] || SEED_PROVINCIAL_DATA[0]
    );
  }, [displayData]);

  const disparityPercent = useMemo(() => {
    if (!minPriceItem || !maxPriceItem || minPriceItem.price === 0) return 0;
    return (((maxPriceItem.price - minPriceItem.price) / minPriceItem.price) * 100).toFixed(1);
  }, [minPriceItem, maxPriceItem]);

  const activeProvinceItem = useMemo(() => {
    return (
      displayData.find(
        (p) => p.province.toLowerCase() === selectedProvince.toLowerCase()
      ) ||
      SEED_PROVINCIAL_DATA.find(
        (p) => p.province.toLowerCase() === selectedProvince.toLowerCase()
      ) ||
      displayData[0]
    );
  }, [displayData, selectedProvince]);

  return (
    <PageContainer>
      {/* Header & Breadcrumb */}
      <div>
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-muted-foreground mb-2"
        >
          <Link href="/" className="hover:text-foreground font-semibold">
            SAMBUNG
          </Link>
          <span className="text-muted-foreground/50">/</span>
          <span className="font-medium text-foreground">
            Peta Disparitas Harga Regional
          </span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Peta Sebaran & Perbedaan Harga Gabah
            </h1>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed max-w-3xl">
              Bandingkan rata-rata harga gabah di berbagai provinsi untuk menemukan wilayah dengan pasokan melimpah atau peluang harga jual terbaik secara transparan.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === "map" ? "table" : "map")}
              className="gap-2 text-xs font-semibold cursor-pointer shadow-2xs"
            >
              {viewMode === "map" ? (
                <>
                  <TableIcon className="w-3.5 h-3.5 text-primary" />
                  <span>Tampilan Tabel</span>
                </>
              ) : (
                <>
                  <MapIcon className="w-3.5 h-3.5 text-primary" />
                  <span>Tampilan Peta</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 sm:p-5 bg-card rounded-2xl mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground block">
              Komoditas Acuan
            </label>
            <Select
              items={COMMODITY_OPTIONS}
              value={selectedCommodity}
              onValueChange={(val) => {
                if (val) setSelectedCommodity(val);
              }}
            >
              <SelectTrigger className="w-full h-11 rounded-lg border border-input bg-background px-3 text-xs font-semibold text-foreground shadow-2xs">
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
              Cakupan Wilayah
            </label>
            <Select
              items={COVERAGE_OPTIONS}
              value={selectedCoverage}
              onValueChange={(val) => {
                if (val) setSelectedCoverage(val);
              }}
            >
              <SelectTrigger className="w-full h-11 rounded-lg border border-input bg-background px-3 text-xs font-semibold text-foreground shadow-2xs">
                <SelectValue placeholder="Pilih cakupan" />
              </SelectTrigger>
              <SelectContent>
                {COVERAGE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground block">
              Snapshot Waktu
            </label>
            <Select
              items={TIME_OPTIONS}
              value={selectedTime}
              onValueChange={(val) => {
                if (val) setSelectedTime(val);
              }}
            >
              <SelectTrigger className="w-full h-11 rounded-lg border border-input bg-background px-3 text-xs font-semibold text-foreground shadow-2xs">
                <SelectValue placeholder="Pilih snapshot" />
              </SelectTrigger>
              <SelectContent>
                {TIME_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Main Map or Table Container */}
      <Card className="p-6 sm:p-7 space-y-6 rounded-2xl bg-card mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
          <div>
            <h2 className="type-subheading font-bold text-foreground">
              {viewMode === "map"
                ? "Peta Sebaran Harga Antarwilayah"
                : "Tabel Peringkat Harga Antarwilayah"}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Data terintegrasi dari pusat agregasi pasar gabah SAMBUNG dan survei pengamatan harga daerah.
            </p>
          </div>
          <Badge variant="outline" className="text-xs font-semibold self-start sm:self-auto px-3 py-1 bg-muted/40">
            {selectedCoverage}
          </Badge>
        </div>

        {viewMode === "map" ? (
          <div>
            <IndonesiaSvgMap
              data={displayData}
              selectedProvince={selectedProvince}
              onSelectProvince={(prov) => setSelectedProvince(prov)}
            />
          </div>
        ) : (
          <ProvincialTable
            data={displayData}
            selectedProvince={selectedProvince}
            onSelectProvince={(prov) => setSelectedProvince(prov)}
          />
        )}

        {/* 3 Summary Metrics */}
        <div className="pt-4 border-t border-border/80 grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-4 rounded-lg bg-muted/40 border border-border/80 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
              <TrendingDown className="w-4 h-4" />
              <p className="text-xs font-bold uppercase tracking-wider">
                Harga Terendah (Sentra Surplus)
              </p>
            </div>
            <p className="text-sm font-bold text-foreground">
              {minPriceItem?.province}
            </p>
            <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400 font-display tabular-nums">
              {formatRupiah(minPriceItem?.price || 0)}
              <span className="text-xs font-normal text-muted-foreground">/kg</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Deviasi: {minPriceItem?.percentageDiff.toFixed(1)}% di bawah median
            </p>
          </div>

          <div className="p-4 rounded-lg bg-muted/40 border border-border/80 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
              <TrendingUp className="w-4 h-4" />
              <p className="text-xs font-bold uppercase tracking-wider">
                Harga Tertinggi (Wilayah Konsumen)
              </p>
            </div>
            <p className="text-sm font-bold text-foreground">
              {maxPriceItem?.province}
            </p>
            <p className="text-2xl font-black text-amber-700 dark:text-amber-400 font-display tabular-nums">
              {formatRupiah(maxPriceItem?.price || 0)}
              <span className="text-xs font-normal text-muted-foreground">/kg</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Deviasi: +{maxPriceItem?.percentageDiff.toFixed(1)}% di atas median
            </p>
          </div>

          <div className="p-4 rounded-lg bg-muted/40 border border-border/80 space-y-1">
            <div className="flex items-center gap-1.5 text-foreground">
              <Scale className="w-4 h-4 text-primary" />
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Rentang Disparitas Nasional
              </p>
            </div>
            <p className="text-sm font-bold text-foreground">
              Selisih Titik Terendah vs Tertinggi
            </p>
            <p className="text-2xl font-black text-foreground font-display tabular-nums">
              {disparityPercent}%
            </p>
            <p className="text-xs text-muted-foreground">
              Dipengaruhi jarak logistik, masa panen, & curah hujan
            </p>
          </div>
        </div>
      </Card>

      {/* Selected Province Context & Factors */}
      <Card className="p-6 sm:p-7 space-y-6 rounded-2xl bg-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Wilayah Terpilih
              </span>
              <Badge variant="secondary" className="text-xs font-bold">
                {activeProvinceItem.province}
              </Badge>
            </div>
            <h3 className="font-display text-xl font-bold text-foreground mt-1">
              Konteks Harga & Analisis Penentu Disparitas di {activeProvinceItem.province}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Plain Indonesian factor explanations */}
          <div className="lg:col-span-8 space-y-4">
            <div>
              <h4 className="font-bold text-sm text-foreground flex items-center gap-2 font-display">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Faktor Penjelas Deviasi Harga Regional</span>
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Estimasi pengaruh logistik antarpulau, iklim, dan ketersediaan pasokan panen
                lokal terhadap selisih harga dari median nasional.
              </p>
            </div>

            <div className="overflow-x-auto border border-border/80 rounded-lg bg-background">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/60">
                  <tr className="border-b border-border/80 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <th className="p-3">Variabel Pengaruh</th>
                    <th className="p-3">Kondisi Lapangan</th>
                    <th className="p-3 text-right">Arah Pengaruh Terhadap Harga</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  <tr>
                    <td className="p-3 font-semibold text-foreground">
                      Jarak & Aksesibilitas Logistik Distribusi
                    </td>
                    <td className="p-3 text-muted-foreground tabular-nums text-xs">
                      Jalur distribusi antarpulau
                    </td>
                    <td className="p-3 text-right font-bold tabular-nums text-amber-700 dark:text-amber-400">
                      + Rp85 s/d Rp120/kg (Menaikkan)
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-foreground">
                      Curah Hujan & Kondisi Iklim Pertanian
                    </td>
                    <td className="p-3 text-muted-foreground tabular-nums text-xs">
                      Curah hujan normal musiman
                    </td>
                    <td className="p-3 text-right font-bold tabular-nums text-amber-700 dark:text-amber-400">
                      + Rp40 s/d Rp60/kg (Kering lambat)
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-foreground">
                      Volume Surplus Panen Gabah Lokal
                    </td>
                    <td className="p-3 text-muted-foreground tabular-nums text-xs">
                      {activeProvinceItem.percentageDiff < 0
                        ? "Masa panen raya aktif"
                        : "Panen normal/selang"}
                    </td>
                    <td className="p-3 text-right font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
                      - Rp70 s/d Rp95/kg (Meredam)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>
                Faktor penjelas dihitung untuk memetakan dinamika pasar dan mempermudah
                perencanaan pasokan, bukan dasar klaim legal.
              </span>
            </div>
          </div>

          {/* Sidebar Summary Card */}
          <div className="lg:col-span-4 space-y-4 p-5 rounded-lg bg-card border border-border/70 shadow-xs">
            <div>
              <span className="text-xs font-semibold text-primary block">
                Ringkasan Wilayah
              </span>
              <h3 className="type-subheading text-foreground font-bold mt-0.5">
                {activeProvinceItem.province}
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-border/40">
                <span className="text-muted-foreground">Harga Acuan Rata-rata:</span>
                <span className="font-bold text-foreground text-sm tabular-nums">
                  {formatRupiah(activeProvinceItem.price)}/kg
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-border/40">
                <span className="text-muted-foreground">Median Acuan Nasional:</span>
                <span className="font-bold text-foreground text-sm tabular-nums">
                  {formatRupiah(activeProvinceItem.medianPrice)}/kg
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-border/40">
                <span className="text-muted-foreground">Deviasi vs Median:</span>
                <span
                  className={`font-black text-sm tabular-nums ${
                    activeProvinceItem.percentageDiff < 0
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-amber-700 dark:text-amber-400"
                  }`}
                >
                  {activeProvinceItem.percentageDiff > 0
                    ? `+${activeProvinceItem.percentageDiff.toFixed(2)}%`
                    : `${activeProvinceItem.percentageDiff.toFixed(2)}%`}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-muted-foreground">Jumlah Titik Sampel:</span>
                <span className="font-semibold text-foreground text-xs tabular-nums">
                  {activeProvinceItem.sampleCount} titik pengamatan
                </span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <Button
                size="sm"
                className="w-full text-xs font-bold justify-between cursor-pointer rounded-lg"
                render={<Link href="/pembeli/katalog" />}
              >
                <span>Cari Pasokan di {activeProvinceItem.province}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs font-semibold justify-between cursor-pointer rounded-lg"
                render={<Link href="/petani/jual" />}
              >
                <span>Jual Gabah di Wilayah Ini</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
              <div className="pt-1 flex items-center justify-between text-xs text-muted-foreground border-t border-border/60">
                <Link href="/harga-wajar" className="hover:text-primary transition-colors flex items-center gap-1 font-medium">
                  <Scale className="w-3 h-3" />
                  Kalkulator Harga Wajar
                </Link>
                <Link href="/prakiraan" className="hover:text-primary transition-colors flex items-center gap-1 font-medium">
                  Prakiraan AI →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </PageContainer>
  );
}
