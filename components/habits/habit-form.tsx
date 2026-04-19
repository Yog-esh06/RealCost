"use client";
import React, { useState, useEffect, useRef } from "react";
import { Habit, HabitCategory, CATEGORY_LABELS, CATEGORY_COLORS } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { calculateHabitStats, formatCurrency } from "@/lib/calculations";

const EMOJI_OPTIONS = [
  "☕","🚗","🍕","📺","🏋️","🚬","🍺","🛍️","🎵","🍟",
  "🍔","🍜","🎮","💊","✈️","🎬","📱","🍷","🥗","🧘",
  "🚲","📚","💅","🎯","🏊","🧴","🍦","🍰","🥤","🎪",
  "🎸","🐶","🌿","💻","🎨","🏀","⚽","🎲","🛒","🎤",
];

interface HabitFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (habit: Omit<Habit, "id" | "createdAt" | "updatedAt">) => void;
  initialHabit?: Habit | null;
}

const defaultForm = {
  name: "",
  emoji: "☕",
  category: "food_drink" as HabitCategory,
  costPerInstance: "" as unknown as number,
  timePerInstance: 0,
  frequencyPerWeek: 3,
  currency: "₹",
  color: "#f59e0b",
};

export function HabitForm({ open, onClose, onSave, initialHabit }: HabitFormProps) {
  const [form, setForm] = useState(defaultForm);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialHabit) {
      setForm({
        name: initialHabit.name,
        emoji: initialHabit.emoji,
        category: initialHabit.category,
        costPerInstance: initialHabit.costPerInstance,
        timePerInstance: initialHabit.timePerInstance,
        frequencyPerWeek: initialHabit.frequencyPerWeek,
        currency: initialHabit.currency,
        color: initialHabit.color,
      });
    } else {
      setForm(defaultForm);
    }
    setShowEmojiPicker(false);
  }, [initialHabit, open]);

  // Close emoji picker on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleCategoryChange = (cat: HabitCategory) => {
    setForm((f) => ({ ...f, category: cat, color: CATEGORY_COLORS[cat] }));
  };

  const previewHabit = {
    ...form,
    costPerInstance: Number(form.costPerInstance) || 0,
    id: "preview",
    createdAt: "",
    updatedAt: "",
  } as Habit;
  const preview = calculateHabitStats(previewHabit);

  const handleSubmit = () => {
    if (!form.name.trim() || !form.costPerInstance) return;
    onSave({ ...form, costPerInstance: Number(form.costPerInstance) });
    onClose();
  };

  const isValid = form.name.trim() && Number(form.costPerInstance) > 0;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">
            {initialHabit ? "Edit Habit" : "Add New Habit"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-1">

          {/* Emoji picker — full width, above name */}
          <div className="space-y-2" ref={pickerRef}>
            <Label>Pick an Emoji</Label>
            <button
              type="button"
              onClick={() => setShowEmojiPicker((v) => !v)}
              className="flex h-11 w-full items-center gap-3 rounded-lg border border-border bg-input px-3 hover:bg-secondary transition-colors text-left"
            >
              <span className="text-2xl">{form.emoji}</span>
              <span className="text-sm text-muted-foreground">
                {showEmojiPicker ? "Close picker" : "Click to change emoji"}
              </span>
            </button>

            {showEmojiPicker && (
              <div className="rounded-xl border border-border bg-card p-4 shadow-2xl">
                <div className="grid grid-cols-8 gap-3">
                  {EMOJI_OPTIONS.map((e) => (
                    <button
                      key={e}
                      type="button"
                      className={`flex h-11 w-11 items-center justify-center rounded-lg text-2xl transition-all hover:bg-secondary hover:scale-110 ${
                        form.emoji === e ? "bg-secondary ring-2 ring-emerald-500" : ""
                      }`}
                      onClick={() => {
                        setForm((f) => ({ ...f, emoji: e }));
                        setShowEmojiPicker(false);
                      }}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Habit name */}
          <div className="space-y-2">
            <Label htmlFor="habit-name">Habit Name</Label>
            <Input
              id="habit-name"
              placeholder="e.g. Morning Coffee, Uber Rides..."
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="h-11"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => handleCategoryChange(v as HabitCategory)}>
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Cost per instance — full width */}
          <div className="space-y-2">
            <Label htmlFor="cost">Cost per instance (₹)</Label>
            <Input
              id="cost"
              type="number"
              min={0}
              placeholder="e.g. 250"
              value={form.costPerInstance === 0 && !initialHabit ? "" : form.costPerInstance}
              onChange={(e) =>
                setForm((f) => ({ ...f, costPerInstance: e.target.value as unknown as number }))
              }
              className="h-11 font-mono text-base"
            />
          </div>

          {/* Frequency slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Frequency</Label>
              <span className="rounded-lg border border-border bg-input px-3 py-1 text-sm font-mono font-semibold text-foreground">
                {form.frequencyPerWeek}× per week
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={21}
              value={form.frequencyPerWeek}
              onChange={(e) =>
                setForm((f) => ({ ...f, frequencyPerWeek: parseInt(e.target.value) }))
              }
              className="w-full accent-emerald-500 cursor-pointer h-2"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>1×/wk</span>
              <span>Daily (7×)</span>
              <span>3×/day (21×)</span>
            </div>
          </div>

          {/* Chart color */}
          <div className="space-y-2">
            <Label>Chart Color</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.color}
                onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                className="h-11 w-20 cursor-pointer rounded-lg border border-border bg-input p-1"
              />
              <div className="flex-1 rounded-lg border border-border bg-input px-3 py-2">
                <span className="font-mono text-sm text-muted-foreground">{form.color}</span>
              </div>
              <div
                className="h-11 w-11 rounded-lg border border-border shadow-inner"
                style={{ backgroundColor: form.color }}
              />
            </div>
          </div>

          {/* Live preview */}
          {form.name && Number(form.costPerInstance) > 0 && (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-emerald-400">
                💰 Cost Preview
              </p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg bg-secondary/50 p-2">
                  <div className="font-mono text-base font-bold text-foreground">
                    {formatCurrency(preview.weeklyCost)}
                  </div>
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground mt-0.5">per week</div>
                </div>
                <div className="rounded-lg bg-secondary/50 p-2">
                  <div className="font-mono text-base font-bold text-amber-400">
                    {formatCurrency(preview.monthlyCost)}
                  </div>
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground mt-0.5">per month</div>
                </div>
                <div className="rounded-lg bg-secondary/50 p-2">
                  <div className="font-mono text-base font-bold text-rose-400">
                    {formatCurrency(preview.yearlyCost)}
                  </div>
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground mt-0.5">per year</div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" onClick={onClose} className="h-10">
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!isValid} className="h-10 px-6">
              {initialHabit ? "Save Changes" : "Add Habit"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}