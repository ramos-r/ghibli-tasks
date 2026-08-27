"use client";

import { useState, type ReactElement } from "react";
import { toast } from "sonner";
import { createCategoryAction, updateCategoryAction } from "@/app/(app)/categories/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import type { Category } from "@/generated/prisma/client";
import { categoryIconComponents } from "@/lib/category-icons";
import { categoryColors, categoryIcons, createCategorySchema } from "@/lib/validations/category";
import { cn } from "@/lib/utils";

type FormValues = {
  name: string;
  color: (typeof categoryColors)[number];
  icon: (typeof categoryIcons)[number];
};

function toFormValues(category?: Category): FormValues {
  return {
    name: category?.name ?? "",
    color: (category?.color as FormValues["color"]) ?? categoryColors[0],
    icon: (category?.icon as FormValues["icon"]) ?? categoryIcons[0],
  };
}

export function CategoryFormDialog({
  category,
  trigger,
}: {
  category?: Category;
  trigger: ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<FormValues>(() => toFormValues(category));
  const [nameError, setNameError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!category;

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      setValues(toFormValues(category));
      setNameError(undefined);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parsed = createCategorySchema.safeParse(values);
    if (!parsed.success) {
      setNameError(parsed.error.issues[0]?.message);
      return;
    }

    setNameError(undefined);
    setIsSubmitting(true);
    const result = isEditing
      ? await updateCategoryAction({ ...parsed.data, id: category.id })
      : await createCategoryAction(parsed.data);
    setIsSubmitting(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit category" : "New category"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update this category." : "Group your tasks with a color and icon."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="category-name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="category-name"
              value={values.name}
              onChange={(e) => setValues((prev) => ({ ...prev, name: e.target.value }))}
              aria-invalid={!!nameError}
              autoFocus
            />
            {nameError && <p className="text-xs text-destructive">{nameError}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Color</span>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Category color">
              {categoryColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  role="radio"
                  aria-checked={values.color === color}
                  aria-label={color}
                  onClick={() => setValues((prev) => ({ ...prev, color }))}
                  className={cn(
                    "size-7 rounded-full transition-soft",
                    values.color === color && "ring-2 ring-offset-2 ring-offset-background",
                  )}
                  style={{
                    backgroundColor: color,
                    ...(values.color === color ? { boxShadow: `0 0 0 2px ${color}` } : {}),
                  }}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Icon</span>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Category icon">
              {categoryIcons.map((iconName) => {
                const Icon = categoryIconComponents[iconName];
                const selected = values.icon === iconName;
                return (
                  <button
                    key={iconName}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    aria-label={iconName}
                    onClick={() => setValues((prev) => ({ ...prev, icon: iconName }))}
                    className={cn(
                      "flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-soft hover:bg-muted",
                      selected && "border-primary bg-primary/10 text-primary",
                    )}
                  >
                    <Icon className="size-4" />
                  </button>
                );
              })}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Spinner />}
              {isEditing ? "Save changes" : "Create category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
