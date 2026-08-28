"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { changePasswordSchema } from "@/lib/validations/settings";
import { changePassword } from "@/services/user";

type FormValues = { currentPassword: string; newPassword: string; confirmPassword: string };

const emptyValues: FormValues = { currentPassword: "", newPassword: "", confirmPassword: "" };

export function ChangePasswordForm() {
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(field: keyof FormValues) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = changePasswordSchema.safeParse(values);
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
    const outcome = await changePassword(result.data);
    setIsSubmitting(false);

    if (!outcome.success) {
      toast.error(outcome.message);
      return;
    }

    setValues(emptyValues);
    toast.success(outcome.message);
  }

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>Change your account password.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="current-password" className="text-sm font-medium">
              Current password
            </label>
            <Input
              id="current-password"
              type="password"
              value={values.currentPassword}
              onChange={handleChange("currentPassword")}
              aria-invalid={!!errors.currentPassword}
            />
            {errors.currentPassword && (
              <p className="text-xs text-destructive">{errors.currentPassword}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="new-password" className="text-sm font-medium">
              New password
            </label>
            <Input
              id="new-password"
              type="password"
              value={values.newPassword}
              onChange={handleChange("newPassword")}
              aria-invalid={!!errors.newPassword}
            />
            {errors.newPassword && <p className="text-xs text-destructive">{errors.newPassword}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirm-password" className="text-sm font-medium">
              Confirm new password
            </label>
            <Input
              id="confirm-password"
              type="password"
              value={values.confirmPassword}
              onChange={handleChange("confirmPassword")}
              aria-invalid={!!errors.confirmPassword}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">{errors.confirmPassword}</p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting} className="mt-2 self-start">
            {isSubmitting && <Spinner />}
            Change password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
