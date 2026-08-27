import { TaskFilters } from "@/components/features/tasks/task-filters";
import { TaskList } from "@/components/features/tasks/task-list";
import { Priority } from "@/generated/prisma/client";
import { requireCurrentUser } from "@/lib/session";
import {
  taskSortOptions,
  taskStatusFilters,
  type TaskSortOption,
  type TaskStatusFilter,
} from "@/lib/validations/task";
import { getCategories } from "@/services/categories";
import { getTasks } from "@/services/tasks";

const validPriorities = new Set<string>(Object.values(Priority));

interface TasksPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    priority?: string;
    category?: string;
    sort?: string;
  }>;
}

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const params = await searchParams;
  const user = await requireCurrentUser();

  const status = taskStatusFilters.includes(params.status as TaskStatusFilter)
    ? (params.status as TaskStatusFilter)
    : "active";
  const sort = taskSortOptions.includes(params.sort as TaskSortOption)
    ? (params.sort as TaskSortOption)
    : "newest";

  const priority = validPriorities.has(params.priority ?? "")
    ? (params.priority as Priority)
    : undefined;

  const [tasks, categories] = await Promise.all([
    getTasks(user.id, {
      search: params.search,
      status,
      priority,
      categoryId: params.category,
      sort,
    }),
    getCategories(user.id),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-2xl font-semibold">Tasks</h1>
        <p className="text-muted-foreground">Everything on your list, in one calm place.</p>
      </div>
      <TaskFilters categories={categories} />
      <TaskList tasks={tasks} categories={categories} />
    </div>
  );
}
