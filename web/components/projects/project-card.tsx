"use client";

import Link from "next/link";
import { MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import type { Project } from "@/types";
import { formatDate } from "@/lib/utils";
import { useDeleteProject } from "@/hooks/use-projects";

export function ProjectCard({ project }: { project: Project }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const deleteProject = useDeleteProject();

  return (
    <Card className="relative flex flex-col gap-3 p-4">
      <div className="flex items-start justify-between">
        <Link href={`/projects/${project._id}`} className="flex-1">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: project.color }} />
            <h3 className="font-display text-sm font-semibold text-ink">{project.name}</h3>
          </div>
        </Link>
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted"
            aria-label="Project actions"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 z-10 mt-1 w-36 rounded-md border border-border bg-surface-raised py-1 shadow-lg">
              <button
                onClick={() => {
                  deleteProject.mutate(project._id);
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-coral hover:bg-coral/5"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <Link href={`/projects/${project._id}`}>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {project.description || "No description yet."}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <StatusBadge status={project.status} />
          <span className="font-mono text-xs text-muted-foreground">Updated {formatDate(project.updatedAt)}</span>
        </div>
      </Link>
    </Card>
  );
}
