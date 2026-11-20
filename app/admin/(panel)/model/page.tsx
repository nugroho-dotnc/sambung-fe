"use client";

import Link from "next/link";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ModelEvaluationRecord } from "@/features/admin/domain/admin-types";
import { Cpu, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

const MODEL_EVALUATION_ROWS: ModelEvaluationRecord[] = [
  {
    province: "Jawa Barat",
    horizon: "2 Pekan",
    mase: 0.74,
    intervalCoverage: "82.4%",
    status: "Lulus Target",
    activeMethod: "Model AI (Ensemble)",
    isFallback: false,
  },
  {
    province: "Jawa Barat",
    horizon: "4 Pekan",
    mase: 0.86,
    intervalCoverage: "79.1%",
    status: "Lulus Target",
    activeMethod: "Model AI (Ensemble)",
    isFallback: false,
  },
  {
    province: "Jawa Tengah",
    horizon: "2 Pekan",
    mase: 0.81,
    intervalCoverage: "80.5%",
    status: "Lulus Target",
    activeMethod: "Model AI (Ensemble)",
    isFallback: false,
  },
  {
    province: "Jawa Timur",
    horizon: "2 Pekan",
    mase: 0.78,
    intervalCoverage: "83.0%",
    status: "Lulus Target",
    activeMethod: "Model AI (Ensemble)",
    isFallback: false,
  },
  {
    province: "Sulawesi Selatan",
    horizon: "2 Pekan",
    mase: 0.98, // Melebihi ambang batas MASE <= 0.90
    intervalCoverage: "69.0%",
    status: "Gagal Ambang Target",
    activeMethod: "Prakiraan Baseline",
    isFallback: true, // Otomatis fallback ke moving average transparan
  },
];

export default function AdminModelEvalPage() {
  return (
    <PageContainer>
      {/* Header & Breadcrumb */}
      <div>
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-muted-foreground mb-2"
        >
          <Link href="/admin" className="hover:text-foreground font-semibold">
            Pengawas Sistem
          </Link>
          <span className="text-muted-foreground/50">/</span>
          <span className="font-medium text-foreground">Evaluasi Model AI</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Evaluasi & Gerbang Publikasi Model AI
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl">
              Laporan penilaian performa model peramalan per unit wilayah dan horizon terhadap
              ambang batas akurasi statistik sebelum dipublikasikan ke publik.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 text-xs font-semibold text-primary border border-primary/20 shrink-0">
            <Cpu className="w-4 h-4 shrink-0" />
            <span>Walk-Forward Backtesting</span>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <Card className="rounded-2xl border border-border/80 overflow-hidden shadow-xs bg-card">
        <CardHeader className="py-4 px-6 border-b border-border/70">
          <CardTitle className="text-base font-bold text-foreground">
            Hasil Uji Backtesting per Unit Wilayah
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border/80 bg-muted/40 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-5">Provinsi</th>
                <th className="py-3 px-5">Horizon Prakiraan</th>
                <th className="py-3 px-5 text-right">Skor MASE</th>
                <th className="py-3 px-5 text-right">Cakupan Pita 80%</th>
                <th className="py-3 px-5 text-center">Status Evaluasi</th>
                <th className="py-3 px-5">Metode yang Dipublikasikan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {MODEL_EVALUATION_ROWS.map((row, idx) => (
                <tr key={idx} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3.5 px-5 font-bold text-foreground whitespace-nowrap">
                    {row.province}
                  </td>
                  <td className="py-3.5 px-5 text-muted-foreground whitespace-nowrap">
                    {row.horizon}
                  </td>
                  <td className="py-3.5 px-5 font-mono font-bold text-right whitespace-nowrap tabular-nums">
                    <span
                      className={
                        row.mase <= 0.9
                          ? "text-emerald-700 dark:text-emerald-400 font-bold"
                          : "text-destructive font-black"
                      }
                    >
                      {row.mase.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 font-mono font-bold text-right whitespace-nowrap tabular-nums">
                    {row.intervalCoverage}
                  </td>
                  <td className="py-3.5 px-5 text-center whitespace-nowrap">
                    <Badge
                      variant={row.status === "Lulus Target" ? "default" : "destructive"}
                      className="text-[10px] font-bold uppercase"
                    >
                      {row.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">
                        {row.activeMethod}
                      </span>
                      {row.isFallback && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          Fallback Otomatis
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Kebijakan Evaluasi & Fallback */}
      <Card className="rounded-2xl border-border/80 bg-card shadow-xs p-6 space-y-3">
        <div className="flex items-center gap-2 text-foreground font-display font-bold text-sm">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span>Aturan Ambang Batas Gerbang Publikasi AI</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Sesuai prinsip kehati-hatian transparansi pasar, model peramalan AI wajib memenuhi dua kriteria kuantitatif: skor <strong>MASE &le; 0.90</strong> (lebih akurat daripada baseline musiman) dan <strong>Cakupan Pita Keyakinan 80% &ge; 75%</strong>. Apabila suatu wilayah mengalami anomali dan gagal memenuhi ambang batas ini, sistem secara otomatis beralih menampilkan prakiraan baseline moving average yang transparan guna melindungi keputusan petani.
        </p>
      </Card>
    </PageContainer>
  );
}
