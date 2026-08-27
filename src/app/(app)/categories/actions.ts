"use server";

import { revalidatePath } from "next/cache";
import { requireCurrentUser } from "@/lib/session";
import { createCategorySchema, updateCategorySchema } from "@/lib/validations/category";
import * as categoriesService from "@/services/categories";

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

export async function createCategoryAction(input: unknown): Promise<ActionResult> {
  try {
    const user = await requireCurrentUser();
    const parsed = createCategorySchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message ?? "Invalid category data.",
      };
    }

    const created = await categoriesService.createCategory(user.id, parsed.data);
    if (!created) {
      return { success: false, message: "You already have a category with that name." };
    }

    revalidatePath("/categories");
    revalidatePath("/tasks");
    return { success: true, message: "Category created." };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function updateCategoryAction(input: unknown): Promise<ActionResult> {
  try {
    const user = await requireCurrentUser();
    const parsed = updateCategorySchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message ?? "Invalid category data.",
      };
    }

    const updated = await categoriesService.updateCategory(user.id, parsed.data);
    if (!updated) {
      return { success: false, message: "Category not found, or that name is already taken." };
    }

    revalidatePath("/categories");
    revalidatePath("/tasks");
    return { success: true, message: "Category updated." };
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  try {
    const user = await requireCurrentUser();
    const deleted = await categoriesService.deleteCategory(user.id, id);
    if (!deleted) {
      return { success: false, message: "Category not found." };
    }

    revalidatePath("/categories");
    revalidatePath("/tasks");
    return { success: true, message: "Category deleted." };
  } catch (error) {
    return toErrorResult(error);
  }
}
