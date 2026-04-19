"use client";
import React, { useState } from "react";
import { Habit } from "@/types";
import { calculateHabitStats, formatCurrency } from "@/lib/calculations";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface HabitCardProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
  animationDelay?: number;
}

export function HabitCard({ habit, onEdit, onDelete, animationDelay = 0 }: HabitCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const stats = calculateHabitStats(habit);

  return (
    <div
      className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 card-hover animate-slide-up"
      style={{
        animationDelay: `${animationDelay}ms`,
        animationFillMode: "both",
        borderLeft: `3px solid ${habit.color}`,
      }}
    >
      {/* Colored glow */}
      <div
        className="absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-5 blur-xl"
        style={{ backgroundColor: habit.color }}
      />

      <div className="relative">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{habit.emoji}</span>
            <div>
              <h3 className="font-semibold leading-tight text-foreground">{habit.name}</h3>
              <p className="text-xs text-muted-foreground">
                {habit.frequencyPerWeek}× /week · ₹{habit.costPerInstance} · {habit.timePerInstance}min
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onEdit(habit)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            {confirmDelete ? (
              <div className="flex items-center gap-1">
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => onDelete(habit.id)}
                >
                  Confirm
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => setConfirmDelete(false)}
                >
                  No
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:text-rose-400"
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>

        {/* Cost grid */}
        <div className="mb-3 grid grid-cols-3 gap-2 rounded-lg bg-secondary/50 p-2.5">
          <div className="text-center">
            <div className="font-mono text-sm font-bold text-foreground">
              {formatCurrency(stats.weeklyCost)}
            </div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">week</div>
          </div>
          <div className="text-center">
            <div className="font-mono text-sm font-bold text-amber-400">
              {formatCurrency(stats.monthlyCost)}
            </div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">month</div>
          </div>
          <div className="text-center">
            <div className="font-mono text-sm font-bold text-rose-400">
              {formatCurrency(stats.yearlyCost)}
            </div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">year</div>
          </div>
        </div>

        {/* Savings row only */}
        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-400">
            <TrendingDown className="h-3 w-3" />
            <span>Save {formatCurrency(stats.yearlyCost)}/yr if you quit</span>
          </div>
        </div>
      </div>
    </div>
  );
}