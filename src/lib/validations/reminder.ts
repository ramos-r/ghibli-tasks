import { z } from "zod";

export const createReminderSchema = z.object({
  taskId: z.string().min(1),
  remindAt: z
    .string()
    .min(1, "Pick a date and time")
    .refine((value) => !Number.isNaN(new Date(value).getTime()), "Invalid date"),
});

export type CreateReminderInput = z.infer<typeof createReminderSchema>;
