"use client";

import { useEffect } from "react";
import { TriangleAlertIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
      <TriangleAlertIcon className="size-8 text-muted-foreground" aria-hidden="true" />
      <p className="text-sm font-medium">Something went wrong</p>
      <p className="max-w-sm text-sm text-muted-foreground">
        This page hit a snag. Give it another try — your data is safe.
      </p>
      <Button onClick={() => unstable_retry()} className="mt-1">
        Try again
      </Button>
    </div>
  );
}
