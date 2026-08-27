import { prisma } from "@/lib/prisma";
import type { CreateTagInput } from "@/lib/validations/tag";

export async function getTags(userId: string) {
  return prisma.tag.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });
}

export async function createTag(userId: string, input: CreateTagInput) {
  const existing = await prisma.tag.findUnique({
    where: { userId_name: { userId, name: input.name } },
  });
  if (existing) return null;

  return prisma.tag.create({
    data: { name: input.name, userId },
  });
}

export async function deleteTag(userId: string, id: string) {
  const existing = await prisma.tag.findFirst({ where: { id, userId } });
  if (!existing) return false;

  await prisma.tag.delete({ where: { id } });
  return true;
}
