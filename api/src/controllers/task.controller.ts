import { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AuthedRequest } from "../middleware/auth.middleware.js";
import * as taskService from "../services/task.service.js";

export const listTasks = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const { search, status, priority } = req.query as { search?: string; status?: string; priority?: string };
  const tasks = await taskService.listTasks(req.userId!, req.params.projectId, search, status, priority);
  res.json({ tasks });
});

export const createTask = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const task = await taskService.createTask(req.userId!, req.params.projectId, req.body);
  res.status(201).json({ task });
});

export const getTask = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const task = await taskService.getTaskOr404(req.userId!, req.params.id);
  res.json({ task });
});

export const updateTask = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const task = await taskService.updateTask(req.userId!, req.params.id, req.body);
  res.json({ task });
});

export const deleteTask = asyncHandler(async (req: AuthedRequest, res: Response) => {
  await taskService.deleteTask(req.userId!, req.params.id);
  res.status(204).send();
});

export const getDashboard = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const stats = await taskService.dashboardStats(req.userId!);
  res.json(stats);
});
