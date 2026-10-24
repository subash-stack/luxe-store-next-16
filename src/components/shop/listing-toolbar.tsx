import Link from "next/link";
import type { ReactNode } from "react";

import { colorBySlug, sortOptions, type Color } from "@/lib/catalog";
import { cn } from "@/lib/cn";

import { listingHref, toggleColor, type ListingState } from "./listing-state";

type ListingToolbarProps = {
  basePath: string;
  state: ListingState;
  total: number;
  availableColors: Color[];
};

/**
 * Sticky, text-only toolbar: result count on the left, Filter and Sort
 * disclosures on the right. Every option is a plain link, so it works
 * without client JavaScript and each state has a shareable URL.
 */
export function ListingToolbar({
  basePath,
  state,
  total,
  availableColors,
}: ListingToolbarProps) {
  // Remount the disclosures on every URL change so they close after a choice.
  const key = listingHref(basePath, state);

  return (
    <div className="sticky top-header z-30 border-y border-line bg-canvas">
      <div className="page-container flex h-12 items-center justify-between gap-4">
        <p className="text-caption text-ink-muted" aria-live="polite">
          {total} {total === 1 ? "product" : "products"}
        </p>

        <div key={key} className="flex items-center gap-6">
          <Disclosure
            label={
              state.colors.length ? `Filter (${state.colors.length})` : "Filter"
            }
          >
            <p className="type-eyebrow mb-3">Colour</p>
            <ul className="space-y-1">
              {availableColors.map((color) => {
                const selected = state.colors.includes(color.slug);
                return (
                  <li key={color.slug}>
                    <Link
                      href={listingHref(basePath, state, {
                        colors: toggleColor(state.colors, color.slug),
                      })}
                      className={cn(
                        "flex items-center gap-3 py-1.5 text-body-sm transition-colors",
                        selected ? "text-ink" : "text-ink-muted hover:text-ink",
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "size-3.5 rounded-full border border-line",
                          selected && "outline outline-1 outline-offset-2 outline-ink",
                        )}
                        style={{ backgroundColor: color.hex }}
                      />
                      {color.name}
                      {selected && <span className="sr-only">(selected)</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
            {state.colors.length > 0 && (
              <Link
                href={listingHref(basePath, state, { colors: [] })}
                className="link type-label mt-4 inline-block"
              >
                Clear
              </Link>
            )}
          </Disclosure>

          <Disclosure label="Sort">
            <ul className="space-y-1">
              {sortOptions.map((option) => {
                const selected = state.sort === option.key;
                return (
                  <li key={option.key}>
                    <Link
                      href={listingHref(basePath, state, { sort: option.key })}
                      aria-current={selected ? "true" : undefined}
                      className={cn(
                        "block py-1.5 text-body-sm whitespace-nowrap transition-colors",
                        selected
                          ? "text-ink underline decoration-1 underline-offset-4"
                          : "text-ink-muted hover:text-ink",
                      )}
                    >
                      {option.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Disclosure>
        </div>
      </div>

      {state.colors.length > 0 && (
        <div className="page-container flex flex-wrap gap-2 pb-3">
          {state.colors.map((slug) => (
            <Link
              key={slug}
              href={listingHref(basePath, state, {
                colors: toggleColor(state.colors, slug),
              })}
              className="type-label inline-flex h-8 items-center gap-2 border border-line px-3 text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
              aria-label={`Remove ${colorBySlug[slug].name} filter`}
            >
              {colorBySlug[slug].name}
              <span aria-hidden="true">×</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Disclosure({ label, children }: { label: string; children: ReactNode }) {
  return (
    <details className="group relative">
      <summary className="type-label flex cursor-pointer list-none items-center gap-2 py-2 select-none [&::-webkit-details-marker]:hidden">
        {label}
        <span
          aria-hidden="true"
          className="inline-block transition-transform duration-(--duration-base) group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="absolute top-full right-0 z-40 mt-2 min-w-56 border border-line bg-canvas p-5">
        {children}
      </div>
    </details>
  );
}
