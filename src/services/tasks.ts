import type { Prisma, Priority } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type {
  CreateTaskInput,
  TaskSortOption,
  TaskStatusFilter,
  UpdateTaskInput,
} from "@/lib/validations/task";

export interface GetTasksOptions {
  search?: string;
  status?: TaskStatusFilter;
  priority?: Priority;
  sort?: TaskSortOption;
}

function buildOrderBy(sort: TaskSortOption = "newest"): Prisma.TaskOrderByWithRelationInput[] {
  switch (sort) {
    case "oldest":
      return [{ createdAt: "asc" }];
    case "dueDate":
      return [{ dueDate: { sort: "asc", nulls: "last" } }];
    case "priority":
      return [{ priority: "desc" }, { createdAt: "desc" }];
    case "title":
      return [{ title: "asc" }];
    case "newest":
    default:
      return [{ pinned: "desc" }, { createdAt: "desc" }];
  }
}

export async function getTasks(userId: string, options: GetTasksOptions = {}) {
  const { search, status = "active", priority, sort } = options;

  const where: Prisma.TaskWhereInput = {
    userId,
    ...(status === "active" && { completed: false, archived: false }),
    ...(status === "completed" && { completed: true, archived: false }),
    ...(status === "archived" && { archived: true }),
    ...(priority && { priority }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  return prisma.task.findMany({
    where,
    orderBy: buildOrderBy(sort),
  });
}

export async function getTaskById(userId: string, id: string) {
  return prisma.task.findFirst({ where: { id, userId } });
}

export async function createTask(userId: string, input: CreateTaskInput) {
  return prisma.task.create({
    data: {
      title: input.title,
      description: input.description || null,
      priority: input.priority,
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
      userId,
    },
  });
}

export async function updateTask(userId: string, input: UpdateTaskInput) {
  const existing = await getTaskById(userId, input.id);
  if (!existing) return null;

  return prisma.task.update({
    where: { id: input.id },
    data: {
      title: input.title,
      description: input.description || null,
      priority: input.priority,
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
    },
  });
}

export async function deleteTask(userId: string, id: string) {
  const existing = await getTaskById(userId, id);
  if (!existing) return false;

  await prisma.task.delete({ where: { id } });
  return true;
}

export async function toggleTaskCompleted(userId: string, id: string) {
  const existing = await getTaskById(userId, id);
  if (!existing) return null;

  const completed = !existing.completed;
  return prisma.task.update({
    where: { id },
    data: { completed, completedAt: completed ? new Date() : null },
  });
}

export async function toggleTaskArchived(userId: string, id: string) {
  const existing = await getTaskById(userId, id);
  if (!existing) return null;

  return prisma.task.update({
    where: { id },
    data: { archived: !existing.archived },
  });
}

export async function toggleTaskPinned(userId: string, id: string) {
  const existing = await getTaskById(userId, id);
  if (!existing) return null;

  return prisma.task.update({
    where: { id },
    data: { pinned: !existing.pinned },
  });
}

export async function duplicateTask(userId: string, id: string) {
  const existing = await getTaskById(userId, id);
  if (!existing) return null;

  return prisma.task.create({
    data: {
      title: `${existing.title} (copy)`,
      description: existing.description,
      priority: existing.priority,
      dueDate: existing.dueDate,
      userId,
    },
  });
}
