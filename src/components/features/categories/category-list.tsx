import { FolderIcon } from "lucide-react";
import { CategoryItem } from "@/components/features/categories/category-item";
import type { Category } from "@/generated/prisma/client";

export function CategoryList({ categories }: { categories: Category[] }) {
  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-16 text-center">
        <FolderIcon className="size-8 text-muted-foreground" aria-hidden="true" />
        <p className="text-sm font-medium">No categories yet</p>
        <p className="text-sm text-muted-foreground">Create one to start grouping your tasks.</p>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {categories.map((category) => (
        <li key={category.id}>
          <CategoryItem category={category} />
        </li>
      ))}
    </ul>
  );
}
