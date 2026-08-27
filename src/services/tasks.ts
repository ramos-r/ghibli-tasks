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
  categoryId?: string;
  sort?: TaskSortOption;
}

export type TaskWithCategory = Prisma.TaskGetPayload<{ include: { category: true } }>;

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
  const { search, status = "active", priority, categoryId, sort } = options;

  const where: Prisma.TaskWhereInput = {
    userId,
    ...(status === "active" && { completed: false, archived: false }),
    ...(status === "completed" && { completed: true, archived: false }),
    ...(status === "archived" && { archived: true }),
    ...(priority && { priority }),
    ...(categoryId && { categoryId }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  return prisma.task.findMany({
    where,
    include: { category: true },
    orderBy: buildOrderBy(sort),
  });
}

export async function getTaskById(userId: string, id: string) {
  return prisma.task.findFirst({ where: { id, userId } });
}

async function resolveCategoryId(userId: string, categoryId: string | undefined) {
  if (!categoryId) return null;
  const category = await prisma.category.findFirst({ where: { id: categoryId, userId } });
  return category?.id ?? null;
}

export async function createTask(userId: string, input: CreateTaskInput) {
  return prisma.task.create({
    data: {
      title: input.title,
      description: input.description || null,
      priority: input.priority,
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
      categoryId: await resolveCategoryId(userId, input.categoryId),
      userId,
    },
    include: { category: true },
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
      categoryId: await resolveCategoryId(userId, input.categoryId),
    },
    include: { category: true },
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
      categoryId: existing.categoryId,
      userId,
    },
    include: { category: true },
  });
}
