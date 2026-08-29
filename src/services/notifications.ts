import { prisma } from "@/lib/prisma";
import { addUtcDays, startOfUtcDay } from "@/lib/calendar-dates";

export interface NotificationItem {
  id: string;
  type: "reminder" | "overdue" | "due-soon";
  reminderId?: string;
  taskId: string;
  taskTitle: string;
  at: Date;
}

/** Reminders due for delivery, plus tasks that are overdue or due today —
 * everything a user would want surfaced by the notifications bell. There's
 * no push infrastructure here: this is computed fresh each time it's called
 * (on mount and whenever the bell is opened), not pushed to the client.
 * Each category is skipped entirely if the user has turned it off in
 * Settings (Phase 14). */
export async function getNotifications(userId: string): Promise<NotificationItem[]> {
  const now = new Date();
  const todayStart = startOfUtcDay(now);
  const tomorrowStart = addUtcDays(todayStart, 1);

  const preferences = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { notifyOverdue: true, notifyDueSoon: true, notifyReminders: true },
  });

  const [dueReminders, overdueTasks, dueSoonTasks] = await Promise.all([
    preferences.notifyReminders
      ? prisma.reminder.findMany({
          where: { sent: false, remindAt: { lte: now }, task: { userId } },
          include: { task: { select: { id: true, title: true } } },
          orderBy: { remindAt: "asc" },
        })
      : [],
    preferences.notifyOverdue
      ? prisma.task.findMany({
          where: { userId, archived: false, completed: false, dueDate: { lt: todayStart } },
          select: { id: true, title: true, dueDate: true },
          orderBy: { dueDate: "asc" },
        })
      : [],
    preferences.notifyDueSoon
      ? prisma.task.findMany({
          where: {
            userId,
            archived: false,
            completed: false,
            dueDate: { gte: todayStart, lt: tomorrowStart },
          },
          select: { id: true, title: true, dueDate: true },
          orderBy: { dueDate: "asc" },
        })
      : [],
  ]);

  return [
    ...dueReminders.map((reminder) => ({
      id: `reminder-${reminder.id}`,
      type: "reminder" as const,
      reminderId: reminder.id,
      taskId: reminder.taskId,
      taskTitle: reminder.task.title,
      at: reminder.remindAt,
    })),
    ...overdueTasks.map((task) => ({
      id: `overdue-${task.id}`,
      type: "overdue" as const,
      taskId: task.id,
      taskTitle: task.title,
      at: task.dueDate as Date,
    })),
    ...dueSoonTasks.map((task) => ({
      id: `due-soon-${task.id}`,
      type: "due-soon" as const,
      taskId: task.id,
      taskTitle: task.title,
      at: task.dueDate as Date,
    })),
  ];
}
