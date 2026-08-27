"use client";

import { useState, type ReactElement } from "react";
import { toast } from "sonner";
import { createTagAction } from "@/app/(app)/tags/actions";
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
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { createTagSchema } from "@/lib/validations/tag";

export function TagFormDialog({ trigger }: { trigger: ReactElement }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      setName("");
      setError(undefined);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parsed = createTagSchema.safeParse({ name });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message);
      return;
    }

    setError(undefined);
    setIsSubmitting(true);
    const result = await createTagAction(parsed.data);
    setIsSubmitting(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New tag</DialogTitle>
          <DialogDescription>
            Tags help you find and group tasks across categories.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="tag-name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="tag-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={!!error}
              autoFocus
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Spinner />}
              Create tag
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
