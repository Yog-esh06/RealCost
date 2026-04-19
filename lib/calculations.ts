import {
  Habit,
  HabitStats,
  TotalStats,
  ChartDataPoint,
  WEEKS_PER_MONTH,
  MONTHS_PER_YEAR,
} from "@/types";

export function calculateHabitStats(habit: Habit): HabitStats {
  const weeklyCount = habit.frequencyPerWeek;
  const weeklyCost = habit.costPerInstance * weeklyCount;
  const weeklyTime = habit.timePerInstance * weeklyCount;

  const monthlyCost = weeklyCost * WEEKS_PER_MONTH;
  const monthlyTime = weeklyTime * WEEKS_PER_MONTH;

  const yearlyCost = monthlyCost * MONTHS_PER_YEAR;
  const yearlyTime = monthlyTime * MONTHS_PER_YEAR;

  return {
    habit,
    weeklyCount,
    weeklyCost,
    weeklyTime,
    monthlyCost,
    monthlyTime,
    yearlyCost,
    yearlyTime,
  };
}

export function calculateTotals(habits: Habit[]): TotalStats {
  return habits.reduce(
    (acc, habit) => {
      const stats = calculateHabitStats(habit);
      return {
        weeklyCost: acc.weeklyCost + stats.weeklyCost,
        weeklyTime: acc.weeklyTime + stats.weeklyTime,
        monthlyCost: acc.monthlyCost + stats.monthlyCost,
        monthlyTime: acc.monthlyTime + stats.monthlyTime,
        yearlyCost: acc.yearlyCost + stats.yearlyCost,
        yearlyTime: acc.yearlyTime + stats.yearlyTime,
      };
    },
    {
      weeklyCost: 0,
      weeklyTime: 0,
      monthlyCost: 0,
      monthlyTime: 0,
      yearlyCost: 0,
      yearlyTime: 0,
    }
  );
}

export function minutesToHours(minutes: number): number {
  return Math.round((minutes / 60) * 10) / 10;
}

export function minutesToDays(minutes: number): number {
  return Math.round((minutes / (60 * 24)) * 10) / 10;
}

export function formatCurrency(amount: number, currency = "₹"): string {
  if (amount >= 100000) {
    return `${currency}${(amount / 100000).toFixed(1)}L`;
  }
  if (amount >= 1000) {
    return `${currency}${(amount / 1000).toFixed(1)}K`;
  }
  return `${currency}${Math.round(amount).toLocaleString("en-IN")}`;
}

export function formatCurrencyFull(amount: number, currency = "₹"): string {
  return `${currency}${Math.round(amount).toLocaleString("en-IN")}`;
}

export function formatTime(minutes: number): string {
  const hours = minutesToHours(minutes);
  if (hours < 1) return `${Math.round(minutes)}m`;
  if (hours < 24) return `${hours}h`;
  const days = minutesToDays(minutes);
  return `${days}d`;
}

export function getCostPieData(habits: Habit[]): ChartDataPoint[] {
  return habits
    .map((habit) => {
      const stats = calculateHabitStats(habit);
      return {
        name: habit.name,
        value: Math.round(stats.monthlyCost),
        color: habit.color,
        emoji: habit.emoji,
      };
    })
    .sort((a, b) => b.value - a.value);
}

export function getTimeBarData(habits: Habit[]): ChartDataPoint[] {
  return habits
    .map((habit) => {
      const stats = calculateHabitStats(habit);
      return {
        name: habit.name,
        value: Math.round(minutesToHours(stats.monthlyTime)),
        color: habit.color,
        emoji: habit.emoji,
      };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
}

export function generateHabitId(): string {
  return `habit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}
