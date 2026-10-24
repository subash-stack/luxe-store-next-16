import type { ReactNode } from "react";

import { requireAdmin, requireUser } from "@/lib/session";

// Layout guards. Each one awaits the check before its children render, so a
// protected segment never streams to a signed-out visitor. Render inside
// <Suspense>, and still authorize in every data getter and server action:
// a layout doesn't protect those.

export async function RequireUser({ children }: { children: ReactNode }) {
  await requireUser();
  return children;
}

export async function RequireAdmin({ children }: { children: ReactNode }) {
  await requireAdmin();
  return children;
}

export function ProtectedSkeleton() {
  return (
    <div aria-hidden className="content-container section">
      <div className="h-12 w-64 animate-pulse bg-surface" />
      <div className="mt-10 h-40 animate-pulse bg-surface" />
    </div>
  );
}
