import { authClient } from "@/lib/auth-client";
import type { LoginInput, RegisterInput } from "@/lib/validations/auth";

export interface AuthResult {
  success: boolean;
  message: string;
}

export async function registerUser(input: RegisterInput): Promise<AuthResult> {
  const { error } = await authClient.signUp.email({
    name: input.name,
    username: input.username,
    email: input.email,
    password: input.password,
  });

  if (error) {
    return { success: false, message: error.message ?? "Could not create your account." };
  }

  return { success: true, message: "Account created." };
}

export async function loginUser(input: LoginInput): Promise<AuthResult> {
  const isEmail = input.identifier.includes("@");

  const { error } = isEmail
    ? await authClient.signIn.email({ email: input.identifier, password: input.password })
    : await authClient.signIn.username({ username: input.identifier, password: input.password });

  if (error) {
    return { success: false, message: error.message ?? "Invalid credentials." };
  }

  return { success: true, message: "Signed in." };
}

export async function logoutUser(): Promise<void> {
  await authClient.signOut();
}
