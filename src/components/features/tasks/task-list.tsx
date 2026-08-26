import { ClipboardListIcon } from "lucide-react";
import { TaskItem } from "@/components/features/tasks/task-item";
import type { Task } from "@/generated/prisma/client";

export function TaskList({ tasks }: { tasks: Task[] }) {
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
          <TaskItem task={task} />
        </li>
      ))}
    </ul>
  );
}
