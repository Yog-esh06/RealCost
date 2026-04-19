"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useHabitsStore } from "@/store/habits-store";
import { exportToJSON } from "@/lib/storage";
import { Download, TrendingDown } from "lucide-react";

export function Header() {
  const { habits } = useHabitsStore();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
            <TrendingDown className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <span className="font-display text-lg font-bold gradient-text">
              RealCost
            </span>
            <span className="ml-2 hidden text-xs text-muted-foreground sm:inline">
              True cost of your habits
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportToJSON(habits)}
            className="gap-1.5 text-xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export JSON</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
