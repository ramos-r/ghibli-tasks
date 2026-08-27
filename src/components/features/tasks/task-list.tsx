import { ClipboardListIcon } from "lucide-react";
import { TaskItem } from "@/components/features/tasks/task-item";
import type { Category, Tag } from "@/generated/prisma/client";
import type { TaskWithRelations } from "@/services/tasks";

export function TaskList({
  tasks,
  categories,
  tags,
}: {
  tasks: TaskWithRelations[];
  categories: Category[];
  tags: Tag[];
}) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-16 text-center">
        <ClipboardListIcon className="size-8 text-muted-foreground" aria-hidden="true" />
        <p className="text-sm font-medium">No tasks here</p>
        <p className="text-sm text-muted-foreground">
          Try adjusting your filters, or create a new task.
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {tasks.map((task) => (
        <li key={task.id}>
          <TaskItem task={task} categories={categories} tags={tags} />
        </li>
      ))}
    </ul>
  );
}
