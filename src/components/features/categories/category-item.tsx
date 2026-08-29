"use client";

import { useState, useTransition } from "react";
import { MoreHorizontalIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { deleteCategoryAction } from "@/app/(app)/categories/actions";
import { CategoryFormDialog } from "@/components/features/categories/category-form-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Category } from "@/generated/prisma/client";
import { categoryIconComponents } from "@/lib/category-icons";

export function CategoryItem({ category }: { category: Category }) {
  const [isPending, startTransition] = useTransition();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const Icon =
    categoryIconComponents[category.icon as keyof typeof categoryIconComponents] ??
    categoryIconComponents.Folder;

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteCategoryAction(category.id);
      setDeleteOpen(false);
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    });
  }

  return (
    <Card className="flex-row items-center gap-3 px-4 py-3">
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: `${category.color}26`, color: category.color }}
      >
        <Icon className="size-4.5" />
      </span>
      <p className="min-w-0 flex-1 truncate text-sm font-medium">{category.name}</p>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="icon-sm" aria-label="Category actions" />}
        >
          <MoreHorizontalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <PencilIcon />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={() => setDeleteOpen(true)}>
            <Trash2Icon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Rendered outside DropdownMenuContent so closing the menu (which
          unmounts its content) doesn't unmount these dialogs mid-open. */}
      <CategoryFormDialog category={category} open={editOpen} onOpenChange={setEditOpen} />
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this category?</DialogTitle>
            <DialogDescription>
              &ldquo;{category.name}&rdquo; will be deleted. Tasks in this category will keep their
              other details, just without a category.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter showCloseButton>
            <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
