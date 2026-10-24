/** Static fallback that mirrors the product page layout. */
export function ProductDetailSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading product"
      className="page-container grid gap-8 pb-section lg:grid-cols-[3fr_2fr] lg:gap-16 lg:pt-8"
    >
      <div className="-mx-gutter lg:mx-0">
        <div className="media-frame animate-pulse lg:aspect-portrait" />
      </div>
      <div className="space-y-4 lg:pt-14">
        <div className="h-3 w-24 bg-surface" />
        <div className="h-9 w-3/4 bg-surface" />
        <div className="h-4 w-20 bg-surface" />
        <div className="mt-10 h-12 w-full bg-surface" />
      </div>
    </div>
  );
}
