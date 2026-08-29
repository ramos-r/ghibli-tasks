"use client";

import { useState } from "react";
import { CalendarIcon, CircleCheck, PencilIcon, SquareIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TaskFormDialog } from "@/components/features/tasks/task-form-dialog";
import type { Category, Tag, Task } from "@/generated/prisma/client";
import { categoryIconComponents } from "@/lib/category-icons";
import { cn } from "@/lib/utils";
import type { TaskWithRelations } from "@/services/tasks";

const priorityDot: Record<TaskWithRelations["priority"], string> = {
  LOW: "bg-secondary-foreground/40",
  MEDIUM: "bg-warning",
  HIGH: "bg-destructive",
};

const priorityLabels: Record<Task["priority"], string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

const priorityVariants: Record<Task["priority"], "secondary" | "warning" | "destructive"> = {
  LOW: "secondary",
  MEDIUM: "warning",
  HIGH: "destructive",
};

function formatDueDate(date: Date) {
  // Due dates are stored as UTC midnight; format in UTC so the displayed
  // day doesn't shift with the viewer's timezone.
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function CategoryBadge({ category }: { category: Category }) {
  const Icon =
    categoryIconComponents[category.icon as keyof typeof categoryIconComponents] ??
    categoryIconComponents.Folder;
  return (
    <Badge variant="outline" style={{ borderColor: `${category.color}66`, color: category.color }}>
      <Icon />
      {category.name}
    </Badge>
  );
}

export function CalendarTaskChip({
  task,
  categories,
  tags,
}: {
  task: TaskWithRelations;
  categories: Category[];
  tags: Tag[];
}) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setDetailsOpen(true)}
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

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className={cn(task.completed && "text-muted-foreground line-through")}>
              {task.title}
            </DialogTitle>
            {task.description && <DialogDescription>{task.description}</DialogDescription>}
          </DialogHeader>

          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant={priorityVariants[task.priority]}>{priorityLabels[task.priority]}</Badge>
            {task.category && <CategoryBadge category={task.category} />}
            {task.tags.map((tag) => (
              <Badge key={tag.id} variant="secondary">
                {tag.name}
              </Badge>
            ))}
            {task.dueDate && (
              <Badge variant="outline">
                <CalendarIcon />
                {formatDueDate(task.dueDate)}
              </Badge>
            )}
            {task.completed && <Badge variant="success">Completed</Badge>}
            {task.archived && <Badge variant="outline">Archived</Badge>}
          </div>

          {task.subtasks.length > 0 && (
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">
                Subtasks ({task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length})
              </span>
              <ul className="flex flex-col gap-1">
                {task.subtasks.map((subtask) => (
                  <li
                    key={subtask.id}
                    className={cn(
                      "flex items-center gap-1.5 text-sm text-muted-foreground",
                      subtask.completed && "line-through",
                    )}
                  >
                    {subtask.completed ? (
                      <CircleCheck className="size-3.5 shrink-0 text-success" aria-hidden="true" />
                    ) : (
                      <SquareIcon className="size-3.5 shrink-0" aria-hidden="true" />
                    )}
                    {subtask.title}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <DialogFooter showCloseButton>
            <Button
              onClick={() => {
                setDetailsOpen(false);
                setEditOpen(true);
              }}
            >
              <PencilIcon />
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <TaskFormDialog
        task={task}
        categories={categories}
        tags={tags}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
}
