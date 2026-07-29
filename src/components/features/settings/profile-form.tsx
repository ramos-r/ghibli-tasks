"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useSession } from "@/lib/auth-client";
import { updateProfileSchema } from "@/lib/validations/profile";
import { updateProfile } from "@/services/user";

type FormValues = { name: string; username: string };

type SessionUser = {
  id: string;
  name: string;
  email: string;
  username?: string | null;
  image?: string | null;
};

export function ProfileForm() {
  const { data, isPending: isSessionLoading } = useSession();
  const user = data?.user;

  if (isSessionLoading) {
    return (
      <Card className="max-w-md">
        <CardContent className="flex flex-col gap-3 pt-6">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-8 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return null;
  }

  return <ProfileFormFields key={user.id} user={user} />;
}

function ProfileFormFields({ user }: { user: SessionUser }) {
  const [values, setValues] = useState<FormValues>({
    name: user.name,
    username: user.username ?? "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(field: keyof FormValues) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = updateProfileSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FormValues, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FormValues;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    const outcome = await updateProfile(result.data);
    setIsSubmitting(false);

    if (!outcome.success) {
      toast.error(outcome.message);
      return;
    }

    toast.success(outcome.message);
  }

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Your account information.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex items-center gap-3">
          <Avatar size="lg">
            {user.image && <AvatarImage src={user.image} alt="" />}
            <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="profile-name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="profile-name"
              value={values.name}
              onChange={handleChange("name")}
              aria-invalid={!!errors.name}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="profile-username" className="text-sm font-medium">
              Username
            </label>
            <Input
              id="profile-username"
              value={values.username}
              onChange={handleChange("username")}
              aria-invalid={!!errors.username}
            />
            {errors.username && <p className="text-xs text-destructive">{errors.username}</p>}
          </div>

          <Button type="submit" disabled={isSubmitting} className="mt-2 self-start">
            {isSubmitting && <Spinner />}
            Save changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
