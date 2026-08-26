import { Task } from "../models/Task.js";
import { getProjectOr404 } from "./project.service.js";
import { AppError } from "../utils/AppError.js";
import type { CreateTaskInput, UpdateTaskInput } from "../validators/task.validator.js";

export async function listTasks(userId: string, projectId: string, search?: string, status?: string, priority?: string) {
  await getProjectOr404(userId, projectId);
  const query: Record<string, unknown> = { userId, projectId };
  if (search) query.title = { $regex: search, $options: "i" };
  if (status) query.status = status;
  if (priority) query.priority = priority;
  return Task.find(query).sort({ dueDate: 1, createdAt: -1 });
}

export async function getTaskOr404(userId: string, taskId: string) {
  const task = await Task.findOne({ _id: taskId, userId });
  if (!task) throw new AppError("Task not found.", 404);
  return task;
}

export async function createTask(userId: string, projectId: string, input: CreateTaskInput) {
  await getProjectOr404(userId, projectId);
  return Task.create({ ...input, userId, projectId });
}

export async function updateTask(userId: string, taskId: string, input: UpdateTaskInput) {
  const task = await getTaskOr404(userId, taskId);
  Object.assign(task, input);
  await task.save();
  return task;
}

export async function deleteTask(userId: string, taskId: string) {
  await getTaskOr404(userId, taskId);
  await Task.deleteOne({ _id: taskId, userId });
}

export async function dashboardStats(userId: string) {
  const [totalProjects, activeProjects, completedTasks, overdueTasks, todayTasks, priorityTasks] = await Promise.all([
    Task.db.model("Project").countDocuments({ userId }),
    Task.db.model("Project").countDocuments({ userId, status: "In Progress" }),
    Task.countDocuments({ userId, status: "Completed" }),
    Task.countDocuments({ userId, status: { $ne: "Completed" }, dueDate: { $lt: new Date() } }),
    Task.find({ userId, dueDate: { $gte: startOfToday(), $lt: endOfToday() } }).sort({ priority: -1 }),
    Task.find({ userId, status: { $ne: "Completed" }, priority: { $in: ["High", "Urgent"] } })
      .sort({ priority: -1 })
      .limit(6),
  ]);

  return { totalProjects, activeProjects, completedTasks, overdueTasks, todayTasks, priorityTasks };
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}
function endOfToday() {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
}
