"use client";

import React, { useEffect } from "react";
import { useHabitsStore } from "@/store/habits-store";
import { calculateTotals } from "@/lib/calculations";
import { Header } from "@/components/dashboard/header";
import { TotalsBar } from "@/components/dashboard/totals-bar";
import { ChartsSection } from "@/components/dashboard/charts-section";
import { HabitsList } from "@/components/habits/habits-list";
import { AIInsightsPanel } from "@/components/ai/ai-insights-panel";

export default function HomePage() {
  const { habits, isLoaded, loadFromStorage } = useHabitsStore();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full border-2 border-border" />
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-emerald-500" />
          </div>
          <p className="text-sm text-muted-foreground">Loading your habits…</p>
        </div>
      </div>
    );
  }

  const totals = calculateTotals(habits);

  return (
    <div className="min-h-screen bg-background bg-grid">
      <Header />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6">
        {/* Hero text */}
        <div className="mb-6 animate-fade-in">
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            Your Habit Cost Report
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Every daily choice has a true cost. Here&apos;s yours.
          </p>
        </div>

        {/* Big stat cards */}
        <div className="mb-6">
          <TotalsBar totals={totals} />
        </div>

        {/* Charts */}
        {habits.length > 0 && (
          <div className="mb-6">
            <ChartsSection habits={habits} />
          </div>
        )}

        {/* Habits list + AI side by side on large screens */}
        <div className="grid gap-6 xl:grid-cols-5">
          <div className="xl:col-span-3">
            <HabitsList />
          </div>
          <div className="xl:col-span-2">
            <AIInsightsPanel />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          <p>
            Built with <span className="text-rose-400">♥</span> by{" "}
            <a
              href="https://www.github.com/Yog-esh06"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground hover:text-emerald-400 transition-colors underline underline-offset-4"
            >
              Yogesh R Mehta
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}