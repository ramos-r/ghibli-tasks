import { prisma } from "@/lib/prisma";
import type { CreateReminderInput } from "@/lib/validations/reminder";

export async function createReminder(userId: string, input: CreateReminderInput) {
  const task = await prisma.task.findFirst({ where: { id: input.taskId, userId } });
  if (!task) return null;

  return prisma.reminder.create({
    data: { taskId: input.taskId, remindAt: new Date(input.remindAt) },
  });
}

export async function deleteReminder(userId: string, id: string) {
  const existing = await prisma.reminder.findFirst({ where: { id, task: { userId } } });
  if (!existing) return false;

  await prisma.reminder.delete({ where: { id } });
  return true;
}

export async function dismissReminder(userId: string, id: string) {
  const existing = await prisma.reminder.findFirst({ where: { id, task: { userId } } });
  if (!existing) return null;

  return prisma.reminder.update({ where: { id }, data: { sent: true } });
}
