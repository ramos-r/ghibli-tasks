"use client";

import { useState, useTransition } from "react";
import { AlarmClockIcon, PlusIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { createReminderAction, deleteReminderAction } from "@/app/(app)/tasks/actions";
import { Button } from "@/components/ui/button";
import type { Reminder } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";

// Reminders are real points in time (unlike UTC-anchored due dates), so they
// format in the viewer's own timezone rather than being pinned to UTC.
function formatRemindAt(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function isReminderDue(reminder: Reminder) {
  return !reminder.sent && reminder.remindAt.getTime() <= Date.now();
}

function toDatetimeLocalMin() {
  const now = new Date();
  now.setSeconds(0, 0);
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

function ReminderRow({ reminder }: { reminder: Reminder }) {
  const [isPending, startTransition] = useTransition();
  const isDue = isReminderDue(reminder);

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteReminderAction(reminder.id);
      if (!result.success) toast.error(result.message);
    });
  }

  return (
    <div className={cn("group/reminder flex items-center gap-2 py-1", isPending && "opacity-60")}>
      <AlarmClockIcon
        className={cn("size-3.5 shrink-0", isDue ? "text-warning" : "text-muted-foreground")}
        aria-hidden="true"
      />
      <span className={cn("flex-1 text-sm", isDue && "font-medium text-warning")}>
        {formatRemindAt(reminder.remindAt)}
      </span>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        aria-label={`Remove reminder at ${formatRemindAt(reminder.remindAt)}`}
        className="shrink-0 text-muted-foreground opacity-0 transition-soft hover:text-destructive focus-visible:opacity-100 group-hover/reminder:opacity-100"
      >
        <XIcon className="size-3.5" />
      </button>
    </div>
  );
}

export function TaskReminders({ taskId, reminders }: { taskId: string; reminders: Reminder[] }) {
  const [expanded, setExpanded] = useState(false);
  const [newRemindAt, setNewRemindAt] = useState("");
  const [isAdding, startAddTransition] = useTransition();

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newRemindAt) return;

    startAddTransition(async () => {
      const result = await createReminderAction({ taskId, remindAt: newRemindAt });
      if (result.success) {
        setNewRemindAt("");
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
        className="flex items-center gap-2 text-xs text-muted-foreground transition-soft hover:text-foreground"
      >
        <AlarmClockIcon className="size-3.5" aria-hidden="true" />
        <span>Reminders {reminders.length > 0 ? `(${reminders.length})` : ""}</span>
      </button>

      {expanded && (
        <div className="mt-1.5 flex flex-col pl-5.5">
          {reminders.map((reminder) => (
            <ReminderRow key={reminder.id} reminder={reminder} />
          ))}

          <form onSubmit={handleAdd} className="mt-1 flex items-center gap-1.5">
            <PlusIcon className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <input
              type="datetime-local"
              value={newRemindAt}
              min={toDatetimeLocalMin()}
              onChange={(e) => setNewRemindAt(e.target.value)}
              aria-label="New reminder date and time"
              disabled={isAdding}
              className="h-6 flex-1 border-none bg-transparent px-1.5 text-sm text-foreground outline-none"
            />
            <Button type="submit" variant="ghost" size="icon-xs" disabled={isAdding || !newRemindAt}>
              <PlusIcon />
              <span className="sr-only">Add reminder</span>
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
