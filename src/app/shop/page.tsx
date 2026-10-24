import type { Metadata } from "next";
import { Suspense } from "react";

import { ListingSkeleton } from "@/components/shop/listing-skeleton";
import { ProductListing } from "@/components/shop/product-listing";

export const metadata: Metadata = {
  title: "Shop all",
};

export default function ShopPage({ searchParams }: PageProps<"/shop">) {
  return (
    <Suspense fallback={<ListingSkeleton />}>
      <ProductListing
        category={Promise.resolve(undefined)}
        searchParams={searchParams}
      />
    </Suspense>
  );
}
