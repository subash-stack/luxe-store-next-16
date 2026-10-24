"use server";

import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { safeNext } from "@/lib/session";

export type AuthFormState = { error?: string; email?: string; name?: string };

const signUpSchema = z.object({
  name: z.string().trim().min(1, "Enter your name.").max(100),
  email: z.email("Enter a valid email address.").trim().toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(128, "Password must be at most 128 characters."),
});

const signInSchema = z.object({
  email: z.string().trim().toLowerCase().min(1),
  password: z.string().min(1),
});

export async function signUp(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const raw = Object.fromEntries(formData);
  const echo = { email: String(raw.email ?? ""), name: String(raw.name ?? "") };
  const parsed = signUpSchema.safeParse(raw);
  if (!parsed.success) {
    return { ...echo, error: parsed.error.issues[0]?.message };
  }

  try {
    // autoSignIn creates the session; nextCookies writes the cookie.
    await auth.api.signUpEmail({ body: parsed.data, headers: await headers() });
  } catch (error) {
    if (error instanceof APIError) {
      return {
        ...echo,
        error:
          error.body?.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL" ||
          error.body?.code === "USER_ALREADY_EXISTS"
            ? "An account with this email already exists."
            : "We couldn't create your account. Please try again.",
      };
    }
    throw error;
  }

  redirect(safeNext(raw.next));
}

export async function signIn(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const raw = Object.fromEntries(formData);
  const echo = { email: String(raw.email ?? "") };
  const parsed = signInSchema.safeParse(raw);
  if (!parsed.success) {
    return { ...echo, error: "Enter your email and password." };
  }

  try {
    await auth.api.signInEmail({ body: parsed.data, headers: await headers() });
  } catch (error) {
    if (error instanceof APIError) {
      // One message for every failure, so the form doesn't reveal which emails exist.
      return { ...echo, error: "Invalid email or password." };
    }
    throw error;
  }

  redirect(safeNext(raw.next));
}

export async function signOut() {
  await auth.api.signOut({ headers: await headers() });
  redirect("/");
}
