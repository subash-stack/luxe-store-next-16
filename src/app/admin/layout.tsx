import { Suspense } from "react";

import { ProtectedSkeleton, RequireAdmin } from "@/components/auth/require-session";

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <Suspense fallback={<ProtectedSkeleton />}>
      <RequireAdmin>{children}</RequireAdmin>
    </Suspense>
  );
}
