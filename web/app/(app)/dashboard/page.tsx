"use client";

import { useState } from "react";
import { FolderKanban, Flame, CheckCircle2, AlertTriangle, Plus, Sparkles } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { ProgressChart } from "@/components/dashboard/progress-chart";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { PriorityBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { ProjectForm } from "@/components/projects/project-form";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboard } from "@/hooks/use-tasks";
import { formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const { data, isLoading, isError, refetch } = useDashboard();
  const [newProjectOpen, setNewProjectOpen] = useState(false);

  if (isError) return <ErrorState message="Couldn't load your dashboard." onRetry={() => refetch()} />;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink">Overview</h2>
          <p className="text-sm text-muted-foreground">Here's where things stand today.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => setNewProjectOpen(true)}>
            <Plus className="h-4 w-4" /> New project
          </Button>
        </div>
      </div>

      {isLoading || !data ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Total projects" value={data.totalProjects} icon={FolderKanban} />
          <StatCard label="Active projects" value={data.activeProjects} icon={Flame} tone="coral" />
          <StatCard label="Completed tasks" value={data.completedTasks} icon={CheckCircle2} tone="moss" />
          <StatCard label="Overdue tasks" value={data.overdueTasks} icon={AlertTriangle} tone="coral" />
        </div>
      )}

      {data && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="flex flex-col items-center justify-center gap-3 p-6 lg:col-span-1">
            <p className="text-sm font-medium text-ink">Progress overview</p>
            <ProgressChart completed={data.completedTasks} remaining={data.overdueTasks + data.priorityTasks.length} />
          </Card>

          <Card className="p-5 lg:col-span-1">
            <p className="mb-3 text-sm font-medium text-ink">Today's tasks</p>
            {data.todayTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing due today. Enjoy the clear runway.</p>
            ) : (
              <ul className="space-y-2">
                {data.todayTasks.map((t) => (
                  <li key={t._id} className="flex items-center justify-between text-sm">
                    <span className="truncate text-ink">{t.title}</span>
                    <PriorityBadge priority={t.priority} />
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="p-5 lg:col-span-1">
            <p className="mb-3 text-sm font-medium text-ink">Priority tasks</p>
            {data.priorityTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No high-priority tasks open right now.</p>
            ) : (
              <ul className="space-y-2">
                {data.priorityTasks.map((t) => (
                  <li key={t._id} className="flex items-center justify-between text-sm">
                    <span className="truncate text-ink">{t.title}</span>
                    <span className="font-mono text-xs text-muted-foreground">{formatDate(t.dueDate)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      )}

      {data && data.totalProjects === 0 && (
        <EmptyState
          icon={Sparkles}
          title="No projects yet"
          description="Create your first project to start organizing your work."
          actionLabel="New project"
          onAction={() => setNewProjectOpen(true)}
        />
      )}

      <Dialog open={newProjectOpen} onClose={() => setNewProjectOpen(false)} title="New project">
        <ProjectForm onDone={() => setNewProjectOpen(false)} />
      </Dialog>
    </div>
  );
}
