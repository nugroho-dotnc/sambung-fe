"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { formatRupiah } from "@/features/offers/components/offer-summary";

interface ForecastChartProps {
  series: {
    week: string;
    actualPrice?: number;
    forecastPrice?: number;
    lowerCi?: number;
    upperCi?: number;
  }[];
}

export function ForecastChart({ series }: ForecastChartProps) {
  return (
    <div className="w-full h-72 sm:h-80 pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={series} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
          <XAxis
            dataKey="week"
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          />
          <YAxis
            domain={["dataMin - 400", "dataMax + 400"]}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickFormatter={(val) => `Rp${(val / 1000).toFixed(0)}k`}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="rounded-xl border border-border/80 bg-popover p-3 shadow-lg text-xs space-y-1.5 font-sans">
                  <p className="font-bold text-foreground">{label}</p>
                  {payload
                    .filter((p) => p.dataKey !== "lowerCi")
                    .map((entry, index) => (
                      <div key={index} className="flex items-center justify-between gap-4">
                        <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          {entry.name}
                        </span>
                        <span className="tabular-nums font-semibold text-foreground">
                          {formatRupiah(Number(entry.value))}
                        </span>
                      </div>
                    ))}
                </div>
              );
            }}
          />
          <Legend
            verticalAlign="top"
            height={36}
            iconType="circle"
            wrapperStyle={{ fontSize: 12, paddingBottom: 10 }}
          />

          {/* Shaded 80% Confidence Band */}
          <Area
            type="monotone"
            dataKey="upperCi"
            name="Pita Keyakinan 80%"
            fill="#10b981"
            fillOpacity={0.15}
            stroke="none"
          />

          {/* Historical Actual Price */}
          <Line
            type="monotone"
            dataKey="actualPrice"
            name="Harga Historis Aktual"
            stroke="#2563eb" // Blue
            strokeWidth={2.5}
            dot={{ r: 4 }}
          />

          {/* Forecasted Price */}
          <Line
            type="monotone"
            dataKey="forecastPrice"
            name="Prediksi Model AI"
            stroke="#10b981" // Emerald
            strokeWidth={2.5}
            strokeDasharray="4 4"
            dot={{ r: 4, strokeWidth: 2 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
