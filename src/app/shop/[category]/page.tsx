import type { Metadata } from "next";
import { Suspense } from "react";

import { ListingSkeleton } from "@/components/shop/listing-skeleton";
import { ProductListing } from "@/components/shop/product-listing";
import { getCategories, getCategory } from "@/lib/catalog";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/shop/[category]">): Promise<Metadata> {
  const category = await getCategory((await params).category);
  return category
    ? { title: category.name, description: category.description }
    : {};
}

export default function CategoryPage({
  params,
  searchParams,
}: PageProps<"/shop/[category]">) {
  return (
    <Suspense fallback={<ListingSkeleton />}>
      <ProductListing
        category={params.then((p) => p.category)}
        searchParams={searchParams}
      />
    </Suspense>
  );
}
