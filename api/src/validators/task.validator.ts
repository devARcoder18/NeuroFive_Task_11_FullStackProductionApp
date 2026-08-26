import { z } from "zod";
import { TASK_STATUSES, TASK_PRIORITIES } from "../models/Task.js";

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Task title is required").max(200),
  description: z.string().trim().max(2000).optional().default(""),
  status: z.enum(TASK_STATUSES as [string, ...string[]]).optional().default("Todo"),
  priority: z.enum(TASK_PRIORITIES as [string, ...string[]]).optional().default("Medium"),
  dueDate: z.coerce.date().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export const aiBreakdownSchema = z.object({
  goal: z.string().trim().min(3, "Describe your goal in a few more words").max(300),
  projectId: z.string().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
