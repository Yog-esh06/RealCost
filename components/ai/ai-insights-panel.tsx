"use client";
import React from "react";
import { useHabitsStore } from "@/store/habits-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AIInsight, AIInsightsResponse } from "@/types";
import { formatCurrency } from "@/lib/calculations";
import {
  Sparkles,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const severityConfig = {
  critical: { label: "Critical", variant: "destructive" as const, icon: "🔴" },
  high: { label: "High", variant: "destructive" as const, icon: "🟠" },
  medium: { label: "Medium", variant: "secondary" as const, icon: "🟡" },
  low: { label: "Low", variant: "outline" as const, icon: "🔵" },
};

function ScoreRing({ score }: { score: number }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score > 70 ? "#f43f5e" : score > 40 ? "#f59e0b" : "#10b981";

  return (
    <div className="relative flex h-24 w-24 items-center justify-center">
      <svg className="absolute -rotate-90" width="96" height="96">
        <circle cx="48" cy="48" r={radius} stroke="#1f2937" strokeWidth="8" fill="none" />
        <circle
          cx="48" cy="48" r={radius}
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="text-center">
        <div className="font-display text-2xl font-bold" style={{ color }}>
          {score}
        </div>
        <div className="text-[9px] uppercase tracking-widest text-muted-foreground">
          waste score
        </div>
      </div>
    </div>
  );
}

function InsightCard({ insight }: { insight: AIInsight }) {
  // Safe lookup: Lowercase the severity and provide a fallback to 'medium' if not found
  const severityKey = (insight.severity?.toLowerCase() || "medium") as keyof typeof severityConfig;
  const cfg = severityConfig[severityKey] || severityConfig.medium;

  return (
    <div className="rounded-lg border border-border bg-secondary/30 p-4 transition-all hover:border-border/80">
      <div className="mb-2 flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold text-foreground leading-snug">
          {cfg.icon} {insight.title}
        </h4>
        <Badge variant={cfg.variant as any} className="shrink-0 text-[10px]">
          {cfg.label}
        </Badge>
      </div>
      <p className="mb-3 text-xs text-muted-foreground leading-relaxed">
        {insight.reasoning}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-400">
          <TrendingDown className="h-3 w-3" />
          <span>Save {formatCurrency(insight.yearlySavings)}/yr</span>
        </div>
        {insight.alternativeSuggestion && (
          <p className="text-xs text-muted-foreground italic">
            💡 {insight.alternativeSuggestion}
          </p>
        )}
      </div>
    </div>
  );
}

export function AIInsightsPanel() {
  const { habits, aiInsights, isLoadingAI, aiError, setAIInsights, setIsLoadingAI, setAIError } =
    useHabitsStore();

  const fetchInsights = async () => {
    setIsLoadingAI(true);
    setAIError(null);
    try {
      const res = await fetch("/api/ai-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habits }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to fetch insights");
      }
      const data: AIInsightsResponse = await res.json();
      setAIInsights(data);
    } catch (err: any) {
      setAIError(err.message || "Unknown error");
    } finally {
      setIsLoadingAI(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
            <Sparkles className="h-4 w-4 text-purple-400" />
          </div>
          <div>
            <h2 className="font-display text-base font-bold text-foreground">
              AI Habit Advisor
            </h2>
            <p className="text-xs text-muted-foreground">
              Gemini analyzes your spending patterns
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchInsights}
          disabled={isLoadingAI || habits.length === 0}
          className="gap-1.5 text-xs border-purple-500/30 hover:border-purple-500/50 hover:bg-purple-500/5 text-purple-400"
        >
          {isLoadingAI ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : aiInsights ? (
            <RefreshCw className="h-3.5 w-3.5" />
          ) : (
            <Zap className="h-3.5 w-3.5" />
          )}
          {isLoadingAI ? "Analyzing…" : aiInsights ? "Refresh" : "Analyze Habits"}
        </Button>
      </div>

      {aiError && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/5 p-3 text-sm text-rose-400">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {aiError}
        </div>
      )}

      {isLoadingAI && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-lg bg-secondary/20 animate-pulse" />
          ))}
        </div>
      )}

      {!aiInsights && !isLoadingAI && !aiError && (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <span className="mb-3 text-4xl">🤖</span>
          <p className="text-sm text-muted-foreground max-w-xs">
            Click <strong className="text-purple-400">Analyze Habits</strong> to get
            personalized insights on which habits to cut and how much you&apos;d save.
          </p>
        </div>
      )}

      {aiInsights && !isLoadingAI && (
        <div className="space-y-4">
          <div className="flex gap-4 rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
            <ScoreRing score={aiInsights.overallScore} />
            <div className="flex-1">
              <p className="text-sm text-foreground leading-relaxed">
                {aiInsights.summary}
              </p>
              {aiInsights.positiveHabits?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {aiInsights.positiveHabits.map((h) => (
                    <div
                      key={h}
                      className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400"
                    >
                      <CheckCircle2 className="h-2.5 w-2.5" />
                      {h}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Habits to Reconsider
            </h3>
            <div className="space-y-2">
              {aiInsights.topHabitsToQuit.map((insight, idx) => (
                <InsightCard key={insight.habitId || idx} insight={insight} />
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm text-emerald-300 italic">
            ✨ {aiInsights.motivation}
          </div>
        </div>
      )}
    </div>
  );
}