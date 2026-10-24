"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { signIn, signUp, type AuthFormState } from "@/lib/auth-actions";

type Mode = "sign-in" | "sign-up";

const inputClass =
  "h-12 w-full border border-line bg-canvas px-4 text-ink transition-colors duration-(--duration-fast) placeholder:text-ink-subtle focus:border-line-strong focus:outline-none";

function Field({
  label,
  ...props
}: { label: string } & React.ComponentProps<"input">) {
  return (
    <label className="grid gap-2">
      <span className="type-label">{label}</span>
      <input className={inputClass} required {...props} />
    </label>
  );
}

/** Email/password form. Posts to a server action, so it works before hydration. */
export function AuthForm({ mode, next }: { mode: Mode; next: string }) {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(
    mode === "sign-in" ? signIn : signUp,
    {},
  );

  return (
    <form action={action} className="grid gap-6">
      <input type="hidden" name="next" value={next} />

      {mode === "sign-up" && (
        <Field
          label="Name"
          name="name"
          autoComplete="name"
          defaultValue={state.name}
          maxLength={100}
        />
      )}
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        defaultValue={state.email}
      />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
        minLength={mode === "sign-up" ? 8 : undefined}
        maxLength={128}
      />

      <p role="alert" aria-live="polite" className="min-h-6 text-caption text-danger">
        {state.error}
      </p>

      <Button type="submit" block disabled={pending}>
        {pending
          ? mode === "sign-in"
            ? "Signing in…"
            : "Creating account…"
          : mode === "sign-in"
            ? "Sign in"
            : "Create account"}
      </Button>
    </form>
  );
}
