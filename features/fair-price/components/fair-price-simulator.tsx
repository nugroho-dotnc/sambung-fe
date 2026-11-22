"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Scale,
  Calculator,
  Info,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  ShoppingBag,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  calculateFairPriceBreakdown,
  DEFAULT_RENDEMEN,
  GOVERNMENT_HPP,
} from "../domain/calculate-fair-price";
import { formatRupiah } from "@/features/offers/components/offer-summary";
import { PriceRangeSlider } from "@/features/price-check";

const GRAIN_TYPE_OPTIONS = [
  { value: "GKP", label: "Gabah Kering Panen (GKP)" },
  { value: "GKG", label: "Gabah Kering Giling (GKG)" },
];

const REGION_OPTIONS = [
  { value: "Jawa Barat", label: "Jawa Barat (Subang/Karawang)" },
  { value: "Jawa Tengah", label: "Jawa Tengah" },
  { value: "Jawa Timur", label: "Jawa Timur" },
  { value: "Sulawesi Selatan", label: "Sulawesi Selatan" },
];

export function FairPriceSimulator() {
  const [grainType, setGrainType] = useState<"GKP" | "GKG">("GKP");
  const [region, setRegion] = useState<string>("Jawa Barat");
  const [ricePrice, setRicePrice] = useState<number>(14000);
  const [moisture, setMoisture] = useState<number>(grainType === "GKP" ? 22 : 14);

  const result = useMemo(() => {
    return calculateFairPriceBreakdown({
      grainType,
      region,
      ricePrice,
      moisturePercent: moisture,
    });
  }, [grainType, region, ricePrice, moisture]);

  return (
    <div className="space-y-6">
      {/* Control Card */}
      <Card className="p-6 rounded-2xl bg-card space-y-5">
        <div className="border-b border-border/60 pb-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="type-subheading text-foreground font-bold">
              Atur Parameter Mutu Gabah
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ubah nilai di bawah untuk mensimulasikan bagaimana mutu gabah dan harga beras memengaruhi batas harga wajar.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 self-start sm:self-auto">
            Formula Transparan
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground block">
              Komoditas Gabah
            </label>
            <Select
              items={GRAIN_TYPE_OPTIONS}
              value={grainType}
              onValueChange={(val) => {
                if (val === "GKP" || val === "GKG") {
                  setGrainType(val);
                  setMoisture(val === "GKP" ? 22 : 14);
                }
              }}
            >
              <SelectTrigger className="w-full h-11 rounded-lg border border-input bg-background px-3 text-xs font-semibold text-foreground shadow-2xs">
                <SelectValue placeholder="Pilih jenis gabah" />
              </SelectTrigger>
              <SelectContent>
                {GRAIN_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground block">
              Wilayah Pengamatan
            </label>
            <Select
              items={REGION_OPTIONS}
              value={region}
              onValueChange={(val) => {
                if (val) setRegion(val);
              }}
            >
              <SelectTrigger className="w-full h-11 rounded-lg border border-input bg-background px-3 text-xs font-semibold text-foreground shadow-2xs">
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
              Harga Beras Produsen (Rp/kg)
            </label>
            <input
              type="number"
              value={ricePrice}
              onChange={(e) => setRicePrice(Number(e.target.value))}
              step={100}
              min={8000}
              className="w-full h-11 rounded-lg border border-input bg-background px-3 text-xs tabular-nums font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-2xs transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-muted-foreground">
                Kadar Air Gabah (%)
              </label>
              <span className="tabular-nums text-xs font-bold text-foreground">{moisture}%</span>
            </div>
            <input
              type="range"
              min={12}
              max={28}
              step={0.5}
              value={moisture}
              onChange={(e) => setMoisture(Number(e.target.value))}
              className="w-full cursor-pointer accent-emerald-600 mt-2"
            />
          </div>
        </div>
      </Card>

      {/* Result Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Fair Price Range Display */}
        <Card className="lg:col-span-7 p-6 sm:p-7 space-y-6 rounded-2xl bg-card">
          <div>
            <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 block">
              Rentang Harga Wajar Rekomendasi
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-3xl sm:text-4xl font-extrabold font-display tabular-nums text-emerald-700 dark:text-emerald-400">
                Rp{result.lowerBound.toLocaleString("id-ID")} – Rp{result.upperBound.toLocaleString("id-ID")}
              </p>
              <span className="text-sm font-normal text-muted-foreground font-sans">/ kg</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Rentang harga adil untuk gabah {result.grainType} di {result.region} dengan kadar air {result.moisturePercent}%.
            </p>
          </div>

          {/* Interactive Preview Slider */}
          <div className="pt-1">
            <PriceRangeSlider
              value={result.medianPrice}
              lowerBound={result.lowerBound}
              upperBound={result.upperBound}
              onChange={() => {}}
              disabled
              showDirectInput={false}
              label="Posisi Median terhadap Rentang Wajar"
              description="Titik tengah berada pada batas aman hijau."
            />
          </div>

          {/* Government HPP Floor Reference */}
          <div className="p-4 rounded-lg bg-muted/30 border border-border/50 flex items-center justify-between text-xs">
            <div>
              <span className="text-muted-foreground block text-xs">Batas Pengaman HPP Pemerintah</span>
              <span className="font-bold text-foreground">
                Rp{result.hppGovernment.toLocaleString("id-ID")} / kg ({result.grainType})
              </span>
            </div>
            <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              Harga Pasar di Atas HPP
            </span>
          </div>
        </Card>

        {/* Right Column: Mathematical Step-by-Step Breakdown */}
        <Card className="lg:col-span-5 p-6 sm:p-7 space-y-5 rounded-2xl bg-card">
          <div className="border-b border-border/60 pb-3">
            <span className="text-xs font-semibold text-primary">
              Rincian Perhitungan Transparan
            </span>
            <h3 className="type-subheading text-foreground font-bold mt-0.5">
              Bagaimana Nilai Ini Terbentuk?
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-baseline py-1.5 border-b border-border/40">
              <span className="text-muted-foreground">
                1. Nilai Beras Ekuivalen ({Math.round(result.rendemen * 100)}%)
              </span>
              <span className="tabular-nums font-semibold text-foreground">
                {formatRupiah(result.explanation.grossValue)}
              </span>
            </div>

            <div className="flex justify-between items-baseline py-1.5 border-b border-border/40">
              <span className="text-muted-foreground">
                2. Pengurangan Biaya Susut/Jemur
              </span>
              <span className="tabular-nums font-semibold text-amber-700 dark:text-amber-400">
                - {formatRupiah(result.explanation.dryingAdjustment)}
              </span>
            </div>

            <div className="flex justify-between items-baseline py-1.5 border-b border-border/40">
              <span className="text-muted-foreground">
                3. Alokasi Biaya Giling Pabrik
              </span>
              <span className="tabular-nums font-semibold text-muted-foreground">
                - {formatRupiah(result.millingMarginAmount)}
              </span>
            </div>

            <div className="flex justify-between items-baseline pt-2">
              <span className="font-bold text-foreground">Nilai Bersih Wajar</span>
              <span className="tabular-nums text-base font-extrabold text-emerald-700 dark:text-emerald-400">
                {formatRupiah(result.medianPrice)} / kg
              </span>
            </div>
          </div>

          <div className="rounded-lg bg-muted/20 p-3.5 text-xs text-muted-foreground leading-relaxed border border-border/40">
            <p>
              Dengan rendemen konversi {Math.round(result.rendemen * 100)}%, setiap 1 kg gabah menghasilkan sekitar {result.rendemen.toFixed(2)} kg beras. Formula ini menjamin keuntungan petani terlindungi tanpa memberatkan biaya pengolahan penggilingan.
            </p>
          </div>
        </Card>
      </div>

      {/* Jembatan Aksi: Hubungkan Simulasi ke Transaksi Nyata */}
      <Card className="p-6 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 block">
              Langkah Berikutnya
            </span>
            <h4 className="text-base font-bold text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              Gunakan Acuan Rp{result.medianPrice.toLocaleString("id-ID")} / kg untuk Transaksi Anda
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
              Nilai rekomendasi ini telah mempertimbangkan mutu gabah {result.grainType} dan kadar air {result.moisturePercent}%. Anda dapat langsung menggunakannya sebagai harga penawaran panen baru atau membandingkannya dengan stok di katalog pasar.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <Button
              className="font-semibold text-xs min-h-10 px-4 cursor-pointer gap-2 flex-1 sm:flex-initial rounded-lg"
              render={
                <Link href={`/petani/jual?grainType=${result.grainType}&askPrice=${result.medianPrice}&quality=${result.moisturePercent}`}>
                  Jual Gabah dengan Harga Ini
                  <ArrowRight className="w-4 h-4" />
                </Link>
              }
            />
            <Button
              variant="outline"
              className="text-xs min-h-10 px-3 cursor-pointer gap-1.5 flex-1 sm:flex-initial rounded-lg"
              render={
                <Link href="/pembeli/katalog">
                  <ShoppingBag className="w-3.5 h-3.5 text-muted-foreground" />
                  Bandingkan di Katalog
                </Link>
              }
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
