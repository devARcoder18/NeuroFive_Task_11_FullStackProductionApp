export type ProjectStatus = "Planning" | "In Progress" | "Completed" | "Archived";
export type TaskStatus = "Todo" | "In Progress" | "Completed";
export type TaskPriority = "Low" | "Medium" | "High" | "Urgent";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Project {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  projectId: string;
  userId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedTasks: number;
  overdueTasks: number;
  todayTasks: Task[];
  priorityTasks: Task[];
}

export interface AiSuggestion {
  title: string;
}
