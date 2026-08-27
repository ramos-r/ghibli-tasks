import { PlusIcon } from "lucide-react";
import { TagFormDialog } from "@/components/features/tags/tag-form-dialog";
import { TagList } from "@/components/features/tags/tag-list";
import { Button } from "@/components/ui/button";
import { requireCurrentUser } from "@/lib/session";
import { getTags } from "@/services/tags";

export default async function TagsPage() {
  const user = await requireCurrentUser();
  const tags = await getTags(user.id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-2xl font-semibold">Tags</h1>
          <p className="text-muted-foreground">Label your tasks and find them again quickly.</p>
        </div>
        <TagFormDialog
          trigger={
            <Button>
              <PlusIcon />
              New tag
            </Button>
          }
        />
      </div>
      <TagList tags={tags} />
    </div>
  );
}
