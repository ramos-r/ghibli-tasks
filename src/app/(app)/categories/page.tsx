import { PlusIcon } from "lucide-react";
import { CategoryFormDialog } from "@/components/features/categories/category-form-dialog";
import { CategoryList } from "@/components/features/categories/category-list";
import { Button } from "@/components/ui/button";
import { requireCurrentUser } from "@/lib/session";
import { getCategories } from "@/services/categories";

export default async function CategoriesPage() {
  const user = await requireCurrentUser();
  const categories = await getCategories(user.id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-2xl font-semibold">Categories</h1>
          <p className="text-muted-foreground">Group your tasks with a color and icon.</p>
        </div>
        <CategoryFormDialog
          trigger={
            <Button>
              <PlusIcon />
              New category
            </Button>
          }
        />
      </div>
      <CategoryList categories={categories} />
    </div>
  );
}
