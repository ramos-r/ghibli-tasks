import { CalendarDayView } from "@/components/features/calendar/calendar-day-view";
import { CalendarMonthView } from "@/components/features/calendar/calendar-month-view";
import { CalendarNav } from "@/components/features/calendar/calendar-nav";
import { CalendarSummary } from "@/components/features/calendar/calendar-summary";
import { CalendarWeekView } from "@/components/features/calendar/calendar-week-view";
import {
  addUtcDays,
  dateKey,
  formatDayTitle,
  formatMonthTitle,
  formatWeekTitle,
  getMonthGridDays,
  getWeekDays,
  parseDateParam,
} from "@/lib/calendar-dates";
import { requireCurrentUser } from "@/lib/session";
import { calendarViews, type CalendarView } from "@/lib/validations/calendar";
import {
  getOverdueTasks,
  getTasksInRange,
  getTodayTasks,
  getUpcomingTasks,
} from "@/services/calendar";
import { getCategories } from "@/services/categories";
import { getTags } from "@/services/tags";
import type { TaskWithRelations } from "@/services/tasks";

interface CalendarPageProps {
  searchParams: Promise<{ view?: string; date?: string }>;
}

function groupTasksByDay(tasks: TaskWithRelations[]) {
  const map = new Map<string, TaskWithRelations[]>();
  for (const task of tasks) {
    if (!task.dueDate) continue;
    const key = dateKey(task.dueDate);
    const existing = map.get(key) ?? [];
    existing.push(task);
    map.set(key, existing);
  }
  return map;
}

export default async function CalendarPage({ searchParams }: CalendarPageProps) {
  const params = await searchParams;
  const user = await requireCurrentUser();

  const view = calendarViews.includes(params.view as CalendarView)
    ? (params.view as CalendarView)
    : "month";
  const anchor = parseDateParam(params.date);

  const days =
    view === "month" ? getMonthGridDays(anchor) : view === "week" ? getWeekDays(anchor) : [anchor];
  const rangeStart = days[0];
  const rangeEnd = addUtcDays(days[days.length - 1], 1);

  const title =
    view === "month"
      ? formatMonthTitle(anchor)
      : view === "week"
        ? formatWeekTitle(days)
        : formatDayTitle(anchor);

  const [rangeTasks, overdueTasks, todayTasks, upcomingTasks, categories, tags] = await Promise.all(
    [
      getTasksInRange(user.id, rangeStart, rangeEnd),
      getOverdueTasks(user.id),
      getTodayTasks(user.id),
      getUpcomingTasks(user.id),
      getCategories(user.id),
      getTags(user.id),
    ],
  );

  const tasksByDay = groupTasksByDay(rangeTasks);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-2xl font-semibold">Calendar</h1>
        <p className="text-muted-foreground">See what&apos;s due, at a glance.</p>
      </div>

      <CalendarNav view={view} anchor={anchor} title={title} />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1">
          {view === "month" && (
            <CalendarMonthView
              days={days}
              anchor={anchor}
              tasksByDay={tasksByDay}
              categories={categories}
              tags={tags}
            />
          )}
          {view === "week" && (
            <CalendarWeekView
              days={days}
              tasksByDay={tasksByDay}
              categories={categories}
              tags={tags}
            />
          )}
          {view === "day" && (
            <CalendarDayView
              tasks={tasksByDay.get(dateKey(anchor)) ?? []}
              categories={categories}
              tags={tags}
            />
          )}
        </div>

        <CalendarSummary
          overdueTasks={overdueTasks}
          todayTasks={todayTasks}
          upcomingTasks={upcomingTasks}
          categories={categories}
          tags={tags}
        />
      </div>
    </div>
  );
}
