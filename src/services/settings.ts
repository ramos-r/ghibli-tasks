import { prisma } from "@/lib/prisma";
import type { UpdateNotificationPreferencesInput } from "@/lib/validations/settings";

export async function getNotificationPreferences(userId: string) {
  return prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { notifyOverdue: true, notifyDueSoon: true, notifyReminders: true },
  });
}

export async function updateNotificationPreferences(
  userId: string,
  input: UpdateNotificationPreferencesInput,
) {
  return prisma.user.update({
    where: { id: userId },
    data: input,
    select: { notifyOverdue: true, notifyDueSoon: true, notifyReminders: true },
  });
}
