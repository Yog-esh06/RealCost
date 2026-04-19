export interface Habit {
  id: string;
  name: string;
  emoji: string;
  category: HabitCategory;
  costPerInstance: number; // in ₹ or $
  timePerInstance: number; // in minutes
  frequencyPerWeek: number;
  currency: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export type HabitCategory =
  | "food_drink"
  | "transport"
  | "entertainment"
  | "health"
  | "shopping"
  | "vices"
  | "fitness"
  | "other";

export interface HabitStats {
  habit: Habit;
  weeklyCount: number;
  weeklyCost: number;
  weeklyTime: number; // minutes
  monthlyCost: number;
  monthlyTime: number;
  yearlyCost: number;
  yearlyTime: number;
}

export interface TotalStats {
  weeklyCost: number;
  weeklyTime: number;
  monthlyCost: number;
  monthlyTime: number;
  yearlyCost: number;
  yearlyTime: number;
}

export interface AIInsight {
  habitId: string;
  habitName: string;
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  reasoning: string;
  yearlySavings: number;
  alternativeSuggestion?: string;
}

export interface AIInsightsResponse {
  summary: string;
  topHabitsToQuit: AIInsight[];
  overallScore: number; // 0-100, higher = more wasteful
  positiveHabits: string[];
  motivation: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  color: string;
  emoji: string;
}

export const CATEGORY_LABELS: Record<HabitCategory, string> = {
  food_drink: "Food & Drink",
  transport: "Transport",
  entertainment: "Entertainment",
  health: "Health",
  shopping: "Shopping",
  vices: "Vices",
  fitness: "Fitness",
  other: "Other",
};

export const CATEGORY_COLORS: Record<HabitCategory, string> = {
  food_drink: "#f59e0b",
  transport: "#3b82f6",
  entertainment: "#8b5cf6",
  health: "#10b981",
  shopping: "#f43f5e",
  vices: "#ef4444",
  fitness: "#06b6d4",
  other: "#6b7280",
};

export const WEEKS_PER_MONTH = 4.345;
export const MONTHS_PER_YEAR = 12;
