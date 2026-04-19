"use client";
import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Sector,
} from "recharts";
import { ChartDataPoint } from "@/types";
import { formatCurrencyFull } from "@/lib/calculations";

interface CostPieChartProps {
  data: ChartDataPoint[];
  currency?: string;
}

const renderActiveShape = (props: any) => {
  const {
    cx, cy, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value,
  } = props;

  return (
    <g>
      <text x={cx} y={cy - 14} textAnchor="middle" fill="#f8fafc" className="text-sm font-semibold" fontSize={14}>
        {payload.emoji} {payload.name.length > 12 ? payload.name.slice(0, 12) + "…" : payload.name}
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="#10b981" fontSize={18} fontWeight={700}>
        ₹{value.toLocaleString("en-IN")}
      </text>
      <text x={cx} y={cy + 30} textAnchor="middle" fill="#6b7280" fontSize={12}>
        {(percent * 100).toFixed(1)}% of monthly
      </text>
      <Sector
        cx={cx} cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx} cy={cy}
        innerRadius={outerRadius + 12}
        outerRadius={outerRadius + 16}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="rounded-lg border border-border bg-card p-3 shadow-xl">
        <p className="text-sm font-semibold text-foreground">{d.emoji} {d.name}</p>
        <p className="text-sm text-emerald-400 font-mono">₹{d.value.toLocaleString("en-IN")}/mo</p>
      </div>
    );
  }
  return null;
};

export function CostPieChart({ data, currency = "₹" }: CostPieChartProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!data.length) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        No data to display
      </div>
    );
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={72}
            outerRadius={105}
            dataKey="value"
            onMouseEnter={(_, index) => setActiveIndex(index)}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke="transparent"
                opacity={activeIndex === index ? 1 : 0.7}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-2 flex flex-wrap gap-2 justify-center">
        {data.slice(0, 6).map((d, i) => (
          <button
            key={i}
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs transition-all hover:bg-secondary"
            style={{ borderLeft: `3px solid ${d.color}` }}
            onMouseEnter={() => setActiveIndex(i)}
          >
            <span>{d.emoji}</span>
            <span className="text-muted-foreground truncate max-w-[80px]">{d.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
