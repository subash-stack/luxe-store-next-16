import type { Metadata } from "next";
import { Suspense } from "react";

import { OrderHistory } from "@/components/account/order-history";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Container } from "@/components/ui/container";
import { getOrdersForUser } from "@/lib/orders";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Your account",
};

export default function AccountPage() {
  return (
    <Container width="content" className="section">
      <p className="type-eyebrow">Account</p>
      <Suspense fallback={<AccountSkeleton />}>
        <AccountDetails />
      </Suspense>
    </Container>
  );
}

/** Reads the session and the user's orders: request-time, so it streams in. */
async function AccountDetails() {
  const user = await requireUser();
  // Scoped to the session user, never an id from the URL.
  const orders = await getOrdersForUser(user.id);

  return (
    <>
      <h1 className="type-headline mt-3">Welcome, {user.name}</h1>

      <dl className="divide-hairline mt-10 max-w-xl border-y border-line">
        <div className="grid grid-cols-[8rem_1fr] gap-4 py-4">
          <dt className="type-label text-ink-muted">Name</dt>
          <dd>{user.name}</dd>
        </div>
        <div className="grid grid-cols-[8rem_1fr] gap-4 py-4">
          <dt className="type-label text-ink-muted">Email</dt>
          <dd className="break-all">{user.email}</dd>
        </div>
      </dl>

      <section aria-labelledby="orders-heading" className="mt-14">
        <h2 id="orders-heading" className="type-label mb-6">
          Your orders{orders.length > 0 && ` (${orders.length})`}
        </h2>
        <OrderHistory orders={orders} />
      </section>

      <div className="mt-10">
        <SignOutButton />
      </div>
    </>
  );
}

function AccountSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading your account">
      <div className="mt-3 h-12 w-72 max-w-full bg-surface" />
      <div className="mt-10 h-28 max-w-xl bg-surface" />
      <div className="mt-14 h-64 bg-surface" />
    </div>
  );
}
