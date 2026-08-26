import { z } from "zod";
import { PROJECT_STATUSES } from "../models/Project.js";

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, "Project name is required").max(120),
  description: z.string().trim().max(2000).optional().default(""),
  status: z.enum(PROJECT_STATUSES as [string, ...string[]]).optional().default("Planning"),
  color: z.string().trim().optional().default("#FF5A4E"),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
