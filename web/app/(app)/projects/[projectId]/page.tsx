"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Plus, Search, ListTodo, Sparkles, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/ui/badge";
import { TaskRow } from "@/components/tasks/task-row";
import { TaskForm } from "@/components/tasks/task-form";
import { ProjectForm } from "@/components/projects/project-form";
import { AiBreakdownModal } from "@/components/ai/ai-breakdown-modal";
import { RowSkeletonList } from "@/components/shared/skeletons";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { useProject } from "@/hooks/use-projects";
import { useTasks } from "@/hooks/use-tasks";

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  const { data: project, isLoading: projectLoading } = useProject(projectId);
  const { data: tasks, isLoading, isError, refetch } = useTasks(projectId, search, status, priority);

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          {projectLoading || !project ? (
            <div className="h-7 w-48 animate-pulse rounded bg-muted" />
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: project.color }} />
                <h2 className="font-display text-xl font-semibold text-ink">{project.name}</h2>
                <button onClick={() => setEditOpen(true)} className="text-muted-foreground hover:text-ink" aria-label="Edit project">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <StatusBadge status={project.status} />
                {project.description && <p className="truncate text-sm text-muted-foreground">{project.description}</p>}
              </div>
            </>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => setAiOpen(true)}>
            <Sparkles className="h-4 w-4" /> AI Breakdown
          </Button>
          <Button size="sm" onClick={() => setTaskFormOpen(true)}>
            <Plus className="h-4 w-4" /> New task
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tasks..." className="pl-9" />
        </div>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="sm:w-40">
          <option value="">All statuses</option>
          <option>Todo</option>
          <option>In Progress</option>
          <option>Completed</option>
        </Select>
        <Select value={priority} onChange={(e) => setPriority(e.target.value)} className="sm:w-40">
          <option value="">All priorities</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Urgent</option>
        </Select>
      </div>

      {isLoading && <RowSkeletonList />}
      {isError && <ErrorState message="Couldn't load tasks." onRetry={() => refetch()} />}

      {!isLoading && !isError && tasks && tasks.length === 0 && (
        <EmptyState
          icon={ListTodo}
          title="No tasks yet"
          description="Add a task manually, or let the AI Breakdown Assistant suggest a starting list."
          actionLabel="New task"
          onAction={() => setTaskFormOpen(true)}
        />
      )}

      {!isLoading && tasks && tasks.length > 0 && (
        <div className="space-y-2">
          {tasks.map((t) => (
            <TaskRow key={t._id} task={t} projectId={projectId} />
          ))}
        </div>
      )}

      <Dialog open={taskFormOpen} onClose={() => setTaskFormOpen(false)} title="New task">
        <TaskForm projectId={projectId} onDone={() => setTaskFormOpen(false)} />
      </Dialog>

      {project && (
        <Dialog open={editOpen} onClose={() => setEditOpen(false)} title="Edit project">
          <ProjectForm project={project} onDone={() => setEditOpen(false)} />
        </Dialog>
      )}

      <AiBreakdownModal projectId={projectId} open={aiOpen} onClose={() => setAiOpen(false)} />
    </div>
  );
}
