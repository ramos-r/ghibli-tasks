"use client";

import { useState, type ReactElement } from "react";
import { toast } from "sonner";
import { createTaskAction, updateTaskAction } from "@/app/(app)/tasks/actions";
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
import type { Task } from "@/generated/prisma/client";
import { createTaskSchema, type CreateTaskInput } from "@/lib/validations/task";

type FormValues = {
  title: string;
  description: string;
  priority: CreateTaskInput["priority"];
  dueDate: string;
};

const priorityLabels: Record<FormValues["priority"], string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

function toFormValues(task?: Task): FormValues {
  return {
    title: task?.title ?? "",
    description: task?.description ?? "",
    priority: task?.priority ?? "MEDIUM",
    dueDate: task?.dueDate ? task.dueDate.toISOString().slice(0, 10) : "",
  };
}

export function TaskFormDialog({ task, trigger }: { task?: Task; trigger: ReactElement }) {
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

    const parsed = createTaskSchema.safeParse(values);
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
