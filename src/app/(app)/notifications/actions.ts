"use server";

import { requireCurrentUser } from "@/lib/session";
import * as notificationsService from "@/services/notifications";
import * as remindersService from "@/services/reminders";
import type { NotificationItem } from "@/services/notifications";

export async function getNotificationsAction(): Promise<NotificationItem[]> {
  try {
    const user = await requireCurrentUser();
    return await notificationsService.getNotifications(user.id);
  } catch {
    return [];
  }
}

export async function dismissReminderAction(id: string): Promise<{ success: boolean }> {
  try {
    const user = await requireCurrentUser();
    const updated = await remindersService.dismissReminder(user.id, id);
    return { success: !!updated };
  } catch {
    return { success: false };
  }
}
