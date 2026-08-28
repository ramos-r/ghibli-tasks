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
  tagIds?: string[];
  sort?: TaskSortOption;
  limit?: number;
}

export type TaskWithRelations = Prisma.TaskGetPayload<{
  include: { category: true; tags: true; subtasks: true; reminders: true };
}>;

const taskInclude = {
  category: true,
  tags: true,
  subtasks: { orderBy: { order: "asc" } },
  reminders: { orderBy: { remindAt: "asc" } },
} as const;

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
  const { search, status = "active", priority, categoryId, tagIds, sort, limit } = options;

  const where: Prisma.TaskWhereInput = {
    userId,
    ...(status === "active" && { completed: false, archived: false }),
    ...(status === "completed" && { completed: true, archived: false }),
    ...(status === "archived" && { archived: true }),
    ...(priority && { priority }),
    ...(categoryId && { categoryId }),
    ...(tagIds &&
      tagIds.length > 0 && {
        tags: { some: { id: { in: tagIds } } },
      }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { some: { name: { contains: search, mode: "insensitive" } } } },
      ],
    }),
  };

  return prisma.task.findMany({
    where,
    include: taskInclude,
    orderBy: buildOrderBy(sort),
    ...(limit && { take: limit }),
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

async function resolveTagIds(userId: string, tagIds: string[] | undefined) {
  if (!tagIds || tagIds.length === 0) return [];
  const tags = await prisma.tag.findMany({ where: { id: { in: tagIds }, userId } });
  return tags.map((tag) => tag.id);
}

export async function createTask(userId: string, input: CreateTaskInput) {
  const tagIds = await resolveTagIds(userId, input.tagIds);

  return prisma.task.create({
    data: {
      title: input.title,
      description: input.description || null,
      priority: input.priority,
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
      categoryId: await resolveCategoryId(userId, input.categoryId),
      userId,
      tags: { connect: tagIds.map((id) => ({ id })) },
    },
    include: taskInclude,
  });
}

export async function updateTask(userId: string, input: UpdateTaskInput) {
  const existing = await getTaskById(userId, input.id);
  if (!existing) return null;

  const tagIds = await resolveTagIds(userId, input.tagIds);

  return prisma.task.update({
    where: { id: input.id },
    data: {
      title: input.title,
      description: input.description || null,
      priority: input.priority,
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
      categoryId: await resolveCategoryId(userId, input.categoryId),
      tags: { set: tagIds.map((id) => ({ id })) },
    },
    include: taskInclude,
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
  const existing = await prisma.task.findFirst({
    where: { id, userId },
    include: { tags: true },
  });
  if (!existing) return null;

  return prisma.task.create({
    data: {
      title: `${existing.title} (copy)`,
      description: existing.description,
      priority: existing.priority,
      dueDate: existing.dueDate,
      categoryId: existing.categoryId,
      userId,
      tags: { connect: existing.tags.map((tag) => ({ id: tag.id })) },
    },
    include: taskInclude,
  });
}
