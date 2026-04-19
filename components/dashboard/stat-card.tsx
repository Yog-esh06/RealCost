"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Clock } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subvalue?: string;
  sublabel?: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  glowColor?: "green" | "red" | "amber" | "blue";
  className?: string;
  animationDelay?: number;
}

const glowMap = {
  green: "glow-green border-emerald-500/20",
  red: "glow-red border-rose-500/20",
  amber: "glow-amber border-amber-500/20",
  blue: "border-blue-500/20",
};

export function StatCard({
  title,
  value,
  subvalue,
  sublabel,
  icon,
  trend,
  glowColor = "green",
  className,
  animationDelay = 0,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border bg-card p-5 card-hover",
        glowMap[glowColor],
        "animate-slide-up",
        className
      )}
      style={{ animationDelay: `${animationDelay}ms`, animationFillMode: "both" }}
    >
      {/* Background gradient blob */}
      <div
        className={cn(
          "absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-10 blur-2xl",
          glowColor === "green" && "bg-emerald-500",
          glowColor === "red" && "bg-rose-500",
          glowColor === "amber" && "bg-amber-500",
          glowColor === "blue" && "bg-blue-500"
        )}
      />

      <div className="relative">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {title}
          </span>
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg",
              glowColor === "green" && "bg-emerald-500/10 text-emerald-400",
              glowColor === "red" && "bg-rose-500/10 text-rose-400",
              glowColor === "amber" && "bg-amber-500/10 text-amber-400",
              glowColor === "blue" && "bg-blue-500/10 text-blue-400"
            )}
          >
            {icon}
          </div>
        </div>

        <div
          className={cn(
            "font-display text-3xl font-bold tracking-tight",
            glowColor === "green" && "gradient-text",
            glowColor === "red" && "gradient-text-red",
            glowColor === "amber" &&
              "bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent",
            glowColor === "blue" &&
              "bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent"
          )}
        >
          {value}
        </div>

        {subvalue && (
          <div className="mt-1 flex items-center gap-1.5">
            <span className="text-sm text-muted-foreground">{sublabel}</span>
            <span className="text-sm font-semibold text-foreground/80">{subvalue}</span>
          </div>
        )}

        {trend && (
          <div className="mt-2 flex items-center gap-1">
            {trend === "up" ? (
              <>
                <TrendingUp className="h-3 w-3 text-rose-400" />
                <span className="text-xs text-rose-400">Increasing cost</span>
              </>
            ) : trend === "down" ? (
              <>
                <TrendingDown className="h-3 w-3 text-emerald-400" />
                <span className="text-xs text-emerald-400">Great progress</span>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
