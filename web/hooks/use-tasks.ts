"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { DashboardStats, Task } from "@/types";
import type { TaskFormValues } from "@/lib/validators";

export function useTasks(projectId: string, search?: string, status?: string, priority?: string) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (status) params.set("status", status);
  if (priority) params.set("priority", priority);
  const qs = params.toString();

  return useQuery({
    queryKey: ["tasks", projectId, search ?? "", status ?? "", priority ?? ""],
    queryFn: () => api.get<{ tasks: Task[] }>(`/api/projects/${projectId}/tasks${qs ? `?${qs}` : ""}`).then((r) => r.tasks),
    enabled: !!projectId,
  });
}

export function useTask(taskId: string) {
  return useQuery({
    queryKey: ["task", taskId],
    queryFn: () => api.get<{ task: Task }>(`/api/tasks/${taskId}`).then((r) => r.task),
    enabled: !!taskId,
  });
}

export function useCreateTask(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (values: Partial<TaskFormValues>) => api.post<{ task: Task }>(`/api/projects/${projectId}/tasks`, values),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks", projectId] }),
  });
}

export function useUpdateTask(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, values }: { taskId: string; values: Partial<TaskFormValues> }) =>
      api.put<{ task: Task }>(`/api/tasks/${taskId}`, values),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks", projectId] }),
  });
}

export function useDeleteTask(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) => api.delete(`/api/tasks/${taskId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks", projectId] }),
  });
}

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: () => api.get<DashboardStats>("/api/tasks/dashboard"),
  });
}

export function useAiBreakdown() {
  return useMutation({
    mutationFn: (goal: string) =>
      api.post<{ suggestions: { title: string }[]; source: "ai" | "fallback" }>("/api/ai/breakdown", { goal }),
  });
}
