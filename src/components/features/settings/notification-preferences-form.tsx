"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateNotificationPreferencesAction } from "@/app/(app)/settings/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import type { UpdateNotificationPreferencesInput } from "@/lib/validations/settings";

const rows: { key: keyof UpdateNotificationPreferencesInput; label: string; description: string }[] = [
  {
    key: "notifyOverdue",
    label: "Overdue tasks",
    description: "Alert me about tasks past their due date.",
  },
  {
    key: "notifyDueSoon",
    label: "Due today",
    description: "Alert me about tasks due today.",
  },
  {
    key: "notifyReminders",
    label: "Reminders",
    description: "Alert me when a task reminder comes due.",
  },
];

export function NotificationPreferencesForm({
  preferences,
}: {
  preferences: UpdateNotificationPreferencesInput;
}) {
  const [values, setValues] = useState(preferences);
  const [isPending, startTransition] = useTransition();

  function handleToggle(key: keyof UpdateNotificationPreferencesInput, checked: boolean) {
    const next = { ...values, [key]: checked };
    setValues(next);

    startTransition(async () => {
      const result = await updateNotificationPreferencesAction(next);
      if (!result.success) {
        toast.error(result.message);
        setValues(values);
      }
    });
  }

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Choose what shows up in the notifications bell.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {rows.map((row) => (
          <div key={row.key} className="flex items-start justify-between gap-4">
            <div>
              <label htmlFor={`pref-${row.key}`} className="text-sm font-medium">
                {row.label}
              </label>
              <p className="text-sm text-muted-foreground">{row.description}</p>
            </div>
            <Switch
              id={`pref-${row.key}`}
              checked={values[row.key]}
              onCheckedChange={(checked) => handleToggle(row.key, checked)}
              disabled={isPending}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
