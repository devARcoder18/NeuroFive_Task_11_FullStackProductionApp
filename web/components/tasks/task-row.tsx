"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Trash2 } from "lucide-react";
import { PrioritySpine } from "./priority-spine";
import { StatusBadge, PriorityBadge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { cn, formatDate, isOverdue } from "@/lib/utils";
import { useDeleteTask, useUpdateTask } from "@/hooks/use-tasks";
import type { Task } from "@/types";

export function TaskRow({ task, projectId }: { task: Task; projectId: string }) {
  const updateTask = useUpdateTask(projectId);
  const deleteTask = useDeleteTask(projectId);
  const overdue = isOverdue(task.dueDate, task.status);
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex items-center gap-3 rounded-md border border-border bg-surface-raised px-3 py-2.5 transition-colors hover:border-coral/30"
    >
      <PrioritySpine priority={task.priority} />
      <Link href={`/projects/${projectId}/tasks/${task._id}`} className="min-w-0 flex-1">
        <p className={cn("truncate text-sm text-ink", task.status === "Completed" && "text-muted-foreground line-through")}>
          {task.title}
        </p>
        {task.dueDate && (
          <span className={cn("mt-0.5 flex items-center gap-1 font-mono text-xs", overdue ? "text-coral" : "text-muted-foreground")}>
            <Calendar className="h-3 w-3" /> {formatDate(task.dueDate)} {overdue && "· overdue"}
          </span>
        )}
      </Link>
      <PriorityBadge priority={task.priority} />
      <Select
        value={task.status}
        onChange={(e) => updateTask.mutate({ taskId: task._id, values: { status: e.target.value as Task["status"] } })}
        className="hidden h-8 text-xs sm:block"
      >
        <option>Todo</option>
        <option>In Progress</option>
        <option>Completed</option>
      </Select>
      <button
        onClick={() => deleteTask.mutate(task._id)}
        className={cn("rounded-md p-1.5 text-muted-foreground hover:bg-coral/10 hover:text-coral", !hover && "opacity-0 sm:opacity-100")}
        aria-label="Delete task"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
