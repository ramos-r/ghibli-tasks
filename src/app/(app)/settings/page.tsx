import { ChangePasswordForm } from "@/components/features/settings/change-password-form";
import { NotificationPreferencesForm } from "@/components/features/settings/notification-preferences-form";
import { ProfileForm } from "@/components/features/settings/profile-form";
import { requireCurrentUser } from "@/lib/session";
import { getNotificationPreferences } from "@/services/settings";

export default async function SettingsPage() {
  const user = await requireCurrentUser();
  const preferences = await getNotificationPreferences(user.id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground">Your profile, password, and notification preferences.</p>
      </div>
      <ProfileForm />
      <ChangePasswordForm />
      <NotificationPreferencesForm preferences={preferences} />
    </div>
  );
}
