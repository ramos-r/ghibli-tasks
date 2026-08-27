import { TaskFormDialog } from "@/components/features/tasks/task-form-dialog";
import type { Category, Tag } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";
import type { TaskWithRelations } from "@/services/tasks";

const priorityDot: Record<TaskWithRelations["priority"], string> = {
  LOW: "bg-secondary-foreground/40",
  MEDIUM: "bg-warning",
  HIGH: "bg-destructive",
};

export function CalendarTaskChip({
  task,
  categories,
  tags,
}: {
  task: TaskWithRelations;
  categories: Category[];
  tags: Tag[];
}) {
  return (
    <TaskFormDialog
      task={task}
      categories={categories}
      tags={tags}
      trigger={
        <button
          type="button"
          className={cn(
            "flex w-full items-center gap-1.5 rounded-md px-1.5 py-0.5 text-left text-xs transition-soft hover:bg-muted",
            task.completed && "opacity-50",
          )}
        >
          <span
            className={cn("size-1.5 shrink-0 rounded-full", priorityDot[task.priority])}
            aria-hidden="true"
          />
          <span className={cn("truncate", task.completed && "line-through")}>{task.title}</span>
        </button>
      }
    />
  );
}
