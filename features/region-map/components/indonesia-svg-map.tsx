"use client";

import { useMemo, useState } from "react";
import { geoMercator, geoPath } from "d3-geo";
import indonesiaGeoJson from "@/data/indonesia-provinces.json";
import type { ProvincialPriceComparison } from "../domain/map-types";
import { formatRupiah } from "@/features/offers/components/offer-summary";

interface IndonesiaSvgMapProps {
  data: ProvincialPriceComparison[];
  selectedProvince: string;
  onSelectProvince: (province: string) => void;
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
  if (upper === "NUSATENGGARA BARAT" || upper === "NUSA TENGGARA BARAT") return "Nusa Tenggara Barat";
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

export function IndonesiaSvgMap({
  data,
  selectedProvince,
  onSelectProvince,
}: IndonesiaSvgMapProps) {
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);

  const width = 960;
  const height = 400;

  // Compute projection and path generator
  const { paths, bounds } = useMemo(() => {
    // GeoJSON FeatureCollection
    const geo = indonesiaGeoJson as any;
    const projection = geoMercator().fitSize([width - 40, height - 40], geo);
    const pathGenerator = geoPath().projection(projection);

    const generated = geo.features.map((feature: any, idx: number) => {
      const rawName = feature.properties?.Propinsi || "";
      const provName = normalizeProvinceName(rawName);
      const d = pathGenerator(feature);
      return {
        id: idx,
        name: provName,
        path: d,
      };
    });

    return { paths: generated, bounds: projection };
  }, []);

  function getColor(provName: string, isSelected: boolean) {
    const item = data.find((d) => d.province.toLowerCase() === provName.toLowerCase());
    if (!item) return "#94a3b8"; // Default slate

    const diff = item.percentageDiff;
    if (diff < -3.5) return "#059669"; // Emerald 600 (Much cheaper / surplus)
    if (diff < -1.0) return "#10b981"; // Emerald 500
    if (diff <= 1.5) return "#64748b"; // Balanced / Normal Slate
    if (diff <= 5.0) return "#f59e0b"; // Amber 500 (Higher price)
    return "#ea580c"; // Orange 600 (Highest price / deficit)
  }

  const activeItem = data.find(
    (d) => d.province.toLowerCase() === (hoveredProvince || selectedProvince).toLowerCase()
  );

  return (
    <div className="relative w-full rounded-2xl border border-border/80 bg-muted/20 p-4 sm:p-6 overflow-hidden">
      {/* Interactive Tooltip / Info Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Wilayah Terpilih:
          </span>
          <span className="text-sm font-bold text-foreground">
            {hoveredProvince || selectedProvince}
          </span>
          {activeItem && (
            <span
              className={`text-xs tabular-nums font-bold px-2 py-0.5 rounded-md ${
                activeItem.percentageDiff > 0
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                  : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
              }`}
            >
              {activeItem.percentageDiff > 0
                ? `+${activeItem.percentageDiff}%`
                : `${activeItem.percentageDiff}%`}{" "}
              vs Median
            </span>
          )}
        </div>

        {activeItem && (
          <div className="text-xs text-muted-foreground tabular-nums">
            Rata-rata Gabah: <strong className="text-foreground">{formatRupiah(activeItem.price)}/kg</strong> (Sampel: {activeItem.sampleCount} titik)
          </div>
        )}
      </div>

      {/* SVG Canvas */}
      <div className="w-full aspect-[2.4/1] relative flex items-center justify-center">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full max-h-[420px] select-none"
        >
          <g transform="translate(20, 20)">
            {paths.map((p: any) => {
              if (!p.path) return null;
              const isSelected = selectedProvince.toLowerCase() === p.name.toLowerCase();
              const isHovered = hoveredProvince?.toLowerCase() === p.name.toLowerCase();
              const fillColor = getColor(p.name, isSelected);

              return (
                <path
                  key={p.id}
                  d={p.path}
                  fill={fillColor}
                  fillOpacity={isHovered ? 1 : isSelected ? 0.95 : 0.8}
                  stroke={isSelected ? "#000" : isHovered ? "#fff" : "rgba(255,255,255,0.4)"}
                  strokeWidth={isSelected ? 2.5 : isHovered ? 1.8 : 0.7}
                  className="cursor-pointer transition-all duration-150 outline-none"
                  onMouseEnter={() => setHoveredProvince(p.name)}
                  onMouseLeave={() => setHoveredProvince(null)}
                  onClick={() => onSelectProvince(p.name)}
                >
                  <title>{`${p.name}`}</title>
                </path>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Map Legend */}
      <div className="mt-4 pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            Deviasi vs Median Nasional:
          </span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#059669]" />
            <span className="text-xs text-muted-foreground">&lt; -3.5% (Surplus)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#10b981]" />
            <span className="text-xs text-muted-foreground">-3.5% s/d -1.0%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#64748b]" />
            <span className="text-xs text-muted-foreground">Normal (±1.5%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#f59e0b]" />
            <span className="text-xs text-muted-foreground">+1.5% s/d +5.0%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ea580c]" />
            <span className="text-xs text-muted-foreground">&gt; +5.0% (Defisit)</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Klik provinsi pada peta untuk melihat rincian acuan daerah.
        </p>
      </div>
    </div>
  );
}
