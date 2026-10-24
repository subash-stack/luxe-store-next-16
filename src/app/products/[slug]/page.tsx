import type { Metadata } from "next";
import { Suspense } from "react";

import { ProductDetail } from "@/components/product/product-detail";
import { ProductDetailSkeleton } from "@/components/product/product-detail-skeleton";
import { getAllProductSlugs, getProduct, getProductCopy } from "@/lib/catalog";

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  return product
    ? { title: product.name, description: getProductCopy(product).description }
    : {};
}

export default function ProductPage({ params }: PageProps<"/products/[slug]">) {
  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetail slug={params.then((p) => p.slug)} />
    </Suspense>
  );
}
