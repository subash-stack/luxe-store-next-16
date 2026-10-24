import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false },
};

// Placeholder until admin tools exist. Every admin data getter and server
// action must call requireAdmin() itself.
export default async function AdminPage() {
  const admin = await requireAdmin();

  return (
    <Container width="content" className="section">
      <p className="type-eyebrow">Admin</p>
      <h1 className="type-headline mt-3">Store admin</h1>
      <p className="mt-6 text-ink-muted">Signed in as {admin.email}.</p>
    </Container>
  );
}
