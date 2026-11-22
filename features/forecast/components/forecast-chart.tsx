"use client";

import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
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

const chartConfig = {
  actualPrice: {
    label: "Harga Historis Aktual",
    color: "#2563eb",
  },
  upperCi: {
    label: "Pita Keyakinan 80%",
    color: "#10b981",
  },
  forecastPrice: {
    label: "Prediksi Model AI",
    color: "#10b981",
  },
} satisfies ChartConfig;

export function ForecastChart({ series }: ForecastChartProps) {
  return (
    <ChartContainer config={chartConfig} className="w-full h-72 sm:h-80 pt-2">
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
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value, name, item) => (
                <div className="flex w-full items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="h-2 w-2 shrink-0 rounded-[2px]"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-muted-foreground">
                      {chartConfig[item.dataKey as keyof typeof chartConfig]?.label || name}
                    </span>
                  </div>
                  <span className="font-semibold tabular-nums text-foreground">
                    {formatRupiah(Number(value))}
                  </span>
                </div>
              )}
            />
          }
        />
        <ChartLegend content={<ChartLegendContent />} verticalAlign="top" height={36} />

        {/* Shaded 80% Confidence Band */}
        <Area
          type="monotone"
          dataKey="upperCi"
          fill="var(--color-upperCi)"
          fillOpacity={0.15}
          stroke="none"
        />

        {/* Historical Actual Price */}
        <Line
          type="monotone"
          dataKey="actualPrice"
          stroke="var(--color-actualPrice)"
          strokeWidth={2.5}
          dot={{ r: 4 }}
        />

        {/* Forecasted Price */}
        <Line
          type="monotone"
          dataKey="forecastPrice"
          stroke="var(--color-forecastPrice)"
          strokeWidth={2.5}
          strokeDasharray="4 4"
          dot={{ r: 4, strokeWidth: 2 }}
        />
      </ComposedChart>
    </ChartContainer>
  );
}
