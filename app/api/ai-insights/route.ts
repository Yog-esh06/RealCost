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
      "severity": "critical" | "high" | "medium" | "low",
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

The "severity" field MUST be exactly one of: "critical", "high", "medium", or "low".
Return top 3-4 habits. Pure JSON only.`;

    // PRIMARY MODEL: Gemini 3.1 Flash (The 2026 speed king)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.1-flash-lite-preview",
      generationConfig: { responseMimeType: "application/json" }
    });

    let result;
    try {
      result = await model.generateContent(prompt);
    } catch (apiError: any) {
      // FALLBACK: Use Gemini 2.5 Flash if the 3.1 preview is overloaded (503)
      if (apiError.status === 503) {
        const stableModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        result = await stableModel.generateContent(prompt);
      } else {
        throw apiError;
      }
    }
    
    const response = await result.response;
    const text = response.text();

    const clean = text.replace(/```json|```/g, "").trim();
    const insights: AIInsightsResponse = JSON.parse(clean);

    return NextResponse.json(insights);
  } catch (error: any) {
    console.error("AI Error:", error);
    const isOverloaded = error.status === 503;
    return NextResponse.json(
      { error: isOverloaded ? "AI is busy. Retry in 10s." : "Analysis failed." },
      { status: isOverloaded ? 503 : 500 }
    );
  }
}