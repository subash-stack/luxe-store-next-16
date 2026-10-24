import { Suspense } from "react";

import { ProtectedSkeleton, RequireUser } from "@/components/auth/require-session";

export default function AccountLayout({ children }: LayoutProps<"/account">) {
  return (
    <Suspense fallback={<ProtectedSkeleton />}>
      <RequireUser>{children}</RequireUser>
    </Suspense>
  );
}
