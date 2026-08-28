"use server";

import { requireCurrentUser } from "@/lib/session";
import * as tasksService from "@/services/tasks";
import type { TaskWithRelations } from "@/services/tasks";

// Global search spans every status (unlike the Tasks page's own search
// filter, which defaults to "active") since the point is to find anything,
// from anywhere — including a task you've already completed or archived.
export async function searchTasksAction(query: string): Promise<TaskWithRelations[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  try {
    const user = await requireCurrentUser();
    return await tasksService.getTasks(user.id, { search: trimmed, status: "all", limit: 8 });
  } catch {
    return [];
  }
}
