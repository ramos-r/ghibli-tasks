import { CalendarTaskChip } from "@/components/features/calendar/calendar-task-chip";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Category, Tag } from "@/generated/prisma/client";
import type { TaskWithRelations } from "@/services/tasks";

function SummarySection({
  title,
  tasks,
  categories,
  tags,
  emptyText,
  badgeVariant,
}: {
  title: string;
  tasks: TaskWithRelations[];
  categories: Category[];
  tags: Tag[];
  emptyText: string;
  badgeVariant?: "destructive" | "warning";
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-medium">{title}</h3>
        {tasks.length > 0 && (
          <Badge variant={badgeVariant ?? "secondary"} className="h-4.5 px-1.5">
            {tasks.length}
          </Badge>
        )}
      </div>
      {tasks.length === 0 ? (
        <p className="text-xs text-muted-foreground">{emptyText}</p>
      ) : (
        <div className="flex flex-col gap-0.5">
          {tasks.map((task) => (
            <CalendarTaskChip key={task.id} task={task} categories={categories} tags={tags} />
          ))}
        </div>
      )}
    </div>
  );
}

export function CalendarSummary({
  overdueTasks,
  todayTasks,
  upcomingTasks,
  categories,
  tags,
}: {
  overdueTasks: TaskWithRelations[];
  todayTasks: TaskWithRelations[];
  upcomingTasks: TaskWithRelations[];
  categories: Category[];
  tags: Tag[];
}) {
  return (
    <Card className="w-full gap-4 p-4 sm:max-w-64">
      <CardHeader className="p-0">
        <CardTitle>At a glance</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-0">
        <SummarySection
          title="Overdue"
          tasks={overdueTasks}
          categories={categories}
          tags={tags}
          emptyText="Nothing overdue"
          badgeVariant="destructive"
        />
        <SummarySection
          title="Today"
          tasks={todayTasks}
          categories={categories}
          tags={tags}
          emptyText="Nothing due today"
        />
        <SummarySection
          title="Upcoming (7 days)"
          tasks={upcomingTasks}
          categories={categories}
          tags={tags}
          emptyText="Nothing coming up"
        />
      </CardContent>
    </Card>
  );
}
