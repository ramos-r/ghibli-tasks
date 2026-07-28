import { BellIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MobileNav } from "@/components/features/layout/mobile-nav";
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
        {/* Search is implemented in Phase 13 — visual placeholder for now. */}
        <Input placeholder="Search tasks…" aria-label="Search tasks" className="pl-8" disabled />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        {/* Notifications are implemented in Phase 12 — visual placeholder for now. */}
        <Button variant="ghost" size="icon" aria-label="Notifications" disabled>
          <BellIcon />
        </Button>
        <UserMenu />
      </div>
    </header>
  );
}
