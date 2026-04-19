"use client";
import React from "react";
import { Habit } from "@/types";
import { getCostPieData, getTimeBarData } from "@/lib/calculations";
import { CostPieChart } from "@/components/charts/cost-pie-chart";
import { TimeBarChart } from "@/components/charts/time-bar-chart";
import { PieChart, BarChart2 } from "lucide-react";

interface ChartsSectionProps {
  habits: Habit[];
}

export function ChartsSection({ habits }: ChartsSectionProps) {
  const pieData = getCostPieData(habits);
  const barData = getTimeBarData(habits);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Cost breakdown */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10">
            <PieChart className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Cost Breakdown</h3>
            <p className="text-xs text-muted-foreground">Monthly spend by habit</p>
          </div>
        </div>
        <CostPieChart data={pieData} />
      </div>

      {/* Time breakdown */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10">
            <BarChart2 className="h-3.5 w-3.5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Time Breakdown</h3>
            <p className="text-xs text-muted-foreground">Monthly hours spent per habit</p>
          </div>
        </div>
        <TimeBarChart data={barData} />
      </div>
    </div>
  );
}
