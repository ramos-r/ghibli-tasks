import type { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background px-4 py-12">
      <Link href="/" className="font-heading text-xl font-semibold text-foreground">
        Ghibli Tasks
      </Link>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
