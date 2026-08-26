import { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AuthedRequest } from "../middleware/auth.middleware.js";
import * as projectService from "../services/project.service.js";

export const listProjects = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const { search, status } = req.query as { search?: string; status?: string };
  const projects = await projectService.listProjects(req.userId!, search, status);
  res.json({ projects });
});

export const getProject = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const project = await projectService.getProjectOr404(req.userId!, req.params.id);
  res.json({ project });
});

export const createProject = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const project = await projectService.createProject(req.userId!, req.body);
  res.status(201).json({ project });
});

export const updateProject = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const project = await projectService.updateProject(req.userId!, req.params.id, req.body);
  res.json({ project });
});

export const deleteProject = asyncHandler(async (req: AuthedRequest, res: Response) => {
  await projectService.deleteProject(req.userId!, req.params.id);
  res.status(204).send();
});
