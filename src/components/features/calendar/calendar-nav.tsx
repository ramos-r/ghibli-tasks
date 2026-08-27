"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addUtcDays, addUtcMonths, dateKey } from "@/lib/calendar-dates";
import { calendarViews, type CalendarView } from "@/lib/validations/calendar";

const viewLabels: Record<CalendarView, string> = {
  month: "Month",
  week: "Week",
  day: "Day",
};

export function CalendarNav({
  view,
  anchor,
  title,
}: {
  view: CalendarView;
  anchor: Date;
  title: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function navigate(nextView: CalendarView, nextAnchor: Date) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", nextView);
    params.set("date", dateKey(nextAnchor));
    router.push(`${pathname}?${params.toString()}`);
  }

  function goToStep(direction: -1 | 1) {
    if (view === "month") return navigate(view, addUtcMonths(anchor, direction));
    if (view === "week") return navigate(view, addUtcDays(anchor, direction * 7));
    return navigate(view, addUtcDays(anchor, direction));
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon-sm" aria-label="Previous" onClick={() => goToStep(-1)}>
          <ChevronLeftIcon />
        </Button>
        <Button variant="outline" size="icon-sm" aria-label="Next" onClick={() => goToStep(1)}>
          <ChevronRightIcon />
        </Button>
        <Button variant="outline" onClick={() => navigate(view, new Date())}>
          Today
        </Button>
        <h2 className="font-heading text-lg font-medium">{title}</h2>
      </div>

      <div className="flex items-center gap-1 rounded-lg border border-border p-1">
        {calendarViews.map((v) => (
          <Button
            key={v}
            size="sm"
            variant={v === view ? "default" : "ghost"}
            onClick={() => navigate(v, anchor)}
            aria-pressed={v === view}
          >
            {viewLabels[v]}
          </Button>
        ))}
      </div>
    </div>
  );
}
