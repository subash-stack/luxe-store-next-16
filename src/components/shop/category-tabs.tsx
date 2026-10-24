import Link from "next/link";

import type { Category, CategorySlug } from "@/lib/catalog";

type CategoryTabsProps = {
  categories: Category[];
  active?: CategorySlug;
  /** Carried across categories; colour filters are not, since availability differs. */
  query?: string;
};

export function CategoryTabs({ categories, active, query }: CategoryTabsProps) {
  const tabs = [
    { href: "/shop", label: "All", current: !active },
    ...categories.map((c) => ({
      href: `/shop/${c.slug}`,
      label: c.name,
      current: c.slug === active,
    })),
  ];

  return (
    <nav aria-label="Categories" className="scrollbar-none -mx-gutter overflow-x-auto px-gutter">
      <ul className="flex min-w-max gap-6 md:justify-center md:gap-8">
        {tabs.map((tab) => (
          <li key={tab.href}>
            <Link
              href={query ? `${tab.href}?${query}` : tab.href}
              className={tab.current ? "nav-link" : "nav-link text-ink-muted hover:text-ink"}
              aria-current={tab.current ? "page" : undefined}
            >
              {tab.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
