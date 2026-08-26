import { z } from "zod";

export const taskPriorities = ["LOW", "MEDIUM", "HIGH"] as const;

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  description: z.string().max(2000, "Description is too long").optional(),
  priority: z.enum(taskPriorities).default("MEDIUM"),
  dueDate: z.iso.date().optional().or(z.literal("")),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = createTaskSchema.extend({
  id: z.string().min(1),
});

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

export const taskStatusFilters = ["active", "completed", "archived", "all"] as const;
export type TaskStatusFilter = (typeof taskStatusFilters)[number];

export const taskSortOptions = ["newest", "oldest", "dueDate", "priority", "title"] as const;
export type TaskSortOption = (typeof taskSortOptions)[number];
