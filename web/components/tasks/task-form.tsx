"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { taskSchema, type TaskFormValues } from "@/lib/validators";
import { useCreateTask } from "@/hooks/use-tasks";

export function TaskForm({ projectId, onDone }: { projectId: string; onDone: () => void }) {
  const createTask = useCreateTask(projectId);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: { title: "", description: "", status: "Todo", priority: "Medium" },
  });

  const onSubmit = async (values: TaskFormValues) => {
    try {
      await createTask.mutateAsync(values);
      toast.success("Task added");
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-ink">Title</label>
        <Input {...register("title")} placeholder="e.g. Build authentication" />
        {errors.title && <p className="mt-1 text-xs text-coral">{errors.title.message}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-ink">Description</label>
        <Textarea rows={2} {...register("description")} placeholder="Optional detail" />
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
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Add task
        </Button>
      </div>
    </form>
  );
}
