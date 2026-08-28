import { GlobalSearch } from "@/components/features/layout/global-search";
import { MobileNav } from "@/components/features/layout/mobile-nav";
import { NotificationsBell } from "@/components/features/layout/notifications-bell";
import { UserMenu } from "@/components/features/layout/user-menu";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <MobileNav />

      <GlobalSearch />

      <div className="ml-auto flex items-center gap-1.5">
        <NotificationsBell />
        <UserMenu />
      </div>
    </header>
  );
}
