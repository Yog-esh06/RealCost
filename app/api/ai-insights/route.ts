import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Habit, AIInsightsResponse } from "@/types";
import { calculateHabitStats, calculateTotals, minutesToHours } from "@/lib/calculations";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { habits }: { habits: Habit[] } = await req.json();

    if (!habits || habits.length === 0) {
      return NextResponse.json({ error: "No habits provided" }, { status: 400 });
    }

    const totals = calculateTotals(habits);
    const habitDetails = habits.map((h) => {
      const stats = calculateHabitStats(h);
      return {
        name: h.name,
        category: h.category,
        yearlyCost: Math.round(stats.yearlyCost),
        yearlyHours: Math.round(minutesToHours(stats.yearlyTime)),
        frequencyPerWeek: h.frequencyPerWeek,
        costPerInstance: h.costPerInstance,
      };
    });

    const prompt = `You are a sharp financial advisor analyzing someone's daily habits. Be direct, insightful, and a little provocative.

Here are their habits with yearly costs (in ₹):
${JSON.stringify(habitDetails, null, 2)}

Total yearly cost: ₹${Math.round(totals.yearlyCost).toLocaleString("en-IN")}
Total yearly hours: ${Math.round(minutesToHours(totals.yearlyTime))}h

Respond ONLY with a JSON object (no markdown, no code fences) matching this exact structure:
{
  "summary": "2-3 sentence punchy summary of their spending habits",
  "topHabitsToQuit": [
    {
      "habitId": "matching habit name",
      "habitName": "string",
      "severity": "critical or high or medium or low",
      "title": "catchy title like Your 60K Coffee Addiction",
      "reasoning": "2 sentences on why to quit or reduce this habit",
      "yearlySavings": 0,
      "alternativeSuggestion": "brief practical alternative"
    }
  ],
  "overallScore": 0,
  "positiveHabits": ["list of habit names that are fine or healthy"],
  "motivation": "one punchy closing statement to motivate change"
}

Return top 3-4 habits to cut. Be specific about rupee amounts. Be real, not preachy. Return pure JSON only, no backticks.`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    const clean = text.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "").trim();
    const insights: AIInsightsResponse = JSON.parse(clean);

    return NextResponse.json(insights);
  } catch (error) {
    console.error("AI insights error:", error);
    return NextResponse.json(
      { error: "Failed to generate insights. Check your Gemini API key." },
      { status: 500 }
    );
  }
}