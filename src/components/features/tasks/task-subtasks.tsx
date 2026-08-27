"use client";

import { useState, useTransition } from "react";
import { ChevronDownIcon, ChevronRightIcon, PlusIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import {
  createSubtaskAction,
  deleteSubtaskAction,
  toggleSubtaskCompletedAction,
  updateSubtaskAction,
} from "@/app/(app)/tasks/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import type { Subtask } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";

function SubtaskRow({ subtask }: { subtask: Subtask }) {
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(subtask.title);

  function handleToggle() {
    startTransition(async () => {
      const result = await toggleSubtaskCompletedAction(subtask.id);
      if (!result.success) toast.error(result.message);
    });
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteSubtaskAction(subtask.id);
      if (!result.success) toast.error(result.message);
    });
  }

  function handleRename() {
    const trimmed = title.trim();
    if (!trimmed || trimmed === subtask.title) {
      setTitle(subtask.title);
      setIsEditing(false);
      return;
    }
    startTransition(async () => {
      const result = await updateSubtaskAction({ id: subtask.id, title: trimmed });
      if (!result.success) {
        toast.error(result.message);
        setTitle(subtask.title);
      }
      setIsEditing(false);
    });
  }

  return (
    <div className={cn("group/subtask flex items-center gap-2 py-1", isPending && "opacity-60")}>
      <button
        type="button"
        onClick={handleToggle}
        disabled={isPending}
        aria-label={subtask.completed ? "Mark subtask as active" : "Mark subtask as complete"}
        aria-pressed={subtask.completed}
        className="flex size-4 shrink-0 items-center justify-center rounded-full border border-input transition-soft data-[completed=true]:border-success data-[completed=true]:bg-success"
        data-completed={subtask.completed}
      />
      {isEditing ? (
        <Input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleRename}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleRename();
            if (e.key === "Escape") {
              setTitle(subtask.title);
              setIsEditing(false);
            }
          }}
          className="h-6 flex-1 px-1.5 text-sm"
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className={cn(
            "flex-1 truncate text-left text-sm transition-soft",
            subtask.completed && "text-muted-foreground line-through",
          )}
        >
          {subtask.title}
        </button>
      )}
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        aria-label={`Delete subtask ${subtask.title}`}
        className="shrink-0 text-muted-foreground opacity-0 transition-soft hover:text-destructive focus-visible:opacity-100 group-hover/subtask:opacity-100"
      >
        <XIcon className="size-3.5" />
      </button>
    </div>
  );
}

export function TaskSubtasks({ taskId, subtasks }: { taskId: string; subtasks: Subtask[] }) {
  const [expanded, setExpanded] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [isAdding, startAddTransition] = useTransition();

  const total = subtasks.length;
  const completedCount = subtasks.filter((s) => s.completed).length;
  const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = newTitle.trim();
    if (!trimmed) return;

    startAddTransition(async () => {
      const result = await createSubtaskAction({ taskId, title: trimmed });
      if (result.success) {
        setNewTitle("");
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        className="flex w-full items-center gap-2 text-xs text-muted-foreground transition-soft hover:text-foreground"
      >
        {expanded ? (
          <ChevronDownIcon className="size-3.5" />
        ) : (
          <ChevronRightIcon className="size-3.5" />
        )}
        <span>Subtasks {total > 0 ? `(${completedCount}/${total})` : ""}</span>
        {total > 0 && <Progress value={percentage} className="ml-1 max-w-24 flex-1" />}
      </button>

      {expanded && (
        <div className="mt-1.5 flex flex-col pl-5.5">
          {subtasks.map((subtask) => (
            <SubtaskRow key={subtask.id} subtask={subtask} />
          ))}

          <form onSubmit={handleAdd} className="mt-1 flex items-center gap-1.5">
            <PlusIcon className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Add a subtask…"
              aria-label="New subtask title"
              disabled={isAdding}
              className="h-6 flex-1 border-none px-1.5 text-sm shadow-none focus-visible:ring-0"
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon-xs"
              disabled={isAdding || !newTitle.trim()}
            >
              <PlusIcon />
              <span className="sr-only">Add subtask</span>
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
