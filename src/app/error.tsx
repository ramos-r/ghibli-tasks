"use client";

import { useEffect } from "react";
import { TriangleAlertIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RootError({
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
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background px-4 py-12 text-center">
      <Link href="/" className="font-heading text-xl font-semibold text-foreground">
        Ghibli Tasks
      </Link>
      <TriangleAlertIcon className="size-8 text-muted-foreground" aria-hidden="true" />
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium">Something went wrong</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          This page hit a snag. Give it another try — your data is safe.
        </p>
      </div>
      <Button onClick={() => unstable_retry()}>Try again</Button>
    </div>
  );
}
