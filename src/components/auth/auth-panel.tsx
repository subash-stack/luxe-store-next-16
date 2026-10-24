import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthForm } from "@/components/auth/auth-form";
import { getSession, safeNext } from "@/lib/session";

type Mode = "sign-in" | "sign-up";

const switchCopy: Record<Mode, { prompt: string; label: string; href: string }> = {
  "sign-in": { prompt: "New to Luxe Store?", label: "Create an account", href: "/sign-up" },
  "sign-up": { prompt: "Already have an account?", label: "Sign in", href: "/sign-in" },
};

/**
 * Reads the session and `?next=`, so render it inside <Suspense>.
 * Visitors who are already signed in go straight on.
 */
export async function AuthPanel({
  mode,
  searchParams,
}: {
  mode: Mode;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const next = safeNext((await searchParams).next);
  if (await getSession()) redirect(next);

  const other = switchCopy[mode];
  const otherHref =
    next === "/account" ? other.href : `${other.href}?next=${encodeURIComponent(next)}`;

  return (
    <>
      <AuthForm mode={mode} next={next} />
      <p className="mt-8 text-ink-muted">
        {other.prompt}{" "}
        <Link href={otherHref} className="link text-ink">
          {other.label}
        </Link>
      </p>
    </>
  );
}

export function AuthPanelSkeleton() {
  return <div aria-hidden className="min-h-96 animate-pulse bg-surface" />;
}
