import { z } from "zod";

export const createSubtaskSchema = z.object({
  taskId: z.string().min(1),
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
});

export type CreateSubtaskInput = z.infer<typeof createSubtaskSchema>;

export const updateSubtaskSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
});

export type UpdateSubtaskInput = z.infer<typeof updateSubtaskSchema>;
