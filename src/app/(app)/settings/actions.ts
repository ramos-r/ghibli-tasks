"use server";

import { revalidatePath } from "next/cache";
import { requireCurrentUser } from "@/lib/session";
import { updateNotificationPreferencesSchema } from "@/lib/validations/settings";
import * as settingsService from "@/services/settings";

export interface ActionResult<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
}

function toErrorResult(error: unknown): ActionResult {
  if (error instanceof Error && error.message === "Not authenticated") {
    return { success: false, message: "You need to sign in again." };
  }
  return { success: false, message: "Something went wrong. Please try again." };
}

export async function updateNotificationPreferencesAction(input: unknown): Promise<ActionResult> {
  try {
    const user = await requireCurrentUser();
    const parsed = updateNotificationPreferencesSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message ?? "Invalid preferences.",
      };
    }

    await settingsService.updateNotificationPreferences(user.id, parsed.data);
    revalidatePath("/settings");
    return { success: true, message: "Notification preferences updated." };
  } catch (error) {
    return toErrorResult(error);
  }
}
