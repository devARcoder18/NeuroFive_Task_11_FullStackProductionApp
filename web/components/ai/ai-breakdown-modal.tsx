"use client";

import { useState } from "react";
import { Sparkles, Plus, CheckCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { useAiBreakdown, useCreateTask } from "@/hooks/use-tasks";
import type { AiSuggestion } from "@/types";

export function AiBreakdownModal({ projectId, open, onClose }: { projectId: string; open: boolean; onClose: () => void }) {
  const [goal, setGoal] = useState("");
  const [suggestions, setSuggestions] = useState<AiSuggestion[]>([]);
  const [source, setSource] = useState<"ai" | "fallback" | null>(null);
  const [added, setAdded] = useState<Set<number>>(new Set());
  const breakdown = useAiBreakdown();
  const createTask = useCreateTask(projectId);

  const reset = () => {
    setGoal("");
    setSuggestions([]);
    setSource(null);
    setAdded(new Set());
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleGenerate = async () => {
    if (goal.trim().length < 3) return;
    try {
      const result = await breakdown.mutateAsync(goal);
      setSuggestions(result.suggestions);
      setSource(result.source);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't generate suggestions");
    }
  };

  const addOne = async (s: AiSuggestion, index: number) => {
    await createTask.mutateAsync({ title: s.title, status: "Todo", priority: "Medium" });
    setAdded((prev) => new Set(prev).add(index));
  };

  const addAll = async () => {
    await Promise.all(
      suggestions.map((s, i) => (!added.has(i) ? createTask.mutateAsync({ title: s.title, status: "Todo", priority: "Medium" }) : null))
    );
    setAdded(new Set(suggestions.map((_, i) => i)));
    toast.success("All suggestions added");
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="AI Task Breakdown"
      description="Describe a goal — FocusFlow will turn it into a focused list of tasks."
      focusReveal
    >
      <div className="space-y-4">
        <div>
          <Textarea
            rows={2}
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g. Prepare my final web development project"
          />
        </div>
        <Button onClick={handleGenerate} disabled={breakdown.isPending || goal.trim().length < 3} className="w-full">
          {breakdown.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Focusing your goal...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" /> Break it down
            </>
          )}
        </Button>

        {suggestions.length > 0 && (
          <div className="animate-focus-in space-y-2 border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Suggested tasks {source === "fallback" && "(offline mode)"}
              </p>
              <button onClick={addAll} className="flex items-center gap-1 text-xs font-medium text-coral hover:underline">
                <CheckCheck className="h-3.5 w-3.5" /> Add all
              </button>
            </div>
            <ul className="space-y-1.5">
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between rounded-md border border-border bg-surface px-3 py-2 text-sm"
                >
                  <span className="text-ink">{s.title}</span>
                  <button
                    onClick={() => addOne(s, i)}
                    disabled={added.has(i)}
                    className="flex items-center gap-1 text-xs font-medium text-coral disabled:text-moss"
                  >
                    {added.has(i) ? (
                      "Added"
                    ) : (
                      <>
                        <Plus className="h-3.5 w-3.5" /> Add
                      </>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Dialog>
  );
}
