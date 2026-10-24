/** Static fallback that mirrors the listing layout, so streaming in doesn't shift it. */
export function ListingSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading products">
      <div className="page-container flex flex-col items-center gap-4 pt-10 pb-8 md:pt-16 md:pb-10">
        <div className="h-4 w-20 bg-surface" />
        <div className="h-9 w-56 bg-surface" />
        <div className="h-4 w-72 max-w-full bg-surface" />
        <div className="mt-6 h-8 w-full max-w-xl bg-surface" />
      </div>
      <div className="h-12 border-y border-line" />
      <div className="page-container pt-px pb-section">
        <ul className="product-grid">
          {Array.from({ length: 8 }, (_, i) => (
            <li key={i}>
              <div className="media-frame animate-pulse" />
              <div className="mx-auto mt-4 h-3 w-2/3 bg-surface" />
              <div className="mx-auto mt-2 h-3 w-1/3 bg-surface" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
