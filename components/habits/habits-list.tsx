"use client";
import React, { useState } from "react";
import { Habit } from "@/types";
import { HabitCard } from "./habit-card";
import { HabitForm } from "./habit-form";
import { useHabitsStore } from "@/store/habits-store";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";

export function HabitsList() {
  const { habits, addHabit, updateHabit, deleteHabit, resetToDefaults } =
    useHabitsStore();
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setShowForm(true);
  };

  const handleSave = (
    habitData: Omit<Habit, "id" | "createdAt" | "updatedAt">
  ) => {
    if (editingHabit) {
      updateHabit(editingHabit.id, habitData);
    } else {
      addHabit(habitData);
    }
    setEditingHabit(null);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingHabit(null);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-foreground">
            Your Habits
          </h2>
          <p className="text-xs text-muted-foreground">
            {habits.length} tracked · hover to edit
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetToDefaults}
            className="gap-1.5 text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reset
          </Button>
          <Button
            size="sm"
            onClick={() => setShowForm(true)}
            className="gap-1.5 text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Habit
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {habits.map((habit, i) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onEdit={handleEdit}
            onDelete={deleteHabit}
            animationDelay={i * 50}
          />
        ))}
      </div>

      {habits.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="mb-3 text-5xl">🌱</span>
          <p className="text-muted-foreground">No habits tracked yet.</p>
          <Button className="mt-4" onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add your first habit
          </Button>
        </div>
      )}

      <HabitForm
        open={showForm}
        onClose={handleClose}
        onSave={handleSave}
        initialHabit={editingHabit}
      />
    </div>
  );
}
