import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Habit, AIInsightsResponse } from "@/types";
import {
  calculateHabitStats,
  calculateTotals,
  minutesToHours,
} from "@/lib/calculations";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { habits }: { habits: Habit[] } = await req.json();

    if (!habits || habits.length === 0) {
      return NextResponse.json(
        { error: "No habits provided" },
        { status: 400 }
      );
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

    const prompt = `You are a sharp financial advisor. Analyze these habits:
${JSON.stringify(habitDetails, null, 2)}

Total yearly cost: ₹${Math.round(totals.yearlyCost).toLocaleString("en-IN")}
Total yearly hours: ${Math.round(minutesToHours(totals.yearlyTime))}h

Respond ONLY with a JSON object matching this structure:
{
  "summary": "string",
  "topHabitsToQuit": [
    {
      "habitId": "string",
      "habitName": "string",
      "severity": "string",
      "title": "string",
      "reasoning": "string",
      "yearlySavings": 0,
      "alternativeSuggestion": "string"
    }
  ],
  "overallScore": 0,
  "positiveHabits": ["string"],
  "motivation": "string"
}

Return top 3-4 habits. Pure JSON only.`;

    // Fail-safe: Use the full resource name
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error("Empty response from AI");
    }

    const clean = text
      .replace(/^```json\s*/, "")
      .replace(/^```\s*/, "")
      .replace(/\s*```$/, "")
      .trim();

    const insights: AIInsightsResponse = JSON.parse(clean);

    return NextResponse.json(insights);
  } catch (error) {
    console.error("AI insights error details:", error);
    return NextResponse.json(
      { error: "AI Insight generation failed. Check server logs." },
      { status: 500 }
    );
  }
}