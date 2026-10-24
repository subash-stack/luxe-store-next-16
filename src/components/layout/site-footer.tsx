import Link from "next/link";

import { Section } from "@/components/ui/container";
import { categories } from "@/lib/catalog/data";

const columns = [
  {
    heading: "Shop",
    links: categories.map((c) => ({ href: `/shop/${c.slug}`, label: c.name })),
  },
  {
    heading: "Client services",
    links: [
      { href: "/", label: "Contact us" },
      { href: "/", label: "Shipping" },
      { href: "/", label: "Returns" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/", label: "About" },
      { href: "/", label: "Privacy" },
      { href: "/", label: "Terms" },
    ],
  },
];

export function SiteFooter() {
  return (
    <Section as="footer" inverse>
      <div className="page-container grid gap-10 sm:grid-cols-3">
        {columns.map((col) => (
          <div key={col.heading}>
            <p className="type-label">{col.heading}</p>
            <ul className="mt-4 space-y-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-caption text-ink-muted transition-colors hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="page-container mt-16 text-caption text-ink-subtle">
        © 2026 Luxe Store
      </p>
    </Section>
  );
}
