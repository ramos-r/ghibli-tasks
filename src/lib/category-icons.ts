import {
  BookOpen,
  Briefcase,
  Code,
  Dumbbell,
  Folder,
  GraduationCap,
  Heart,
  Home,
  Palette,
  Plane,
  ShoppingCart,
  Utensils,
  type LucideIcon,
} from "lucide-react";
import type { categoryIcons } from "@/lib/validations/category";

export const categoryIconComponents: Record<(typeof categoryIcons)[number], LucideIcon> = {
  Folder,
  Briefcase,
  Home,
  Heart,
  BookOpen,
  ShoppingCart,
  Utensils,
  Dumbbell,
  Plane,
  Palette,
  Code,
  GraduationCap,
};
