"use server";

import { revalidatePath } from "next/cache";
import { requireCurrentUser } from "@/lib/session";
import { createTagSchema } from "@/lib/validations/tag";
import * as tagsService from "@/services/tags";

export interface ActionResult {
  success: boolean;
  message: string;
}

function toErrorResult(error: unknown): ActionResult {
  if (error instanceof Error && error.message === "Not authenticated") {
    return { success: false, message: "You need to sign in again." };
  }
  return { success: false, message: "Something went wrong. Please try again." };
}

export async function createTagAction(input: unknown): Promise<ActionResult> {
  try {
    const user = await requireCurrentUser();
    const parsed = createTagSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid tag data." };
    }

    const created = await tagsService.createTag(user.id, parsed.data);
    if (!created) {
      return { success: false, message: "You already have a tag with that name." };
    }

    revalidatePath("/tags");
    revalidatePath("/tasks");
    return { success: true, message: "Tag created." };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function deleteTagAction(id: string): Promise<ActionResult> {
  try {
    const user = await requireCurrentUser();
    const deleted = await tagsService.deleteTag(user.id, id);
    if (!deleted) {
      return { success: false, message: "Tag not found." };
    }

    revalidatePath("/tags");
    revalidatePath("/tasks");
    return { success: true, message: "Tag deleted." };
  } catch (error) {
    return toErrorResult(error);
  }
}
