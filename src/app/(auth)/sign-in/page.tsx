import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthPanel, AuthPanelSkeleton } from "@/components/auth/auth-panel";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function SignInPage({ searchParams }: PageProps<"/sign-in">) {
  return (
    <Container width="prose" className="section">
      <p className="type-eyebrow">Account</p>
      <h1 className="type-headline mt-3 mb-10">Sign in</h1>
      <Suspense fallback={<AuthPanelSkeleton />}>
        <AuthPanel mode="sign-in" searchParams={searchParams} />
      </Suspense>
    </Container>
  );
}
