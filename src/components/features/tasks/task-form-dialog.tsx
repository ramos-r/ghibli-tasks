"use client";

import { useState, type ReactElement } from "react";
import { toast } from "sonner";
import { createTaskAction, updateTaskAction } from "@/app/(app)/tasks/actions";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import type { Category, Tag } from "@/generated/prisma/client";
import { categoryIconComponents } from "@/lib/category-icons";
import { createTaskSchema, type CreateTaskInput } from "@/lib/validations/task";
import { cn } from "@/lib/utils";
import type { TaskWithRelations } from "@/services/tasks";

type FormValues = {
  title: string;
  description: string;
  priority: CreateTaskInput["priority"];
  dueDate: string;
  categoryId: string;
  tagIds: string[];
};

const priorityLabels: Record<FormValues["priority"], string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

const NO_CATEGORY = "none";

function toFormValues(task?: TaskWithRelations): FormValues {
  return {
    title: task?.title ?? "",
    description: task?.description ?? "",
    priority: task?.priority ?? "MEDIUM",
    dueDate: task?.dueDate ? task.dueDate.toISOString().slice(0, 10) : "",
    categoryId: task?.categoryId ?? NO_CATEGORY,
    tagIds: task?.tags.map((tag) => tag.id) ?? [],
  };
}

export function TaskFormDialog({
  task,
  categories,
  tags,
  trigger,
}: {
  task?: TaskWithRelations;
  categories: Category[];
  tags: Tag[];
  trigger: ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<FormValues>(() => toFormValues(task));
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!task;

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      setValues(toFormValues(task));
      setErrors({});
    }
  }

  function handleChange<K extends keyof FormValues>(field: K) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const submission = {
      ...values,
      categoryId: values.categoryId === NO_CATEGORY ? "" : values.categoryId,
    };

    const parsed = createTaskSchema.safeParse(submission);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof FormValues, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof FormValues;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    const result = isEditing
      ? await updateTaskAction({ ...parsed.data, id: task.id })
      : await createTaskAction(parsed.data);
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
          <DialogTitle>{isEditing ? "Edit task" : "New task"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the details of this task." : "Add something to your list."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="task-title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="task-title"
              value={values.title}
              onChange={handleChange("title")}
              aria-invalid={!!errors.title}
              autoFocus
            />
            {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="task-description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="task-description"
              value={values.description}
              onChange={handleChange("description")}
              aria-invalid={!!errors.description}
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="task-priority" className="text-sm font-medium">
                Priority
              </label>
              <Select
                value={values.priority}
                onValueChange={(value) =>
                  setValues((prev) => ({ ...prev, priority: value as FormValues["priority"] }))
                }
              >
                <SelectTrigger id="task-priority" className="w-full">
                  <SelectValue>
                    {(value: FormValues["priority"]) => priorityLabels[value]}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="task-due-date" className="text-sm font-medium">
                Due date
              </label>
              <Input
                id="task-due-date"
                type="date"
                value={values.dueDate}
                onChange={handleChange("dueDate")}
                aria-invalid={!!errors.dueDate}
              />
              {errors.dueDate && <p className="text-xs text-destructive">{errors.dueDate}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="task-category" className="text-sm font-medium">
              Category
            </label>
            <Select
              value={values.categoryId}
              onValueChange={(value) =>
                setValues((prev) => ({ ...prev, categoryId: value ?? NO_CATEGORY }))
              }
            >
              <SelectTrigger id="task-category" className="w-full">
                <SelectValue>
                  {(value: string) => {
                    if (value === NO_CATEGORY) return "No category";
                    return categories.find((c) => c.id === value)?.name ?? "No category";
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_CATEGORY}>No category</SelectItem>
                {categories.map((category) => {
                  const Icon =
                    categoryIconComponents[category.icon as keyof typeof categoryIconComponents];
                  return (
                    <SelectItem key={category.id} value={category.id}>
                      {Icon && <Icon className="size-4" style={{ color: category.color }} />}
                      {category.name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Tags</span>
              <div className="flex flex-wrap gap-1.5" role="group" aria-label="Tags">
                {tags.map((tag) => {
                  const selected = values.tagIds.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() =>
                        setValues((prev) => ({
                          ...prev,
                          tagIds: selected
                            ? prev.tagIds.filter((id) => id !== tag.id)
                            : [...prev.tagIds, tag.id],
                        }))
                      }
                    >
                      <Badge
                        variant={selected ? "default" : "secondary"}
                        className={cn("cursor-pointer transition-soft", !selected && "opacity-60")}
                      >
                        {tag.name}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Spinner />}
              {isEditing ? "Save changes" : "Create task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
