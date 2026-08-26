/**
 * AI Task Breakdown service.
 * Wraps whichever provider is configured behind one interface, with a
 * deterministic local fallback so the feature always works, even with
 * no API key configured (e.g. in review/demo environments).
 */
import { env } from "../config/env.js";

export interface AiSuggestion {
  title: string;
}

const STOP_WORDS = new Set(["a", "an", "the", "my", "for", "to", "of", "and", "in", "on"]);

function localFallbackBreakdown(goal: string): AiSuggestion[] {
  const subject = goal
    .split(" ")
    .filter((w) => !STOP_WORDS.has(w.toLowerCase()))
    .slice(0, 4)
    .join(" ") || "this goal";

  return [
    { title: `Define what "done" looks like for ${subject}` },
    { title: `Break ${subject} into smaller milestones` },
    { title: `Research or gather what's needed for ${subject}` },
    { title: `Build/execute the core of ${subject}` },
    { title: `Review and refine ${subject}` },
    { title: `Ship or present ${subject}` },
  ];
}

async function providerBreakdown(goal: string): Promise<AiSuggestion[] | null> {
  if (!env.aiProviderApiKey) return null;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": env.aiProviderApiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 400,
        messages: [
          {
            role: "user",
            content: `Break this goal into 5-6 short, concrete, actionable task titles. Return ONLY a JSON array of strings, nothing else.\n\nGoal: ${goal}`,
          },
        ],
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const text = data?.content?.find((b: any) => b.type === "text")?.text;
    if (!text) return null;

    const parsed = JSON.parse(text.trim());
    if (!Array.isArray(parsed)) return null;
    return parsed.slice(0, 8).map((title: string) => ({ title }));
  } catch {
    return null;
  }
}

export async function breakdownGoal(goal: string): Promise<{ suggestions: AiSuggestion[]; source: "ai" | "fallback" }> {
  const fromProvider = await providerBreakdown(goal);
  if (fromProvider && fromProvider.length > 0) {
    return { suggestions: fromProvider, source: "ai" };
  }
  return { suggestions: localFallbackBreakdown(goal), source: "fallback" };
}
