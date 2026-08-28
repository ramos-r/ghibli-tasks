import { CalendarTaskChip } from "@/components/features/calendar/calendar-task-chip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Category, Tag } from "@/generated/prisma/client";
import type { TaskWithRelations } from "@/services/tasks";

export function UpcomingDeadlinesCard({
  tasks,
  categories,
  tags,
}: {
  tasks: TaskWithRelations[];
  categories: Category[];
  tags: Tag[];
}) {
  return (
    <Card className="gap-3 p-4">
      <CardHeader className="p-0">
        <CardTitle>Upcoming deadlines</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-0.5 p-0">
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing due in the next 7 days.</p>
        ) : (
          tasks.map((task) => (
            <CalendarTaskChip key={task.id} task={task} categories={categories} tags={tags} />
          ))
        )}
      </CardContent>
    </Card>
  );
}
