import { prisma } from "@/lib/prisma";
import type { CreateCategoryInput, UpdateCategoryInput } from "@/lib/validations/category";

export async function getCategories(userId: string) {
  return prisma.category.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });
}

export async function getCategoryById(userId: string, id: string) {
  return prisma.category.findFirst({ where: { id, userId } });
}

export async function createCategory(userId: string, input: CreateCategoryInput) {
  const existing = await prisma.category.findUnique({
    where: { userId_name: { userId, name: input.name } },
  });
  if (existing) return null;

  return prisma.category.create({
    data: {
      name: input.name,
      color: input.color,
      icon: input.icon,
      userId,
    },
  });
}

export async function updateCategory(userId: string, input: UpdateCategoryInput) {
  const existing = await getCategoryById(userId, input.id);
  if (!existing) return null;

  const nameConflict = await prisma.category.findUnique({
    where: { userId_name: { userId, name: input.name } },
  });
  if (nameConflict && nameConflict.id !== input.id) return null;

  return prisma.category.update({
    where: { id: input.id },
    data: {
      name: input.name,
      color: input.color,
      icon: input.icon,
    },
  });
}

export async function deleteCategory(userId: string, id: string) {
  const existing = await getCategoryById(userId, id);
  if (!existing) return false;

  await prisma.category.delete({ where: { id } });
  return true;
}
