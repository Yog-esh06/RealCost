import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { Habit, AIInsightsResponse } from "@/types";
import { calculateHabitStats, calculateTotals, formatCurrencyFull, minutesToHours } from "@/lib/calculations";

const client = new Anthropic();

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

Respond ONLY with a JSON object (no markdown, no code fences) matching this exact TypeScript type:
{
  "summary": "2-3 sentence punchy summary of their spending habits",
  "topHabitsToQuit": [
    {
      "habitId": "matching habit name",
      "habitName": "string",
      "severity": "critical" | "high" | "medium" | "low",
      "title": "catchy title like 'Your ₹60K Coffee Addiction'",
      "reasoning": "2 sentences on why to quit/reduce this habit",
      "yearlySavings": number,
      "alternativeSuggestion": "brief practical alternative"
    }
  ],
  "overallScore": number between 0-100 (higher = more wasteful/unhealthy habits),
  "positiveHabits": ["list of habit names that are actually fine or healthy"],
  "motivation": "one punchy closing statement to motivate change"
}

Return the top 3-4 habits to cut. Be specific about rupee amounts. Be real, not preachy.`;

    const message = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1200,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type");
    }

    // Parse JSON response
    const text = content.text.trim();
    const jsonStr = text.replace(/^```json\s*/, "").replace(/\s*```$/, "").trim();
    const insights: AIInsightsResponse = JSON.parse(jsonStr);

    return NextResponse.json(insights);
  } catch (error) {
    console.error("AI insights error:", error);
    return NextResponse.json(
      { error: "Failed to generate insights. Check your Anthropic API key." },
      { status: 500 }
    );
  }
}
