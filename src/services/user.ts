import { authClient } from "@/lib/auth-client";
import type { UpdateProfileInput } from "@/lib/validations/profile";
import type { AuthResult } from "@/services/auth";

export async function updateProfile(input: UpdateProfileInput): Promise<AuthResult> {
  const { error } = await authClient.updateUser({
    name: input.name,
    username: input.username,
  });

  if (error) {
    return { success: false, message: error.message ?? "Could not update your profile." };
  }

  return { success: true, message: "Profile updated." };
}
