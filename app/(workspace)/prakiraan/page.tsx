"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  Sparkles,
  Info,
  ShieldCheck,
  TrendingUp,
  Cpu,
  ArrowRight,
  ShoppingBag,
  CheckCircle2,
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
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SEED_FORECASTS, ForecastRecord } from "@/features/forecast/domain/forecast-data";
import { ForecastChart } from "@/features/forecast/components/forecast-chart";
import { ShapWaterfall } from "@/features/forecast/components/shap-waterfall";
import { formatRupiah } from "@/features/offers/components/offer-summary";

export default function ForecastPage() {
  const [horizon, setHorizon] = useState<2 | 4>(2);
  const [province, setProvince] = useState<string>("Jawa Barat");

  const activeForecast = useMemo<ForecastRecord>(() => {
    const found = SEED_FORECASTS.find(
      (f) => f.horizonWeeks === horizon && f.province === province
    );
    return found || SEED_FORECASTS[0];
  }, [horizon, province]);

  return (
    <PageContainer>
      <PageHeader
        title="Prakiraan Tren Harga & Analisis Pasar AI"
        description="Proyeksi harga beras produsen dan estimasi turunan gabah untuk 2 hingga 4 pekan ke depan, dilengkapi transparansi faktor pendorong pasar."
        actions={
          <div className="flex items-center bg-muted/80 p-1 rounded-lg border border-border/80 shadow-2xs">
            <Button
              variant={horizon === 2 ? "default" : "ghost"}
              size="sm"
              onClick={() => setHorizon(2)}
              className="px-3 text-xs font-semibold gap-1.5 rounded-md"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Horizon 2 Pekan</span>
            </Button>
            <Button
              variant={horizon === 4 ? "default" : "ghost"}
              size="sm"
              onClick={() => setHorizon(4)}
              className="px-3 text-xs font-semibold gap-1.5 rounded-md"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Horizon 4 Pekan</span>
            </Button>
          </div>
        }
      />

      {/* Province Picker Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider shrink-0 mr-1">
          Wilayah Sasaran:
        </span>
        {["Jawa Barat", "Jawa Tengah"].map((prov) => (
          <Button
            key={prov}
            size="sm"
            variant={province === prov ? "default" : "outline"}
            onClick={() => setProvince(prov)}
            className="min-h-8 text-xs font-semibold rounded-lg"
          >
            {prov}
          </Button>
        ))}
      </div>

      {/* Main Grid: Forecast Metric & Chart vs SHAP Factors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-8">
        {/* Left Column: AI Prediction & Interactive Chart */}
        <div className="lg:col-span-7">
          <Card className="p-6 sm:p-7 rounded-2xl bg-card">
            <div className="flex items-start justify-between gap-3 border-b border-border/60 pb-3.5">
              <div>
                <span className="text-xs font-semibold text-primary">
                  Sasaran: {activeForecast.province} • {activeForecast.targetDate}
                </span>
                <h2 className="type-subheading text-foreground font-bold mt-0.5">
                  Estimasi Nilai Beras Produsen
                </h2>
              </div>
              <Popover>
                <PopoverTrigger
                  className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer shrink-0"
                  aria-label="Penjelasan Proyeksi Nilai Beras"
                >
                  <Info className="w-4 h-4" />
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80 text-xs space-y-2 p-3.5">
                  <PopoverTitle className="font-bold text-foreground text-xs flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-primary shrink-0" />
                    Tentang Proyeksi Nilai Beras
                  </PopoverTitle>
                  <PopoverDescription className="text-muted-foreground text-xs leading-relaxed space-y-1.5">
                    <p>
                      Proyeksi dihitung menggunakan model ensemble machine learning berbasis tren musiman, data historis Bapanas & BPS, serta anomali iklim BMKG.
                    </p>
                    <p className="pt-1.5 border-t border-border/50 text-[11px]">
                      Rentang keyakinan 80% menunjukkan batas wajar kemungkinan deviasi harga di pasar produsen.
                    </p>
                  </PopoverDescription>
                </PopoverContent>
              </Popover>
            </div>

            {/* Main Predicted Number with Confidence Interval */}
            <div className="p-5 rounded-lg bg-muted/30 border border-border/50 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">Prediksi Rata-rata</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                  Rentang Keyakinan 80%
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <p className="text-3xl sm:text-4xl font-extrabold font-display tabular-nums text-foreground">
                  {formatRupiah(activeForecast.riceProducerPrice)}
                  <span className="text-xs font-normal text-muted-foreground font-sans ml-1.5">
                    / kg beras
                  </span>
                </p>
                <span className="text-xs font-bold text-foreground bg-background px-3 py-1.5 rounded-md border border-border/70 tabular-nums shadow-2xs">
                  {formatRupiah(activeForecast.confidenceInterval80[0])} – {formatRupiah(activeForecast.confidenceInterval80[1])}
                </span>
              </div>
            </div>

            {/* Derived Grain Estimates (GKP & GKG) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-4.5 rounded-lg border border-border/70 bg-card space-y-1.5 hover:shadow-2xs transition-shadow">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground">Estimasi Turunan GKP</span>
                  <span className="text-xs bg-muted px-2 py-0.5 rounded tabular-nums font-semibold">
                    Rendemen 52%
                  </span>
                </div>
                <p className="text-2xl font-bold font-display tabular-nums text-foreground">
                  {formatRupiah(activeForecast.gkpEstimate)}{" "}
                  <span className="text-xs font-normal text-muted-foreground font-sans">/ kg</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Taksiran harga wajar gabah panen segar di sawah.
                </p>
              </div>

              <div className="p-4.5 rounded-lg border border-border/70 bg-card space-y-1.5 hover:shadow-2xs transition-shadow">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground">Estimasi Turunan GKG</span>
                  <span className="text-xs bg-muted px-2 py-0.5 rounded tabular-nums font-semibold">
                    Rendemen 63%
                  </span>
                </div>
                <p className="text-2xl font-bold font-display tabular-nums text-foreground">
                  {formatRupiah(activeForecast.gkgEstimate)}{" "}
                  <span className="text-xs font-normal text-muted-foreground font-sans">/ kg</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Taksiran harga gabah siap giling (kadar air ~14%).
                </p>
              </div>
            </div>

            {/* Trend Chart */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-muted-foreground mb-2">
                Lintasan Tren Historis & Proyeksi ({horizon} Pekan ke Depan)
              </p>
              <ForecastChart series={activeForecast.historicalSeries} />
            </div>
          </Card>
        </div>

        {/* Right Column: Explainable AI Factors (SHAP) */}
        <div className="lg:col-span-5">
          <Card className="p-6 sm:p-7 rounded-2xl bg-card">
            <div className="border-b border-border/60 pb-3.5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                  <span>Transparansi AI Pasar</span>
                </div>
                <h3 className="type-subheading text-foreground font-bold mt-0.5">
                  Faktor Pembentuk Harga
                </h3>
              </div>
              <Popover>
                <PopoverTrigger
                  className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer shrink-0"
                  aria-label="Penjelasan Faktor SHAP"
                >
                  <Info className="w-4 h-4" />
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80 text-xs space-y-2 p-3.5">
                  <PopoverTitle className="font-bold text-foreground text-xs flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-primary shrink-0" />
                    Catatan Pemodelan Pasar
                  </PopoverTitle>
                  <PopoverDescription className="text-muted-foreground text-xs leading-relaxed space-y-1.5">
                    <p>
                      Analisis SHAP menguraikan variabel iklim, biaya logistik, dan pasokan yang berkontribusi menaikkan (+) atau menahan (-) harga pasar.
                    </p>
                    <p className="pt-1.5 border-t border-border/50 text-[11px]">
                      Prediksi diperbarui berkala menggunakan model terlatih dengan data historis BMKG, BPS, dan Bapanas untuk perencanaan panen.
                    </p>
                  </PopoverDescription>
                </PopoverContent>
              </Popover>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Analisis ini menguraikan faktor lingkungan, iklim, dan pasokan yang paling berkontribusi mendorong kenaikan (+) atau menahan penurunan (-) harga pasar.
            </p>

            <ShapWaterfall factors={activeForecast.shapContributions} />
          </Card>
        </div>
      </div>

      {/* Jembatan Aksi: Hubungkan Prakiraan ke Rencana Transaksi
      <Card className="p-6 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 block">
              Tindakan Berdasarkan Tren
            </span>
            <h4 className="text-base font-bold text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              Manfaatkan Prakiraan Harga untuk Perencanaan Panen
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
              Harga di {activeForecast.province} diproyeksikan berkisar antara {formatRupiah(activeForecast.confidenceInterval80[0])} – {formatRupiah(activeForecast.confidenceInterval80[1])} per kg pada {activeForecast.targetDate}. Amankan kesepakatan pasokan sejak dini sebelum masa panen raya tiba.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <Button
              className="font-semibold text-xs min-h-10 px-4 cursor-pointer gap-2 flex-1 sm:flex-initial rounded-lg"
              render={
                <Link href="/petani/jual">
                  Daftarkan Rencana Panen
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
                  Jelajahi Katalog Pembeli
                </Link>
              }
            />
          </div>
        </div>
      </Card> */}
    </PageContainer>
  );
}
