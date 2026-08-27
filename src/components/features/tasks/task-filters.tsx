"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PlusIcon, SearchIcon } from "lucide-react";
import { TaskFormDialog } from "@/components/features/tasks/task-form-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category } from "@/generated/prisma/client";
import { categoryIconComponents } from "@/lib/category-icons";
import {
  taskSortOptions,
  taskStatusFilters,
  type TaskSortOption,
  type TaskStatusFilter,
} from "@/lib/validations/task";

const ANY_CATEGORY = "any";

const sortLabels: Record<TaskSortOption, string> = {
  newest: "Newest first",
  oldest: "Oldest first",
  dueDate: "Due date",
  priority: "Priority",
  title: "Title",
};

const statusLabels: Record<TaskStatusFilter, string> = {
  active: "Active",
  completed: "Completed",
  archived: "Archived",
  all: "All",
};

const priorityLabels: Record<"any" | "LOW" | "MEDIUM" | "HIGH", string> = {
  any: "Any priority",
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

export function TaskFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateParam("search", search);
    }, 300);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative min-w-48 flex-1">
        <SearchIcon
          className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks…"
          aria-label="Search tasks"
          className="pl-8"
        />
      </div>

      <Select
        value={searchParams.get("status") ?? "active"}
        onValueChange={(value) => updateParam("status", value)}
      >
        <SelectTrigger aria-label="Filter by status">
          <SelectValue>{(value: TaskStatusFilter) => statusLabels[value]}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {taskStatusFilters.map((status) => (
            <SelectItem key={status} value={status}>
              {statusLabels[status]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get("priority") ?? "any"}
        onValueChange={(value) => updateParam("priority", value === "any" ? "" : value)}
      >
        <SelectTrigger aria-label="Filter by priority">
          <SelectValue placeholder="Priority">
            {(value: keyof typeof priorityLabels) => priorityLabels[value]}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="any">Any priority</SelectItem>
          <SelectItem value="LOW">Low</SelectItem>
          <SelectItem value="MEDIUM">Medium</SelectItem>
          <SelectItem value="HIGH">High</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get("sort") ?? "newest"}
        onValueChange={(value) => updateParam("sort", value)}
      >
        <SelectTrigger aria-label="Sort tasks">
          <SelectValue>{(value: TaskSortOption) => sortLabels[value]}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {taskSortOptions.map((sort) => (
            <SelectItem key={sort} value={sort}>
              {sortLabels[sort]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {categories.length > 0 && (
        <Select
          value={searchParams.get("category") ?? ANY_CATEGORY}
          onValueChange={(value) => updateParam("category", value === ANY_CATEGORY ? "" : value)}
        >
          <SelectTrigger aria-label="Filter by category">
            <SelectValue>
              {(value: string) =>
                value === ANY_CATEGORY
                  ? "Any category"
                  : (categories.find((c) => c.id === value)?.name ?? "Any category")
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ANY_CATEGORY}>Any category</SelectItem>
            {categories.map((category) => {
              const Icon =
                categoryIconComponents[category.icon as keyof typeof categoryIconComponents];
              return (
                <SelectItem key={category.id} value={category.id}>
                  {Icon && <Icon className="size-4" style={{ color: category.color }} />}
                  {category.name}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      )}

      <TaskFormDialog
        categories={categories}
        trigger={
          <Button className="ml-auto">
            <PlusIcon />
            New task
          </Button>
        }
      />
    </div>
  );
}
