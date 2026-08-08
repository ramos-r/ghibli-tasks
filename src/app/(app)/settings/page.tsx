import { ProfileForm } from "@/components/features/settings/profile-form";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground">
          Full settings (theme, language, notification preferences) are built out in Phase 14.
        </p>
      </div>
      <ProfileForm />
    </div>
  );
}
