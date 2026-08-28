import { prisma } from "@/lib/prisma";

const taskInclude = {
  category: true,
  tags: true,
  subtasks: { orderBy: { order: "asc" } },
  reminders: { orderBy: { remindAt: "asc" } },
} as const;

function startOfUtcDay(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export async function getTasksInRange(userId: string, start: Date, end: Date) {
  return prisma.task.findMany({
    where: {
      userId,
      archived: false,
      dueDate: { gte: startOfUtcDay(start), lt: startOfUtcDay(end) },
    },
    include: taskInclude,
    orderBy: [{ dueDate: "asc" }, { priority: "desc" }],
  });
}

export async function getOverdueTasks(userId: string) {
  const todayStart = startOfUtcDay(new Date());
  return prisma.task.findMany({
    where: { userId, archived: false, completed: false, dueDate: { lt: todayStart } },
    include: taskInclude,
    orderBy: { dueDate: "asc" },
  });
}

export async function getTodayTasks(userId: string) {
  const todayStart = startOfUtcDay(new Date());
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setUTCDate(tomorrowStart.getUTCDate() + 1);

  return prisma.task.findMany({
    where: { userId, archived: false, dueDate: { gte: todayStart, lt: tomorrowStart } },
    include: taskInclude,
    orderBy: { priority: "desc" },
  });
}

export async function getUpcomingTasks(userId: string, days = 7) {
  const tomorrowStart = startOfUtcDay(new Date());
  tomorrowStart.setUTCDate(tomorrowStart.getUTCDate() + 1);
  const rangeEnd = new Date(tomorrowStart);
  rangeEnd.setUTCDate(rangeEnd.getUTCDate() + days);

  return prisma.task.findMany({
    where: {
      userId,
      archived: false,
      completed: false,
      dueDate: { gte: tomorrowStart, lt: rangeEnd },
    },
    include: taskInclude,
    orderBy: { dueDate: "asc" },
  });
}
