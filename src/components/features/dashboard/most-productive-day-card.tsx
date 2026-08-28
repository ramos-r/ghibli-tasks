import { SparklesIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export function MostProductiveDayCard({ day, count }: { day: string | null; count: number }) {
  return (
    <Card className="flex-row items-center gap-3 p-4">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/40 text-primary">
        <SparklesIcon className="size-4.5" aria-hidden="true" />
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-semibold">{day ?? "—"}</span>
        <span className="text-xs text-muted-foreground">
          {day ? `Your most productive day (${count} completed)` : "Complete a task to see this"}
        </span>
      </div>
    </Card>
  );
}
