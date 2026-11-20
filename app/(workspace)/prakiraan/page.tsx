"use client";

import { useState, useMemo } from "react";
import {
  Calendar,
  Sparkles,
  Info,
  ShieldCheck,
  TrendingUp,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
          <div className="flex items-center bg-muted/80 p-1 rounded-xl border border-border/80 shadow-2xs">
            <Button
              variant={horizon === 2 ? "default" : "ghost"}
              size="sm"
              onClick={() => setHorizon(2)}
              className="min-h-9 px-3 text-xs font-semibold gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Horizon 2 Pekan</span>
            </Button>
            <Button
              variant={horizon === 4 ? "default" : "ghost"}
              size="sm"
              onClick={() => setHorizon(4)}
              className="min-h-9 px-3 text-xs font-semibold gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Horizon 4 Pekan</span>
            </Button>
          </div>
        }
      />

      {/* Province Picker Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider shrink-0 mr-1">
          Wilayah Sasaran:
        </span>
        {["Jawa Barat", "Jawa Tengah"].map((prov) => (
          <Button
            key={prov}
            size="sm"
            variant={province === prov ? "default" : "outline"}
            onClick={() => setProvince(prov)}
            className="min-h-8 text-xs font-semibold rounded-xl"
          >
            {prov}
          </Button>
        ))}
      </div>

      {/* Main Grid: Forecast Metric & Chart vs SHAP Factors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-8">
        {/* Left Column: AI Prediction & Interactive Chart */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 sm:p-7 space-y-6 rounded-2xl border border-border/80 bg-card shadow-xs">
            <div className="flex items-start justify-between gap-3 border-b border-border/60 pb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                  Sasaran: {activeForecast.province} • {activeForecast.targetDate}
                </span>
                <h2 className="text-xl font-bold text-foreground mt-0.5">
                  Estimasi Nilai Beras Produsen
                </h2>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
                {activeForecast.method}
              </span>
            </div>

            {/* Main Predicted Number with Confidence Interval */}
            <div className="p-5 rounded-xl bg-muted/30 border border-border/60 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-semibold">Prediksi Rata-rata</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                  Rentang Keyakinan 80%
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <p className="text-3xl sm:text-4xl font-extrabold font-mono tabular-nums text-foreground">
                  {formatRupiah(activeForecast.riceProducerPrice)}
                  <span className="text-xs font-normal text-muted-foreground font-sans ml-1.5">
                    / kg beras
                  </span>
                </p>
                <span className="font-mono text-xs font-bold text-foreground bg-muted/80 px-3 py-1.5 rounded-lg border border-border/70 tabular-nums">
                  {formatRupiah(activeForecast.confidenceInterval80[0])} – {formatRupiah(activeForecast.confidenceInterval80[1])}
                </span>
              </div>
            </div>

            {/* Derived Grain Estimates (GKP & GKG) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-xl border border-border/70 bg-card space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground">Estimasi Turunan GKP</span>
                  <span className="text-[10px] bg-muted px-2 py-0.5 rounded font-mono font-bold">
                    Rendemen 52%
                  </span>
                </div>
                <p className="text-2xl font-bold font-mono tabular-nums text-foreground">
                  {formatRupiah(activeForecast.gkpEstimate)}{" "}
                  <span className="text-xs font-normal text-muted-foreground font-sans">/ kg</span>
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Taksiran harga wajar gabah panen segar di sawah.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border/70 bg-card space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground">Estimasi Turunan GKG</span>
                  <span className="text-[10px] bg-muted px-2 py-0.5 rounded font-mono font-bold">
                    Rendemen 63%
                  </span>
                </div>
                <p className="text-2xl font-bold font-mono tabular-nums text-foreground">
                  {formatRupiah(activeForecast.gkgEstimate)}{" "}
                  <span className="text-xs font-normal text-muted-foreground font-sans">/ kg</span>
                </p>
                <p className="text-[11px] text-muted-foreground">
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
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 sm:p-7 space-y-4 rounded-2xl border border-border/80 bg-card shadow-xs">
            <div className="border-b border-border/60 pb-3 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-primary uppercase tracking-wider">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Transparansi AI Pasar</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mt-0.5">
                  Faktor Pembentuk Harga
                </h3>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Analisis ini menguraikan faktor lingkungan, iklim, dan pasokan yang paling berkontribusi mendorong kenaikan (+) atau menahan penurunan (-) harga pasar.
            </p>

            <ShapWaterfall factors={activeForecast.shapContributions} />

            <div className="rounded-xl bg-muted/30 p-3.5 border border-border/50 text-[11px] text-muted-foreground space-y-1 leading-relaxed">
              <p className="font-semibold text-foreground">Catatan Pemodelan:</p>
              <p>
                Prediksi dihitung berkala menggunakan model machine learning terlatih dengan data historis BMKG, BPS, dan Bapanas untuk membantu perencanaan waktu tanam dan panen.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
