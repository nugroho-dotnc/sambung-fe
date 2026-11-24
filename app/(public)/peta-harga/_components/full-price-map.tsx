"use client";

import { useMemo, useState, useRef, useCallback } from "react";
import Link from "next/link";
import {
  geoMercator,
  geoPath,
  type GeoGeometryObjects,
  type GeoPermissibleObjects,
} from "d3-geo";
import indonesiaGeoJson from "@/data/indonesia-provinces.json";
import { SEED_PROVINCIAL_DATA } from "@/features/region-map/domain/map-types";
import { formatRupiah } from "@/features/offers/components/offer-summary";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Scale,
  Calculator,
  Plus,
  Minus,
  RotateCcw,
  ArrowRight,
  Info,
  ChevronUp,
  ChevronDown,
  MapPin,
} from "lucide-react";

interface ProvinceFeature {
  type: string;
  properties?: {
    Propinsi?: string;
  };
  geometry: GeoGeometryObjects;
}

interface ProvinceGeoJson {
  type: string;
  features: ProvinceFeature[];
}

interface ProvincePathItem {
  id: number;
  name: string;
  path: string | null;
}

function normalizeProvinceName(geoName: string): string {
  const upper = (geoName || "").toUpperCase().trim();
  if (upper === "JAWA BARAT") return "Jawa Barat";
  if (upper === "JAWA TENGAH") return "Jawa Tengah";
  if (upper === "JAWA TIMUR") return "Jawa Timur";
  if (upper === "PROBANTEN") return "Banten";
  if (upper === "DKI JAKARTA") return "DKI Jakarta";
  if (upper === "DAERAH ISTIMEWA YOGYAKARTA") return "DI Yogyakarta";
  if (upper === "DI. ACEH") return "Aceh";
  if (upper === "SUMATERA UTARA") return "Sumatera Utara";
  if (upper === "SUMATERA BARAT") return "Sumatera Barat";
  if (upper === "SUMATERA SELATAN") return "Sumatera Selatan";
  if (upper === "RIAU") return "Riau";
  if (upper === "JAMBI") return "Jambi";
  if (upper === "BENGKULU") return "Bengkulu";
  if (upper === "LAMPUNG") return "Lampung";
  if (upper === "BANGKA BELITUNG") return "Kepulauan Bangka Belitung";
  if (upper === "BALI") return "Bali";
  if (upper === "NUSATENGGARA BARAT" || upper === "NUSA TENGGARA BARAT")
    return "Nusa Tenggara Barat";
  if (upper === "NUSA TENGGARA TIMUR") return "Nusa Tenggara Timur";
  if (upper === "KALIMANTAN BARAT") return "Kalimantan Barat";
  if (upper === "KALIMANTAN TENGAH") return "Kalimantan Tengah";
  if (upper === "KALIMANTAN SELATAN") return "Kalimantan Selatan";
  if (upper === "KALIMANTAN TIMUR") return "Kalimantan Timur";
  if (upper === "SULAWESI UTARA") return "Sulawesi Utara";
  if (upper === "SULAWESI TENGAH") return "Sulawesi Tengah";
  if (upper === "SULAWESI SELATAN") return "Sulawesi Selatan";
  if (upper === "SULAWESI TENGGARA") return "Sulawesi Tenggara";
  if (upper === "GORONTALO") return "Gorontalo";
  if (upper === "MALUKU") return "Maluku";
  if (upper === "MALUKU UTARA") return "Maluku Utara";
  if (upper.includes("IRIAN JAYA TIMUR") || upper.includes("PAPUA")) return "Papua";
  if (upper.includes("IRIAN JAYA BARAT")) return "Papua Barat";

  return geoName;
}

export default function FullPriceMap() {
  const [selectedProvince, setSelectedProvince] = useState<string>("Jawa Barat");
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // UI Panels toggle state for mobile ergonomics
  const [isStatsExpanded, setIsStatsExpanded] = useState<boolean>(true);
  const [isLegendExpanded, setIsLegendExpanded] = useState<boolean>(true);

  // Map Pan and Zoom state
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; panX: number; panY: number }>({
    x: 0,
    y: 0,
    panX: 0,
    panY: 0,
  });
  const hasMovedRef = useRef<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const svgWidth = 1000;
  const svgHeight = 460;

  // Compute projection and path generator
  const paths: ProvincePathItem[] = useMemo(() => {
    const geo = indonesiaGeoJson as unknown as ProvinceGeoJson;
    const projection = geoMercator().fitSize(
      [svgWidth - 60, svgHeight - 60],
      geo as unknown as GeoPermissibleObjects
    );
    const pathGenerator = geoPath().projection(projection);

    return geo.features.map((feature: ProvinceFeature, idx: number) => {
      const rawName = feature.properties?.Propinsi || "";
      const provName = normalizeProvinceName(rawName);
      const d = pathGenerator(feature as unknown as GeoPermissibleObjects);
      return {
        id: idx,
        name: provName,
        path: d,
      };
    });
  }, []);

  // Compute national statistics
  const stats = useMemo(() => {
    const minItem = SEED_PROVINCIAL_DATA.reduce(
      (prev, curr) => (curr.price < prev.price ? curr : prev),
      SEED_PROVINCIAL_DATA[0]
    );

    const maxItem = SEED_PROVINCIAL_DATA.reduce(
      (prev, curr) => (curr.price > prev.price ? curr : prev),
      SEED_PROVINCIAL_DATA[0]
    );

    const sumPrice = SEED_PROVINCIAL_DATA.reduce((acc, curr) => acc + curr.price, 0);
    const avgPrice = Math.round(sumPrice / SEED_PROVINCIAL_DATA.length);
    const medianPrice = 6700; // Benchmark median price (GKP)

    const disparityAmount = maxItem.price - minItem.price;
    const disparityPercent = Number(
      (((maxItem.price - minItem.price) / minItem.price) * 100).toFixed(1)
    );

    const avgDiffPercent = Number(
      (((avgPrice - medianPrice) / medianPrice) * 100).toFixed(1)
    );

    return {
      minItem,
      maxItem,
      avgPrice,
      medianPrice,
      disparityAmount,
      disparityPercent,
      avgDiffPercent,
      totalProvinces: SEED_PROVINCIAL_DATA.length,
    };
  }, []);

  // Color mapper based on deviation vs median
  const getColor = useCallback((provName: string) => {
    const item = SEED_PROVINCIAL_DATA.find(
      (d) => d.province.toLowerCase() === provName.toLowerCase()
    );
    if (!item) return "#94a3b8"; // Slate fallback

    const diff = item.percentageDiff;
    if (diff < -3.5) return "#059669"; // Emerald 600 (Much cheaper / surplus)
    if (diff < -1.0) return "#10b981"; // Emerald 500 (Moderate surplus)
    if (diff <= 1.5) return "#64748b"; // Slate 500 (Balanced / Normal)
    if (diff <= 5.0) return "#f59e0b"; // Amber 500 (Moderate deficit)
    return "#ea580c"; // Orange 600 (High deficit)
  }, []);

  const activeProvinceName = hoveredProvince || selectedProvince;
  const activeItem = useMemo(() => {
    return (
      SEED_PROVINCIAL_DATA.find(
        (d) => d.province.toLowerCase() === activeProvinceName.toLowerCase()
      ) || null
    );
  }, [activeProvinceName]);

  // Zoom handlers
  const handleZoomIn = () => setZoom((prev) => Math.min(Number((prev + 0.35).toFixed(2)), 3.2));
  const handleZoomOut = () => setZoom((prev) => Math.max(Number((prev - 0.35).toFixed(2)), 0.8));
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Drag pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag with primary mouse button
    if (e.button !== 0) return;
    setIsDragging(true);
    hasMovedRef.current = false;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        hasMovedRef.current = true;
      }
      setPan({
        x: dragStartRef.current.panX + dx,
        y: dragStartRef.current.panY + dy,
      });
    }

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setTooltipPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile pan
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      hasMovedRef.current = false;
      const touch = e.touches[0];
      dragStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        panX: pan.x,
        panY: pan.y,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1) {
      const touch = e.touches[0];
      const dx = touch.clientX - dragStartRef.current.x;
      const dy = touch.clientY - dragStartRef.current.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        hasMovedRef.current = true;
      }
      setPan({
        x: dragStartRef.current.panX + dx,
        y: dragStartRef.current.panY + dy,
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[calc(100dvh-4rem)] min-h-[580px] overflow-hidden bg-background select-none flex items-center justify-center cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Subtle Map Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Top-Left Header Badge / Title */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 pointer-events-auto max-w-[280px] sm:max-w-sm">
        <div className="bg-card/90 dark:bg-card/90 backdrop-blur-md border border-border/80 shadow-md rounded-2xl p-3 sm:p-4 space-y-1.5 transition-all">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Geospasial 34 Provinsi
            </span>
            <Badge variant="outline" className="text-[10px] font-bold py-0 h-4">
              GKP Terkini
            </Badge>
          </div>
          <h1 className="font-display font-extrabold text-base sm:text-lg text-foreground tracking-tight leading-tight">
            Peta Sebaran & Disparitas Harga
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed hidden sm:block">
            Klik atau arahkan kursor ke wilayah untuk meninjau deviasi harga gabah terhadap median nasional.
          </p>
        </div>
      </div>

      {/* Top-Right Statistics Card (Nilai Tinggi, Rendah, Disparitas, Rata-rata) */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 pointer-events-auto w-72 sm:w-88 md:w-96 max-w-[calc(100vw-2rem)]">
        <Card className="rounded-2xl border-border/80 bg-card/92 dark:bg-card/92 backdrop-blur-md shadow-xl overflow-hidden transition-all">
          {/* Card Title & Collapse Toggle */}
          <div
            className="p-4 sm:p-5 pb-3 flex items-center justify-between cursor-pointer border-b border-border/50"
            onClick={() => setIsStatsExpanded(!isStatsExpanded)}
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-sm sm:text-base text-foreground tracking-tight">
                  Statistik Pasar Nasional
                </h2>
                <Badge variant="secondary" className="text-[10px] font-semibold">
                  34 Provinsi
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Acuan Median:{" "}
                <strong className="text-foreground">
                  {formatRupiah(stats.medianPrice)}/kg
                </strong>
              </p>
            </div>
            <button
              type="button"
              className="p-1 rounded-lg text-muted-foreground hover:bg-muted/60 transition-colors"
              aria-label={isStatsExpanded ? "Tutup statistik" : "Buka statistik"}
            >
              {isStatsExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Expandable Body */}
          {isStatsExpanded && (
            <div className="p-4 sm:p-5 pt-3.5 space-y-3.5">
              {/* 2x2 Grid of Key Statistics */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* 1. Nilai Tertinggi */}
                <div className="p-3 rounded-xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/20 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
                    <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Tertinggi
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-foreground truncate" title={stats.maxItem.province}>
                    {stats.maxItem.province}
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-amber-700 dark:text-amber-400 font-display tabular-nums">
                    {formatRupiah(stats.maxItem.price)}
                    <span className="text-[10px] font-normal text-muted-foreground">/kg</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    +{stats.maxItem.percentageDiff.toFixed(1)}% vs median
                  </div>
                </div>

                {/* 2. Nilai Terendah */}
                <div className="p-3 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-500/20 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                    <TrendingDown className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Terendah
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-foreground truncate" title={stats.minItem.province}>
                    {stats.minItem.province}
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-emerald-700 dark:text-emerald-400 font-display tabular-nums">
                    {formatRupiah(stats.minItem.price)}
                    <span className="text-[10px] font-normal text-muted-foreground">/kg</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {stats.minItem.percentageDiff.toFixed(1)}% vs median
                  </div>
                </div>

                {/* 3. Rentang Disparitas */}
                <div className="p-3 rounded-xl bg-blue-500/10 dark:bg-blue-950/30 border border-blue-500/20 space-y-1">
                  <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400">
                    <Scale className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Disparitas
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-foreground">
                    Rentang Harga
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-blue-700 dark:text-blue-400 font-display tabular-nums">
                    {formatRupiah(stats.disparityAmount)}
                    <span className="text-[10px] font-normal text-muted-foreground">/kg</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    Gap {stats.disparityPercent}% antarprovinsi
                  </div>
                </div>

                {/* 4. Rata-rata Nasional */}
                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 space-y-1">
                  <div className="flex items-center gap-1.5 text-primary">
                    <Calculator className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Rata-rata
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-foreground">
                    Seluruh Daerah
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-primary font-display tabular-nums">
                    {formatRupiah(stats.avgPrice)}
                    <span className="text-[10px] font-normal text-muted-foreground">/kg</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    +{stats.avgDiffPercent}% vs median
                  </div>
                </div>
              </div>

              {/* Selected Province Details Box */}
              {activeItem && (
                <div className="p-3 rounded-xl bg-muted/50 border border-border/80 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-foreground font-bold text-xs sm:text-sm">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="truncate">{activeItem.province}</span>
                    </div>
                    <span
                      className={`text-[10px] tabular-nums font-bold px-2 py-0.5 rounded-md shrink-0 ${
                        activeItem.percentageDiff > 0
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      }`}
                    >
                      {activeItem.percentageDiff > 0
                        ? `+${activeItem.percentageDiff.toFixed(1)}%`
                        : `${activeItem.percentageDiff.toFixed(1)}%`}{" "}
                      vs Median
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between text-xs pt-0.5">
                    <span className="text-muted-foreground text-[11px]">Harga Lokal GKP:</span>
                    <span className="font-extrabold text-foreground font-display tabular-nums text-sm">
                      {formatRupiah(activeItem.price)}
                      <span className="text-[10px] font-normal text-muted-foreground">/kg</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Titik Pantau:</span>
                    <span className="font-semibold text-foreground">{activeItem.sampleCount} lokasi</span>
                  </div>

                  <div className="pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs font-semibold h-8 gap-1.5 hover:bg-primary hover:text-primary-foreground hover:border-primary cursor-pointer transition-colors"
                      render={<Link href="/kalkulator" />}
                    >
                      <span>Simulasikan Harga Wajar</span>
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* Bottom-Left Legend Card (Legenda Deviasi vs Median) */}
      <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-20 pointer-events-auto max-w-[290px] sm:max-w-xs">
        <Card className="rounded-2xl border-border/80 bg-card/92 dark:bg-card/92 backdrop-blur-md shadow-xl overflow-hidden transition-all">
          <div
            className="p-3.5 sm:p-4 pb-2.5 flex items-center justify-between cursor-pointer border-b border-border/50"
            onClick={() => setIsLegendExpanded(!isLegendExpanded)}
          >
            <div className="space-y-0.5">
              <h3 className="font-display font-bold text-xs sm:text-sm text-foreground tracking-tight">
                Legenda Deviasi vs Median
              </h3>
              <p className="text-[10px] text-muted-foreground">
                Median Nasional: Rp 6.700/kg
              </p>
            </div>
            <button
              type="button"
              className="p-1 rounded-lg text-muted-foreground hover:bg-muted/60 transition-colors"
              aria-label={isLegendExpanded ? "Tutup legenda" : "Buka legenda"}
            >
              {isLegendExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </button>
          </div>

          {isLegendExpanded && (
            <div className="p-3.5 sm:p-4 pt-3 space-y-2 text-xs">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#059669] shrink-0 shadow-xs" />
                  <span className="text-muted-foreground text-[11px]">&lt; -3.5%</span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                  Surplus Kuat
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#10b981] shrink-0 shadow-xs" />
                  <span className="text-muted-foreground text-[11px]">-3.5% s/d -1.0%</span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  Surplus Moderat
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#64748b] shrink-0 shadow-xs" />
                  <span className="text-muted-foreground text-[11px]">±1.5%</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  Normal / Berimbang
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#f59e0b] shrink-0 shadow-xs" />
                  <span className="text-muted-foreground text-[11px]">+1.5% s/d +5.0%</span>
                </div>
                <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                  Defisit Moderat
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#ea580c] shrink-0 shadow-xs" />
                  <span className="text-muted-foreground text-[11px]">&gt; +5.0%</span>
                </div>
                <span className="text-[11px] font-semibold text-orange-700 dark:text-orange-400">
                  Defisit Kuat
                </span>
              </div>

              <div className="pt-2 border-t border-border/50 text-[10px] text-muted-foreground flex items-center gap-1.5 leading-snug">
                <Info className="w-3 h-3 shrink-0 text-primary" />
                <span>Klik provinsi untuk mengunci tinjauan wilayah.</span>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Floating Zoom & Pan Controls (Bottom-Right) */}
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20 pointer-events-auto flex flex-col gap-1.5">
        <Button
          variant="outline"
          size="icon"
          className="w-9 h-9 rounded-xl bg-card/90 dark:bg-card/90 backdrop-blur-md border border-border/80 shadow-md hover:bg-muted cursor-pointer"
          onClick={handleZoomIn}
          title="Perbesar Peta"
          aria-label="Perbesar Peta"
        >
          <Plus className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="w-9 h-9 rounded-xl bg-card/90 dark:bg-card/90 backdrop-blur-md border border-border/80 shadow-md hover:bg-muted cursor-pointer"
          onClick={handleZoomOut}
          title="Perkecil Peta"
          aria-label="Perkecil Peta"
        >
          <Minus className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="w-9 h-9 rounded-xl bg-card/90 dark:bg-card/90 backdrop-blur-md border border-border/80 shadow-md hover:bg-muted cursor-pointer"
          onClick={handleResetView}
          title="Atur Ulang Posisi"
          aria-label="Atur Ulang Posisi"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Interactive SVG Canvas */}
      <div className="w-full h-full flex items-center justify-center p-2 sm:p-6">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full max-h-[82vh] select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <g
            transform={`translate(${svgWidth / 2 + pan.x}, ${
              svgHeight / 2 + pan.y
            }) scale(${zoom}) translate(${-svgWidth / 2}, ${-svgHeight / 2})`}
            className="transition-transform duration-75 ease-out"
          >
            {paths.map((p: ProvincePathItem) => {
              if (!p.path) return null;
              const isSelected =
                selectedProvince.toLowerCase() === p.name.toLowerCase();
              const isHovered =
                hoveredProvince?.toLowerCase() === p.name.toLowerCase();
              const fillColor = getColor(p.name);

              return (
                <path
                  key={p.id}
                  d={p.path}
                  fill={fillColor}
                  fillOpacity={isHovered ? 1 : isSelected ? 0.96 : 0.82}
                  stroke={
                    isSelected
                      ? "#09090b"
                      : isHovered
                      ? "#ffffff"
                      : "rgba(255,255,255,0.45)"
                  }
                  strokeWidth={isSelected ? 2.6 : isHovered ? 1.8 : 0.7}
                  className="cursor-pointer transition-[fill-opacity,stroke-width] duration-150 outline-none"
                  onMouseEnter={() => setHoveredProvince(p.name)}
                  onMouseLeave={() => setHoveredProvince(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!hasMovedRef.current) {
                      setSelectedProvince(p.name);
                    }
                  }}
                >
                  <title>{`${p.name}`}</title>
                </path>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Floating Hover Tooltip (follows cursor on desktop) */}
      {hoveredProvince && tooltipPos && (
        <div
          className="pointer-events-none absolute z-30 hidden sm:block -translate-x-1/2 -translate-y-full mb-3"
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y - 12}px`,
          }}
        >
          <div className="bg-popover/95 text-popover-foreground backdrop-blur-md border border-border/80 shadow-lg rounded-xl px-3 py-2 text-xs space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getColor(hoveredProvince) }} />
              <span>{hoveredProvince}</span>
            </div>
            {activeItem && (
              <div className="flex items-center gap-2 text-[11px] tabular-nums">
                <span className="font-bold">{formatRupiah(activeItem.price)}/kg</span>
                <span className="text-muted-foreground">·</span>
                <span
                  className={
                    activeItem.percentageDiff > 0
                      ? "text-amber-600 font-semibold"
                      : "text-emerald-600 font-semibold"
                  }
                >
                  {activeItem.percentageDiff > 0 ? "+" : ""}
                  {activeItem.percentageDiff.toFixed(1)}% vs median
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
