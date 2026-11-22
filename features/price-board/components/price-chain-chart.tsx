"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import type { HistoricalTrendPoint } from "../domain/price-chain";
import { formatRupiah } from "@/features/offers/components/offer-summary";

interface PriceChainChartProps {
  data: HistoricalTrendPoint[];
}

export function PriceChainChart({ data }: PriceChainChartProps) {
  return (
    <div className="w-full h-72 sm:h-80 pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
          <XAxis
            dataKey="week"
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
            tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
          />
          <YAxis
            domain={["dataMin - 500", "dataMax + 500"]}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            tickFormatter={(value) => `Rp${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="rounded-xl border border-border/80 bg-popover p-3 shadow-lg text-xs space-y-1.5 font-sans">
                  <p className="font-bold text-foreground">{label}</p>
                  {payload.map((entry, index) => (
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
          <Line
            type="monotone"
            dataKey="retailPrice"
            name="Eceran Konsumen"
            stroke="#2563eb" // Blue
            strokeWidth={2.5}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="millerPrice"
            name="Penggilingan Padi"
            stroke="#f59e0b" // Amber
            strokeWidth={2}
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="farmerPrice"
            name="Petani (Setara Beras)"
            stroke="#10b981" // Emerald
            strokeWidth={2.5}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
