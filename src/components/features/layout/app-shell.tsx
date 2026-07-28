import type { ReactNode } from "react";
import { Footer } from "@/components/features/layout/footer";
import { Navbar } from "@/components/features/layout/navbar";
import { Sidebar } from "@/components/features/layout/sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <div className="flex min-h-dvh flex-1 flex-col">
        <Navbar />
        <main className="flex-1 px-4 py-8 sm:px-6">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
