"use client";

import Link from "next/link";
import { useActionState } from "react";

import { addToBag, type AddToBagState } from "@/app/bag/actions";
import { Button } from "@/components/ui/button";

const initialState: AddToBagState = { status: "idle" };

export function AddToBag({ slug }: { slug: string }) {
  const [state, formAction, pending] = useActionState(
    addToBag.bind(null, slug),
    initialState,
  );

  return (
    <form action={formAction}>
      <Button type="submit" block disabled={pending}>
        {pending ? "Adding…" : "Add to bag"}
      </Button>
      <p aria-live="polite" className="mt-3 min-h-5 text-caption">
        {state.status === "added" && !pending && (
          <span className="text-ink-muted">
            Added to bag.{" "}
            <Link href="/bag" className="link text-ink">
              View bag
            </Link>
          </span>
        )}
        {state.status === "error" && !pending && (
          <span className="text-danger">{state.message}</span>
        )}
      </p>
    </form>
  );
}
