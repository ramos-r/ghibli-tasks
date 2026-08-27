"use client";

import { useState, useTransition } from "react";
import { XIcon } from "lucide-react";
import { toast } from "sonner";
import { deleteTagAction } from "@/app/(app)/tags/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Tag } from "@/generated/prisma/client";

export function TagItem({ tag }: { tag: Tag }) {
  const [isPending, startTransition] = useTransition();
  const [deleteOpen, setDeleteOpen] = useState(false);

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteTagAction(tag.id);
      setDeleteOpen(false);
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    });
  }

  return (
    <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
      <Badge variant="secondary" className="gap-1 py-1 pr-1 pl-2.5 text-sm">
        {tag.name}
        <DialogTrigger
          render={
            <Button
              variant="ghost"
              size="icon-xs"
              className="rounded-full hover:bg-foreground/10"
              aria-label={`Delete tag ${tag.name}`}
              disabled={isPending}
            />
          }
        >
          <XIcon />
        </DialogTrigger>
      </Badge>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this tag?</DialogTitle>
          <DialogDescription>
            &ldquo;{tag.name}&rdquo; will be removed from every task that has it.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton>
          <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
