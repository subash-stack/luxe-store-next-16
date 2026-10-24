import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthPanel, AuthPanelSkeleton } from "@/components/auth/auth-panel";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Create an account",
};

export default function SignUpPage({ searchParams }: PageProps<"/sign-up">) {
  return (
    <Container width="prose" className="section">
      <p className="type-eyebrow">Account</p>
      <h1 className="type-headline mt-3 mb-10">Create an account</h1>
      <Suspense fallback={<AuthPanelSkeleton />}>
        <AuthPanel mode="sign-up" searchParams={searchParams} />
      </Suspense>
    </Container>
  );
}
