"use client";
import React from "react";
import { TotalStats } from "@/types";
import { formatCurrency } from "@/lib/calculations";
import { StatCard } from "./stat-card";
import { DollarSign, Calendar } from "lucide-react";

interface TotalsBarProps {
  totals: TotalStats;
}

export function TotalsBar({ totals }: TotalsBarProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <StatCard
        title="Monthly Cost"
        value={formatCurrency(totals.monthlyCost)}
        subvalue={formatCurrency(totals.weeklyCost)}
        sublabel="per week"
        icon={<DollarSign className="h-4 w-4" />}
        glowColor="red"
        animationDelay={0}
      />
      <StatCard
        title="Yearly Cost"
        value={formatCurrency(totals.yearlyCost)}
        subvalue={formatCurrency(totals.monthlyCost * 3)}
        sublabel="per quarter"
        icon={<Calendar className="h-4 w-4" />}
        glowColor="amber"
        animationDelay={100}
      />
    </div>
  );
}