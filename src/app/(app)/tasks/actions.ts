"use server";

import { revalidatePath } from "next/cache";
import { requireCurrentUser } from "@/lib/session";
import { createReminderSchema } from "@/lib/validations/reminder";
import { createSubtaskSchema, updateSubtaskSchema } from "@/lib/validations/subtask";
import { createTaskSchema, updateTaskSchema } from "@/lib/validations/task";
import * as remindersService from "@/services/reminders";
import * as subtasksService from "@/services/subtasks";
import * as tasksService from "@/services/tasks";

export interface ActionResult<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
}

function toErrorResult(error: unknown): ActionResult {
  if (error instanceof Error && error.message === "Not authenticated") {
    return { success: false, message: "You need to sign in again." };
  }
  return { success: false, message: "Something went wrong. Please try again." };
}

export async function createTaskAction(input: unknown): Promise<ActionResult> {
  try {
    const user = await requireCurrentUser();
    const parsed = createTaskSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid task data." };
    }

    await tasksService.createTask(user.id, parsed.data);
    revalidatePath("/tasks");
    return { success: true, message: "Task created." };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function updateTaskAction(input: unknown): Promise<ActionResult> {
  try {
    const user = await requireCurrentUser();
    const parsed = updateTaskSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid task data." };
    }

    const updated = await tasksService.updateTask(user.id, parsed.data);
    if (!updated) {
      return { success: false, message: "Task not found." };
    }

    revalidatePath("/tasks");
    return { success: true, message: "Task updated." };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function deleteTaskAction(id: string): Promise<ActionResult> {
  try {
    const user = await requireCurrentUser();
    const deleted = await tasksService.deleteTask(user.id, id);
    if (!deleted) {
      return { success: false, message: "Task not found." };
    }

    revalidatePath("/tasks");
    return { success: true, message: "Task deleted." };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function toggleTaskCompletedAction(id: string): Promise<ActionResult> {
  try {
    const user = await requireCurrentUser();
    const updated = await tasksService.toggleTaskCompleted(user.id, id);
    if (!updated) {
      return { success: false, message: "Task not found." };
    }

    revalidatePath("/tasks");
    return {
      success: true,
      message: updated.completed ? "Task completed." : "Task marked as active.",
    };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function toggleTaskArchivedAction(id: string): Promise<ActionResult> {
  try {
    const user = await requireCurrentUser();
    const updated = await tasksService.toggleTaskArchived(user.id, id);
    if (!updated) {
      return { success: false, message: "Task not found." };
    }

    revalidatePath("/tasks");
    return {
      success: true,
      message: updated.archived ? "Task archived." : "Task restored.",
    };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function toggleTaskPinnedAction(id: string): Promise<ActionResult> {
  try {
    const user = await requireCurrentUser();
    const updated = await tasksService.toggleTaskPinned(user.id, id);
    if (!updated) {
      return { success: false, message: "Task not found." };
    }

    revalidatePath("/tasks");
    return {
      success: true,
      message: updated.pinned ? "Task pinned." : "Task unpinned.",
    };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function duplicateTaskAction(id: string): Promise<ActionResult> {
  try {
    const user = await requireCurrentUser();
    const duplicated = await tasksService.duplicateTask(user.id, id);
    if (!duplicated) {
      return { success: false, message: "Task not found." };
    }

    revalidatePath("/tasks");
    return { success: true, message: "Task duplicated." };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function createSubtaskAction(input: unknown): Promise<ActionResult> {
  try {
    const user = await requireCurrentUser();
    const parsed = createSubtaskSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message ?? "Invalid subtask data.",
      };
    }

    const created = await subtasksService.createSubtask(user.id, parsed.data);
    if (!created) {
      return { success: false, message: "Task not found." };
    }

    revalidatePath("/tasks");
    return { success: true, message: "Subtask added." };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function updateSubtaskAction(input: unknown): Promise<ActionResult> {
  try {
    const user = await requireCurrentUser();
    const parsed = updateSubtaskSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message ?? "Invalid subtask data.",
      };
    }

    const updated = await subtasksService.updateSubtask(user.id, parsed.data);
    if (!updated) {
      return { success: false, message: "Subtask not found." };
    }

    revalidatePath("/tasks");
    return { success: true, message: "Subtask updated." };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function deleteSubtaskAction(id: string): Promise<ActionResult> {
  try {
    const user = await requireCurrentUser();
    const deleted = await subtasksService.deleteSubtask(user.id, id);
    if (!deleted) {
      return { success: false, message: "Subtask not found." };
    }

    revalidatePath("/tasks");
    return { success: true, message: "Subtask deleted." };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function toggleSubtaskCompletedAction(id: string): Promise<ActionResult> {
  try {
    const user = await requireCurrentUser();
    const updated = await subtasksService.toggleSubtaskCompleted(user.id, id);
    if (!updated) {
      return { success: false, message: "Subtask not found." };
    }

    revalidatePath("/tasks");
    return { success: true, message: "" };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function createReminderAction(input: unknown): Promise<ActionResult> {
  try {
    const user = await requireCurrentUser();
    const parsed = createReminderSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message ?? "Invalid reminder data.",
      };
    }

    const created = await remindersService.createReminder(user.id, parsed.data);
    if (!created) {
      return { success: false, message: "Task not found." };
    }

    revalidatePath("/tasks");
    return { success: true, message: "Reminder set." };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function deleteReminderAction(id: string): Promise<ActionResult> {
  try {
    const user = await requireCurrentUser();
    const deleted = await remindersService.deleteReminder(user.id, id);
    if (!deleted) {
      return { success: false, message: "Reminder not found." };
    }

    revalidatePath("/tasks");
    return { success: true, message: "Reminder removed." };
  } catch (error) {
    return toErrorResult(error);
  }
}
