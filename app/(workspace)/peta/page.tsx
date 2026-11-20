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
              Disparitas Harga Antarprovinsi
            </h1>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed max-w-3xl">
              Pantau sebaran harga gabah di 34 provinsi dan pahami disparitas antarwilayah
              berdasarkan pasokan hasil panen, biaya logistik antarpulau, dan acuan pasar nasional.
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
      <Card className="p-4 sm:p-5 bg-card border border-border/80 rounded-2xl shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Komoditas Acuan
            </label>
            <div className="relative">
              <select
                value={selectedCommodity}
                onChange={(e) => setSelectedCommodity(e.target.value)}
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
              Cakupan Wilayah
            </label>
            <div className="relative">
              <select
                value={selectedCoverage}
                onChange={(e) => setSelectedCoverage(e.target.value)}
                className="w-full h-10 appearance-none rounded-xl border border-border/80 bg-background px-3.5 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary pr-9 cursor-pointer shadow-2xs"
              >
                <option value="Seluruh Indonesia">Seluruh Indonesia (34 Provinsi)</option>
                <option value="Pulau Jawa">Pulau Jawa (Sentra Utama)</option>
                <option value="Luar Jawa">Luar Jawa</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Snapshot Waktu
            </label>
            <div className="relative">
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full h-10 appearance-none rounded-xl border border-border/80 bg-background px-3.5 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary pr-9 cursor-pointer shadow-2xs"
              >
                <option value="Snapshot Terkini">Snapshot Terkini (Pekan Berjalan)</option>
                <option value="Rata-rata 30 Hari">Rata-rata 30 Hari Terakhir</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>
      </Card>

      {/* Main Map or Table Container */}
      <Card className="p-6 sm:p-7 space-y-6 rounded-2xl border border-border/80 bg-card shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/80">
          <div>
            <h2 className="font-display font-bold text-xl text-foreground">
              {viewMode === "map"
                ? "Peta Sebaran Disparitas Spasial"
                : "Tabel Peringkat Disparitas Antarwilayah"}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Data terintegrasi dari pusat agregasi pasar gabah SAMBUNG dan survei pengamatan harga daerah.
            </p>
          </div>
          <Badge variant="outline" className="text-xs font-bold self-start sm:self-auto">
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
          <div className="p-4 rounded-xl bg-muted/40 border border-border/80 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
              <TrendingDown className="w-4 h-4" />
              <p className="text-[11px] font-bold uppercase tracking-wider">
                Harga Terendah (Sentra Surplus)
              </p>
            </div>
            <p className="text-sm font-bold text-foreground">
              {minPriceItem?.province}
            </p>
            <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400 font-display tabular-nums font-mono">
              {formatRupiah(minPriceItem?.price || 0)}
              <span className="text-xs font-normal text-muted-foreground">/kg</span>
            </p>
            <p className="text-[11px] text-muted-foreground">
              Deviasi: {minPriceItem?.percentageDiff.toFixed(1)}% di bawah median
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
              {maxPriceItem?.province}
            </p>
            <p className="text-2xl font-black text-amber-700 dark:text-amber-400 font-display tabular-nums font-mono">
              {formatRupiah(maxPriceItem?.price || 0)}
              <span className="text-xs font-normal text-muted-foreground">/kg</span>
            </p>
            <p className="text-[11px] text-muted-foreground">
              Deviasi: +{maxPriceItem?.percentageDiff.toFixed(1)}% di atas median
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
              Selisih Titik Terendah vs Tertinggi
            </p>
            <p className="text-2xl font-black text-foreground font-display tabular-nums font-mono">
              {disparityPercent}%
            </p>
            <p className="text-[11px] text-muted-foreground">
              Dipengaruhi jarak logistik, masa panen, & curah hujan
            </p>
          </div>
        </div>
      </Card>

      {/* Selected Province Context & Factors */}
      <Card className="p-6 sm:p-7 space-y-6 rounded-2xl border border-border/80 bg-card shadow-xs">
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

            <div className="overflow-x-auto border border-border/80 rounded-xl bg-background">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/60">
                  <tr className="border-b border-border/80 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
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
                    <td className="p-3 text-muted-foreground font-mono text-[11px]">
                      Jalur distribusi antarpulau
                    </td>
                    <td className="p-3 text-right font-mono font-bold tabular-nums text-amber-700 dark:text-amber-400">
                      + Rp85 s/d Rp120/kg (Menaikkan)
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-foreground">
                      Curah Hujan & Kondisi Iklim Pertanian
                    </td>
                    <td className="p-3 text-muted-foreground font-mono text-[11px]">
                      Curah hujan normal musiman
                    </td>
                    <td className="p-3 text-right font-mono font-bold tabular-nums text-amber-700 dark:text-amber-400">
                      + Rp40 s/d Rp60/kg (Kering lambat)
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-foreground">
                      Volume Surplus Panen Gabah Lokal
                    </td>
                    <td className="p-3 text-muted-foreground font-mono text-[11px]">
                      {activeProvinceItem.percentageDiff < 0
                        ? "Masa panen raya aktif"
                        : "Panen normal/selang"}
                    </td>
                    <td className="p-3 text-right font-mono font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
                      - Rp70 s/d Rp95/kg (Meredam)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>
                Faktor penjelas dihitung untuk memetakan dinamika pasar dan mempermudah
                perencanaan pasokan, bukan dasar klaim legal.
              </span>
            </div>
          </div>

          {/* Sidebar Summary Card */}
          <div className="lg:col-span-4 space-y-4 p-5 rounded-xl bg-muted/30 border border-border/80">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Ringkasan {activeProvinceItem.province}
            </span>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-border/70">
                <span className="text-muted-foreground">Harga Acuan Rata-rata:</span>
                <span className="font-mono font-bold text-foreground text-sm tabular-nums">
                  {formatRupiah(activeProvinceItem.price)}/kg
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-border/70">
                <span className="text-muted-foreground">Median Acuan Nasional:</span>
                <span className="font-mono font-bold text-foreground text-sm tabular-nums">
                  {formatRupiah(activeProvinceItem.medianPrice)}/kg
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-border/70">
                <span className="text-muted-foreground">Deviasi vs Median:</span>
                <span
                  className={`font-mono font-black text-sm tabular-nums ${
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
                <span className="font-mono font-semibold text-foreground text-xs tabular-nums">
                  {activeProvinceItem.sampleCount} titik pengamatan
                </span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <Button
                size="sm"
                className="w-full text-xs font-bold justify-between cursor-pointer"
                render={<Link href="/harga" />}
              >
                <span>Lihat Papan Rantai Harga</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs font-semibold justify-between cursor-pointer"
                render={<Link href="/prakiraan" />}
              >
                <span>Buka Prakiraan Tren AI</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </PageContainer>
  );
}
