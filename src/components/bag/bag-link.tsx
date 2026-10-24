import Link from "next/link";
import { Suspense } from "react";

import { getBagCount } from "@/lib/bag";

async function BagCount() {
  const count = await getBagCount();
  return <>Bag ({count})</>;
}

/** Header bag link. The count reads the bag cookie, so only it waits for the request. */
export function BagLink() {
  return (
    <Link href="/bag" className="nav-link">
      <Suspense fallback="Bag">
        <BagCount />
      </Suspense>
    </Link>
  );
}
