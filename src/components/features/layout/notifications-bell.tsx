"use client";

import { useEffect, useState, useTransition } from "react";
import { AlarmClockIcon, AlertTriangleIcon, BellIcon, CalendarClockIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  dismissReminderAction,
  getNotificationsAction,
} from "@/app/(app)/notifications/actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { NotificationItem } from "@/services/notifications";
import { cn } from "@/lib/utils";

const typeConfig = {
  reminder: { icon: AlarmClockIcon, label: "Reminder", className: "text-primary" },
  overdue: { icon: AlertTriangleIcon, label: "Overdue", className: "text-destructive" },
  "due-soon": { icon: CalendarClockIcon, label: "Due today", className: "text-warning" },
} as const;

function formatRelativeTime(date: Date) {
  const diffMs = date.getTime() - Date.now();
  const diffMinutes = Math.round(diffMs / 60000);
  const formatter = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" });

  if (Math.abs(diffMinutes) < 60) return formatter.format(diffMinutes, "minute");
  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffHours) < 24) return formatter.format(diffHours, "hour");
  const diffDays = Math.round(diffHours / 24);
  return formatter.format(diffDays, "day");
}

function NotificationRow({
  item,
  onDismiss,
}: {
  item: NotificationItem;
  onDismiss: (id: string) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const { icon: Icon, label, className } = typeConfig[item.type];

  function handleDismiss(e: React.MouseEvent) {
    e.preventDefault();
    if (!item.reminderId) return;
    startTransition(async () => {
      const result = await dismissReminderAction(item.reminderId as string);
      if (result.success) onDismiss(item.id);
      else toast.error("Could not dismiss reminder.");
    });
  }

  return (
    <Link
      href="/tasks"
      className={cn(
        "flex items-start gap-2 rounded-md px-1.5 py-1.5 text-sm transition-soft hover:bg-accent",
        isPending && "pointer-events-none opacity-60",
      )}
    >
      <Icon className={cn("mt-0.5 size-3.5 shrink-0", className)} aria-hidden="true" />
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium">{item.taskTitle}</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </span>
      <span className="shrink-0 text-xs text-muted-foreground">
        {formatRelativeTime(item.at)}
      </span>
      {item.reminderId && (
        <button
          type="button"
          onClick={handleDismiss}
          disabled={isPending}
          aria-label={`Dismiss reminder for ${item.taskTitle}`}
          className="shrink-0 text-muted-foreground transition-soft hover:text-foreground"
        >
          <span className="text-xs underline underline-offset-2">Dismiss</span>
        </button>
      )}
    </Link>
  );
}

export function NotificationsBell() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getNotificationsAction().then((items) => {
      setNotifications(items);
      setLoaded(true);
    });
  }, []);

  function handleOpenChange(open: boolean) {
    if (open) {
      getNotificationsAction().then(setNotifications);
    }
  }

  function handleDismiss(id: string) {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  }

  const count = notifications.length;

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={count > 0 ? `Notifications (${count} unread)` : "Notifications"}
            className="relative"
          />
        }
      >
        <BellIcon />
        {loaded && count > 0 && (
          <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[0.65rem] font-medium text-destructive-foreground">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <p className="px-1.5 py-3 text-center text-sm text-muted-foreground">
            You&apos;re all caught up.
          </p>
        ) : (
          <div className="flex flex-col gap-0.5">
            {notifications.map((item) => (
              <NotificationRow key={item.id} item={item} onDismiss={handleDismiss} />
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
