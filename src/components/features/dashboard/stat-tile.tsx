import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export function StatTile({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
}) {
  return (
    <Card className="flex-row items-center gap-3 p-4">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/40 text-primary">
        <Icon className="size-4.5" aria-hidden="true" />
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-semibold">{value}</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    </Card>
  );
}
