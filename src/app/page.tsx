"use client";

import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const swatches = [
  { name: "Background", className: "bg-background" },
  { name: "Surface", className: "bg-card" },
  { name: "Primary", className: "bg-primary" },
  { name: "Primary hover", className: "bg-primary-hover" },
  { name: "Secondary", className: "bg-secondary" },
  { name: "Accent", className: "bg-accent" },
  { name: "Success", className: "bg-success" },
  { name: "Warning", className: "bg-warning" },
  { name: "Danger", className: "bg-destructive" },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-16">
      <header className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-semibold">Ghibli Tasks — Design System</h1>
        <p className="text-secondary-foreground">
          A calm, cozy, minimal component preview. Not a real page — replaced in Phase 3.
        </p>
      </header>

      <section aria-labelledby="colors-heading" className="flex flex-col gap-3">
        <h2 id="colors-heading" className="font-heading text-lg font-medium">
          Color palette
        </h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {swatches.map((swatch) => (
            <div key={swatch.name} className="flex flex-col gap-1.5">
              <div
                className={`h-14 rounded-xl border border-border shadow-soft ${swatch.className}`}
              />
              <span className="text-xs text-muted-foreground">{swatch.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="typography-heading" className="flex flex-col gap-3">
        <h2 id="typography-heading" className="font-heading text-lg font-medium">
          Typography
        </h2>
        <div className="flex flex-col gap-2">
          <p className="font-heading text-3xl font-semibold">Heading / 3xl</p>
          <p className="font-heading text-xl font-semibold">Heading / xl</p>
          <p className="text-base">Body / base — the quick brown fox jumps over the lazy dog.</p>
          <p className="text-sm text-muted-foreground">Body secondary / sm</p>
        </div>
      </section>

      <section aria-labelledby="buttons-heading" className="flex flex-col gap-3">
        <h2 id="buttons-heading" className="font-heading text-lg font-medium">
          Buttons
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button>Default</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button disabled>
            <Spinner />
            Loading
          </Button>
        </div>
      </section>

      <section aria-labelledby="badges-heading" className="flex flex-col gap-3">
        <h2 id="badges-heading" className="font-heading text-lg font-medium">
          Badges
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="destructive">Danger</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </section>

      <section aria-labelledby="form-heading" className="flex flex-col gap-3">
        <h2 id="form-heading" className="font-heading text-lg font-medium">
          Form controls
        </h2>
        <div className="flex flex-col gap-3 sm:max-w-sm">
          <Input placeholder="Task title" aria-label="Task title" />
          <Textarea placeholder="Description" aria-label="Description" />
        </div>
      </section>

      <section aria-labelledby="feedback-heading" className="flex flex-col gap-3">
        <h2 id="feedback-heading" className="font-heading text-lg font-medium">
          Feedback &amp; overlays
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={() => toast.success("Task saved")}>
            Show toast
          </Button>

          <Dialog>
            <DialogTrigger render={<Button variant="outline">Open dialog</Button>} />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete task?</DialogTitle>
                <DialogDescription>This action cannot be undone.</DialogDescription>
              </DialogHeader>
              <DialogFooter showCloseButton>
                <Button variant="destructive">Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline">Open menu</Button>} />
            <DropdownMenuContent>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Archive</DropdownMenuItem>
              <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger render={<Button variant="outline">Hover me</Button>} />
              <TooltipContent>Soft, subtle, on-brand tooltip</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </section>

      <section aria-labelledby="card-heading" className="flex flex-col gap-3">
        <h2 id="card-heading" className="font-heading text-lg font-medium">
          Card &amp; Avatar
        </h2>
        <Card className="sm:max-w-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="" alt="" />
                <AvatarFallback>GT</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>Water the garden</CardTitle>
                <CardDescription>Due tomorrow</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
