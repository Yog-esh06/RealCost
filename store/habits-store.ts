"use client";

import { create } from "zustand";
import { Habit, AIInsightsResponse } from "@/types";
import { loadHabits, saveHabits } from "@/lib/storage";
import { generateHabitId } from "@/lib/calculations";

interface HabitsStore {
  habits: Habit[];
  isLoaded: boolean;
  aiInsights: AIInsightsResponse | null;
  isLoadingAI: boolean;
  aiError: string | null;

  loadFromStorage: () => void;
  addHabit: (habit: Omit<Habit, "id" | "createdAt" | "updatedAt">) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  resetToDefaults: () => void;
  setAIInsights: (insights: AIInsightsResponse | null) => void;
  setIsLoadingAI: (loading: boolean) => void;
  setAIError: (error: string | null) => void;
}

export const useHabitsStore = create<HabitsStore>((set, get) => ({
  habits: [],
  isLoaded: false,
  aiInsights: null,
  isLoadingAI: false,
  aiError: null,

  loadFromStorage: () => {
    const habits = loadHabits();
    set({ habits, isLoaded: true });
  },

  addHabit: (habitData) => {
    const habit: Habit = {
      ...habitData,
      id: generateHabitId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const habits = [...get().habits, habit];
    set({ habits });
    saveHabits(habits);
  },

  updateHabit: (id, updates) => {
    const habits = get().habits.map((h) =>
      h.id === id ? { ...h, ...updates, updatedAt: new Date().toISOString() } : h
    );
    set({ habits });
    saveHabits(habits);
  },

  deleteHabit: (id) => {
    const habits = get().habits.filter((h) => h.id !== id);
    set({ habits });
    saveHabits(habits);
  },

  resetToDefaults: () => {
    const { DEFAULT_HABITS } = require("@/lib/default-habits");
    const habits = DEFAULT_HABITS.map((h: Habit) => ({
      ...h,
      id: generateHabitId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    set({ habits });
    saveHabits(habits);
  },

  setAIInsights: (insights) => set({ aiInsights: insights }),
  setIsLoadingAI: (loading) => set({ isLoadingAI: loading }),
  setAIError: (error) => set({ aiError: error }),
}));
