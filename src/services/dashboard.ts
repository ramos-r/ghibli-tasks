import { prisma } from "@/lib/prisma";
import { addUtcDays, addUtcMonths, getWeekDays, startOfUtcDay, utcDay } from "@/lib/calendar-dates";

export async function getTaskCounts(userId: string) {
  const [todayCount, completedCount, pendingCount] = await Promise.all([
    prisma.task.count({
      where: {
        userId,
        archived: false,
        dueDate: { gte: startOfUtcDay(new Date()), lt: addUtcDays(startOfUtcDay(new Date()), 1) },
      },
    }),
    prisma.task.count({ where: { userId, completed: true, archived: false } }),
    prisma.task.count({ where: { userId, completed: false, archived: false } }),
  ]);

  return { todayCount, completedCount, pendingCount };
}

async function getProgress(userId: string, start: Date, end: Date) {
  const [total, completed] = await Promise.all([
    prisma.task.count({ where: { userId, archived: false, dueDate: { gte: start, lt: end } } }),
    prisma.task.count({
      where: { userId, archived: false, completed: true, dueDate: { gte: start, lt: end } },
    }),
  ]);

  return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
}

export async function getWeeklyProgress(userId: string) {
  const days = getWeekDays(new Date());
  return getProgress(userId, days[0], addUtcDays(days[6], 1));
}

export async function getMonthlyProgress(userId: string) {
  const today = new Date();
  const start = utcDay(today.getUTCFullYear(), today.getUTCMonth(), 1);
  return getProgress(userId, start, addUtcMonths(start, 1));
}

export async function getUpcomingDeadlines(userId: string, days = 7) {
  const tomorrowStart = addUtcDays(startOfUtcDay(new Date()), 1);
  const rangeEnd = addUtcDays(tomorrowStart, days);

  return prisma.task.findMany({
    where: {
      userId,
      archived: false,
      completed: false,
      dueDate: { gte: tomorrowStart, lt: rangeEnd },
    },
    include: {
      category: true,
      tags: true,
      subtasks: { orderBy: { order: "asc" } },
      reminders: { orderBy: { remindAt: "asc" } },
    },
    orderBy: { dueDate: "asc" },
    take: 5,
  });
}

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export async function getMostProductiveDay(userId: string) {
  const completions = await prisma.task.findMany({
    where: { userId, completed: true, completedAt: { not: null } },
    select: { completedAt: true },
  });

  if (completions.length === 0) return null;

  const countsByDay = new Array(7).fill(0);
  for (const { completedAt } of completions) {
    if (completedAt) countsByDay[completedAt.getUTCDay()]++;
  }

  const maxCount = Math.max(...countsByDay);
  const dayIndex = countsByDay.indexOf(maxCount);

  return { day: DAY_NAMES[dayIndex], count: maxCount };
}

export interface ActivityEntry {
  id: string;
  title: string;
  type: "completed" | "created" | "updated";
  at: Date;
}

export async function getRecentActivity(userId: string, limit = 6): Promise<ActivityEntry[]> {
  const tasks = await prisma.task.findMany({
    where: { userId },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      completed: true,
      completedAt: true,
    },
    orderBy: { updatedAt: "desc" },
    take: limit,
  });

  return tasks.map((task) => {
    if (task.completed && task.completedAt) {
      return { id: task.id, title: task.title, type: "completed", at: task.completedAt };
    }
    if (task.createdAt.getTime() === task.updatedAt.getTime()) {
      return { id: task.id, title: task.title, type: "created", at: task.createdAt };
    }
    return { id: task.id, title: task.title, type: "updated", at: task.updatedAt };
  });
}
