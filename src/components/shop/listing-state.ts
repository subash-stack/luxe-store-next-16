import {
  isColorSlug,
  isSortKey,
  type ColorSlug,
  type SortKey,
} from "@/lib/catalog";

export type RawSearchParams = Record<string, string | string[] | undefined>;

export type ListingState = {
  colors: ColorSlug[];
  sort: SortKey;
  page: number;
};

function toArray(value: string | string[] | undefined) {
  return value === undefined ? [] : Array.isArray(value) ? value : [value];
}

/** Parse and sanitise listing search params; unknown values are dropped. */
export function parseListingState(params: RawSearchParams): ListingState {
  const sort = toArray(params.sort)[0];
  const page = Number.parseInt(toArray(params.page)[0] ?? "", 10);
  return {
    colors: [...new Set(toArray(params.color).filter(isColorSlug))],
    sort: isSortKey(sort) ? sort : "featured",
    page: Number.isFinite(page) && page > 1 ? Math.min(page, 50) : 1,
  };
}

/**
 * Build a listing URL from the current state plus changes. Defaults are
 * omitted to keep URLs clean, and any filter/sort change resets pagination.
 */
export function listingHref(
  basePath: string,
  state: ListingState,
  changes: Partial<ListingState> = {},
) {
  const next: ListingState = {
    ...state,
    page: "page" in changes ? state.page : 1,
    ...changes,
  };

  const query = new URLSearchParams();
  for (const color of next.colors) query.append("color", color);
  if (next.sort !== "featured") query.set("sort", next.sort);
  if (next.page > 1) query.set("page", String(next.page));

  const qs = query.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export function toggleColor(colors: ColorSlug[], color: ColorSlug) {
  return colors.includes(color)
    ? colors.filter((c) => c !== color)
    : [...colors, color];
}
