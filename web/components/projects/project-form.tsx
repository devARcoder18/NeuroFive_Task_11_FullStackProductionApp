"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { projectSchema, type ProjectFormValues } from "@/lib/validators";
import { useCreateProject, useUpdateProject } from "@/hooks/use-projects";
import type { Project } from "@/types";

const COLORS = ["#FF5A4E", "#E8A33D", "#3F6A52", "#6B7280"];

export function ProjectForm({ project, onDone }: { project?: Project; onDone: () => void }) {
  const isEdit = !!project;
  const create = useCreateProject();
  const update = useUpdateProject(project?._id ?? "");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project?.name ?? "",
      description: project?.description ?? "",
      status: project?.status ?? "Planning",
      color: project?.color ?? COLORS[0],
    },
  });

  const color = watch("color");

  const onSubmit = async (values: ProjectFormValues) => {
    try {
      if (isEdit) {
        await update.mutateAsync(values);
        toast.success("Project updated");
      } else {
        await create.mutateAsync(values);
        toast.success("Project created");
      }
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-ink">Name</label>
        <Input {...register("name")} placeholder="e.g. Final Web Development Project" />
        {errors.name && <p className="mt-1 text-xs text-coral">{errors.name.message}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-ink">Description</label>
        <Textarea rows={3} {...register("description")} placeholder="What is this project about?" />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-ink">Status</label>
          <Select {...register("status")} className="w-full">
            <option>Planning</option>
            <option>In Progress</option>
            <option>Completed</option>
            <option>Archived</option>
          </Select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Color</label>
          <div className="flex h-10 items-center gap-2">
            {COLORS.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setValue("color", c)}
                className="h-6 w-6 rounded-full ring-offset-2 ring-offset-surface-raised"
                style={{ backgroundColor: c, boxShadow: color === c ? `0 0 0 2px ${c}` : undefined }}
                aria-label={`Choose color ${c}`}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isEdit ? "Save changes" : "Create project"}
        </Button>
      </div>
    </form>
  );
}
