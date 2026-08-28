import { CheckCircle2Icon, PencilIcon, PlusCircleIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ActivityEntry } from "@/services/dashboard";

const typeConfig = {
  completed: { icon: CheckCircle2Icon, verb: "Completed", className: "text-success" },
  created: { icon: PlusCircleIcon, verb: "Created", className: "text-primary" },
  updated: { icon: PencilIcon, verb: "Updated", className: "text-muted-foreground" },
} as const;

function formatRelativeTime(date: Date) {
  const diffMs = date.getTime() - Date.now();
  const diffMinutes = Math.round(diffMs / 60000);
  const formatter = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" });

  if (Math.abs(diffMinutes) < 60) return formatter.format(diffMinutes, "minute");
  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffHours) < 24) return formatter.format(diffHours, "hour");
  const diffDays = Math.round(diffHours / 24);
  return formatter.format(diffDays, "day");
}

export function RecentActivityCard({ entries }: { entries: ActivityEntry[] }) {
  return (
    <Card className="gap-3 p-4">
      <CardHeader className="p-0">
        <CardTitle>Recent activity</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 p-0">
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nothing yet — create a task to get started.
          </p>
        ) : (
          entries.map((entry) => {
            const { icon: Icon, verb, className } = typeConfig[entry.type];
            return (
              <div key={entry.id} className="flex items-start gap-2 text-sm">
                <Icon className={`mt-0.5 size-3.5 shrink-0 ${className}`} aria-hidden="true" />
                <p className="min-w-0 flex-1 truncate">
                  <span className="text-muted-foreground">{verb}</span> {entry.title}
                </p>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatRelativeTime(entry.at)}
                </span>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
