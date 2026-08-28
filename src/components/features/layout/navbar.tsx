import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MobileNav } from "@/components/features/layout/mobile-nav";
import { NotificationsBell } from "@/components/features/layout/notifications-bell";
import { UserMenu } from "@/components/features/layout/user-menu";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <MobileNav />

      <div className="relative flex-1 max-w-sm">
        <SearchIcon
          className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        {/* Global search is implemented in Phase 13 — visual placeholder for now. */}
        <Input
          placeholder="Search tasks…"
          aria-label="Global search (coming soon)"
          className="pl-8"
          disabled
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <NotificationsBell />
        <UserMenu />
      </div>
    </header>
  );
}
