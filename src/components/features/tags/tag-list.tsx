import { TagIcon } from "lucide-react";
import { TagItem } from "@/components/features/tags/tag-item";
import type { Tag } from "@/generated/prisma/client";

export function TagList({ tags }: { tags: Tag[] }) {
  if (tags.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-16 text-center">
        <TagIcon className="size-8 text-muted-foreground" aria-hidden="true" />
        <p className="text-sm font-medium">No tags yet</p>
        <p className="text-sm text-muted-foreground">Create one to start labeling your tasks.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <TagItem key={tag.id} tag={tag} />
      ))}
    </div>
  );
}
