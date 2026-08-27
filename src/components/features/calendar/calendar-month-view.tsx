import { CalendarTaskChip } from "@/components/features/calendar/calendar-task-chip";
import type { Category, Tag } from "@/generated/prisma/client";
import { dateKey, startOfUtcDay } from "@/lib/calendar-dates";
import { cn } from "@/lib/utils";
import type { TaskWithRelations } from "@/services/tasks";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MAX_VISIBLE_PER_DAY = 3;

export function CalendarMonthView({
  days,
  anchor,
  tasksByDay,
  categories,
  tags,
}: {
  days: Date[];
  anchor: Date;
  tasksByDay: Map<string, TaskWithRelations[]>;
  categories: Category[];
  tags: Tag[];
}) {
  const today = dateKey(startOfUtcDay(new Date()));
  const currentMonth = anchor.getUTCMonth();

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="grid grid-cols-7 border-b border-border bg-muted/50">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="px-2 py-1.5 text-center text-xs font-medium text-muted-foreground"
          >
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const key = dateKey(day);
          const dayTasks = tasksByDay.get(key) ?? [];
          const isCurrentMonth = day.getUTCMonth() === currentMonth;
          const isToday = key === today;

          return (
            <div
              key={key}
              className={cn(
                "flex min-h-24 flex-col gap-1 border-b border-r border-border p-1.5 last:border-r-0",
                !isCurrentMonth && "bg-muted/30",
              )}
            >
              <span
                className={cn(
                  "self-start rounded-full px-1.5 text-xs",
                  isToday && "bg-primary text-primary-foreground",
                  !isCurrentMonth && !isToday && "text-muted-foreground",
                )}
              >
                {day.getUTCDate()}
              </span>
              <div className="flex flex-col gap-0.5">
                {dayTasks.slice(0, MAX_VISIBLE_PER_DAY).map((task) => (
                  <CalendarTaskChip key={task.id} task={task} categories={categories} tags={tags} />
                ))}
                {dayTasks.length > MAX_VISIBLE_PER_DAY && (
                  <span className="px-1.5 text-xs text-muted-foreground">
                    +{dayTasks.length - MAX_VISIBLE_PER_DAY} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
