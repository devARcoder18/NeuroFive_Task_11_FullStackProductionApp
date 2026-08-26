import { cn } from "@/lib/utils";
import type { TaskPriority, TaskStatus, ProjectStatus } from "@/types";

const priorityClasses: Record<TaskPriority, string> = {
  Low: "bg-muted text-muted-foreground",
  Medium: "bg-amber/15 text-amber",
  High: "bg-coral/15 text-coral",
  Urgent: "bg-coral text-coral-foreground",
};

const statusClasses: Record<TaskStatus | ProjectStatus, string> = {
  Todo: "bg-muted text-muted-foreground",
  Planning: "bg-muted text-muted-foreground",
  "In Progress": "bg-amber/15 text-amber",
  Completed: "bg-moss/15 text-moss",
  Archived: "bg-muted text-muted-foreground",
};

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium font-mono", priorityClasses[priority])}>
      {priority}
    </span>
  );
}

export function StatusBadge({ status }: { status: TaskStatus | ProjectStatus }) {
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", statusClasses[status])}>{status}</span>
  );
}
