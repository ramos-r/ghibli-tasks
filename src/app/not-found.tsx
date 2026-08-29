import { CompassIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background px-4 py-12 text-center">
      <Link href="/" className="font-heading text-xl font-semibold text-foreground">
        Ghibli Tasks
      </Link>
      <CompassIcon className="size-8 text-muted-foreground" aria-hidden="true" />
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium">Page not found</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          There&apos;s nothing here. Let&apos;s get you back on track.
        </p>
      </div>
      <Button nativeButton={false} render={<Link href="/" />}>
        Back to Dashboard
      </Button>
    </div>
  );
}
