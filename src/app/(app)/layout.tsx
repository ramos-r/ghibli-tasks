import type { ReactNode } from "react";
import { AppShell } from "@/components/features/layout/app-shell";

export default function AppLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
