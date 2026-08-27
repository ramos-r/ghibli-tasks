import { CalendarTaskChip } from "@/components/features/calendar/calendar-task-chip";
import type { Category, Tag } from "@/generated/prisma/client";
import { dateKey, startOfUtcDay } from "@/lib/calendar-dates";
import { cn } from "@/lib/utils";
import type { TaskWithRelations } from "@/services/tasks";

export function CalendarWeekView({
  days,
  tasksByDay,
  categories,
  tags,
}: {
  days: Date[];
  tasksByDay: Map<string, TaskWithRelations[]>;
  categories: Category[];
  tags: Tag[];
}) {
  const today = dateKey(startOfUtcDay(new Date()));

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-7">
      {days.map((day) => {
        const key = dateKey(day);
        const dayTasks = tasksByDay.get(key) ?? [];
        const isToday = key === today;

        return (
          <div key={key} className="flex flex-col gap-2 rounded-xl border border-border p-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                {new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "UTC" }).format(
                  day,
                )}
              </span>
              <span
                className={cn(
                  "rounded-full px-1.5 text-xs",
                  isToday && "bg-primary text-primary-foreground",
                )}
              >
                {day.getUTCDate()}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              {dayTasks.length === 0 && <p className="text-xs text-muted-foreground">No tasks</p>}
              {dayTasks.map((task) => (
                <CalendarTaskChip key={task.id} task={task} categories={categories} tags={tags} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
