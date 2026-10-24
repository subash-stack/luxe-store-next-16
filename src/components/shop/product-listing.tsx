import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/product/product-card";
import { ButtonLink } from "@/components/ui/button";
import {
  getAvailableColors,
  getCategories,
  getCategory,
  getProducts,
} from "@/lib/catalog";

import { CategoryTabs } from "./category-tabs";
import { ListingToolbar } from "./listing-toolbar";
import {
  listingHref,
  parseListingState,
  type RawSearchParams,
} from "./listing-state";

type ProductListingProps = {
  /** Resolves to a category slug, or undefined for "All". */
  category: Promise<string | undefined>;
  searchParams: Promise<RawSearchParams>;
};

/**
 * Reads URL data (category + search params), so it must render inside
 * <Suspense>: the route's App Shell stays URL-independent.
 */
export async function ProductListing({
  category: categoryPromise,
  searchParams,
}: ProductListingProps) {
  const [slug, rawParams] = await Promise.all([categoryPromise, searchParams]);

  const category = slug ? await getCategory(slug) : undefined;
  if (slug && !category) notFound();

  const state = parseListingState(rawParams);
  const basePath = category ? `/shop/${category.slug}` : "/shop";

  const [categories, availableColors, result] = await Promise.all([
    getCategories(),
    getAvailableColors(category?.slug),
    getProducts({ category: category?.slug, ...state }),
  ]);

  // Colours from another category may not exist here; keep only sort when switching.
  const carriedQuery = state.sort === "featured" ? "" : `sort=${state.sort}`;

  return (
    <>
      <header className="page-container pt-10 pb-8 text-center md:pt-16 md:pb-10">
        <p className="type-eyebrow">{category ? "Shop" : "Collection"}</p>
        <h1 className="type-headline mt-3">{category?.name ?? "All products"}</h1>
        <p className="mx-auto mt-3 max-w-prose-narrow text-body text-ink-muted">
          {category?.description ??
            "Leather goods, shoes, ready-to-wear and jewelry."}
        </p>
        <div className="mt-8">
          <CategoryTabs
            categories={categories}
            active={category?.slug}
            query={carriedQuery}
          />
        </div>
      </header>

      <ListingToolbar
        basePath={basePath}
        state={state}
        total={result.total}
        availableColors={availableColors}
      />

      <div className="page-container pt-px pb-section">
        {result.items.length > 0 ? (
          <ul className="product-grid">
            {result.items.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-section text-center">
            <p className="text-title">No products match these filters</p>
            <Link
              href={listingHref(basePath, state, { colors: [] })}
              className="link type-label mt-4 inline-block"
            >
              Clear filters
            </Link>
          </div>
        )}

        {result.items.length > 0 && (
          <div className="mt-16 flex flex-col items-center gap-4">
            <p className="text-caption text-ink-subtle">
              Showing {result.items.length} of {result.total}
            </p>
            {result.hasMore && (
              <ButtonLink
                href={listingHref(basePath, state, { page: state.page + 1 })}
                variant="secondary"
                scroll={false}
              >
                Load more
              </ButtonLink>
            )}
          </div>
        )}
      </div>
    </>
  );
}
