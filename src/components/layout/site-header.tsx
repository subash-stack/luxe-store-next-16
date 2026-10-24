import Link from "next/link";

import { BagLink } from "@/components/bag/bag-link";
import { getCategories } from "@/lib/catalog";

export async function SiteHeader() {
  const categories = await getCategories();
  const nav = [
    { href: "/shop", label: "Shop all" },
    ...categories.map((c) => ({ href: `/shop/${c.slug}`, label: c.name })),
  ];

  return (
    <header className="site-header">
      <div className="page-container grid grid-cols-[1fr_auto_1fr] items-center">
        {/* Mobile: native disclosure, no client JS. */}
        <details className="group lg:hidden">
          <summary className="type-label flex h-11 cursor-pointer list-none items-center [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">Menu</span>
            <span className="hidden group-open:inline">Close</span>
          </summary>
          <nav
            aria-label="Primary"
            className="absolute inset-x-0 top-full border-b border-line bg-canvas"
          >
            <ul className="page-container divide-hairline">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="type-label block py-4">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </details>

        <nav aria-label="Primary" className="hidden gap-6 lg:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link">
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href="/" className="type-label tracking-wide-label">
          Luxe Store
        </Link>

        <div className="flex justify-end gap-5">
          <Link href="/shop" className="nav-link max-sm:hidden">
            Search
          </Link>
          {/* Static on purpose: no session read in the shell. Guests are sent to sign-in. */}
          <Link href="/account" className="nav-link">
            Account
          </Link>
          <BagLink />
        </div>
      </div>
    </header>
  );
}
