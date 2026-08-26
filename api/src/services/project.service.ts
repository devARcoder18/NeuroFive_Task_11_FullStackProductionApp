import { Project } from "../models/Project.js";
import { Task } from "../models/Task.js";
import { AppError } from "../utils/AppError.js";
import type { CreateProjectInput, UpdateProjectInput } from "../validators/project.validator.js";

export async function listProjects(userId: string, search?: string, status?: string) {
  const query: Record<string, unknown> = { userId };
  if (search) query.name = { $regex: search, $options: "i" };
  if (status) query.status = status;
  return Project.find(query).sort({ updatedAt: -1 });
}

export async function getProjectOr404(userId: string, projectId: string) {
  const project = await Project.findOne({ _id: projectId, userId });
  if (!project) throw new AppError("Project not found.", 404);
  return project;
}

export async function createProject(userId: string, input: CreateProjectInput) {
  return Project.create({ ...input, userId });
}

export async function updateProject(userId: string, projectId: string, input: UpdateProjectInput) {
  const project = await getProjectOr404(userId, projectId);
  Object.assign(project, input);
  await project.save();
  return project;
}

export async function deleteProject(userId: string, projectId: string) {
  await getProjectOr404(userId, projectId);
  await Task.deleteMany({ projectId, userId });
  await Project.deleteOne({ _id: projectId, userId });
}
