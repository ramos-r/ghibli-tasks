import { prisma } from "@/lib/prisma";
import type { CreateSubtaskInput, UpdateSubtaskInput } from "@/lib/validations/subtask";

async function getOwnedSubtask(userId: string, id: string) {
  return prisma.subtask.findFirst({
    where: { id, task: { userId } },
  });
}

export async function createSubtask(userId: string, input: CreateSubtaskInput) {
  const task = await prisma.task.findFirst({ where: { id: input.taskId, userId } });
  if (!task) return null;

  const count = await prisma.subtask.count({ where: { taskId: input.taskId } });

  return prisma.subtask.create({
    data: { title: input.title, taskId: input.taskId, order: count },
  });
}

export async function updateSubtask(userId: string, input: UpdateSubtaskInput) {
  const existing = await getOwnedSubtask(userId, input.id);
  if (!existing) return null;

  return prisma.subtask.update({
    where: { id: input.id },
    data: { title: input.title },
  });
}

export async function deleteSubtask(userId: string, id: string) {
  const existing = await getOwnedSubtask(userId, id);
  if (!existing) return false;

  await prisma.subtask.delete({ where: { id } });
  return true;
}

export async function toggleSubtaskCompleted(userId: string, id: string) {
  const existing = await getOwnedSubtask(userId, id);
  if (!existing) return null;

  return prisma.subtask.update({
    where: { id },
    data: { completed: !existing.completed },
  });
}
