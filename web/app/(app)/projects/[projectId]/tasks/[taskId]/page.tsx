"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { taskSchema, type TaskFormValues } from "@/lib/validators";
import { useTask, useUpdateTask, useDeleteTask } from "@/hooks/use-tasks";

export default function TaskDetailPage() {
  const { projectId, taskId } = useParams<{ projectId: string; taskId: string }>();
  const router = useRouter();
  const { data: task, isLoading, isError, refetch } = useTask(taskId);
  const updateTask = useUpdateTask(projectId);
  const deleteTask = useDeleteTask(projectId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({ resolver: zodResolver(taskSchema) });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description ?? "",
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : undefined,
      });
    }
  }, [task, reset]);

  const onSubmit = async (values: TaskFormValues) => {
    try {
      await updateTask.mutateAsync({ taskId, values });
      toast.success("Task saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const onDelete = async () => {
    await deleteTask.mutateAsync(taskId);
    toast.success("Task deleted");
    router.push(`/projects/${projectId}`);
  };

  if (isError) return <ErrorState message="Couldn't load this task." onRetry={() => refetch()} />;

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <button
        onClick={() => router.push(`/projects/${projectId}`)}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> Back to project
      </button>

      <Card className="p-5">
        {isLoading || !task ? (
          <div className="space-y-3">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">Title</label>
              <Input {...register("title")} />
              {errors.title && <p className="mt-1 text-xs text-coral">{errors.title.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">Description</label>
              <Textarea rows={4} {...register("description")} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-ink">Status</label>
                <Select {...register("status")} className="w-full">
                  <option>Todo</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </Select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-ink">Priority</label>
                <Select {...register("priority")} className="w-full">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Urgent</option>
                </Select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-ink">Due date</label>
                <Input type="date" {...register("dueDate")} />
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-4">
              <Button type="button" variant="danger" size="sm" onClick={onDelete}>
                <Trash2 className="h-3.5 w-3.5" /> Delete task
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                Save changes
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
