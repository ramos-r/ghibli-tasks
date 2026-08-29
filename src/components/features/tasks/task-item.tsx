"use client";

import { useState, useTransition } from "react";
import {
  ArchiveIcon,
  ArchiveRestoreIcon,
  CalendarIcon,
  Circle,
  CircleCheck,
  CopyIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PinIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";
import {
  deleteTaskAction,
  duplicateTaskAction,
  toggleTaskArchivedAction,
  toggleTaskCompletedAction,
  toggleTaskPinnedAction,
} from "@/app/(app)/tasks/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TaskFormDialog } from "@/components/features/tasks/task-form-dialog";
import { TaskReminders } from "@/components/features/tasks/task-reminders";
import { TaskSubtasks } from "@/components/features/tasks/task-subtasks";
import type { Category, Tag, Task } from "@/generated/prisma/client";
import { categoryIconComponents } from "@/lib/category-icons";
import { cn } from "@/lib/utils";
import type { TaskWithRelations } from "@/services/tasks";

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
  // Due dates are stored as UTC midnight from a date-only input; format in
  // UTC too so the displayed day doesn't shift with the viewer's timezone.
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

export function TaskItem({
  task,
  categories,
  tags,
}: {
  task: TaskWithRelations;
  categories: Category[];
  tags: Tag[];
}) {
  const [isPending, startTransition] = useTransition();
  const [deleteOpen, setDeleteOpen] = useState(false);

  function handleToggleCompleted() {
    startTransition(async () => {
      const result = await toggleTaskCompletedAction(task.id);
      if (!result.success) toast.error(result.message);
    });
  }

  function handleToggleArchived() {
    startTransition(async () => {
      const result = await toggleTaskArchivedAction(task.id);
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    });
  }

  function handleTogglePinned() {
    startTransition(async () => {
      const result = await toggleTaskPinnedAction(task.id);
      if (!result.success) toast.error(result.message);
    });
  }

  function handleDuplicate() {
    startTransition(async () => {
      const result = await duplicateTaskAction(task.id);
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    });
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteTaskAction(task.id);
      setDeleteOpen(false);
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    });
  }

  return (
    <Card className={cn("flex-row items-start gap-3 px-4 py-3.5", isPending && "opacity-60")}>
      <button
        type="button"
        onClick={handleToggleCompleted}
        disabled={isPending}
        aria-label={task.completed ? "Mark task as active" : "Mark task as complete"}
        aria-pressed={task.completed}
        className="mt-0.5 shrink-0 text-muted-foreground transition-soft hover:text-primary focus-visible:outline-none"
      >
        {task.completed ? (
          <CircleCheck className="size-5 text-success" />
        ) : (
          <Circle className="size-5" />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              "text-sm font-medium break-words",
              task.completed && "text-muted-foreground line-through",
            )}
          >
            {task.title}
          </p>
          {task.pinned && (
            <PinIcon className="size-3.5 shrink-0 fill-current text-primary" aria-hidden="true" />
          )}
        </div>
        {task.description && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{task.description}</p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
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
          {task.archived && <Badge variant="outline">Archived</Badge>}
        </div>
        <TaskSubtasks taskId={task.id} subtasks={task.subtasks} />
        <TaskReminders taskId={task.id} reminders={task.reminders} />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="icon-sm" aria-label="Task actions" />}
        >
          <MoreHorizontalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <TaskFormDialog
            task={task}
            categories={categories}
            tags={tags}
            triggerIsNativeButton={false}
            trigger={
              <DropdownMenuItem closeOnClick={false}>
                <PencilIcon />
                Edit
              </DropdownMenuItem>
            }
          />
          <DropdownMenuItem onClick={handleDuplicate}>
            <CopyIcon />
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleTogglePinned}>
            <PinIcon />
            {task.pinned ? "Unpin" : "Pin"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleToggleArchived}>
            {task.archived ? <ArchiveRestoreIcon /> : <ArchiveIcon />}
            {task.archived ? "Restore" : "Archive"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger
              nativeButton={false}
              render={
                <DropdownMenuItem variant="destructive" closeOnClick={false}>
                  <Trash2Icon />
                  Delete
                </DropdownMenuItem>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete this task?</DialogTitle>
                <DialogDescription>
                  &ldquo;{task.title}&rdquo; will be permanently deleted. This can&apos;t be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter showCloseButton>
                <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  );
}
