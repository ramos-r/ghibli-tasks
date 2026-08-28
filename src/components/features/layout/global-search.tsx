"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { CalendarIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { searchTasksAction } from "@/app/(app)/search/actions";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import type { TaskWithRelations } from "@/services/tasks";

function formatDueDate(date: Date) {
  // Due dates are stored as UTC midnight; format in UTC so the displayed
  // day doesn't shift with the viewer's timezone (see task-item.tsx).
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function ResultRow({ task, query, onNavigate }: { task: TaskWithRelations; query: string; onNavigate: () => void }) {
  return (
    <Link
      href={`/tasks?search=${encodeURIComponent(query)}&status=all`}
      onClick={onNavigate}
      className="flex items-start gap-2 rounded-md px-2 py-2 text-sm transition-soft hover:bg-accent"
    >
      <SearchIcon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
      <span className="min-w-0 flex-1">
        <span
          className={cn("block truncate font-medium", task.completed && "text-muted-foreground line-through")}
        >
          {task.title}
        </span>
        <span className="mt-1 flex flex-wrap items-center gap-1.5">
          {task.completed && <Badge variant="success">Completed</Badge>}
          {task.archived && <Badge variant="outline">Archived</Badge>}
          {task.category && (
            <span className="text-xs text-muted-foreground">{task.category.name}</span>
          )}
          {task.dueDate && (
            <Badge variant="outline">
              <CalendarIcon />
              {formatDueDate(task.dueDate)}
            </Badge>
          )}
        </span>
      </span>
    </Link>
  );
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TaskWithRelations[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  function handleQueryChange(value: string) {
    setQuery(value);
    clearTimeout(debounceRef.current);

    if (!value.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      startTransition(async () => {
        const found = await searchTasksAction(value);
        setResults(found);
        setHasSearched(true);
      });
    }, 300);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setQuery("");
      setResults([]);
      setHasSearched(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open search"
        className="flex min-w-0 flex-1 max-w-sm items-center gap-2 rounded-lg border border-input bg-background px-2.5 py-1.5 text-sm text-muted-foreground transition-soft hover:bg-muted dark:bg-input/30 dark:hover:bg-input/50"
      >
        <SearchIcon className="size-4 shrink-0" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate text-left">Search tasks…</span>
        <kbd className="hidden shrink-0 rounded border border-border px-1.5 py-0.5 text-xs sm:inline-block">
          ⌘K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="top-24 flex max-h-[70vh] translate-y-0 flex-col gap-3 p-0 sm:max-w-lg" showCloseButton={false}>
          <DialogTitle className="sr-only">Search everything</DialogTitle>
          <div className="relative shrink-0 border-b border-border p-3">
            <SearchIcon
              className="pointer-events-none absolute top-1/2 left-5.5 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              autoFocus
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Search tasks by title, description, or tag…"
              aria-label="Search everything"
              className="border-none pl-8 shadow-none focus-visible:ring-0"
            />
          </div>

          <div className="flex-1 overflow-y-auto px-2 pb-3">
            {isPending ? (
              <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
                <Spinner className="size-4" />
                Searching…
              </div>
            ) : hasSearched && results.length === 0 ? (
              <p className="px-2 py-8 text-center text-sm text-muted-foreground">
                No tasks match &ldquo;{query}&rdquo;.
              </p>
            ) : results.length > 0 ? (
              <div className="flex flex-col gap-0.5">
                {results.map((task) => (
                  <ResultRow
                    key={task.id}
                    task={task}
                    query={query}
                    onNavigate={() => handleOpenChange(false)}
                  />
                ))}
              </div>
            ) : (
              <p className="px-2 py-8 text-center text-sm text-muted-foreground">
                Search across every task, by title, description, or tag — completed and archived
                included.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
