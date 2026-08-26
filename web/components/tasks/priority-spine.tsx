import { cn } from "@/lib/utils";
import type { TaskPriority } from "@/types";

const spineClass: Record<TaskPriority, string> = {
  Low: "priority-spine-low",
  Medium: "priority-spine-medium",
  High: "priority-spine-high",
  Urgent: "priority-spine-urgent",
};

/**
 * The Priority Spine: a data-driven vertical bar, not decoration.
 * Its color and glow are derived directly from the task's priority.
 */
export function PrioritySpine({ priority, className }: { priority: TaskPriority; className?: string }) {
  return <span className={cn("w-1 shrink-0 self-stretch rounded-full", spineClass[priority], className)} />;
}
