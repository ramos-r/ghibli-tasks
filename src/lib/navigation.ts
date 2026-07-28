import type { LucideIcon } from "lucide-react";
import { CalendarDays, FolderKanban, LayoutDashboard, ListTodo, Settings, Tag } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Tasks", href: "/tasks", icon: ListTodo },
  { label: "Calendar", href: "/calendar", icon: CalendarDays },
  { label: "Categories", href: "/categories", icon: FolderKanban },
  { label: "Tags", href: "/tags", icon: Tag },
  { label: "Settings", href: "/settings", icon: Settings },
];
