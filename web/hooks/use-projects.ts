"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Project } from "@/types";
import type { ProjectFormValues } from "@/lib/validators";

export function useProjects(search?: string, status?: string) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (status) params.set("status", status);
  const qs = params.toString();

  return useQuery({
    queryKey: ["projects", search ?? "", status ?? ""],
    queryFn: () => api.get<{ projects: Project[] }>(`/api/projects${qs ? `?${qs}` : ""}`).then((r) => r.projects),
  });
}

export function useProject(projectId: string) {
  return useQuery({
    queryKey: ["projects", projectId],
    queryFn: () => api.get<{ project: Project }>(`/api/projects/${projectId}`).then((r) => r.project),
    enabled: !!projectId,
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (values: ProjectFormValues) => api.post<{ project: Project }>("/api/projects", values),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["projects"] }),
  });
}

export function useUpdateProject(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (values: Partial<ProjectFormValues>) => api.put<{ project: Project }>(`/api/projects/${projectId}`, values),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["projects"] }),
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (projectId: string) => api.delete(`/api/projects/${projectId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["projects"] }),
  });
}
